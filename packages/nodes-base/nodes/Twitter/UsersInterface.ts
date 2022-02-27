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

export interface IUsersV1 {
	user_id?: number,
	screen_name?: string,
	since_id?: number,
	count?: number,
	max_id?: number,
	trim_user? :boolean,
	exclude_replies? : boolean,
	include_rts?:boolean
}
