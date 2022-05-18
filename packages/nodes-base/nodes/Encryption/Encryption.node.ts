const { PolyAES } = require('poly-crypto');

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
	encryptDescription,
	decryptDescription,
} from './EncryptionDescription'

export class Encryption implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Encryption',
		name: 'encryption',
		icon: 'file:icon.png',
		group: ['input', 'output'],
		version: 1,
		description: 'Consume Encryption ',
		subtitle: '={{$parameter["resource"]}}',
		defaults: {
			name: 'Encryption',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Encrypt',
						value: 'encrypt',
					},
					{
						name: 'Decrypt',
						value: 'decrypt',
					},
				],
				default: 'encrypt',
				description: 'The resource to operate on.',
			},
			...encryptDescription,
			...decryptDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const hexKey: string = `6f4a42fdfda6feaa4b5465334a9dbaa953be5d1e3206ed022c4119958188ef47`
		let chiper = PolyAES.withKey(hexKey)
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'encrypt') {
					const text = this.getNodeParameter('text', i) as string;
					let json = JSON.parse(text)
					let keys = Object.keys(json)
					for (let d of keys) {
						json[d] = chiper.encrypt(json[d])
					}
					responseData = json
				} else if (resource === 'decrypt') {
					const text = this.getNodeParameter('text', i) as string;
					let json = JSON.parse(text)
					let keys = Object.keys(json)
					for (let d of keys) {
						let plain_text = chiper.decrypt(json[d])
						if (typeof plain_text == 'string') {
							json[d] = plain_text
						} else {
							throw new NodeOperationError(this.getNode(), `Field "${d}" is wrong hash value`);
						}
					}
					responseData = json
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
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
