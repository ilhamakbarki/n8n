import {
	INodeProperties,
} from 'n8n-workflow';

export const usersLookupOptions = [
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
					'users_lookup',
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
