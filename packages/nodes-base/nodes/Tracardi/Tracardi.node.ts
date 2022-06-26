import {
	IExecuteFunctions,
} from 'n8n-core';
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	tracardiResource,
} from './ResourceDescription';

import {
	contextOperations,
	contextWebhookFields,
} from './ContextDescription';

import {
	tracardiApiRequest,
} from './GenericFunctions'

export class Tracardi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tracardi',
		name: 'tracardi',
		icon: 'file:tracardi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Tracardi Customer Data Platform',
		defaults: {
			name: 'Tracardi',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{
			name : 'tracardiAuth',
			required:true,
		}],
		properties: [
			...tracardiResource,
			//Operations
			...contextOperations,
			...contextWebhookFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		let resource = this.getNodeParameter('resource', 0) as string
		let operation = this.getNodeParameter('operation', 0) as string;

		let body: IDataObject = {}
		let qs: IDataObject = {}

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'context') {
					if (operation === 'webhook') {
						let sourceID = this.getNodeParameter('sourceID', i) as string;
						let eventType = this.getNodeParameter('eventType', i) as string;
						const responseData = await tracardiApiRequest.call(this, `/collect/${eventType}/${sourceID}`, 'POST');
						console.log(responseData)
						returnData.push(responseData as IDataObject);
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}
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
