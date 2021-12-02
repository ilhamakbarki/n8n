export interface IUsers {
	until_id?: string;
	start_time?: string;
	since_id?: string
	exclude?: string
	end_time?: string
	'expansions'?: string
	'max_results'?: number
	'pagination_token'?: string
	'tweet.fields'?: string
	'user.fields'?: string
	'media.fields'?: string
	'place.fields'?: string
	'poll.fields'?: string
}
