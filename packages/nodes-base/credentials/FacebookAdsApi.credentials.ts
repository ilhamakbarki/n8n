import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';


export class FacebookAdsApi implements ICredentialType {
	name = 'facebookAdsApi';
	displayName = 'Facebook Ads API';
	properties = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string' as NodePropertyTypes,
			default: '',
		},

	];
}