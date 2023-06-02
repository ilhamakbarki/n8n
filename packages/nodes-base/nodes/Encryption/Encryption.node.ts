import CryptoJS from 'crypto-js';

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { encryptDescription, decryptDescription } from './EncryptionDescription';

export class Encryption implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Encryption',
		name: 'encryption',
		icon: 'file:icon.svg',
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
				noDataExpression: true,
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
			},
			...encryptDescription,
			...decryptDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const hexKey: string = '6f4a42fdfda6feaa4b5465334a9dbaa953be5d1e3206ed022c4119958188ef47';
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		let responseData;
		const resource = this.getNodeParameter('resource', 0);
		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'encrypt') {
					const text = this.getNodeParameter('text', i) as string;
					const json = JSON.parse(text);
					const keys = Object.keys(json);
					for (const d of keys) {
						json[d] = CryptoJS.AES.encrypt(json[d], hexKey).toString();
					}
					responseData = json;
				} else if (resource === 'decrypt') {
					const text = this.getNodeParameter('text', i) as string;
					const json = JSON.parse(text);
					const keys = Object.keys(json);
					for (const d of keys) {
						const decrypted = CryptoJS.AES.decrypt(json[d], hexKey);
						if (decrypted) {
							try {
								const str = decrypted.toString(CryptoJS.enc.Utf8);
								if (str.length > 0) {
									json[d] = str;
								} else {
									throw new NodeOperationError(this.getNode(), `Field "${d}" is wrong hash value`);
								}
							} catch (e) {
								throw new NodeOperationError(this.getNode(), `Field "${d}" is wrong hash value`);
							}
						} else {
							throw new NodeOperationError(this.getNode(), `Field "${d}" is wrong hash value`);
						}
					}
					responseData = json;
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
