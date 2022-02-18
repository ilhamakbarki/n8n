import {
	INodeProperties
} from "n8n-workflow";

export const tweetOperations_v2: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'tweet_v2',
				],
			},
		},
		options: [
			{
				name : 'Tweets lookup',
				value : 'lookup'
			}
		],
		default: 'lookup',
		description: 'The operation to perform.',
	},
];

export const lookupTweets_v2 : INodeProperties[] = [
	{
		displayName: 'Tweet ID',
		name: 'tweetID',
		type: 'string',
		placeholder: 'Tweet ID',
		default: '',
		required:true,
		displayOptions: {
			show: {
				operation: [
					'lookup',
				],
				resource: [
					'tweet_v2',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'lookup',
				],
				resource: [
					'tweet_v2',
				],
			},
		},
		options: [
			{
				displayName: 'Expansions',
				name: 'expansions',
				type: 'string',
				default: '',
				hint : 'attachments.poll_ids, attachments.media_keys, author_id, entities.mentions.username, geo.place_id, in_reply_to_user_id, referenced_tweets.id, referenced_tweets.id.author_id',
				description: 'Expansions enable you to request additional data objects that relate to the originally returned Space. Submit a list of desired expansions in a comma-separated list. Available (attachments.poll_ids, attachments.media_keys, author_id, entities.mentions.username, geo.place_id, in_reply_to_user_id, referenced_tweets.id, referenced_tweets.id.author_id)',
			},
			{
				displayName: 'Media Fields',
				name: 'media_fields',
				type: 'string',
				default: '',
				hint:"duration_ms, height, media_key, preview_image_url, type, url, width, public_metrics, non_public_metrics, organic_metrics, promoted_metrics, alt_text",
				description: 'This fields parameter enables you to select which specific media fields will deliver in each returned Tweet. Available (duration_ms, height, media_key, preview_image_url, type, url, width, public_metrics, non_public_metrics, organic_metrics, promoted_metrics, alt_text)',
			},
			{
				displayName: 'Place Fields',
				name: 'place_fields',
				type: 'string',
				default: '',
				hint:"contained_within, country, country_code, full_name, geo, id, name, place_type",
				description: 'This fields parameter enables you to select which specific place fields will deliver in each returned Tweet. Available (contained_within, country, country_code, full_name, geo, id, name, place_type)',
			},
			{
				displayName: 'Poll Fields',
				name: 'poll_fields',
				type: 'string',
				default: '',
				hint:"duration_minutes, end_datetime, id, options, voting_status",
				description: 'This fields parameter enables you to select which specific poll fields will deliver in each returned Tweet. Available (duration_minutes, end_datetime, id, options, voting_status)',
			},
			{
				displayName: 'Tweet Fields',
				name: 'tweet_fields',
				type: 'string',
				default: '',
				hint :"attachments, author_id, context_annotations, conversation_id, created_at, entities, geo, id, in_reply_to_user_id, lang, non_public_metrics, public_metrics, organic_metrics, promoted_metrics, possibly_sensitive, referenced_tweets, reply_settings, source, text, withheld",
				description: 'This fields parameter enables you to select which specific Tweet fields will deliver in each returned Tweet object. Available (attachments, author_id, context_annotations, conversation_id, created_at, entities, geo, id, in_reply_to_user_id, lang, non_public_metrics, public_metrics, organic_metrics, promoted_metrics, possibly_sensitive, referenced_tweets, reply_settings, source, text, withheld)',
			},
			{
				displayName: 'User Fields',
				name: 'user_fields',
				type: 'string',
				default: '',
				hint:"created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld",
				description: 'This fields parameter enables you to select which specific user fields will deliver in each returned Space. Available (created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld)',
			},

		],
	}
]
