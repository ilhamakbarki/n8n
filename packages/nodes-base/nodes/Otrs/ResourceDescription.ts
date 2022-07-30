import {
	INodeProperties,
} from 'n8n-workflow';

export const otrsResource: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Ticket',
				value: 'ticket',
			},
		],
		default: 'ticket',
	},
];
