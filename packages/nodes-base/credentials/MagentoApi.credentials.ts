import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MagentoApi implements ICredentialType {
	name = 'magentoApi';
	displayName = 'Magento 1 API';
	documentationUrl = 'magento1';
	properties: INodeProperties[] = [
		{
			displayName: 'Host XML-RPC',
			name: 'host',
			type: 'string',
			required:true,
			default: '',
		},
		{
			displayName: 'Api User',
			name: 'apiUser',
			type: 'string',
			default: '',
			required:true,
		},
		{
			displayName: 'Api Key',
			name: 'apiKey',
			type: 'string',
			required:true,
			typeOptions:{
				password:true,
			},
			default: '',
		},
	];
}
