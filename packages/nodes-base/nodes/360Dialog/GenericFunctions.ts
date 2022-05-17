import {
	OptionsWithUrl,
} from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IBinaryKeyData,
	IDataObject,
	INodeExecutionData,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export async function dialogApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IHookFunctions, method: string, resource: string, body: any = {}, qs: IDataObject = {}, uri?: string, option: IDataObject = {}): Promise<any> { // tslint:disable-line:no-any
	const credentials = await this.getCredentials('dialog360Api') as {
		apiKeySecret: string;
	};

	let options: OptionsWithUrl = {
		method,
		body,
		qs,
		url: uri || `https://waba.360dialog.io/${resource}`,
		json: true,
		headers: {
			"D360-API-KEY":credentials.apiKeySecret
		}
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
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
