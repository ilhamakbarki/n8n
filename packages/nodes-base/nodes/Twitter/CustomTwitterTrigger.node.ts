import {
	IHookFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeOperationError,
} from 'n8n-workflow';

import {
	eventListeningOptions
} from "./EventOptions";

import { requestTwitterService } from './GenericFunctions';

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
		credentials: [],
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
				try {
					const webhookUrl = this.getNodeWebhookUrl('default')
					const host = this.getNodeParameter('host') as string;
					const webhookData = this.getWorkflowStaticData('node')
					let qs: IDataObject = {
						webhook_url: webhookUrl
					}
					let response = await requestTwitterService.call(this, `GET`, `${host}/api/v1/webhook`, {}, qs)
					if (response.code == 200) {
						webhookData.id = response.data.id
						console.log(`Webhook already exists : ${webhookData.id}`)
						return true
					}
					return false;
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error);
				}
			},

			async create(this: IHookFunctions): Promise<boolean> {
				try {
					const webhookUrl = this.getNodeWebhookUrl('default')
					const host = this.getNodeParameter('host') as string;
					const webhookData = this.getWorkflowStaticData('node')
					let body: IDataObject = {
						webhook_url: webhookUrl,
						method: `POST`
					}
					let response = await requestTwitterService.call(this, `POST`, `${host}/api/v1/webhook`, body, {})
					if (response.code == 200) {
						webhookData.id = response.data.id
						console.log(`Success create webhook : ${webhookData.id}`)
						return true
					}
					return false
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error);
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				try {
					const host = this.getNodeParameter('host') as string;
					const webhookData = this.getWorkflowStaticData('node')
					let response = await requestTwitterService.call(this, `DELETE`, `${host}/api/v1/webhook/${webhookData.id}`, {}, {})
					if (response.code == 200) {
						console.log(`Success delete webhook : ${webhookData.id}`)
						return true
					}
					return false
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error);
				}
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
