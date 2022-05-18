
import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	templatesOperations,
	getTemplatesAdditional,
} from './TemplatesDescription';

import {
	messagesOperations,
	sendMessageFields,
	sendMessageAdditional,
} from './MessagesDescription';

import {
	IBody,
} from './Dialog360Interface';

import {
	dialogApiRequest
} from './GenericFunctions'
import { IData } from '../Orbit/Interfaces';

export class Dialog360 implements INodeType {
	description: INodeTypeDescription = {
		displayName: '360 Dialog',
		name: 'dialog360',
		icon: 'file:icon.png',
		group: ['input', 'output'],
		version: 1,
		description: 'Consume 360 Dialog Whatsapp API',
		subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
		defaults: {
			name: '360 Dialog',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			{
				displayName : 'API Key',
				name : 'apikey',
				default : '',
				description : 'API key for 360 Dialog API',
				type : 'string',
				required : true,
				typeOptions: {
					password: true,
				},
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Templates',
						value: 'templates',
					},
					{
						name: 'Messages',
						value: 'messages',
					},
				],
				default: 'templates',
				description: 'The resource to operate on.',
			},
			//Templates Operation
			...templatesOperations,
			...getTemplatesAdditional,
			//Message Operation
			...messagesOperations,
			...sendMessageFields,
			...sendMessageAdditional,
		],
	};

	methods = {
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const apikey = this.getNodeParameter('apikey', 0) as string;
		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'templates') {
					if (operation === 'get') {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						let resp = await dialogApiRequest.call(this, `GET`, `v1/configs/templates`, apikey)
						if (typeof additionalFields.name != 'undefined') {
							let template
							for (let d of resp.waba_templates) {
								if (d.name == additionalFields.name) {
									template = d
									break
								}
							}
							if (typeof template == 'undefined') {
								throw new NodeOperationError(this.getNode(), `Template "${additionalFields.name}" is not found!`);
							}
							responseData = template
						} else {
							responseData = resp.waba_templates
						}
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				} else if (resource === 'messages') {
					if (operation === 'send') {
						const recipient = this.getNodeParameter('recipient', i) as string;
						const templateName = this.getNodeParameter('template', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						let resp = await dialogApiRequest.call(this, `GET`, `v1/configs/templates`, apikey)
						let template
						for (let d of resp.waba_templates) {
							if (d.name == templateName) {
								template = d
								break
							}
						}
						if (typeof template == 'undefined') {
							throw new NodeOperationError(this.getNode(), `Template "${templateName}" is not found!`);
						}
						let components: IDataObject[] = []
						for (let d of template.components) {
							//Set component header
							if (d.type == 'HEADER' && d.format == 'IMAGE') {
								let header: IDataObject = {
									"type": "header",
									"parameters": [
										{
											"type": "image",
											"image": {
												"link": d['example']['header_handle'][0]
											}
										}
									]
								}
								components.push(header)
							}
							//Set component body
							else if (d.type == 'BODY') {
								let body: IDataObject = {
									"type": "body"
								}
								if (typeof d.example != 'undefined') {
									if (typeof additionalFields.body == 'undefined') {
										throw new NodeOperationError(this.getNode(), `The Body Text Message is required`);
									}
									let bodyMessage = additionalFields.body as string
									let bodyMessages = bodyMessage.split('|')
									let totalBody = d['example']['body_text'][0].length
									if (bodyMessages.length != totalBody) {
										throw new NodeOperationError(this.getNode(), `Body Message on Template need ${totalBody} text value, but given ${bodyMessages.length} value, please check the Body Text`)
									}
									let parameters: IDataObject[] = []
									for (let e of bodyMessages) {
										parameters.push({
											"type": "text",
											"text": e
										})
									}
									body['parameters'] = parameters
								}
								components.push(body)
							}
						}

						let body: IBody = {
							to: recipient,
							type: `template`,
							template: {
								namespace: template['namespace'],
								name: template['name'],
								language: {
									"policy": "deterministic",
									"code": template['language']
								},
								components
							}
						}
						responseData = await dialogApiRequest.call(this, `POST`, `v1/messages`, apikey, body)
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}
				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
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
