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
					{
						name: 'Get Data from Company ID',
						value: 'fetch_company',
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
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'number',
				default: '',
				placeholder: '165',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'fetch_company',
						],
					},
				},
				description: 'Fetch data from Company ID',
			}],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		let requestMethod: string;
		let resource: string;
		let endpoint: any;

		for (let i = 0; i < items.length; i++) {
			try {
				resource = this.getNodeParameter('resource', i) as string;
				let algolia_app_id = "SU5V69FJOJ", algolia_api_key = "a4971670ebc5d269725bb3d7639f9c3d", company_id
				if (resource == "fetch_data") {
					const url = this.getNodeParameter('url', i) as string
					endpoint = url
					requestMethod = 'GET';
					let headers: Headers = {
						"Accept": "text/html"
					}
					const r = await fetchData.call(this, requestMethod, endpoint, headers, false, {}, {})
					//Get algolia_app_id
					var t = r.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/gm)
					if (t != null) {
						let script = t[0]
						script = script.replace(/<script id="__NEXT_DATA__" type="application\/json">/g, "")
						script = script.replace(/<\/script>/g, "")
						script = JSON.parse(script)
						if (script["runtimeConfig"]) {
							if (script["runtimeConfig"]["algoliaAppId"]) {
								algolia_app_id = script["runtimeConfig"]["algoliaAppId"]
							}
							if (script["runtimeConfig"]["algoliaSearchApiKey"]) {
								algolia_api_key = script["runtimeConfig"]["algoliaSearchApiKey"]
							}
						}
						if (script["props"] && script["props"]["initialProps"] && script["props"]["initialProps"]["network"] && script["props"]["initialProps"]["network"]["id"]) {
							company_id = script["props"]["initialProps"]["network"]["id"]
						} else {
							throw new NodeOperationError(this.getNode(), `No Company ID Found on this website "${endpoint}"`);
						}
					} else {
						throw new NodeOperationError(this.getNode(), `No Algio API Found on this website "${endpoint}"`);
					}
				}
				else if (resource == "fetch_company") {
					company_id = this.getNodeParameter('company_id', i) as number
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}

				//Get Collections Website ID
				// endpoint = `https://${website}/api/v1/collections/`
				// headers["Accept"] = "application/json"
				// const collections = await fetchData.call(this, requestMethod, endpoint, headers, true, {}, {})
				// if(collections["collection"]===null){
				// 	throw new NodeOperationError(this.getNode(), `No Collections Found on this website "${endpoint}"`);
				// }
				// if(collections["collection"]["id"]===null){
				// 	throw new NodeOperationError(this.getNode(), `No Collections ID Found on this website "${endpoint}"`);
				// }
				// let website_id = collections["collection"]["id"]
				// let company_id = params.get('company_id')
				// if (company_id === null) {
				// 	throw new NodeOperationError(this.getNode(), `No Query String company_id Found this "${url}"`);
				// }
				// endpoint = `https://${website}/api/v1/organizations/${company_id}?collection_id=${website_id}`
				// const organization = await fetchData.call(this, requestMethod, endpoint, headers, true, {}, {})
				// if(organization["error"]){
				// 	throw new NodeOperationError(this.getNode(), `The Organization Error "${organization["error"]}"`);
				// }
				// if(organization["id"]===null){
				// 	throw new NodeOperationError(this.getNode(), `No Organization ID found on "${endpoint}"`);
				// }
				// let post_url = `https://su5v69fjoj-dsn.algolia.net/1/indexes/Job_${website_id}_production/query`
				// let qs = {
				// 	"x-algolia-agent":"Algolia for JavaScript (3.35.1); Browser (lite)",
				// 	"x-algolia-application-id":algolia_app_id,
				// 	"x-algolia-api-key":algolia_api_key
				// }
				// let body = {
				// 	params:`page=0&hitsPerPage=20&filters=(organization.id:"${organization["id"]}")&attributesToRetrieve=["title","organization.name","organization.logo_url","organization.slug","organization.id","locations","url","created_at","slug","source"]&removeStopWords=["en"]`
				// }
				// requestMethod = "POST"
				// headers["Content-Type"] = "application/json"
				// const algolia = await fetchData.call(this, requestMethod, post_url, headers, true, body, qs)
				//returnData.push(algolia as IDataObject);

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
