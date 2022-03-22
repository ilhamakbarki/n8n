export interface ITweet {
	auto_populate_reply_metadata?: boolean;
	display_coordinates?: boolean;
	lat?: number;
	long?: number;
	media_ids?: string;
	possibly_sensitive?: boolean;
	status: string;
	in_reply_to_status_id?: string;
}

export interface ITweetV2 {
	'expansions'?: string
	'media.fields'?: string
	'place.fields'?: string
	'poll.fields'?: string
	'tweet.fields'?: string
	'user.fields'?: string
}

export interface IManageTweetsV2 {
	'direct_message_deep_link'?: string
	'for_super_followers_only'?: boolean
	'geo'?: {
		'place_id'?: string
	}
	'media'?: {
		'media_ids'?: []
		'tagged_user_ids'?: []
	}
	'poll'?: {
		'duration_minutes'?: number
		'options'?: []
	}
	'quote_tweet_id'?: string
	'reply'?: {
		'exclude_reply_user_ids'?: []
		'in_reply_to_tweet_id'?: string
	}
	'reply_settings'?:string
	'text'?:string
}
