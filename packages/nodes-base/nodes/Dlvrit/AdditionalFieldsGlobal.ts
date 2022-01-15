import { INodeProperties } from "n8n-workflow";

export const additionalFieldsGlobal: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: [
					'postRoutes',
					'postAccount'
				],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Shared',
				name: 'shared',
				type: 'boolean',
				default: false,
				description: 'use shared url where applicable',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title to use if shared is set',
			},
			{
				displayName: 'Post Time',
				name: 'posttime',
				type: 'string',
				default: '',
				description: 'A future post time (only for Qs)',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				default: 'first',
				options: [
					{
						name: 'first',
						value: 'first',
						displayName:'First',
					},
					{
						name: 'last',
						value: 'last',
						displayName:'Last',
					},
				],
				description: 'Specifiy order in Q',
			},
			{
				displayName: 'Queue',
				name: 'queue',
				type: 'string',
				default: '',
				description: 'If set, post to the social Q',
			},
		],
		description: 'Additional Field for Post Routes.',
	},
]
