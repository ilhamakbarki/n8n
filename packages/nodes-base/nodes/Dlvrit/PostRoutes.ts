import { INodeProperties } from 'n8n-workflow';

export const postRoutesOptions: INodeProperties[] = [
	{
		displayName : "ID",
		name:"id",
		type:"number",
		required:true,
		default:0,
		description:"Route or Queue id",
		displayOptions : {
			show : {
				resource: [
					'postRoutes',
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
					'postRoutes',
				],
			}
		}
	},
];
