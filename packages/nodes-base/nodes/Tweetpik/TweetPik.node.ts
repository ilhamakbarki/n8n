import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { Headers } from 'request';
import { additionalFieldsGlobal } from './AdditionalFieldsGlobal';
import { createPicOptions } from './CreatePicture';
import { callAPI } from './GenericFunctions';

export class TweetPik implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TweetPik',
		name: 'tweetpik',
		icon: 'file:tweetpik.png',
		group: ['transform'],
		version: 1,
		description: 'Custom TweetPik API',
		defaults: {
			name: 'TweetPik API',
			color: '#1C4E63',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: "tweetpikApi",
				required: true
			}
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Create Picture',
						value: 'createPic',
					},
				],
				default: 'createPic',
				description: 'The resource to operate on.',
			},
			...createPicOptions,
			...additionalFieldsGlobal
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const credentials = await this.getCredentials('tweetpikApi') as {
			apiKey: string;
		};

		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
		}

		const resource = this.getNodeParameter('resource', 0) as string;
		let endpoint: any;
		let body: IDataObject = {}
		let headers : Headers = {
			"Authorization" : credentials.apiKey,
			"Content-Type":"application/json"
		}
		for (let i = 0; i < items.length; i++) {
			try {
				if (resource == "createPic") {
					body["tweetId"] = this.getNodeParameter('id', i) as string
					endpoint = `images`

					let additional = this.getNodeParameter('additionalFields', i) as IDataObject

					if (typeof additional.themeId !== 'undefined') {
						body["themeId"] = additional.themeId as string
					}

					if (typeof additional.dimension !== 'undefined') {
						body["dimension"] = additional.dimension as string
					}

					if (typeof additional.displayLikes !== 'undefined') {
						body["displayLikes"] = additional.displayLikes as boolean
					}

					if (typeof additional.displayReplies !== 'undefined') {
						body["displayReplies"] = additional.displayReplies as boolean
					}

					if (typeof additional.displayRetweets !== 'undefined') {
						body["displayRetweets"] = additional.displayRetweets as boolean
					}

					if (typeof additional.displayVerified !== 'undefined') {
						body["displayVerified"] = additional.displayVerified as boolean
					}

					if (typeof additional.displaySource !== 'undefined') {
						body["displaySource"] = additional.displaySource as boolean
					}

					if (typeof additional.displayTime !== 'undefined') {
						body["displayTime"] = additional.displayTime as boolean
					}

					if (typeof additional.displayMediaImages !== 'undefined') {
						body["displayMediaImages"] = additional.displayMediaImages as boolean
					}

					if (typeof additional.displayLinkPreview !== 'undefined') {
						body["displayLinkPreview"] = additional.displayLinkPreview as boolean
					}

					if (typeof additional.textWidth !== 'undefined') {
						body["textWidth"] = additional.textWidth as number
					}

					if (typeof additional.canvasWidth !== 'undefined') {
						body["canvasWidth"] = additional.canvasWidth as number
					}

					if (typeof additional.backgroundImage !== 'undefined') {
						body["backgroundImage"] = additional.backgroundImage as string
					}

					let r = await callAPI.call(this, `POST`, endpoint, headers, body, {}, {})
					returnData.push(r)
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
