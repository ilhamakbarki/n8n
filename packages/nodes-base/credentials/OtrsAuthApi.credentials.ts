import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class OtrsAuthApi implements ICredentialType {
	name = 'otrsAuthApi';
	displayName = 'Otrs Auth';
	documentationUrl = 'otrs';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
			hint: 'https://sdlocatel.keos.co/',
			required: true
		},
		{
			displayName: 'Path Webservice',
			name: 'path',
			type: 'string',
			default: '',
			hint: 'rest',
			required: true
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			hint: 'ilham',
			required: true
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true
		},
	];
}
