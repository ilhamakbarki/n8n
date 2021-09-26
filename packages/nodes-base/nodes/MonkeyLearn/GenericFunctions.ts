import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	IDataObject, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

const MonkeyLearn = require('monkeylearn')

/**
 * Make an API request to MonkeyLearn
 *
 * @param {IHookFunctions} this
 * @param {string} model_id
 * @param {object} body
 * @returns {Promise<any>}
 */

 export async function monkeyLearnClassifyApiRequest(this: IHookFunctions | IExecuteFunctions, model_id: string, data: IDataObject[]) : Promise<any> {
 	const credentials = await this.getCredentials('monkeyLearnApi') as {
 		apiKey: string;
 	};

 	if (credentials === undefined) {
 		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
 	}

 	try {
 		const ml = new MonkeyLearn(credentials.apiKey)
 		return await ml.classifiers.classify(model_id, data)
 	} catch (error) {
 		throw new NodeApiError(this.getNode(), error);
 	}
 }
