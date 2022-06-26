import {
	INodeProperties,
} from 'n8n-workflow';

export const tracardiResource: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Context Server',
				value: 'context',
			},
		],
		default: 'context',
	},
];
