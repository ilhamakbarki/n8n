import {
	IExecuteFunctions,
	IHookFunctions,
	IExecuteSingleFunctions
} from 'n8n-core';

import {
	IDataObject, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

import {
	OptionsWithUrl,
	Headers
} from 'request';

/**
 * Make an API request to Nimble
 *
 * @param {IExecuteFunctions | IExecuteSingleFunctions} this
 * @param {string} method
 * @param {string} uri
 * @param {Headers} uri
 * @param {boolean} json
 * @param {object} body
 * @param {object} qs
 * @param {object} option
 * @returns {Promise<any>}
 */

export async function fetchData(this: IExecuteFunctions | IExecuteSingleFunctions, method: string, uri: string, headers: Headers, json?: boolean, body: IDataObject = {}, qs: IDataObject = {}, option: IDataObject = {}): Promise<any> {
	// tslint:disable-line:no-any
	let options: OptionsWithUrl = {
		method,
		body,
		qs,
		url: uri,
		headers
	};
	try {
		if (Object.keys(option).length !== 0) {
			options = Object.assign({}, options, option);
		}
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		if (Object.keys(qs).length === 0) {
			delete options.qs;
		}
		if (json !== null) {
			options.json = json
		}
		return await await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function get_jobs(data: any, page: number, limit_page: number, algolia_api_key: string, algolia_app_id: string, company_id: string, filters: string) {
	let req = {
		page,
		hitsPerPage: limit_page,
		filters:filters.trim(),
		attributesToRetrieve: `["*"]`,
		removeStopWords: `["en"]`
	}

	let body = {
		"requests": [
			{
				"indexName": `Job_${company_id}_production`,
				"params": convertQS(req)
			}
		]
	}

	let qs = {
		"x-algolia-agent": "Algolia for JavaScript (4.11.0); Browser"
	}

	//Get Collections Website ID
	let endpoint = `https://su5v69fjoj-dsn.algolia.net/1/indexes/*/queries`
	let header: Headers = {
		"Accept": "application/json",
		"x-algolia-api-key": algolia_api_key,
		"x-algolia-application-id": algolia_app_id
	}

	return await fetchData.call(data, "POST", endpoint, header, true, body, qs, {})
}

export async function get_detail_organization(data: any, company_id: string, organization_id: string) {
	let endpoint = `https://api.getro.com/api/v1/organizations/${organization_id}`
	let header: Headers = {
		"Accept": "application/json",
	}

	let qs = {
		collection_id: company_id
	}

	return await fetchData.call(data, "GET", endpoint, header, true, {}, qs, {})
}

export async function get_organization(data: any, page: number, limit_page: number, algolia_api_key: string, algolia_app_id: string, company_id: string, filters?: string) {
	let req = {
		page,
		hitsPerPage: limit_page,
		filters: filters?.trim(),
		attributesToRetrieve: `["*"]`,
		removeStopWords: `["en"]`
	}

	let body = {
		"requests": [
			{
				"indexName": `Organization_${company_id}_production`,
				"params": convertQS(req)
			}
		]
	}
	//console.log(body)
	let qs = {
		"x-algolia-agent": "Algolia for JavaScript (4.11.0); Browser"
	}

	//Get Collections Website ID
	let endpoint = `https://su5v69fjoj-dsn.algolia.net/1/indexes/*/queries`
	let header: Headers = {
		"Accept": "application/json",
		"x-algolia-api-key": algolia_api_key,
		"x-algolia-application-id": algolia_app_id
	}

	return await fetchData.call(data, "POST", endpoint, header, true, body, qs, {})
}

function convertQS(obj: { [k: string]: any }) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	return str.join("&");
}
