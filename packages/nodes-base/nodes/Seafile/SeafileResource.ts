import {
	INodeProperties
} from "n8n-workflow";

export const seaFileResource: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		options: [
			{
				name: 'Directories',
				value: 'dir',
			},
			{
				name: 'Share Link',
				value: 'share_link',
			},
		],
		default: 'dir',
		description: 'The resource to operate on.',
	},
];
