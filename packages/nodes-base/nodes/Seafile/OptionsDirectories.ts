import {
	INodeProperties
} from "n8n-workflow";

export const operationsDir: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'dir',
				],
			},
		},
		options: [
			{
				name: 'Create New Directory',
				value: 'create',
				description: 'Create new directory on Repository',
			},
			{
				name: 'Rename Directory',
				value: 'rename',
				description: 'Rename directory on Repository',
			},
		],
		default: 'create',
		description: 'The operation to perform.',
	},
];

export const optionsDirCreate: INodeProperties[] = [
	{
		displayName: 'Libraries',
		name: 'repo',
		type: 'options',
		default: '',
		required:true,
		typeOptions : {
			loadOptionsMethod : 'getRepos'
		},
		displayOptions: {
			show: {
				resource: [
					'dir',
					'share_link'
				],
				operation : [
					'create',
					'rename'
				]
			},
		},
		description: 'Choose the libraries.',
	},
	{
		displayName: 'Folder Name',
		name: 'name',
		type: 'string',
		required:true,
		displayOptions: {
			show: {
				resource: [
					'dir',
				],
				operation : [
					'create',
					'rename'
				]
			},
		},
		default: '',
		description: 'The folder name.',
	}
]

export const optionsDirRename: INodeProperties[] = [
	{
		displayName: 'New Folder Name',
		name: 'newName',
		type: 'string',
		required:true,
		displayOptions: {
			show: {
				resource: [
					'dir',
				],
				operation : [
					'rename'
				]
			},
		},
		default: '',
		description: 'New Folder name.',
	}
]
