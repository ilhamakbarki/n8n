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
