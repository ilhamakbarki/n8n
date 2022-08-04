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
 * @param {IHookFunctions|IExecuteFunctions} this
 * @param {string} method
 * @param {string} path
 * @param {string} uri
 * @param {object} body
 * @param {object} qs
 * @returns {Promise<any>}
 */
export async function otrsApiRequest(this: IHookFunctions | IExecuteFunctions, method: string, path?: string, uri?: string, body?: IDataObject, qs?: IDataObject): Promise<any> { // tslint:disable-line:no-any
	const credentials = await this.getCredentials('otrsAuthApi') as {
		host: string;
		path: string;
		username: string;
		password: string;
	};

	const optionsAuth: OptionsWithUri = {
		body: {
			User: credentials.username,
			Password: credentials.password,
		},
		uri: `${credentials.host}/api/auth/login`,
		json: true,
		method: 'POST'
	}
	let authRespo = await this.helpers.request(optionsAuth);
	if((authRespo["Response"] as string).toLocaleLowerCase() !="ok"){
		throw new NodeApiError(this.getNode(), {"error":401, "message":authRespo.Message}, {message:authRespo.Message, httpCode:"401"});
	}

	let sessionID = authRespo["SessionValue"]
	const options: OptionsWithUri = {
		method,
		body,
		qs,
		uri: `${credentials.host}/nph-genericinterface.pl/Webservice/${credentials.path}/${path}`,
		json: true,
		rejectUnauthorized: false,
	};

	if(uri != undefined){
		options.uri = `${credentials.host}${uri}`
	}

	options.body["SessionID"] = sessionID

	if (typeof options.body === "undefined" || Object.keys(options.body).length < 1) {
		delete options.body
	}

	if (typeof options.qs === "undefined" || Object.keys(options.qs).length < 1) {
		delete options.qs
	}
	try {
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
