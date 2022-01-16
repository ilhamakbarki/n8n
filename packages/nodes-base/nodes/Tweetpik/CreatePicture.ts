import { INodeProperties } from 'n8n-workflow';

export const createPicOptions: INodeProperties[] = [
	{
		displayName : "Tweet ID",
		name:"id",
		type:"string",
		required:true,
		default:"",
		description:"Tweet ID",
		displayOptions : {
			show : {
				resource: [
					'createPic',
				],
			}
		}
	},
];
