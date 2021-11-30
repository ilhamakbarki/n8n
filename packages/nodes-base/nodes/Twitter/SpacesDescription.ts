import {
	INodeProperties,
} from 'n8n-workflow';

export const spacesOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'spaces',
				],
			},
		},
		options: [
			{
				name: 'Lookup by a single Spaces ID',
				value: 'lookup_spaces_id',
				description: 'Returns a variety of information about a single Space specified by the requested ID.',
			},
			{
				name: 'Lookup by their creator ID',
				value: 'lookup_creator_id',
				description: 'Returns live or scheduled Spaces created by the specified user IDs.',
			},
			{
				name: 'Search for spaces using a keyword',
				value: 'search_spaces_keyword',
				description: 'Return live or scheduled Spaces matching your specified search terms.',
			},
		],
		default: 'lookup_spaces_id',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const spacesOptions = [
	/* -------------------------------------------------------------------------- */
	/*                           spaces:lookup_spaces_id                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'The Spaces ID.',
		name: 'spaces_id',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				operation: [
					'lookup_spaces_id',
				],
				resource: [
					'spaces',
				],
			},
		},
		description: 'The ID of the Spaces to lookup.',
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
					'lookup_spaces_id',
				],
				resource: [
					'spaces',
				],
			},
		},
		options: [
			{
				displayName: 'Expansions',
				name: 'expansions',
				type: 'string',
				default: '',
				description: 'Expansions enable you to request additional data objects that relate to the originally returned Space. Submit a list of desired expansions in a comma-separated list. Available (invited_user_ids, speaker_ids, creator_id, host_ids)',
			},
			{
				displayName: 'Space Fields',
				name: 'space_fields',
				type: 'string',
				default: 'id,state',
				description: 'This fields parameter enables you to select which specific Space fields will deliver in each returned Space. Available (host_ids, created_at, creator_id, id, lang, invited_user_ids, participant_count, speaker_ids, started_at, ended_at, topic_ids, state, title, updated_at, scheduled_start, is_ticketed',
			},
			{
				displayName: 'Topic Fields',
				name: 'topic_fields',
				type: 'string',
				default: '',
				description: 'This fields parameter enables you to select which specific topic metadata in each returned Space topic object Available (id, name, description)',
			},
			{
				displayName: 'User Fields',
				name: 'user_fields',
				type: 'string',
				default: '',
				description: 'This fields parameter enables you to select which specific user fields will deliver in each returned Space. Available (created_at, description, entities, id, location, name, pinned_tweet_id, profile_image_url, protected, public_metrics, url, username, verified, withheld)',
			},
		],
	}
] as INodeProperties[];
