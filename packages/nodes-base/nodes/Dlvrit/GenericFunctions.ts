import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	GenericValue,
	IDataObject, IHttpRequestOptions, IWebhookFunctions, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

import {
	OptionsWithUrl,
	Headers,
} from 'request';

export async function callAPI(this: IExecuteFunctions | IWebhookFunctions, method: string, uri: string, headers: Headers = {}, body: IDataObject = {}, qs: IDataObject = {}, option: IDataObject = {}, formData: IDataObject = {}): Promise<any> {

	let options: OptionsWithUrl = {
		method,
		body,
		qs,
		useQuerystring:true,
		url: `https://api.dlvrit.com/1/${uri}`,
		headers,
		formData,
		json: true
	};
	try {
		if (Object.keys(option).length !== 0) {
			options = Object.assign({}, options, option);
		}
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		if (Object.keys(formData).length === 0) {
			delete options.formData;
		}
		if(Object.keys(qs).length === 0){
			delete options.qs
			options.useQuerystring = false
		}

		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export async function callImage(this: IExecuteFunctions | IWebhookFunctions, url: string): Promise<any> {
	try {
		let httpRequest : IHttpRequestOptions = {
			url,
			method:"GET",
			encoding:"stream"
		}
		return await this.helpers.httpRequest(httpRequest);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
