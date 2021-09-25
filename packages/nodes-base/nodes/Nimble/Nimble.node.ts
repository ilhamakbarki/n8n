import {
    IExecuteFunctions,
} from 'n8n-core';

import {
    IDataObject,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
} from 'n8n-workflow';

import {
    nimbleApiRequest,
} from './GenericFunctions';

export class Nimble implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Nimble',
        name: 'nimble',
        icon: 'file:nimble.png',
        group: ['transform'],
        version: 1,
        description: 'Custom Nimble API',
        defaults: {
            name: 'Nimble',
            color: '#1C4E63',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
        {
            name: 'nimbleApi',
            required: true,
        },
        ],
        properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            required : true,
            options: [
            {
                name: 'Create Contact',
                value: 'create_contact',
            },
            {
                name: 'Lookup Contact',
                value: 'lookup',
            },
            ],
            default: 'create_contact',
            description: 'The resource to operate on.',
        },
        {
            displayName: 'Record Type',
            name: 'record_type',
            type: 'options' ,
            default: 'person',
            required: true,
            options : [
            {
                name : "Person",
                value : "person"
            },
            {
                name : "Company",
                value : "company"
            }
            ],
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'The record type of your contact',
        },
        {
            displayName: 'First Name',
            name: 'first_name',
            type: 'string',
            default: '',
            placeholder: 'Jibril',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'The first name of your contact',
        },
        {
            displayName: 'Last Name',
            name: 'last_name',
            type: 'string',
            default: '',
            placeholder: 'Sulaiman',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'The last name of your contact',
        },
        {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            default: '',
            placeholder: '[{"modifier": "work","value": "123123123"}]',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Phone number your contact must JSON Array Format',
        },
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: '[{"modifier": "other","value": "https://nimble.com/", "label":"nimble"}]',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'URL your contact must JSON Array Format',
        },
        {
            displayName: 'Source',
            name: 'source',
            type: 'string',
            default: '',
            placeholder: '[{"modifier": "","value": "csv", "label":"source"}]',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Source your contact must JSON Array Format',
        },
        {
            displayName: 'Address',
            name: 'address',
            type: 'string',
            default: '',
            placeholder: '[{"modifier": "other","value": "Earth", "label":"address"}]',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Address your contact must JSON Array Format',
        },
        {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            placeholder: '[{"modifier": "","value": "ilhamakbarki@nimble.com", "label":"email"}]',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Email your contact must JSON Array Format',
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            placeholder: '[{"modifier": "other","value": "description", "label":"description"}]',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Description your contact must JSON Array Format',
        },
        {
            displayName: 'Parent Company',
            name: 'parent_company',
            type: 'string',
            default: '',
            placeholder: '[{"modifier": "other", "extra_value":"5c459c56ceee1868ee3ab468", "value": "nimble", "label":"parent company"}]',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Parent Company your contact must JSON Array Format',
        },
        {
            displayName: 'Tags',
            name: 'tags',
            type: 'string',
            default: '',
            placeholder: 'customers,best,other',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Maximum 5 tags are allowed in this list during contact creation.',
        },
        {
            displayName: 'Avatar URL',
            name: 'avatar_url',
            type: 'string',
            default: '',
            placeholder: 'https://example.com/image.png',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Avatar of your contact.',
        },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];

        // For Post
        let body: IDataObject;
        // For Query string
        let qs: IDataObject;


        let requestMethod: string;
        let resource: string;
        let endpoint: string;

        for (let i = 0; i < items.length; i++) {
            try{
                resource = this.getNodeParameter('resource', i) as string;

                body = {};
                qs = {};

                if(resource=="create_contact"){
                    endpoint = 'api/v1/contact';
                    requestMethod = 'POST';
                    body['record_type'] = this.getNodeParameter('record_type', i) as string;
                    body['tags'] = this.getNodeParameter('tags', i) as string;
                    body['avatar_url'] = this.getNodeParameter('avatar_url', i) as string;
                    
                    let parent_company = this.getNodeParameter('parent_company',i) as string || "[]"
                    let description = this.getNodeParameter('description',i) as string || "[]"
                    let email = this.getNodeParameter('email',i) as string || "[]"
                    let address = this.getNodeParameter('address',i) as string || "[]"
                    let source = this.getNodeParameter('source',i) as string || "[]"
                    let url = this.getNodeParameter('url',i) as string || "[]"
                    body['fields'] = {
                        "first name":[
                        {
                            "value" : this.getNodeParameter('first_name', i) as string,
                            "modifier" : "",
                        }],
                        "last name":[
                        {
                            "value" : this.getNodeParameter('last_name', i) as string,
                            "modifier" : "",
                        }],
                        "phone" : JSON.parse(this.getNodeParameter('phone',i) as string),
                        "parent company" : JSON.parse(parent_company),
                        "description" : JSON.parse(description),
                        "email" : JSON.parse(email),
                        "address" : JSON.parse(address),
                        "source" : JSON.parse(source),
                        "URL" : JSON.parse(url),
                    };

                    
                    // if(parent_company.length>5)
                    //     delete body['fields']["parent company"]
                    // if(description.length>2)
                    //     delete body.fields["description"]
                    // if(email.length>2)
                    // if(address.length>2)
                    // if(source.length>2)
                    // if(url.length>2)

                }else if(resource=="lookup"){
                    requestMethod = 'GET';
                    endpoint = 'api/v1/contact';
                }else{
                    throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                }
                const responseData = await nimbleApiRequest.call(this, requestMethod, endpoint, body, qs);
                returnData.push(responseData as IDataObject);
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: error.message });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
