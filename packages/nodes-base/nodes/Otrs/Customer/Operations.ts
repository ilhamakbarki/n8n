import {
	INodeProperties,
} from 'n8n-workflow';

export const customerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'customer',
				],
			},
		},
		options: [
			{
				name: 'Create Customer',
				value: 'create',
				description: 'Create a New Customer',
				action: 'Create new otrs customer',
			},
		],
		default: 'create',
	},
];
