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
import { URL } from 'url';

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
		let endpoint: any;

		for (let i = 0; i < items.length; i++) {
			try {
				resource = this.getNodeParameter('resource', i) as string;

				if (resource == "fetch_data") {
					const url = new URL(this.getNodeParameter('url', i) as string);
					const params = url.searchParams;

					//Get Website
					let website = params.get('website')
					if (website === null) {
						throw new NodeOperationError(this.getNode(), `The Query Website not Found on "${url}"`);
					}
					website = decodeURIComponent(website)
					endpoint = `https://${website}/`
					requestMethod = 'GET';
					let headers: Headers = {
						"Accept": "text/html"
					}
					const r = await fetchData.call(this, requestMethod, endpoint, headers, false, {}, {})

					//Get algolia_app_id
					var matches = r.match(/<meta property="algolia_app_id" content="([A-Z0-9]+)">/);
					if (matches===null) {
						throw new NodeOperationError(this.getNode(), `No algolia_app_id Found on this website "${endpoint}"`);
					}
					let algolia_app_id = matches[1];
					console.log(`Alogolia APP ID ${algolia_app_id}`)

					//Get algolia_api_key
					matches = r.match(/<meta property="algolia_api_key" content="([a-z0-9]+)">/);
					if (matches===null) {
						throw new NodeOperationError(this.getNode(), `No algolia_api_key Found on this website "${endpoint}"`);
					}
					let algolia_api_key = matches[1];
					console.log(`Alogolia Key ${algolia_api_key}`)

					//Get Collections Website ID
					endpoint = `https://${website}/api/v1/collections/`
					headers["Accept"] = "application/json"
					const collections = await fetchData.call(this, requestMethod, endpoint, headers, true, {}, {})
					if(collections["collection"]===null){
						throw new NodeOperationError(this.getNode(), `No Collections Found on this website "${endpoint}"`);
					}
					if(collections["collection"]["id"]===null){
						throw new NodeOperationError(this.getNode(), `No Collections ID Found on this website "${endpoint}"`);
					}
					let website_id = collections["collection"]["id"]
					let company_id = params.get('company_id')
					if (company_id === null) {
						throw new NodeOperationError(this.getNode(), `No Query String company_id Found this "${url}"`);
					}
					endpoint = `https://${website}/api/v1/organizations/${company_id}?collection_id=${website_id}`
					const organization = await fetchData.call(this, requestMethod, endpoint, headers, true, {}, {})
					if(organization["error"]){
						throw new NodeOperationError(this.getNode(), `The Organization Error "${organization["error"]}"`);
					}
					if(organization["id"]===null){
						throw new NodeOperationError(this.getNode(), `No Organization ID found on "${endpoint}"`);
					}
					let post_url = `https://su5v69fjoj-dsn.algolia.net/1/indexes/Job_${website_id}_production/query`
					let qs = {
						"x-algolia-agent":"Algolia for JavaScript (3.35.1); Browser (lite)",
						"x-algolia-application-id":algolia_app_id,
						"x-algolia-api-key":algolia_api_key
					}
					let body = {
						params:`page=0&hitsPerPage=20&filters=(organization.id:"${organization["id"]}")&attributesToRetrieve=["title","organization.name","organization.logo_url","organization.slug","organization.id","locations","url","created_at","slug","source"]&removeStopWords=["en"]`
					}
					requestMethod = "POST"
					headers["Content-Type"] = "application/json"
					const algolia = await fetchData.call(this, requestMethod, post_url, headers, true, body, qs)
					returnData.push(algolia as IDataObject);
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

function convertQS(obj: { [k: string]: any }) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	return str.join("&");
}
