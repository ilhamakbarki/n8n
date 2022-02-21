import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class SeafileApi implements ICredentialType {
	name = 'seaFileApi';
	displayName = 'Seafile API';
	documentationUrl = 'seafile';
	properties: INodeProperties[] = [
		{
			displayName: 'Seafile Host Url',
			name: 'host',
			type: 'string',
			default: '',
			required:true
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required:true
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
			required:true
		},
	];
}
