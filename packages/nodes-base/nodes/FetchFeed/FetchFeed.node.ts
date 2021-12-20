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
import { FetchJobsOptions } from './FetchJobsOptions';
import { FetchOptions } from './FetchOptions';

import {
	fetchData,
	get_organization,
	get_jobs,
	get_detail_organization,
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
						name: 'Get Organization & Jobs from URL',
						value: 'fetch_all_data',
					},
					{
						name: 'Get Organization & Jobs from Company ID',
						value: 'fetch_all_data_by_id',
					},
					{
						name: 'Get Organization from URL',
						value: 'fetch_data',
					},
					{
						name: 'Get Organization from Company ID',
						value: 'fetch_company',
					},
					{
						name: 'Get Jobs from Organization',
						value: 'fetch_jobs',
					},
				],
				default: 'fetch_all_data',
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
							'fetch_all_data'
						],
					},
				},
				description: 'Fetch data from URL',
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				default: '',
				placeholder: '165',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'fetch_company',
							'fetch_jobs',
							'fetch_all_data_by_id'
						],
					},
				},
				description: 'Fetch data from Company ID',
			},
			...FetchOptions,
			...FetchJobsOptions
		],
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
				let algolia_app_id = "SU5V69FJOJ", algolia_api_key = "a4971670ebc5d269725bb3d7639f9c3d", company_id: string, organization_id = ""
				if (resource == "fetch_data" || resource == "fetch_all_data") {
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
							company_id = script["props"]["initialProps"]["network"]["id"] as string
						} else {
							throw new NodeOperationError(this.getNode(), `No Company ID Found on this website "${endpoint}"`);
						}
					} else {
						throw new NodeOperationError(this.getNode(), `No Algio API Found on this website "${endpoint}"`);
					}
				} else if (resource == "fetch_company" || resource == "fetch_all_data_by_id") {
					company_id = this.getNodeParameter('company_id', i) as string
				} else if (resource == "fetch_jobs") {
					company_id = this.getNodeParameter('company_id', i) as string
					organization_id = this.getNodeParameter('organization_id', i) as string
				}
				else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}

				const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
				let all_page: boolean = false
				if (additionalFields.all_page) {
					all_page = additionalFields.all_page as boolean
				}

				let limit_page = 25
				if (additionalFields.limit_page) {
					limit_page = additionalFields.limit_page as number
				}

				if (all_page) {
					limit_page = 100
				}

				let page: number = 0
				if (!all_page && additionalFields.page) {
					page = additionalFields.page as number
				}

				let filters = ""
				if (additionalFields.organization_id) {
					filters = `(objectID:"${additionalFields.organization_id as string}")`
				}

				if (resource == "fetch_data" || resource == "fetch_company") {
					let org = await get_organization(this, page, limit_page, algolia_api_key, algolia_app_id, company_id, filters)
					if (!org["results"]) {
						throw new NodeOperationError(this.getNode(), `No Organizations Found on this website`);
					}
					let total_page = org["results"][0]["nbPages"]
					for (let data of org["results"][0]["hits"]) {
						data["company_id"] = company_id
						data["detail"] = await get_detail_organization(this, company_id, data["objectID"])
						returnData.push(data)
					}

					if (all_page) {
						for (page = 1; page < total_page; page++) {
							let org = await get_organization(this, page, limit_page, algolia_api_key, algolia_app_id, company_id, filters)
							for (let data of org["results"][0]["hits"]) {
								data["company_id"] = company_id
								data["detail"] = await get_detail_organization(this, company_id, data["objectID"])
								returnData.push(data)
							}
						}
					}
				} else if (resource == "fetch_all_data" || resource == "fetch_all_data_by_id") {
					//GET ORGANIZATIONS
					let organizations = []
					let org = await get_organization(this, page, limit_page, algolia_api_key, algolia_app_id, company_id, filters)
					if (!org["results"]) {
						throw new NodeOperationError(this.getNode(), `No Organizations Found on this website`);
					}
					let total_page = org["results"][0]["nbPages"]
					for (let data of org["results"][0]["hits"]) {
						data["company_id"] = company_id
						data["detail"] = await get_detail_organization(this, company_id, data["objectID"])
						organizations.push(data)
					}

					if (all_page) {
						for (page = 1; page < total_page; page++) {
							let org = await get_organization(this, page, limit_page, algolia_api_key, algolia_app_id, company_id, filters)
							for (let data of org["results"][0]["hits"]) {
								data["company_id"] = company_id
								data["detail"] = await get_detail_organization(this, company_id, data["objectID"])
								organizations.push(data)
							}
						}
					}

					for (let data of organizations) {
						page = 0
						let jobs = []
						let job = await get_jobs(this, page, 100, algolia_api_key, algolia_app_id, company_id, data["objectID"])
						if (!job["results"]) {
							continue
						}
						let total_page = job["results"][0]["nbPages"]
						for (let data2 of job["results"][0]["hits"]) {
							delete data2["_highlightResult"]
							jobs.push(data2)
						}

						for (page = 1; page < total_page; page++) {
							let job = await get_jobs(this, page, 100, algolia_api_key, algolia_app_id, company_id, data["objectID"])
							if (!job["results"]) {
								continue
							}
							for (let data2 of job["results"][0]["hits"]) {
								delete data2["_highlightResult"]
								jobs.push(data2)
							}
						}
						data["jobs"] = jobs
						returnData.push(data)
					}
				} else {
					let jobs = []
					let job = await get_jobs(this, page, limit_page, algolia_api_key, algolia_app_id, company_id, organization_id)
					if (!job["results"]) {
						continue
					}
					let total_page = job["results"][0]["nbPages"]
					for (let data2 of job["results"][0]["hits"]) {
						delete data2["_highlightResult"]
						returnData.push(data2)
					}

					if (all_page) {
						for (page = 1; page < total_page; page++) {
							let job = await get_jobs(this, page, limit_page, algolia_api_key, algolia_app_id, company_id, organization_id)
							if (!job["results"]) {
								continue
							}
							for (let data2 of job["results"][0]["hits"]) {
								delete data2["_highlightResult"]
								returnData.push(data2)
							}
						}
					}
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
