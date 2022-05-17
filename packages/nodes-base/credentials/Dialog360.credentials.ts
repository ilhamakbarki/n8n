import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class Dialog360 implements ICredentialType {
	name = 'dialog360Api';
	displayName = '360 Dialog API';
	documentationUrl = '360Dialog';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key Secret',
			name: 'apiKeySecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: ''
		},
	];
}
