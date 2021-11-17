import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

import FormData = require('form-data');

var request = require('request')

/**
 * Make an API request to Upload Data MonkeyLearn
 *
 * @param {IHookFunctions} this
 * @param {object} headers
 * @param {string} method
 * @param {string} url_api
 * @param {object} qs
 * @param {object} body
 * @returns {Promise<any>}
 */

export async function apiCall(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, headers: IDataObject, method: string, url_api: string, qs: IDataObject, formData?: FormData, body?: IDataObject): Promise<any> {
	const credentials = await this.getCredentials('akauntingApi') as {
		url: string;
		company_id: string;
		username: string;
		password: string;
	};

	if (credentials === undefined) {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}

	try {
		let url = `${credentials.url}${url_api}?${qs}`
		let basic = Buffer.from(`${credentials.username}:${credentials.password}`, 'utf8').toString('base64')
		if (formData) {
			let length = await new Promise<number>((resolve, error) => {
				formData.getLength((err: any, l: number) => {
					if (err) {
						error(err)
					} else {
						resolve(l)
					}
				})
			})
			headers = {
				'Authorization': `Basic ${basic}`,
				'Content-Length': length,

				...formData.getHeaders()
			}
			const options: OptionsWithUri = {
				method,
				formData,
				uri: url,
				json: true,
				headers: headers,
			};
			console.log(`Options ${JSON.stringify(options)}`)
			return await this.helpers.request!(options);
		} else {
			headers = {
				'Authorization': `Basic ${basic}`
			}
			const options = {
				method,
				uri: url,
				headers: headers,
				body,
				qs,
				json: true,
			};
			console.log(`Options ${JSON.stringify(options)}`)
			return await this.helpers.request!(options);
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
