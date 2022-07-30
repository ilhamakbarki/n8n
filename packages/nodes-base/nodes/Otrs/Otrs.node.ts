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

import {
	optionalTicketCreateFields,
	ticketCreateFields,
} from './Ticket/Create';

import {
	otrsApiRequest,
} from './GenericFunctions'
import { ticketOperations } from './Ticket/Operations';

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
			//Operations
			...ticketOperations,
			...ticketCreateFields,
			...optionalTicketCreateFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		let resource = this.getNodeParameter('resource', 0) as string
		let operation = this.getNodeParameter('operation', 0) as string;

		let body: IDataObject = {}
		let qs: IDataObject = {}

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'ticket') {
					if (operation === 'create') {
						let ticket: IDataObject = {
							'Title': this.getNodeParameter('title', i) as string,
							'Queue': this.getNodeParameter('queue', i) as string,
							'State': this.getNodeParameter('state', i) as string,
							'Priority': this.getNodeParameter('priority', i) as string,
							'CustomerUser': this.getNodeParameter('customerUser', i) as string,
						}
						let article: IDataObject = {
							'CommunicationChannel': this.getNodeParameter('communicationChannel', i) as string,
							'Subject': this.getNodeParameter('subject', i) as string,
							'Body': this.getNodeParameter('body', i) as string,
							'ContentType': this.getNodeParameter('contentType', i) as string,
							'Charset': this.getNodeParameter('charset', i) as string,
						}
						let additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						if (typeof additionalFields.lockID != 'undefined') {
							ticket["LockID"] = additionalFields.lockID
						}
						if (typeof additionalFields.lock != 'undefined') {
							ticket["Lock"] = additionalFields.lock
						}
						if (typeof additionalFields.typeID != 'undefined') {
							ticket["TypeID"] = additionalFields.typeID
						}
						if (typeof additionalFields.type != 'undefined') {
							ticket["Type"] = additionalFields.type
						}
						if (typeof additionalFields.serviceID != 'undefined') {
							ticket["ServiceID"] = additionalFields.serviceID
						}
						if (typeof additionalFields.service != 'undefined') {
							ticket["Service"] = additionalFields.service
						}
						if (typeof additionalFields.SLAID != 'undefined') {
							ticket["SLAID"] = additionalFields.SLAID
						}
						if (typeof additionalFields.SLA != 'undefined') {
							ticket["SLA"] = additionalFields.SLA
						}
						if (typeof additionalFields.ownerID != 'undefined') {
							ticket["OwnerID"] = additionalFields.ownerID
						}
						if (typeof additionalFields.owner != 'undefined') {
							ticket["Owner"] = additionalFields.owner
						}
						if (typeof additionalFields.responsibleID != 'undefined') {
							ticket["ResponsibleID"] = additionalFields.responsibleID
						}
						if (typeof additionalFields.responsible != 'undefined') {
							ticket["Responsible"] = additionalFields.responsible
						}

						if (typeof additionalFields.isVisibleForCustomer != 'undefined') {
							article["IsVisibleForCustomer"] = additionalFields.isVisibleForCustomer
						}
						if (typeof additionalFields.senderTypeID != 'undefined') {
							article["SenderTypeID"] = additionalFields.senderTypeID
						}
						if (typeof additionalFields.senderType != 'undefined') {
							article["SenderType"] = additionalFields.senderType
						}
						if (typeof additionalFields.autoResponseType != 'undefined') {
							article["AutoResponseType"] = additionalFields.autoResponseType
						}
						if (typeof additionalFields.from != 'undefined') {
							article["From"] = additionalFields.from
						}
						if (typeof additionalFields.historyType != 'undefined') {
							article["HistoryType"] = additionalFields.historyType
						}
						if (typeof additionalFields.historyComment != 'undefined') {
							article["HistoryComment"] = additionalFields.historyComment
						}
						if (typeof additionalFields.timeUnit != 'undefined') {
							article["TimeUnit"] = additionalFields.timeUnit
						}
						if (typeof additionalFields.noAgentNotify != 'undefined') {
							article["NoAgentNotify"] = additionalFields.noAgentNotify
						}

						body["Ticket"] = ticket
						body["Article"] = article
						const responseData = await otrsApiRequest.call(this, `ticket`, 'POST', body);
						returnData.push(responseData as IDataObject);
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
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
