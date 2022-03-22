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
			},
			{
				name : 'Manage Tweets',
				value : 'manage_tweets'
			},
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

export const manageTweets : INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'manage_tweets',
				],
				resource: [
					'tweet_v2',
				],
			},
		},
		options: [
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				default: '',
				hint:`Hello World!`,
				description: `Text of the Tweet being created. This field is required if media.media_ids is not present.
				`,
			},
			{
				displayName: 'Direct Message Deep Link',
				name: 'direct_message_deep_link',
				type: 'string',
				default: '',
				hint : 'https://twitter.com/messages/compose?recipient_id=2244994945',
				description: 'Tweets a link directly to a Direct Message conversation with an account.',
			},
			{
				displayName: 'Super Followers Only',
				name: 'for_super_followers_only',
				type: 'boolean',
				default: false,
				description: 'Allows you to Tweet exclusively for Super Followers.',
			},
			{
				displayName: 'Place ID',
				name: 'geo_place_id',
				type: 'string',
				default: '',
				hint:"5a110d312052166f",
				description: `Place ID being attached to the Tweet for geo location.`,
			},
			{
				displayName: 'Media IDs',
				name: 'media_media_ids',
				type: 'string',
				default: '',
				hint:`1455952740635586573,145595,1455952740`,
				description: 'A list of Media IDs being attached to the Tweet. This is only required if the request includes the tagged_user_ids',
			},
			{
				displayName: 'Tagged User IDs',
				name: 'media_tagged_user_ids',
				type: 'string',
				default: '',
				hint:`2244994945,6253282`,
				description: `A list of User IDs being tagged in the Tweet with Media. If the user you're tagging doesn't have photo-tagging enabled, their names won't show up in the list of tagged users even though the Tweet is successfully created.`,
			},
			{
				displayName: 'Poll Options',
				name: 'poll_options',
				type: 'string',
				default: '',
				hint:`yes,maybe,no`,
				description: 'A list of poll options for a Tweet with a poll. For the request to be successful it must also include duration_minutes too.',
			},
			{
				displayName: 'Poll Duration Minutes',
				name: 'poll_duration_minutes',
				type: 'number',
				default: 0,
				description: `Duration of the poll in minutes for a Tweet with a poll. This is only required if the request includes poll.options`,
			},
			{
				displayName: 'Quote Tweet ID',
				name: 'quote_tweet_id',
				type: 'string',
				default: '',
				hint:`1455953449422516226`,
				description: `Link to the Tweet being quoted.`,
			},

			{
				displayName: 'In Reply To Tweet ID',
				name: 'reply_in_reply_to_tweet_id',
				type: 'string',
				default: '',
				hint:`1455953449422516226`,
				description: `Tweet ID of the Tweet being replied to. Please note that in_reply_to_tweet_id needs to be in the request if exclude_reply_user_ids is present.`,
			},
			{
				displayName: 'Exclude Reply User IDs',
				name: 'reply_exclude_reply_user_ids',
				type: 'string',
				default: '',
				hint:`6253282,1455953`,
				description: `A list of User IDs to be excluded from the reply Tweet thus removing a user from a thread.`,
			},
			{
				displayName: 'Reply Settings',
				name: 'reply_settings',
				type: 'string',
				default: '',
				hint:`mentionedUsers`,
				description: `Settings to indicate who can reply to the Tweet. Options include "mentionedUsers" and "following". If the field isn't specified, it will default to everyone.
				`,
			},
		],
	}
]
