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
				name: 'Add Rules',
				value: 'add_rules',
				description: 'Add the Rules of an important event',
			},
			{
				name : 'Get Rules',
				value : 'get_rules',
				description : 'Get your current list rulest'
			},
			{
				name: 'Delete Rules',
				value: 'del_rules',
				description: 'Add the Rules of an important event',
			}
		],
		default: 'add_rules',
		description: 'The operation to perform.',
	},
];

export const eventOptions: INodeProperties[] = [
	{
		displayName: 'Rules Value',
		name: 'value',
		type: 'string',
		required:true,
		displayOptions: {
			show: {
				resource: [
					'event',
				],
				operation : [
					'add_rules'
				]
			},
		},
		default: '',
		description: 'The rules value of event do you want to read, use comma (,) for many split events',
	},
	{
		displayName: 'Tags Value',
		name: 'tag',
		type: 'string',
		required:false,
		displayOptions: {
			show: {
				resource: [
					'event',
				],
				operation : [
					'add_rules'
				]
			},
		},
		default: '',
		description: 'The tag value of event do you want to read, use comma (,) for many split events',
	},
	{
		displayName: 'Rules ID',
		name: 'value',
		type: 'string',
		required:true,
		displayOptions: {
			show: {
				resource: [
					'event',
				],
				operation : [
					'del_rules'
				]
			},
		},
		default: '',
		description: 'Rules ID to Delete',
	},
];

export const eventListeningOptions : INodeProperties[] = [
	{
		displayName: 'Read Fields',
		name: 'value',
		type: 'string',
		required:true,
		displayOptions: {
			show: {
				event: [
					'read',
				]
			},
		},
		default: '',
		hint:"tweet.fields=created_at&expansions=author_id&user.fields=created_at",
		description: 'Identify and specify which fields you would like to retrieve',
	},
]
