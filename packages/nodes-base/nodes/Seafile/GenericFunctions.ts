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
	IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export async function seaFileApiRequest(this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IHookFunctions, method: string, resource: string, body: any = {}, formData: IDataObject={}, qs: IDataObject = {}, json: boolean = true, option: IDataObject = {}): Promise<any> {

	const credentials = await this.getCredentials('seaFileApi') as {
		host: string;
		username: string;
		password: string;
	};

	if (typeof credentials === "undefined") {
		throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
	}
	let tokenAccess
	try {
		let optionToken : OptionsWithUrl = {
			method : `POST`,
			json:true,
			url : `${credentials.host}/api2/auth-token/`,
			formData : {
				'username' : credentials.username,
				'password' : credentials.password,
			}
		}

		//@ts-ignore
		let token = await this.helpers.request(optionToken);
		tokenAccess = token.token
		// console.log(`Token access Seafile : ${tokenAccess}`)
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}

	let options: OptionsWithUrl = {
		method,
		body,
		qs,
		formData,
		url: `${credentials.host}${resource}`,
		json,
		headers : {
			Authorization : `Token ${tokenAccess}`
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
		if(Object.keys(formData).length===0){
			delete options.formData;
		}

		//@ts-ignore
		return await this.helpers.request(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
