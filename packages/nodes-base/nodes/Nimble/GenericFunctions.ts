import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	IDataObject, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

/**
 * Make an API request to Nimble
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */

 export async function nimbleApiRequest(this: IHookFunctions | IExecuteFunctions, method: string, endpoint: string, body: IDataObject, query?: IDataObject): Promise<any> { // tslint:disable-line:no-any
 	const credentials = await this.getCredentials('nimbleApi') as {
 		apiKey: string;
 	};

 	if (credentials === undefined) {
 		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
 	}

 	if (query === undefined) {
 		query = {};
 	}

 	const options: OptionsWithUri = {
 		method,
 		multipart: {
 			data: [{
 				'content-type': 'application/json',
 				body: JSON.stringify(body)
 			}]
 		},
 		qs: query,
 		uri: `https://api.nimble.com/${endpoint}`,
 		json: true,
 	};

 	options.auth = {
 		bearer : credentials.apiKey
 	};

 	try {
 		return await this.helpers.request(options);
 	} catch (error) {
 		throw new NodeApiError(this.getNode(), error);
 	}
 }
