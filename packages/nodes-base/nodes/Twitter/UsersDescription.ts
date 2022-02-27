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
			{
				name: 'Lookup',
				value: 'users_lookup',
				description: 'Returns a variety of information about a single user specified by the requested ID.',
			},
			{
				name: `User's Tweets`,
				value: 'users_tweets',
				description: 'Returns Tweets composed by a single user, specified by the requested user ID.',
			},
			{
				name: `User's Timelines`,
				value: 'users_timelines',
				description: 'Returns Tweets mentioning a single user specified by the requested user ID. By default, the most recent ten Tweets are returned per request.',
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
					'users_lookup',
					'users_tweets',
					'users_timelines'
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

export const usersTimelinesOptions = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'users_timelines',
				],
				resource: [
					'users',
				],
			},
		},
		options: [
			{
				displayName: 'Start Time',
				name: 'start_time',
				type: 'string',
				default: '',
				hint : '2022-02-28T00:00:01.05Z',
				description: 'YYYY-MM-DDTHH:mm:ssZ (ISO 8601/RFC 3339). The new UTC timestamp from which the Tweets will be provided.',
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'string',
				default: '',
				hint : '2022-02-28T23:59:05.05Z',
				description: 'YYYY-MM-DDTHH:mm:ssZ (ISO 8601/RFC 3339). The new UTC timestamp from which the Tweets will be provided.',
			},
			{
				displayName: 'Expansions',
				name: 'expansions',
				type: 'string',
				default: '',
				hint : 'attachments.poll_ids, attachments.media_keys, author_id, entities.mentions.username, geo.place_id, in_reply_to_user_id, referenced_tweets.id, referenced_tweets.id.author_id',
				description: 'Expansions enable you to request additional data objects that relate to the originally returned users. Available (pinned_tweet_id)',
			},
			{
				displayName: 'Max Results',
				name: 'max_results',
				type: 'number',
				default: 10,
				description: 'Specifies the number of Tweets to try and retrieve, up to a maximum of 100 per distinct request. By default, 10 results are returned if this parameter is not supplied.',
			},
			{
				displayName: 'Media Fields',
				name: 'media_fields',
				type: 'string',
				default: '',
				hint : 'duration_ms, height, media_key, preview_image_url, type, url, width, public_metrics, non_public_metrics, organic_metrics, promoted_metrics, alt_text',
				description: `This fields parameter enables you to select which specific media fields will deliver in each returned Tweet.`,
			},
			{
				displayName: 'Pagination Token',
				name: 'pagination_token',
				type: 'string',
				default: '',
				description: `Used to request the next page of results if all results weren't returned with the latest request, or to go back to the previous page of results.`,
			},
			{
				displayName: 'Place Fields',
				name: 'place_fields',
				type: 'string',
				default: '',
				hint : 'contained_within, country, country_code, full_name, geo, id, name, place_type',
				description: 'This fields parameter enables you to select which specific place fields will deliver in each returned Tweet.',
			},
			{
				displayName: 'Poll Fields',
				name: 'poll_fields',
				type: 'string',
				default: '',
				hint : 'duration_minutes, end_datetime, id, options, voting_status',
				description: 'This fields parameter enables you to select which specific poll fields will deliver in each returned Tweet.',
			},
			{
				displayName: 'Since ID',
				name: 'since_id',
				type: 'string',
				default: '',
				description: `Returns results with a Tweet ID greater than (that is, more recent than) the specified 'since' Tweet ID.`,
			},
			{
				displayName: 'Until ID',
				name: 'until_id',
				type: 'string',
				default: '',
				description: `Returns results with a Tweet ID less less than (that is, older than) the specified 'until' Tweet ID.`,
			},
			{
				displayName: 'Tweet Fields',
				name: 'tweet_fields',
				type: 'string',
				default: '',
				hint : 'attachments, author_id, context_annotations, conversation_id, created_at, entities, geo, id, in_reply_to_user_id, lang, non_public_metrics, public_metrics, organic_metrics, promoted_metrics, possibly_sensitive, referenced_tweets, reply_settings, source, text, withheld',
				description: 'This fields parameter enables you to select which specific Tweet fields will deliver in each returned Tweet object.',
			},
			{
				displayName: 'User Fields',
				name: 'user_fields',
				type: 'string',
				default: '',
				hint : 'created_at, description, entities, id, location, name, pinned_tweet_id, profile_image_url, protected, public_metrics, url, username, verified, withheld',
				description: 'This fields parameter enables you to select which specific user fields will deliver in each returned Tweet.',
			},
		]
	}
] as INodeProperties[]
