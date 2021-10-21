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
            displayName: 'Query Search',
            name: 'query',
            type: 'string' ,
            default: '',
            placeholder: '{"and":[{"last name":{"is":"Ferrara"}},{"first name":{"is":"Jon"}}]}',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'lookup',
                    ],
                },
            },
            description: 'Query Search from Nimble',
        },
        {
            displayName: 'Per Page',
            name: 'per_page',
            type: 'number' ,
            default: 30,
            placeholder: '30',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'lookup',
                    ],
                },
            },
            description: 'Result per page',
        },
        {
            displayName: 'Page',
            name: 'page',
            type: 'number' ,
            default: 1,
            placeholder: '1',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'lookup',
                    ],
                },
            },
            description: 'Page',
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
            displayName: 'Twitter',
            name: 'twitter',
            type: 'string',
            default: '',
            placeholder: 'jibril',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Your Contact Twitter',
        },
        {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'http://nimble.com',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'URL your contact',
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            placeholder: 'Description',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'create_contact',
                    ],
                },
            },
            description: 'Description your contact',
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
        }
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

                    let description = this.getNodeParameter('description',i) as string || ""
                    let url = this.getNodeParameter('url',i) as string || ""
                    let twitter = this.getNodeParameter('twitter', i) as string || ""
                    let fields: {[k: string]: any} = {}
                    
                    fields["first name"] = [{
                        "value" : this.getNodeParameter('first_name', i) as string,
                        "modifier" : "",
                    }]

                    if(twitter.length>1){
                        fields["twitter"] = [{
                            "modifier": "", 
                            "field_id":"", 
                            "value": twitter, 
                            "label": "twitter"
                        }]
                    }

                    if(description.length>1){
                        fields["description"] = [{
                            "modifier":"other",
                            "value":description,
                            "label":"description"
                        }]
                    }
                    if(url.length>1){
                        fields["URL"] = [{
                            "modifier": "work",
                            "value": url, 
                            "label": "URL"
                        }]
                    }
                    body['fields'] = fields

                }else if(resource=="lookup"){
                    requestMethod = 'GET';
                    let query = convertQS({
                        query : this.getNodeParameter('query',i) as string,
                        per_page : this.getNodeParameter('per_page',i) as number || 30,
                        page : this.getNodeParameter('page',i) as number || 1
                    })
                    endpoint = `api/v1/contacts?${query}`;
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

function convertQS(obj : {[k: string]: any}) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
        return str.join("&");
    }