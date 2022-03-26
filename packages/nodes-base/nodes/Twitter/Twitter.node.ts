
import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	directMessageFields,
	directMessageOperations,
} from './DirectMessageDescription';

import {
	tweetFields,
	tweetOperations,
} from './TweetDescription';

import {
	spacesOptions,
	spacesOperations,
} from './SpacesDescription';

import {
	usersOptions,
	usersOperations,
	usersTimelinesOptions,
} from './UsersDescription';

import {
	twitterApiRequest,
	twitterApiRequest2,
	twitterApiRequestAllItems,
	twitterApiRequestOauth2,
	uploadAttachments,
} from './GenericFunctions';

import {
	usersLookupOptions
} from './UsersLookupOptions'

import {
	ITweet,
	ITweetV2,
	IManageTweetsV2
} from './TweetInterface';

import { ISpaces } from './SpacesInterface';
import { IUsers, IUsersV1 } from './UsersInterface';
import { usersTimelinesV1Options, usersTweetsOptions } from './UsersTweetsOptions';
import { friendShipsLookupOptions, friendShipsOperations, friendShipsOptions, friendShipsShowOptions } from './FriendshipsOptions';
import { eventOperations, eventOptions } from './EventOptions';
import { lookupTweets_v2, manageTweets, tweetOperations_v2 } from './TweetV2Description';
import { usersV1Operations } from './UsersV1Description';
import { usersFollowersOptions } from './UsersFollowOptions';

const ISO6391 = require('iso-639-1');

export class Twitter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Twitter',
		name: 'twitter',
		icon: 'file:twitter.svg',
		group: ['input', 'output'],
		version: 1,
		description: 'Consume Twitter API',
		subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
		defaults: {
			name: 'Twitter',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'twitterOAuth1Api',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'directMessage',
							'tweet',
							'users_v1',
							'friendship',
						],
					},
				},
			},
			{
				name: 'twitterOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'tweet_v2',
						],
						operation:[
							//Tweet V2
							'manage_tweets'
						]
					},
				},
			},
			{
				name: 'twitterBearerToken',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'spaces',
							'users',
							'event',
							'tweet_v2'
						],
						operation:[
							//Spaces
							'lookup_spaces_id',
							'lookup_creator_id',
							'search_spaces_keyword',
							//Users
							'users_following',
							'users_followers',
							'users_lookup',
							'users_tweets',
							'users_timelines',
							//Event
							'add_rules',
							'get_rules',
							'del_rules',
							//Tweet V2
							'lookup',
						]
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Direct Message',
						value: 'directMessage',
					},
					{
						name: 'Tweet',
						value: 'tweet',
					},
					{
						name: 'Spaces',
						value: 'spaces'
					},
					{
						name: 'Users V1',
						value: 'users_v1'
					},
					{
						name: 'Users V2',
						value: 'users'
					},
					{
						name: 'Friendship',
						value: 'friendship'
					},
					{
						name: "Event",
						value: "event"
					},
					{
						name: 'Tweet V2',
						value: 'tweet_v2',
					},
				],
				default: 'tweet',
				description: 'The resource to operate on.',
			},
			// DIRECT MESSAGE
			...directMessageOperations,
			...directMessageFields,
			// TWEET
			...tweetOperations,
			...tweetFields,
			//TWEET V2
			...tweetOperations_v2,
			...lookupTweets_v2,
			...manageTweets,
			//Spaces
			...spacesOperations,
			...spacesOptions,
			//Users V1
			...usersV1Operations,
			...usersTimelinesV1Options,
			//Users
			...usersOperations,
			...usersOptions,
			...usersTimelinesOptions,
			...usersLookupOptions,
			...usersTweetsOptions,
			...usersFollowersOptions,
			//Friendship
			...friendShipsOperations,
			...friendShipsOptions,
			...friendShipsLookupOptions,
			...friendShipsShowOptions,
			//Event Listening Stream
			...eventOperations,
			...eventOptions
		],
	};

	methods = {
		loadOptions: {
			// Get all the available languages to display them to user so that he can
			// select them easily
			async getLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const languages = ISO6391.getAllNames();
				for (const language of languages) {
					const languageName = language;
					const languageId = ISO6391.getCode(language);
					returnData.push({
						name: languageName,
						value: languageId,
					});
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length as unknown as number;
		let responseData;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'directMessage') {
					//https://developer.twitter.com/en/docs/twitter-api/v1/direct-messages/sending-and-receiving/api-reference/new-event
					if (operation === 'create') {
						const userId = this.getNodeParameter('userId', i) as string;
						const text = this.getNodeParameter('text', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: IDataObject = {
							type: 'message_create',
							message_create: {
								target: {
									recipient_id: userId,
								},
								message_data: {
									text,
									attachment: {},
								},
							},
						};

						if (additionalFields.attachment) {
							const attachment = additionalFields.attachment as string;

							const attachmentProperties: string[] = attachment.split(',').map((propertyName) => {
								return propertyName.trim();
							});

							const medias = await uploadAttachments.call(this, attachmentProperties, items, i);
							//@ts-ignore
							body.message_create.message_data.attachment = { type: 'media', media: { id: medias[0].media_id_string } };
						} else {
							//@ts-ignore
							delete body.message_create.message_data.attachment;
						}

						responseData = await twitterApiRequest.call(this, 'POST', '/direct_messages/events/new.json', { event: body });

						responseData = responseData.event;
					}
				}
				if (resource === 'tweet') {
					// https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/post-statuses-update
					if (operation === 'create') {
						const text = this.getNodeParameter('text', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: ITweet = {
							status: text,
						};

						if (additionalFields.inReplyToStatusId) {
							body.in_reply_to_status_id = additionalFields.inReplyToStatusId as string;
							body.auto_populate_reply_metadata = true;
						}

						if (additionalFields.attachments) {

							const attachments = additionalFields.attachments as string;

							const attachmentProperties: string[] = attachments.split(',').map((propertyName) => {
								return propertyName.trim();
							});

							const medias = await uploadAttachments.call(this, attachmentProperties, items, i);

							body.media_ids = (medias as IDataObject[]).map((media: IDataObject) => media.media_id_string).join(',');
						}

						if (additionalFields.possiblySensitive) {
							body.possibly_sensitive = additionalFields.possiblySensitive as boolean;
						}

						if (additionalFields.displayCoordinates) {
							body.display_coordinates = additionalFields.displayCoordinates as boolean;
						}

						if (additionalFields.locationFieldsUi) {
							const locationUi = additionalFields.locationFieldsUi as IDataObject;
							if (locationUi.locationFieldsValues) {
								const values = locationUi.locationFieldsValues as IDataObject;
								body.lat = parseFloat(values.latitude as string);
								body.long = parseFloat(values.longitude as string);
							}
						}

						responseData = await twitterApiRequest.call(this, 'POST', '/statuses/update.json', {}, body as unknown as IDataObject);
					}
					// https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-destroy-id
					if (operation === 'delete') {
						const tweetId = this.getNodeParameter('tweetId', i) as string;

						responseData = await twitterApiRequest.call(this, 'POST', `/statuses/destroy/${tweetId}.json`, {}, {});
					}
					// https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
					if (operation === 'search') {
						const q = this.getNodeParameter('searchText', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const qs: IDataObject = {
							q,
						};

						if (additionalFields.includeEntities) {
							qs.include_entities = additionalFields.includeEntities as boolean;
						}

						if (additionalFields.resultType) {
							qs.response_type = additionalFields.resultType as string;
						}

						if (additionalFields.until) {
							qs.until = additionalFields.until as string;
						}

						if (additionalFields.lang) {
							qs.lang = additionalFields.lang as string;
						}

						if (additionalFields.locationFieldsUi) {
							const locationUi = additionalFields.locationFieldsUi as IDataObject;
							if (locationUi.locationFieldsValues) {
								const values = locationUi.locationFieldsValues as IDataObject;
								qs.geocode = `${values.latitude as string},${values.longitude as string},${values.distance}${values.radius}`;
							}
						}

						qs.tweet_mode = additionalFields.tweetMode || 'compat';

						if (returnAll) {
							responseData = await twitterApiRequestAllItems.call(this, 'statuses', 'GET', '/search/tweets.json', {}, qs);
						} else {
							qs.count = this.getNodeParameter('limit', 0) as number;
							responseData = await twitterApiRequest.call(this, 'GET', '/search/tweets.json', {}, qs);
							responseData = responseData.statuses;
						}
					}
					//https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-favorites-create
					if (operation === 'like') {
						const tweetId = this.getNodeParameter('tweetId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {
							id: tweetId,
						};

						if (additionalFields.includeEntities) {
							qs.include_entities = additionalFields.includeEntities as boolean;
						}

						responseData = await twitterApiRequest.call(this, 'POST', '/favorites/create.json', {}, qs);
					}
					//https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-retweet-id
					if (operation === 'retweet') {
						const tweetId = this.getNodeParameter('tweetId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const qs: IDataObject = {
							id: tweetId,
						};

						if (additionalFields.trimUser) {
							qs.trim_user = additionalFields.trimUser as boolean;
						}

						responseData = await twitterApiRequest.call(this, 'POST', `/statuses/retweet/${tweetId}.json`, {}, qs);
					}
				}
				if (resource === 'spaces') {
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					const qs: ISpaces = {}
					if (additionalFields.expansions) {
						qs.expansions = additionalFields.expansions as string
					}
					if (additionalFields.space_fields) {
						qs['space.fields'] = additionalFields.space_fields as string
					}
					if (additionalFields.topic_fields) {
						qs['topic.fields'] = additionalFields.topic_fields as string
					}
					if (additionalFields.user_fields) {
						qs['user.fields'] = additionalFields.user_fields as string
					}

					if (operation === 'lookup_spaces_id') {
						const spaces_id = this.getNodeParameter('spaces_id', i) as string
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/spaces/${spaces_id}`);
					} else if (operation === 'lookup_creator_id') {
						qs.user_ids = this.getNodeParameter('user_ids', i) as string
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/spaces/by/creator_ids`);
					} else if (operation === 'search_spaces_keyword') {
						qs.query = this.getNodeParameter('query', i) as string
						if (additionalFields.state) {
							qs.state = additionalFields.state as string
						}
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/spaces/search`);
					}

				}
				if (resource === 'users_v1') {
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					const qs: IUsersV1 = {}
					if (operation === 'users_timelines') {
						if (typeof additionalFields.user_id != "undefined") {
							qs["user_id"] = additionalFields.user_id as number
						}
						if (typeof additionalFields.screen_name != "undefined") {
							qs["screen_name"] = additionalFields.screen_name as string
						}
						if (typeof additionalFields.count != "undefined") {
							qs["count"] = additionalFields.count as number
						}
						if (typeof additionalFields.since_id != "undefined") {
							qs["since_id"] = additionalFields.since_id as number
						}
						if (typeof additionalFields.max_id != "undefined") {
							qs["max_id"] = additionalFields.max_id as number
						}
						if (typeof additionalFields.trim_user != "undefined") {
							qs["trim_user"] = additionalFields.trim_user as boolean
						}
						if (typeof additionalFields.exclude_replies != "undefined") {
							qs["exclude_replies"] = additionalFields.exclude_replies as boolean
						}
						if (typeof additionalFields.include_rts != "undefined") {
							qs["include_rts"] = additionalFields.include_rts as boolean
						}
						responseData = await twitterApiRequest.call(this, 'GET', `/statuses/user_timeline.json`, {}, qs as IDataObject);
					}
				}
				if (resource === 'users') {
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					const qs: IUsers = {}
					if (typeof additionalFields.expansions != "undefined") {
						qs.expansions = additionalFields.expansions as string
					}
					if (typeof additionalFields.tweet_fields != "undefined") {
						qs['tweet.fields'] = additionalFields.tweet_fields as string
					}
					if (typeof additionalFields.user_fields != "undefined") {
						qs['user.fields'] = additionalFields.user_fields as string
					}
					const user_id = this.getNodeParameter('user_id', i) as string

					if (operation === 'users_following') {
						if (additionalFields.max_results) {
							qs.max_results = additionalFields.max_results as number
						}
						if (additionalFields.pagination_token) {
							qs.pagination_token = additionalFields.pagination_token as string
						}
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/users/${user_id}/following`);
					}
					else if (operation === 'users_lookup') {
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/users/${user_id}`);
						responseData = responseData.data
					}
					else if (operation === 'users_tweets') {
						if (additionalFields.end_time) {
							qs.end_time = additionalFields.end_time as string
						}
						if (additionalFields.start_time) {
							qs.start_time = additionalFields.start_time as string
						}
						if (additionalFields.exclude) {
							qs.exclude = additionalFields.exclude as string
						}
						if (additionalFields.max_results) {
							qs.max_results = additionalFields.max_results as number
						}
						if (additionalFields.media_fields) {
							qs['media.fields'] = additionalFields.media_fields as string
						}
						if (additionalFields.pagination_token) {
							qs.pagination_token = additionalFields.pagination_token as string
						}
						if (additionalFields.place_fields) {
							qs['place.fields'] = additionalFields.place_fields as string
						}
						if (additionalFields.poll_fields) {
							qs["poll.fields"] = additionalFields.poll_fields as string
						}
						if (additionalFields.since_id) {
							qs.since_id = additionalFields.since_id as string
						}
						if (additionalFields.until_id) {
							qs.until_id = additionalFields.until_id as string
						}

						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/users/${user_id}/tweets`);
					}
					else if (operation === 'users_timelines') {
						if (typeof additionalFields.end_time != "undefined") {
							qs.end_time = additionalFields.end_time as string
						}
						if (typeof additionalFields.start_time != "undefined") {
							qs.start_time = additionalFields.start_time as string
						}
						if (typeof additionalFields.max_results != "undefined") {
							qs.max_results = additionalFields.max_results as number
						}
						if (typeof additionalFields.media_fields != "undefined") {
							qs['media.fields'] = additionalFields.media_fields as string
						}
						if (typeof additionalFields.pagination_token != "undefined") {
							qs.pagination_token = additionalFields.pagination_token as string
						}
						if (typeof additionalFields.place_fields != "undefined") {
							qs['place.fields'] = additionalFields.place_fields as string
						}
						if (typeof additionalFields.poll_fields != "undefined") {
							qs["poll.fields"] = additionalFields.poll_fields as string
						}
						if (typeof additionalFields.since_id != "undefined") {
							qs.since_id = additionalFields.since_id as string
						}
						if (typeof additionalFields.until_id != "undefined") {
							qs.until_id = additionalFields.until_id as string
						}
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/users/${user_id}/mentions`);
					}
					else if (operation === 'users_followers') {
						if (typeof additionalFields.max_results != "undefined") {
							qs['max_results'] = additionalFields.max_results as number
						}
						if (typeof additionalFields.pagination_token != "undefined") {
							qs['pagination_token'] = additionalFields.pagination_token as string
						}
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/users/${user_id}/followers`);
					}
				}
				if (resource === 'friendship') {
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					let qs: IDataObject = {}
					if (operation === 'create') {
						if (typeof additionalFields.screen_name !== "undefined") {
							qs["screen_name"] = additionalFields.screen_name as string
						}
						if (typeof additionalFields.user_id !== "undefined") {
							qs["user_id"] = additionalFields.user_id as number
						}
						if (typeof additionalFields.follow !== "undefined") {
							qs["follow"] = additionalFields.follow as boolean
						}
						responseData = await twitterApiRequest.call(this, 'POST', `/friendships/create.json`, {}, qs);
					}
					else if (operation == 'lookup') {
						if (typeof additionalFields.screen_name !== "undefined") {
							qs["screen_name"] = additionalFields.screen_name as string
						}
						if (typeof additionalFields.user_id !== "undefined") {
							qs["user_id"] = additionalFields.user_id as string
						}
						responseData = await twitterApiRequest.call(this, 'GET', `/friendships/lookup.json`, {}, qs);
					}
					else if (operation == 'show') {
						if (typeof additionalFields["source_id"] != "undefined") {
							qs["source_id"] = additionalFields["source_id"] as number
						}
						if (typeof additionalFields["source_screen_name"] != "undefined") {
							qs["source_screen_name"] = additionalFields["source_screen_name"] as string
						}
						if (typeof additionalFields["target_id"] != "undefined") {
							qs["target_id"] = additionalFields["target_id"] as number
						}
						if (typeof additionalFields["target_screen_name"] != "undefined") {
							qs["target_screen_name"] = additionalFields["target_screen_name"] as string
						}
						let response = await twitterApiRequest.call(this, 'GET', `/friendships/show.json`, {}, qs);
						responseData = response["relationship"]
					}
				}
				if (resource === "event") {
					if (operation === 'add_rules') {
						let body: IDataObject = {}
						const value = this.getNodeParameter('value', i) as string;
						const tags = this.getNodeParameter('tag', i) as string;
						let value_split = value.split(",")
						let tags_split = tags.split(",")
						if (tags_split.length > 0) {
							if (value_split.length != tags_split.length) {
								throw new NodeOperationError(this.getNode(), 'Tags and Rules name same length, Check the Comma (,)');
							}
						}
						let add: IDataObject[] = []
						for (let index in value_split) {
							if (tags_split.length > 0 && tags_split[index].trim().length > 1) {
								add.push({ "value": value_split[index].trim(), 'tag': tags_split[index].trim() })
							} else {
								add.push({ "value": value_split[index].trim() })
							}
						}
						body["add"] = add
						responseData = await twitterApiRequest2.call(this, 'POST', ``, body, {}, `https://api.twitter.com/2/tweets/search/stream/rules`);
					} else if (operation === "get_rules") {
						let response = await twitterApiRequest2.call(this, 'GET', ``, {}, {}, `https://api.twitter.com/2/tweets/search/stream/rules`);
						if (response["meta"]["result_count"] > 0) {
							responseData = response["data"]
						} else {
							responseData = []
						}
					} else if (operation === "del_rules") {
						const value = this.getNodeParameter('value', i) as string;
						let body: IDataObject = {}
						let ids = value.split(",")
						body["delete"] = {
							ids
						}
						responseData = await twitterApiRequest2.call(this, 'POST', ``, body, {}, `https://api.twitter.com/2/tweets/search/stream/rules`);
					}
					// else if (operation === "read") {
					// 	const value = this.getNodeParameter('value', i) as string;
					// 	console.log(value)
					// 	responseData = await twitterApiRequest2.call(this, 'GET', ``, {}, {}, `https://api.twitter.com/2/tweets/search/stream?${value}`);
					// }
				}
				if (resource === 'tweet_v2') {
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
					if (operation === 'lookup') {
						const qs: ITweetV2 = {}
						if (typeof additionalFields.expansions != "undefined") {
							qs.expansions = additionalFields.expansions as string
						}
						if (typeof additionalFields.media_fields != "undefined") {
							qs['media.fields'] = additionalFields.media_fields as string
						}
						if (typeof additionalFields.place_fields != "undefined") {
							qs['place.fields'] = additionalFields.place_fields as string
						}
						if (typeof additionalFields.poll_fields != "undefined") {
							qs['poll.fields'] = additionalFields.poll_fields as string
						}
						if (typeof additionalFields.tweet_fields != "undefined") {
							qs['tweet.fields'] = additionalFields.tweet_fields as string
						}
						if (additionalFields.user_fields) {
							qs['user.fields'] = additionalFields.user_fields as string
						}
						const tweetID = this.getNodeParameter('tweetID', i) as string
						responseData = await twitterApiRequest2.call(this, 'GET', '', {}, qs as IDataObject, `https://api.twitter.com/2/tweets/${tweetID}`);
						responseData = responseData.data
					}
					else if (operation == 'manage_tweets') {
						const body: IManageTweetsV2 = {}
						if (typeof additionalFields.direct_message_deep_link != "undefined") {
							body['direct_message_deep_link'] = additionalFields.direct_message_deep_link as string
						}
						if (typeof additionalFields.for_super_followers_only != "undefined") {
							body['for_super_followers_only'] = additionalFields.for_super_followers_only as boolean
						}
						if (typeof additionalFields.geo_place_id != "undefined") {
							body['geo'] = {
								place_id : additionalFields.geo_place_id as string
							}
						}
						let media : IDataObject={}
						if (typeof additionalFields.media_media_ids != "undefined") {
							let media_ids = additionalFields.media_media_ids as string
							media_ids = media_ids.replace(/\s/g,'')
							media['media_ids'] = media_ids.split(",")
						}
						if (typeof additionalFields.media_tagged_user_ids != "undefined") {
							let media_tagged_user_ids = additionalFields.media_tagged_user_ids as string
							media_tagged_user_ids = media_tagged_user_ids.replace(/\s/g,'')
							media['tagged_user_ids'] = media_tagged_user_ids.split(",")
						}
						if(Object.keys(media).length>0){
							body['media'] = media
						}

						let poll : IDataObject={}
						if (typeof additionalFields.poll_options != "undefined") {
							let poll_options = additionalFields.poll_options as string
							poll_options = poll_options.replace(/\s/g,'')
							poll['options'] = poll_options.split(",")
						}
						if (typeof additionalFields.poll_duration_minutes != "undefined") {
							poll['duration_minutes'] = additionalFields.poll_duration_minutes as number
						}
						if(Object.keys(poll).length>0){
							body['poll'] = poll
						}

						if (typeof additionalFields.quote_tweet_id != "undefined") {
							body['quote_tweet_id'] = additionalFields.quote_tweet_id as string
						}

						let reply : IDataObject={}
						if (typeof additionalFields.reply_exclude_reply_user_ids != "undefined") {
							let reply_exclude_reply_user_ids = additionalFields.reply_exclude_reply_user_ids as string
							reply_exclude_reply_user_ids = reply_exclude_reply_user_ids.replace(/\s/g,'')
							reply['exclude_reply_user_ids'] = reply_exclude_reply_user_ids.split(",")
						}
						if (typeof additionalFields.reply_in_reply_to_tweet_id != "undefined") {
							reply['in_reply_to_tweet_id'] = additionalFields.reply_in_reply_to_tweet_id as string
						}
						if(Object.keys(reply).length>0){
							body['reply'] = reply
						}

						if (typeof additionalFields.reply_settings != "undefined") {
							body['reply_settings'] = additionalFields.reply_settings as string
						}
						if (typeof additionalFields.text != "undefined") {
							body['text'] = additionalFields.text as string
						}
						responseData = await twitterApiRequestOauth2.call(this, 'POST', '', body, {}, `https://api.twitter.com/2/tweets`);
						responseData = responseData.data
					}
				}
				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
