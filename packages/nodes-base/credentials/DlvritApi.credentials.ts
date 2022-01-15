import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class DlvritApi implements ICredentialType {
	name = 'dlvritApi';
	displayName = 'Dlvrit API Key';
	documentationUrl = 'Dlvrit';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];
}
