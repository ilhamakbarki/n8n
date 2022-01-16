import {
	INodeProperties,
} from 'n8n-workflow';

export const eventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'event',
				],
			},
		},
		options: [
			{
				name: 'Listen',
				value: 'listen',
				description: 'Listen an important event',
			},
			{
				name: 'Read',
				value: 'read',
				description: 'Read your list important event',
			},
		],
		default: 'listen',
		description: 'The operation to perform.',
	},
];

export const eventOptions: INodeProperties[] = [
	{
		displayName: 'Event Value',
		name: 'value',
		type: 'string',
		required:true,
		displayOptions: {
			show: {
				resource: [
					'event',
				],
				operation : [
					'listen'
				]
			},
		},
		default: '',
		description: 'The value of event want to listen.',
	},
];
