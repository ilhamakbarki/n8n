import {
	INodeProperties,
} from 'n8n-workflow';

export const smsOptions: INodeProperties[] = [
	{
		name : "additionalFields",
		displayName : "Additional Field",
		type : "collection",
		placeholder : "Add Field",
		default : {},
		displayOptions : {
			show : {
				resource: [
					'sms',
				],
				operation: [
					'send',
				],
			}
		},
		options : [
			{
				name : "mediaUrl",
				displayName : "Media URL",
				default :"",
				type :"string",
				description:"Media url must valid URL and not CORS"
			}
		]
	}
];
