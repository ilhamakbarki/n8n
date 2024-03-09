import type {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IDataObject,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { NodeApiError } from 'n8n-workflow';

export async function dialogApiRequest(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: IHttpRequestMethods,
	resource: string,
	apikey: string,
	body: any = {},
	qs: IDataObject = {},
	uri?: string,
	option: IDataObject = {},
): Promise<any> {
	// tslint:disable-line:no-any

	let options: IHttpRequestOptions = {
		method,
		body,
		qs,
		url: uri ?? `https://waba.360dialog.io/${resource}`,
		json: true,
		headers: {
			'D360-API-KEY': apikey,
		},
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
		//@ts-ignore
		return await this.helpers.httpRequest(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
