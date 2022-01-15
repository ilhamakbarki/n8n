import { INodeProperties } from 'n8n-workflow';

export const postAccountOptions: INodeProperties[] = [
	{
		displayName : "ID",
		name:"id",
		type:"number",
		required:true,
		default:0,
		description:"Account id",
		displayOptions : {
			show : {
				resource: [
					'postAccount',
				],
			}
		}
	},
	{
		displayName : "Message",
		name:"message",
		type:"string",
		required:true,
		default:"",
		description:"Message",
		displayOptions : {
			show : {
				resource: [
					'postAccount',
				],
			}
		}
	},
];
