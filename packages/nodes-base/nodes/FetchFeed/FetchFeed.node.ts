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
import { Headers } from 'request';

import {
	fetchData,
} from './GenericFunctions';

export class FetchFeed implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fetch Feed',
		name: 'fetchfeed',
		icon: 'file:fetch.png',
		group: ['transform'],
		version: 1,
		description: 'Custom Fetch Data API',
		defaults: {
			name: 'Fetch Data',
			color: '#1C4E63',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Get Data from URL',
						value: 'fetch_data',
					},
				],
				default: 'fetch_data',
				description: 'The resource to operate on.',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://google.com',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'fetch_data',
						],
					},
				},
				description: 'Fetch data from URL',
			}],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		let requestMethod: string;
		let resource: string;
		let endpoint: string;

		for (let i = 0; i < items.length; i++) {
			try {
				resource = this.getNodeParameter('resource', i) as string;

				if (resource == "fetch_data") {
					endpoint = decodeURIComponent(this.getNodeParameter('url', i) as string)
					requestMethod = 'GET';
					let headers: Headers = {
						"Accept": "text/html"
					}
					const website = await fetchData.call(this, requestMethod, endpoint, headers, false, {}, {})
					var matches = website.match(/<meta property="algolia_app_id" content="([A-Z0-9]+)">/);
					if (matches[1]===null) {
						throw new NodeOperationError(this.getNode(), `No algolia_app_id Found on this website "${endpoint}"`);
					}
					let algolia_app_id = matches[1];
					console.log(`Alogolia APP ID ${algolia_app_id}`)
					matches = website.match(/<meta property="algolia_api_key" content="([a-z0-9]+)">/);
					if (matches[1]===null) {
						throw new NodeOperationError(this.getNode(), `No algolia_api_key Found on this website "${endpoint}"`);
					}
					let algolia_api_key = matches[1];
					console.log(`Alogolia Key ${algolia_api_key}`)

					endpoint = `https://${endpoint}/api/v1/collections/`
					headers["Accept"] = "application/json"
					const collections = await fetchData.call(this, requestMethod, endpoint, headers, true, {}, {})
					console.log(collections)

				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}

				//returnData.push(responseData as IDataObject);
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

function convertQS(obj: { [k: string]: any }) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	return str.join("&");
}
