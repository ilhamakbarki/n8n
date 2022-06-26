import {
	INodeProperties,
} from 'n8n-workflow';

export const contextOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'context',
				],
			},
		},
		options: [
			{
				name: 'Track Webhook',
				value: 'webhook',
				description: 'Collects data from request POST and adds event type. Then it is sent to Tracardi as profile less event. Session is not saved.',
			},
		],
		default: 'webhook',
	},
];

export const contextWebhookFields: INodeProperties[] = [
	{
		displayName: 'Event Type',
		name: 'eventType',
		type: 'string',
		required:true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'context',
				],
				operation: [
					'webhook'
				]
			},
		},
		default:'',
	},
	{
		displayName: 'Source ID',
		name: 'sourceID',
		type: 'string',
		noDataExpression: true,
		required:true,
		displayOptions: {
			show: {
				resource: [
					'context',
				],
				operation: [
					'webhook'
				]
			},
		},
		default:'',
	},
];
