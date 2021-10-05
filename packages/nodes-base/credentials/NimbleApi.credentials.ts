import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class NimbleApi implements ICredentialType {
	name = 'nimbleApi';
	displayName = 'Nimble API';
	documentationUrl = 'nimble';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];
}
