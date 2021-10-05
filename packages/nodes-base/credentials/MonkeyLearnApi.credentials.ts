import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class MonkeyLearnApi implements ICredentialType {
	name = 'monkeyLearnApi';
	displayName = 'MonkeyLearn API';
	documentationUrl = 'MonkeyLearn';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];
}
