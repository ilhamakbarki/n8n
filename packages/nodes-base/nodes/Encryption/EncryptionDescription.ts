import {
	INodeProperties,
} from 'n8n-workflow';

export const encryptDescription: INodeProperties[] = [
	{
		displayName: 'JSON Object of text',
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
		description: 'JSON Object of text to encrypt any value on fields into hash.',
		hint : `{"field1":"hello my name is ilham", "field2":"another words"}`
	},
];

export const decryptDescription: INodeProperties[] = [
	{
		displayName: 'JSON Object of Hash',
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
		description: 'JSON Object of hash to decrypt value on fields into plain text.',
		hint : `{"field1":"slHnEKIDw3+TwK==", "field2":"Ot3usTcAk/Mt3ux/XFDrY60P"}`
	},
];
