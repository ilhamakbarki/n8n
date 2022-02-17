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

import {
	eventListeningOptions
} from "./EventOptions";

const needle = require('needle')

let streamGlobal: any
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
				const webhookUrl = this.getNodeWebhookUrl('default');
				const credentials = await this.getCredentials('twitterBearerToken') as {
					token: string;
				};
				if (credentials === undefined) {
					throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
				}
				const value = this.getNodeParameter('value') as string;
				let streamURL = `https://api.twitter.com/2/tweets/search/stream?${value}`

				streamGlobal = needle.get(streamURL, {
					headers: {
						Authorization: `Bearer ${credentials.token}`,
					},
				})

				streamGlobal.on('data', async (data: any) => {
					try {
						console.log("received stream")

						let response = await needle('POST', webhookUrl, data, {
							headers: {
								'content-type': 'application/json'
							},
						})
						console.log(response.body)
					} catch (error) {
						console.log("Error sini")
						throw new NodeOperationError(this.getNode(), error);
					}
				})

				console.log("success set stream")
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
