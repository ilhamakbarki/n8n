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

 export async function fetchData(this: IExecuteFunctions | IExecuteSingleFunctions, method: string, uri: string, headers : Headers, json?: boolean, body: any = {}, qs: IDataObject = {},  option: IDataObject = {}): Promise<any> {
	 // tslint:disable-line:no-any
	let options: OptionsWithUrl = {
		method,
		body,
		qs,
		url : uri,
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
		if(json !== null){
			options.json = json
		}
		return await await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

