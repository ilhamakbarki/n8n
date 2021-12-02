import {
	INodeProperties,
} from 'n8n-workflow';

export const usersTweetsOptions = [
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
					'users_tweets'
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
				placeholder: "2021-12-03T23:59:13.05Z",
				description: 'YYYY-MM-DDTHH:mm:ssZ (ISO 8601/RFC 3339). The newest or most recent UTC timestamp from which the Tweets will be provided.',
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'string',
				default: '',
				placeholder: "2021-12-03T23:59:13.05Z",
				description: 'YYYY-MM-DDTHH:mm:ssZ (ISO 8601/RFC 3339). The newest or most recent UTC timestamp from which the Tweets will be provided.',
			},
			{
				displayName: 'Exclude',
				name: 'exclude',
				type: 'string',
				default: '',
				description: 'When exclude=retweets is used, the maximum historical Tweets returned is still 3200. When the exclude=replies parameter is used for any value, only the most recent 800 Tweets are available. Available (retweets,replies)',
			},
			{
				displayName: 'Expansions',
				name: 'expansions',
				type: 'string',
				default: '',
				description: 'Expansions enable you to request additional data objects that relate to the originally returned users. Available (attachments.poll_ids,attachments.media_keys,author_id,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id)',
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
				default: "",
				description: 'This fields parameter enables you to select which specific media fields will deliver in each returned Tweet. Available (duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,non_public_metrics,organic_metrics,promoted_metrics,alt_text)',
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
				description: `This fields parameter enables you to select which specific place fields will deliver in each returned Tweet. Available(contained_within,country,country_code,full_name,geo,id,name,place_type)`,
			},
			{
				displayName: 'Poll Fields',
				name: 'poll_fields',
				type: 'string',
				default: '',
				description: `This fields parameter enables you to select which specific poll fields will deliver in each returned Tweet. Available(duration_minutes,end_datetime,id,options,voting_status)`,
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
