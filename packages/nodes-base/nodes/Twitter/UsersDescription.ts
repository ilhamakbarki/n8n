import {
	INodeProperties,
} from 'n8n-workflow';

export const usersOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'users',
				],
			},
		},
		options: [
			{
				name: 'Following',
				value: 'users_following',
				description: 'Returns a list of users the specified user ID is following.',
			},
		],
		default: 'users_following',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const usersOptions = [
	/* -------------------------------------------------------------------------- */
	/*                           spaces:users_following                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'User ID.',
		name: 'user_id',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				operation: [
					'users_following',
				],
				resource: [
					'users',
				],
			},
		},
		description: 'The user ID whose following you would like to retrieve.',
	},
	/* -------------------------------------------------------------------------- */
	/*                           spaces:Options Fields                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'users_following',
				],
				resource: [
					'users',
				],
			},
		},
		options: [
			{
				displayName: 'Expansions',
				name: 'expansions',
				type: 'string',
				default: '',
				description: 'Expansions enable you to request additional data objects that relate to the originally returned users. Available (pinned_tweet_id)',
			},
			{
				displayName: 'Max Results',
				name: 'max_results',
				type: 'number',
				default: 100,
				description: 'The maximum number of results to be returned per page. This can be a number between 1 and the 1000. By default, each page will return 100 results.',
			},
			{
				displayName: 'Pagination Token',
				name: 'pagination_token',
				type: 'string',
				default: '',
				description: `Used to request the next page of results if all results weren't returned with the latest request, or to go back to the previous page of results.`,
			},
			{
				displayName: 'Tweet Fields',
				name: 'tweet_fields',
				type: 'string',
				default: '',
				description: 'This fields parameter enables you to select which specific Tweet fields will deliver in each returned pinned Tweet. Available (attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,id,in_reply_to_user_id,lang,non_public_metrics,public_metrics,organic_metrics,promoted_metrics,possibly_sensitive,referenced_tweets,reply_settings,source,text,withheld)',
			},
			{
				displayName: 'User Fields',
				name: 'user_fields',
				type: 'string',
				default: '',
				description: 'This fields parameter enables you to select which specific user fields will deliver with each returned users objects. Available (created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld)',
			},
		],
	}
] as INodeProperties[];
