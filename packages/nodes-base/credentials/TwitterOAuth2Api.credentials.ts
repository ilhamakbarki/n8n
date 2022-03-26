import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

const scopes = [
	'tweet.read',
	'tweet.write',
	'tweet.moderate.write',
	'users.read',
	'follows.read',
	'follows.write',
	'offline.access',
	'space.read',
	'mute.read',
	'mute.write',
	'like.read',
	'like.write',
	'list.read',
	'list.write',
	'block.read',
	'block.write',
	'bookmark.read',
	'bookmark.write',
];

export class TwitterOAuth2Api implements ICredentialType {
	name = 'twitterOAuth2Api';
	extends = [
		'oAuth2Api',
	];
	displayName = 'Twitter OAuth2 API';
	documentationUrl = 'twitter';
	properties: INodeProperties[] = [
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://twitter.com/i/oauth2/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.twitter.com/2/oauth2/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: scopes.join(' '),
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'code_challenge=8e3HVuCadrtdDYvv64C2SCrTPfGzY6HKLvr5yULU5WFja7KCfG&code_challenge_method=plain',
		},
		{
			displayName: 'Code Verifier',
			name: 'code_verifier',
			type: 'hidden',
			default: '8e3HVuCadrtdDYvv64C2SCrTPfGzY6HKLvr5yULU5WFja7KCfG',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
			description: 'Resource to consume.',
		},
	];
}
