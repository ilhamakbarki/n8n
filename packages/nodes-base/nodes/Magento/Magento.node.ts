import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	magento1ApiRequest,
} from './GenericFunctionsMageto';

import {
	orderOperations,
	orderGet,
} from './V1Description/OrderDescription';

export class Magento implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Magento 1',
		name: 'magento',
		icon: 'file:magento.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Magento 1 API',
		defaults: {
			name: 'Magento',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'magentoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Order',
						value: 'order',
					},
				],
				default: 'order',
			},
			...orderOperations,
			...orderGet,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'order') {
					if (operation === 'get') {
						const orderID = this.getNodeParameter('orderID', i) as string;
						responseData = await magento1ApiRequest.call(this, 'sales_order.info', [orderID])
					}
				}

				Array.isArray(responseData)
					? returnData.push(...responseData)
					: returnData.push(responseData);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
