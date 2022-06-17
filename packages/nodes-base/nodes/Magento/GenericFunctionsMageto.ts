import {
	IWebhookFunctions,
	NodeApiError,
	IHookFunctions,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject
} from "n8n-workflow";

const xmlrpc = require('xmlrpc')
export async function magento1ApiRequest(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, args: any[]): Promise<any> { // tslint:disable-line:no-any
	const credentials = await this.getCredentials('magentoApi') as {
		apiUser: string,
		apiKey: string,
		host: string,
	};

	try {
		const client = xmlrpc.createSecureClient({ url: credentials.host })
		let sessionId = await new Promise((resolve, reject) => {
			client.methodCall('login', [credentials.apiUser, credentials.apiKey], (error: Error, value: any) => {
				if (error != null) {
					reject(error)
				} else {
					resolve(value)
				}
			})
		})

		//@ts-ignore
		return await new Promise((resolve, reject) => {
			client.methodCall('call', [sessionId, method, args], (err: Error, value: any) => {
				if (err != null) {
					reject(err)
				} else {
					resolve(value)
				}
			})
		})
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}
