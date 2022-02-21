import { INodeProperties } from "n8n-workflow";

export const operationsShareLink: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'share_link',
				],
			},
		},
		options: [
			{
				name: 'Create Share Link',
				value: 'create',
				description: 'Create new Share Link directory on Repository',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
];

export const optionsSLCreate: INodeProperties[] = [
	{
		displayName: 'Folder Path',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'share_link',
				],
				operation: [
					'create',
				]
			},
		},
		default: '',
		description: 'The folder path.',
	},
	{
		displayName: 'Additional Fields',
		placeholder: 'Add Field',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'share_link',
				],
				operation: [
					'create',
				]
			},
		},
		options: [
			{
				displayName : 'Password',
				name : 'password',
				type : 'hidden',
				default : ''
			},
			{
				displayName : 'Expire Days',
				name : 'expire_days',
				type : 'number',
				default : ''
			},
			{
				name : 'permissions',
				displayName : 'Permissions',
				type : 'options',
				default : 1,
				options : [
					{
						name : 'All Access',
						value : 1
					},
					{
						name : 'Edit and Download',
						value : 2
					},
					{
						name : 'Edit and Upload',
						value : 3
					},
					{
						name : 'Upload and Download',
						value : 4
					},
					{
						name : 'Only Edit',
						value : 5
					},
					{
						name : 'Only Upload',
						value : 6
					},
					{
						name : 'Only Download',
						value : 7
					},
				]
			}
		]
	}
]

