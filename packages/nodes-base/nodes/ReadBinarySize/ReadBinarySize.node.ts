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

export class ReadBinarySize implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Read Binary Size',
		name: 'readBinarySize',
		icon: 'fa:file-import',
		group: ['input'],
		version: 1,
		description: 'Read a binary size',
		defaults: {
			name: 'Read Binary Size',
			color: '#44AA44',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Property Name',
				name: 'dataPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				description: 'Name of the binary property to read size',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						name: 'typeMemory',
						displayName: 'Types of Memory',
						description: 'Types of various Units of Memory',
						type: 'options',
						default: '1. Byte',
						options: [
							{
								name: '1. Byte',
								value: 'Byte',
							},
							{
								name: '2. Kilobyte',
								value: 'Kilobyte',
							},
							{
								name: '3. Megabyte',
								value: 'Megabyte',
							},
							{
								name: '4. Gigabyte',
								value: 'Gigabyte',
							},
							{
								name: '5. Terabyte',
								value: 'Terabyte',
							},
							{
								name: '6. Petabyte',
								value: 'Petabyte',
							},
							{
								name: '7. Exabyte',
								value: 'Exabyte',
							},
							{
								name: '8. Zettabyte',
								value: 'Zettabyte',
							},
							{
								name: '9. Yottabyte',
								value: 'Yottabyte',
							},
						]
					}
				]
			}
		],
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

		const items = this.getInputData();

		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let item: INodeExecutionData;

		const additionalFields = this.getNodeParameter('additionalFields', 0) as IDataObject;
		let typeMemory = 'Byte'
		var devide = 1
		if (typeof additionalFields.typeMemory !== 'undefined') {
			typeMemory = additionalFields.typeMemory as string
			switch (typeMemory) {
				case 'Kilobyte': {
					devide = 2 ** 10
					break;
				}
				case 'Megabyte': {
					devide = 1024 ** 2
					break;
				}
				case 'Gigabyte': {
					devide = 1024 ** 3
					break;
				}
				case 'Terabyte': {
					devide = 1024 ** 4
					break;
				}
				case 'Petabyte': {
					devide = 1024 ** 5
					break;
				}
				case 'Exabyte': {
					devide = 1024 ** 6
					break;
				}
				case 'Zettabyte': {
					devide = 1024 ** 7
					break;
				}
				case 'Yottabyte': {
					devide = 1024 ** 8
					break;
				}
			}
		}
		console.log(`devide ${devide}`)

		for (let itemIndex = 0; itemIndex < length; itemIndex++) {
			try {
				const dataPropertyName = this.getNodeParameter('dataPropertyName', itemIndex) as string;
				item = items[itemIndex];

				if (item.binary === undefined) {
					throw new NodeOperationError(this.getNode(), 'No binary data set. So file can not be read!', { itemIndex });
				}

				if (item.binary[dataPropertyName] === undefined) {
					throw new NodeOperationError(this.getNode(), `The binary property "${dataPropertyName}" does not exist. So no file can be read!`, { itemIndex });
				}

				const newItem: INodeExecutionData = {
					json: {},
					pairedItem: {
						item: itemIndex,
					},
				};
				Object.assign(newItem.json, item.json);
				const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, dataPropertyName);

				(newItem.json as IDataObject).length = binaryDataBuffer.length / devide;
				(newItem.json as IDataObject).units = typeMemory;

				returnData.push(newItem);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: itemIndex,
						},
					});
					continue;
				}
				throw error;
			}
		}
		return this.prepareOutputData(returnData);
	}

}
