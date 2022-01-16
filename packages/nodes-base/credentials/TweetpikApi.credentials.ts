import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class TweetpikApi implements ICredentialType {
	name = 'tweetpikApi';
	displayName = 'TweetPik API Key';
	documentationUrl = 'Tweetpik';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
		},
	];
}
