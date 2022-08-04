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

import {
	otrsResource,
} from './ResourceDescription';

import { ticketOperations } from './Ticket/Operations';
import { customerOperations } from './Customer/Operations';

import {
	optionalTicketCreateFields,
	ticketCreateFields,
} from './Ticket/Create';

import {
	otrsApiRequest,
} from './GenericFunctions';

import { customerCreateFields } from './Customer/Create';

export class Otrs implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Otrs',
		name: 'otrs',
		icon: 'file:otrs.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'OTRS Data Platform',
		defaults: {
			name: 'OTRS',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{
			name: 'otrsAuthApi',
			required: true,
		}],
		properties: [
			...otrsResource,
			//Ticket
			...ticketOperations,
			...ticketCreateFields,
			...optionalTicketCreateFields,
			//Customer
			...customerOperations,
			...customerCreateFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const body: IDataObject = {};
		const qs: IDataObject = {};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'ticket') {
					if (operation === 'create') {
						const ticket: IDataObject = {
							'Title': this.getNodeParameter('title', i) as string,
							'CustomerUser': this.getNodeParameter('customerUser', i) as string,
						};
						const article: IDataObject = {
							'CommunicationChannel': 'Email',
							'Subject': this.getNodeParameter('subject', i) as string,
							'Body': this.getNodeParameter('body', i) as string,
							'ContentType': 'text/plain; charset=utf8',
							'Charset': 'utf8',
							'MimeType': 'text/plain',
						};
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (typeof additionalFields.customerID !== 'undefined') {
							ticket["CustomerID"] = additionalFields.customerID;
						}
						if (typeof additionalFields.queueID !== 'undefined') {
							ticket["QueueID"] = additionalFields.queueID;
						}
						if (typeof additionalFields.queue !== 'undefined') {
							ticket["Queue"] = additionalFields.queue;
						}
						if (typeof additionalFields.stateID !== 'undefined') {
							ticket["StateID"] = additionalFields.stateID;
						}
						if (typeof additionalFields.state !== 'undefined') {
							ticket["State"] = additionalFields.state;
						}
						if (typeof additionalFields.priorityID !== 'undefined') {
							ticket["PriorityID"] = additionalFields.priorityID;
						}
						if (typeof additionalFields.priority !== 'undefined') {
							ticket["Priority"] = additionalFields.priority;
						}
						if (typeof additionalFields.lockID !== 'undefined') {
							ticket["LockID"] = additionalFields.lockID;
						}
						if (typeof additionalFields.lock !== 'undefined') {
							ticket["Lock"] = additionalFields.lock;
						}
						if (typeof additionalFields.ticketTypeID !== 'undefined') {
							ticket["TypeID"] = additionalFields.ticketTypeID;
						}
						if (typeof additionalFields.ticketType !== 'undefined') {
							ticket["Type"] = additionalFields.ticketType;
						}
						if (typeof additionalFields.serviceID !== 'undefined') {
							ticket["ServiceID"] = additionalFields.serviceID;
						}
						if (typeof additionalFields.service !== 'undefined') {
							ticket["Service"] = additionalFields.service;
						}
						if (typeof additionalFields.SLAID !== 'undefined') {
							ticket["SLAID"] = additionalFields.SLAID;
						}
						if (typeof additionalFields.SLA !== 'undefined') {
							ticket["SLA"] = additionalFields.SLA;
						}
						if (typeof additionalFields.ownerID !== 'undefined') {
							ticket["OwnerID"] = additionalFields.ownerID;
						}
						if (typeof additionalFields.owner !== 'undefined') {
							ticket["Owner"] = additionalFields.owner;
						}
						if (typeof additionalFields.responsibleID !== 'undefined') {
							ticket["ResponsibleID"] = additionalFields.responsibleID;
						}
						if (typeof additionalFields.responsible !== 'undefined') {
							ticket["Responsible"] = additionalFields.responsible;
						}

						if (typeof additionalFields.isVisibleForCustomer !== 'undefined') {
							article["IsVisibleForCustomer"] = additionalFields.isVisibleForCustomer;
						}
						if (typeof additionalFields.senderTypeID !== 'undefined') {
							article["SenderTypeID"] = additionalFields.senderTypeID;
						}
						if (typeof additionalFields.senderType !== 'undefined') {
							article["SenderType"] = additionalFields.senderType;
						}
						if (typeof additionalFields.autoResponseType !== 'undefined') {
							article["AutoResponseType"] = additionalFields.autoResponseType;
						}
						if (typeof additionalFields.from !== 'undefined') {
							article["From"] = additionalFields.from;
						}
						if (typeof additionalFields.historyType !== 'undefined') {
							article["HistoryType"] = additionalFields.historyType;
						}
						if (typeof additionalFields.historyComment !== 'undefined') {
							article["HistoryComment"] = additionalFields.historyComment;
						}
						if (typeof additionalFields.timeUnit !== 'undefined') {
							article["TimeUnit"] = additionalFields.timeUnit;
						}
						if (typeof additionalFields.noAgentNotify !== 'undefined') {
							article["NoAgentNotify"] = additionalFields.noAgentNotify;
						}

						body["Ticket"] = ticket;
						body["Article"] = article;
						const responseData = await otrsApiRequest.call(this, 'POST', `ticket`, undefined, body);
						returnData.push(responseData as IDataObject);
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				} else if(resource === 'customer'){
					if (operation === 'create') {
						const customer: IDataObject = {
							'Firstname': this.getNodeParameter('firstname', i) as string,
							'Lastname': this.getNodeParameter('lastname', i) as string,
							'CustomerID': this.getNodeParameter('email', i) as string,
							'Login': this.getNodeParameter('email', i) as string,
							'Email': this.getNodeParameter('email', i) as string,
						};
						const responseData = await otrsApiRequest.call(this, `POST`, undefined, '/api/customers/createCustomerUser', customer);
						returnData.push(responseData as IDataObject);
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				}else {
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
