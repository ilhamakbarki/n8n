import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class Neo4j implements ICredentialType {
	name = 'neo4j';
	displayName = 'Neo4j';
	properties: INodeProperties[]= [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: 'neo4j',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Database',
			name: 'database',
			type: 'string',
			default: 'neo4j',
		},
		{
			displayName: 'Url',
			name: 'url',
			type: 'string',
			default: 'http://localhost:7474',
		},
	];
}
