import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	OptionsWithUrl,
	AuthOptions,
} from 'request';

/**
 * Make an authenticated REST API request to HighLevel.
 */
export async function highLevelApiRequest(
	this: IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: string,
	endpoint: string,
	body: object = {},
	qs: object = {},
) {
	const { apiKey } = await this.getCredentials('highLevelApi') as { apiKey: string };

	const auth :AuthOptions = {
		bearer : apiKey,
	}

	const options :OptionsWithUrl = {
		auth,
		method,
		body,
		qs,
		url: `https://rest.gohighlevel.com/v1${endpoint}`,
		json: true,
	};

	try {
		if (Object.keys(body).length === 0) {
			delete options.body;
		}
		if (Object.keys(qs).length === 0) {
			delete options.qs;
		}
		return await this.helpers.request!.call(this, options);

	} catch (error) {

		if (error?.response?.body?.error) {
			const { error: errorMessage } = error.response.body;
			throw new Error(
				`HighLevel error response [${error.statusCode}]: ${errorMessage}`,
			);
		}

		throw error;
	}
}

