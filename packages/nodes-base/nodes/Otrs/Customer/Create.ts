import {
	INodeProperties,
} from 'n8n-workflow';

export const customerCreateFields: INodeProperties[] = [
	{
		displayName: 'Firstname',
		name: 'firstname',
		type: 'string',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'customer',
				],
				operation: [
					'create',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Lastname',
		name: 'lastname',
		type: 'string',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'customer',
				],
				operation: [
					'create',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Email',
		name: 'email',
		placeholder:'ilham@example.com',
		type: 'string',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'customer',
				],
				operation: [
					'create',
				],
			},
		},
		default: '',
	},
];
