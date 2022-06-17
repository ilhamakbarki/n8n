import { INodeProperties } from "n8n-workflow";

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'order',
				],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get detail Order ID',
			},
		],
		default: 'get',
	},
];

export const orderGet: INodeProperties[] = [
	{
		displayName : 'Order ID',
		name : 'orderID',
		type : 'number',
		default : '',
		noDataExpression:true,
		description:'Order ID Autoincrement',
		hint : '145000004',
		required : true,
	}
]
