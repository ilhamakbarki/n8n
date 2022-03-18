import { INodeProperties } from "n8n-workflow";

export const usersFollowersOptions = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: [
					'users_followers',
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
				hint : 'pinned_tweet_id',
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
