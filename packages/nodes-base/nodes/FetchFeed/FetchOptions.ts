import {
	INodeProperties,
} from 'n8n-workflow';

export const FetchOptions = [
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
				resource: [
					'fetch_data',
					'fetch_company',
				],
			},
		},
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				placeholder: "0",
				description: 'Page',
			},
			{
				displayName: 'Limit Per Page',
				name: 'limit_page',
				type: 'number',
				default: 25,
				placeholder: "25",
				description: 'Limit Data Perpage',
			},
			{
				displayName: 'All Page',
				name: 'all_page',
				type: 'boolean',
				default: false,
				description: 'All Page',
			},
			{
				displayName: 'Organization ID',
				name: 'organization_id',
				type: 'string',
				default: '',
				description: 'Organization ID',
			},
		],
	}
] as INodeProperties[];
