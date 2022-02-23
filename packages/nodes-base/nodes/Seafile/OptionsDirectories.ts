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
			{
				name: 'List Directory',
				value: 'list',
				description: 'List item in directory on Repository',
			},
			{
				name: 'Detail Directory',
				value: 'detail',
				description: 'Get Detail directory',
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
					'rename',
					'list',
					'detail'
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
					'rename',
					'detail'
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

export const optionsDirList: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		placeholder: 'Add Field',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'dir',
				],
				operation: [
					'list',
				]
			},
		},
		options: [
			{
				displayName : 'Path',
				name : 'path',
				type : 'string',
				default : '',
				description : `The path to a directory. If p is missing, then defaults to '/' which is the top directory.`
			},
			{
				displayName : 'Oid',
				name : 'oid',
				type : 'string',
				default : '',
				description : `The object id of the directory. The object id is the checksum of the directory contents.`
			},
			{
				displayName : 'Show Item',
				name : 'showItem',
				type : 'options',
				default : 1,
				options : [
					{
						name : 'All Item',
						value : 1
					},
					{
						name : 'Only File',
						value : 2
					},
					{
						name : 'Only Directory',
						value : 3
					},
				]
			},
			{
				displayName : 'Recursive',
				name : 'recursive',
				type : 'options',
				default : 0,
				description : `Return all directory and All entries recursively`,
				options : [
					{
						name : 'True',
						value : 1
					},
					{
						name : 'False',
						value : 0
					},
				]
			},
		]
	}
]
