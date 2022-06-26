import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class TracardiAuth implements ICredentialType {
	name = 'tracardiAuth';
	displayName = 'Tracardi Auth';
	documentationUrl = 'tracardi';
	properties: INodeProperties[] = [
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
			required:true
		},
	];
}
