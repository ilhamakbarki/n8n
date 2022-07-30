import {
	INodeProperties,
} from 'n8n-workflow';

export const ticketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'ticket',
				],
			},
		},
		options: [
			{
				name: 'Create Ticket',
				value: 'create',
				description: 'Create a New Ticket for OTRS',
				action: 'Create OTRS a ticket',
			},
		],
		default: 'create',
	},
];
