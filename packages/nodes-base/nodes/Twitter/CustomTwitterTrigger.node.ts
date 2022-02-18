import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	GenericValue,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeOperationError,
} from 'n8n-workflow';
import request = require('request');
import { tokenFields } from '../Stripe/descriptions';

import {
	eventListeningOptions
} from "./EventOptions";

const needle = require('needle')

export class CustomTwitterTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Custom Twitter Trigger',
		name: 'customTwitterTrigger',
		icon: 'file:twitter.svg',
		group: ['trigger'],
		subtitle: '={{$parameter["event"]}}',
		version: 1,
		description: "Handle Custom Twitter Trigger via Webhooks",
		defaults: {
			name: 'Custom Twitter Trigger',
			color: '#6ad7b9',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'twitterBearerToken',
				required: true,
				displayOptions: {
					show: {
						event: [
							'read',
						]
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				options: [
					{
						name: "Listening Event",
						description: "Listening event that already setup the rules",
						value: "read"
					}
				],
				default: 'read',
				description: 'The resource to operate on.',
			},
			...eventListeningOptions
		]
	};

	// @ts-ignore
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') || "";
				const credentials = await this.getCredentials('twitterBearerToken') as {
					token: string;
				};
				if (credentials === undefined) {
					throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
				}
				const value = this.getNodeParameter('value') as string;
				let streamURL = `https://api.twitter.com/2/tweets/search/stream?${value}`
				streamGlobal = streamConnect.call(this, streamURL, credentials.token, webhookUrl, 0)
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				try {
					streamGlobal.request.abort()
					console.log("success remove stream")
				} catch (error) {
					console.log("Error saat delete")
					console.log(error)
					return false;
				}
				return true;
			},
		}
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		try {
			const req = this.getRequestObject();
			return {
				workflowData: [
					this.helpers.returnJsonArray(req.body)
				],
			};
		} catch (error) {
			console.log("Error webhook")
			throw new NodeOperationError(this.getNode(), error);
		}
	}
}

function bin2String(array: any) {
	var result = "";
	for (var i = 0; i < array.length; i++) {
		result += String.fromCharCode(parseInt(array[i], 2));
	}
	return result;
}

let streamGlobal: any
function streamConnect(this: IHookFunctions, streamUrl: string, token: string, webhookUrl: string, retryAttempt: number): any {
	let stream = needle.get(streamUrl, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	stream.on('data', async (data: any) => {
		console.log("received stream")
		try {
			let json = JSON.parse(data)
			console.log("sending to webhook...")
			let response = await needle('POST', webhookUrl, json, {
				headers: {
					'content-type': 'application/json'
				},
			})
			console.log(response.body)
		} catch (error) {
			console.log("Error Received")
			console.log(bin2String(data))
			if (data.status === 401) {
				console.log(data);
				throw new NodeOperationError(this.getNode(), '401 Unauthorization');
			} else if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
				console.log(data.detail)
				throw new NodeOperationError(this.getNode(), 'This stream is currently at the maximum allowed connection limit.');
			}
		}
	}).on('err', (error: any) => {
		if (error.code !== 'ECONNRESET') {
			console.log("received stream error")
			console.log(error);
		} else {
			streamGlobal.request.abort()
			console.log("success remove stream because disconnect")
			setTimeout(() => {
				console.log(`A connection error occurred. Reconnecting... count (${retryAttempt + 1})`)
				streamGlobal = streamConnect.call(this, streamUrl, token, webhookUrl, ++retryAttempt)
			}, 2 ** retryAttempt * 10);
		}
	})

	console.log("success set stream")
	return stream
}
