import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

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

	const options = {
		headers: {
			Authorization: apiKey,
		},
		method,
		body,
		qs,
		uri: `https://rest.gohighlevel.com/v1${endpoint}`,
		json: true,
	};

	try {

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

