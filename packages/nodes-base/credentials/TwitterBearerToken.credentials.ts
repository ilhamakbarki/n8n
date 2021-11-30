import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const scopes = [
	'webhooks:write',
	'webhooks:read',
	'forms:read',
];

export class TwitterBearerToken implements ICredentialType {
	name = 'twitterBearerToken';
	displayName = 'Twitter Bearer Token';
	documentationUrl = 'twitter';
	properties: INodeProperties[] = [
		{
			displayName: 'Bearer Token',
			name: 'token',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			}
		},
	];
}
