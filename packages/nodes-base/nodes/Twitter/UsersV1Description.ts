import {
	INodeProperties
} from "n8n-workflow";

export const usersV1Operations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'users_v1',
				],
			},
		},
		options: [
			{
				name: `User's Timelines`,
				value: 'users_timelines',
				description: 'Returns Tweets mentioning a single user specified by the requested user ID. By default, the most recent ten Tweets are returned per request.',
			},
		],
		default: 'users_timelines',
		description: 'The operation to perform.',
	},
] as INodeProperties[];
