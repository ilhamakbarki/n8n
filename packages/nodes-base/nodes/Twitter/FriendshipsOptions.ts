import {
	INodeProperties,
} from 'n8n-workflow';

export const friendShipsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'friendship',
				],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a friendship',
			},
			{
				name: 'Lookup',
				value: 'lookup',
				description: 'Lookup a friendship',
			},
			{
				name: 'Show',
				value: 'show',
				description: 'Show a friendship',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
];

export const friendShipsOptions = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'create'
				],
				resource: [
					'friendship',
				],
			},
		},
		options: [
			{
				name: "screen_name",
				displayName: "Screen Name",
				default: "",
				type: "string",
				description: "The screen name of the user to follow."
			},
			{
				name: "user_id",
				displayName: "User ID",
				default: "",
				type: "number",
				description: "The ID of the user to follow."
			},
			{
				name: "follow",
				displayName: "Follow",
				default: false,
				type: "boolean",
				description: "Enable notifications for the target user."
			},
		],
	}
] as INodeProperties[];

export const friendShipsLookupOptions = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'lookup'
				],
				resource: [
					'friendship',
				],
			},
		},
		options: [
			{
				name: "screen_name",
				displayName: "Screen Name",
				default: '',
				type: "string",
				description: "A comma separated list of screen names, up to 100 are allowed in a single request.",
				hint : 'andypiper,binary_aaron,twitterdev'
			},
			{
				name: "user_id",
				displayName: "User ID",
				default: '',
				type: "string",
				description: "A comma separated list of user IDs, up to 100 are allowed in a single request.",
				hint : '7832146253282,8271281239,12321293124'
			},
		]
	}
] as INodeProperties[];

export const friendShipsShowOptions = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'show'
				],
				resource: [
					'friendship',
				],
			},
		},
		options: [
			{
				name: "source_id",
				displayName: "Source ID",
				default: '',
				type: "number",
				description: "The user_id of the subject user.",
				hint : '783214'
			},
			{
				name: "source_screen_name",
				displayName: "Source Screen Name",
				default: '',
				type: "string",
				description: "The screen_name of the subject user.",
				hint : 'twitter'
			},
			{
				name: "target_id",
				displayName: "Target ID",
				default: '',
				type: "number",
				description: "The user_id of the target user.",
				hint : '2244994945'
			},
			{
				name: "target_screen_name",
				displayName: "Source Screen Name",
				default: '',
				type: "string",
				description: "The screen_name of the target user.",
				hint : 'TwitterDev'
			},
		]
	}
] as INodeProperties[]
