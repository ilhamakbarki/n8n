import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	IDataObject, NodeApiError,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

/**
 * Make an API request to Tracardi
 *
 * @param {IHookFunctions} this
 * @param {string} path
 * @param {string} method
 * @param {object} body
 * @param {object} qs
 * @returns {Promise<any>}
 */
export async function tracardiApiRequest(this: IHookFunctions | IExecuteFunctions, path:string, method: string, body?: IDataObject, qs?: IDataObject): Promise<any> { // tslint:disable-line:no-any
	const credentials = await this.getCredentials('tracardiAuth') as {
		host: string;
	};

	const options: OptionsWithUri = {
		method,
		body,
		qs,
		uri: `${credentials.host}${path}`,
		json: true,
		rejectUnauthorized:false,
	};

	if(typeof options.body==="undefined" || Object.keys(options.body).length<1){
		delete options.body
	}

	if(typeof options.qs==="undefined" || Object.keys(options.qs).length<1){
		delete options.qs
	}
	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
