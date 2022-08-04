import {
	INodeProperties,
} from 'n8n-workflow';

export const ticketCreateFields: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'ticket',
				],
				operation: [
					'create',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Customer User',
		name: 'customerUser',
		type: 'string',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: [
					'ticket',
				],
				operation: [
					'create',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: [
					'ticket',
				],
				operation: [
					'create',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		noDataExpression: true,
		required: true,
		displayOptions: {
			show: {
				resource: [
					'ticket',
				],
				operation: [
					'create',
				],
			},
		},
		default: '',
	},
];

export const optionalTicketCreateFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'ticket',
				],
				operation: [
					'create',
				],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Customer ID',
				name: 'customerID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Queue ID',
				name: 'queueID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Queue',
				name: 'queue',
				type: 'string',
				default: '',
			},
			{
				displayName: 'State ID',
				name: 'stateID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Priority ID',
				name: 'priorityID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Lock ID',
				name: 'lockID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Lock',
				name: 'lock',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Ticket Type ID',
				name: 'ticketTypeID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Ticket Type',
				name: 'ticketType',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Service ID',
				name: 'serviceID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Service',
				name: 'service',
				type: 'string',
				default: '',
			},
			{
				displayName: 'SLAID',
				name: 'SLAID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'SLA',
				name: 'SLA',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Owner ID',
				name: 'ownerID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Responsible ID',
				name: 'responsibleID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Responsible',
				name: 'responsible',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Is Visible For Customer',
				name: 'isVisibleForCustomer',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Sender Type ID',
				name: 'senderTypeID',
				type: 'number',
				default: '',
			},
			{
				displayName: 'Sender Type',
				name: 'senderType',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Auto Response Type',
				name: 'autoResponseType',
				type: 'string',
				default: '',
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				default: '',
			},
			{
				displayName: 'History Type',
				name: 'historyType',
				type: 'string',
				default: '',
			},
			{
				displayName: 'History Comment',
				name: 'historyComment',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Time Unit',
				name: 'timeUnit',
				type: 'number',
				default: '',
			},
			{
				displayName: 'No Agent Notify',
				name: 'noAgentNotify',
				type: 'number',
				default: '',
			},
		],
	},
];
