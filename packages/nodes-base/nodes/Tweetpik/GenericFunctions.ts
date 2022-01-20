import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject, IWebhookFunctions, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

import {
	OptionsWithUrl,
	Headers
} from 'request';

export async function callAPI(this: IExecuteFunctions | IWebhookFunctions, method: string, uri: string, headers: Headers={}, body: IDataObject = {}, qs: IDataObject = {},  option: IDataObject = {}): Promise<any> {
	let options: OptionsWithUrl = {
		method,
		body : body,
		qs,
		url: `https://tweetpik.com/api/${uri}`,
		headers,
		json : true
	};
	console.log(options)
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
		return await await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
