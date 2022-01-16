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

import { additionalFieldsGlobal } from './AdditionalFieldsGlobal';
import { postRoutesOptions } from './PostRoutes';
import { postAccountOptions } from './PostAccount';
import { callAPI, callImage } from './GenericFunctions';

export class Dlvrit implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Dlvrit',
		name: 'dlvrit',
		icon: 'file:dlvrit.png',
		group: ['transform'],
		version: 1,
		description: 'Custom Dlvrit API',
		defaults: {
			name: 'Dlvrit API',
			color: '#1C4E63',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: "dlvritApi",
				required: true
			}
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Get Routes',
						value: 'getRoutes',
					},
					{
						name: 'Post to a Routes (or Queue)',
						value: 'postRoutes',
					},
					{
						name: 'Post to an Account',
						value: 'postAccount',
					},
				],
				default: 'getRoutes',
				description: 'The resource to operate on.',
			},
			...postRoutesOptions,
			...postAccountOptions,
			...additionalFieldsGlobal
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const credentials = await this.getCredentials('dlvritApi') as {
			apiKey: string;
		};

		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
		}

		const resource = this.getNodeParameter('resource', 0) as string;
		let endpoint: any;
		let qs: IDataObject = {}
		qs.key = credentials.apiKey

		let formData: IDataObject={}
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource == "getRoutes") {
					endpoint = `routes.json`
					let r = await callAPI.call(this, `GET`, endpoint, {}, {}, qs, {})
					if (r["routes"]) {
						for (let x of r["routes"]) {
							returnData.push(x)
						}
					} else {
						returnData.push(r)
					}
				} else if (resource == "postRoutes" || resource == "postAccount") {
					qs["id"] = this.getNodeParameter('id', i) as number
					qs["msg"] = this.getNodeParameter('message', i) as string

					let additional = this.getNodeParameter('additionalFields', i) as IDataObject
					if (typeof additional.shared !== 'undefined') {
						additional.shared ? qs["shared"] = "1" : qs["shared"] = "0"
					}
					if (typeof additional.title !== 'undefined') {
						qs["title"] = additional.title
					}
					if (typeof additional.posttime !== 'undefined') {
						qs["posttime"] = additional.posttime
					}
					if (typeof additional.order !== 'undefined') {
						qs["order"] = additional.order
					}
					if (typeof additional.queue !== 'undefined') {
						qs["queue"] = additional.queue
					}
					if (typeof additional.media !== 'undefined') {
						formData["media"] = await callImage.call(this, additional.media as string)
					}
					resource == "postRoutes" ? endpoint = `postToRoute.json` : endpoint = `postToAccount.json`
					let r = await callAPI.call(this, "POST", endpoint, {}, {}, qs, {}, formData)
					returnData.push(r)
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
