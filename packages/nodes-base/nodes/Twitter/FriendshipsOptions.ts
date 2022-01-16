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
				name:"screen_name",
				displayName:"Screen Name",
				default:"",
				type:"string",
				description:"The screen name of the user to follow."
			},
			{
				name:"user_id",
				displayName:"User ID",
				default:"",
				type:"number",
				description:"The ID of the user to follow."
			},
			{
				name:"follow",
				displayName:"Follow",
				default:false,
				type:"boolean",
				description:"Enable notifications for the target user."
			},
		],
	}
] as INodeProperties[];
