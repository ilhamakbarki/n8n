import {
	INodeProperties,
} from 'n8n-workflow';

export const encryptDescription: INodeProperties[] = [
	{
		displayName: 'Paint Text',
		name: 'text',
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'encrypt',
				],
			},
		},
		default: '',
		required:true,
		description: 'Text to encrypt',
	},
];

export const decryptDescription: INodeProperties[] = [
	{
		displayName: 'Hash',
		name: 'text',
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'decrypt',
				],
			},
		},
		default: '',
		required:true,
		description: 'Hash to decrypt',
	},
];
