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
    monkeyLearnClassifyApiRequest,
    monkeyLearnUploadApiRequest
} from './GenericFunctions';

export class MonkeyLearn implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'MonkeyLearn',
        name: 'monkeyLearn',
        icon: 'file:monkeylearn.png',
        group: ['transform'],
        version: 1,
        description: 'Custom Nodes MonkeyLearn API',
        defaults: {
            name: 'MonkeyLearn',
            color: '#1C4E63',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
        {
            name: 'monkeyLearnApi',
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
                name: 'Clasify Text',
                value: 'clasify',
            },
            {
                name: 'Upload Data',
                value: 'upload_data',
            },
            ],
            default: 'clasify',
            description: 'The resource to operate on.',
        },
        {
            displayName: 'Model ID',
            name: 'model_id',
            type: 'string' ,
            default: '',
            placeholder: 'cl_uJISMsk2s1',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'clasify',
                    'upload_data'
                    ],
                },
            },
            description: 'Model ID',
        },
        {
            displayName: 'Duplicate Strategy',
            name: 'input_duplicates_strategy',
            type: 'options',
            default: 'merge',
            required: true,
            options: [
            {
                name : "Merge",
                value : "merge"
            },
            {
                name: 'Keep First',
                value: 'keep_first',
            },
            {
                name: 'Keep Last',
                value: 'keep_last',
            },
            ],
            displayOptions: {
                show: {
                    resource: [
                    'upload_data',
                    ],
                },
            },
            description: 'Indicates what to do with duplicate texts in this request. Must be one of “merge”, “keep_first” or “keep_last”. The exact workings are explained below',
        },
        {
            displayName: 'Existing Duplicate Strategy',
            name: 'existing_duplicates_strategy',
            type: 'options',
            default: 'overwrite',
            required: true,
            options: [
            {
                name : "Overwrite",
                value : "overwrite"
            },
            {
                name: 'Ignore',
                value: 'ignore',
            }],
            displayOptions: {
                show: {
                    resource: [
                    'upload_data',
                    ],
                },
            },
            description: 'Indicates what to do with texts of this request that already exist in the model. Must be one of “overwrite” or “ignore”. The exact workings are explained below.',
        },
        {
            displayName: 'Text',
            name: 'text',
            type: 'string' ,
            default: '',
            placeholder: "First Text",
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'upload_data',
                    ],
                },
            },
            description: 'Text to Upload',
        },
        {
            displayName: 'Tags ID',
            name: 'tag_id',
            type: 'string' ,
            default: '',
            placeholder: "Text Tag.. Use Comma (,) if more then one Tag",
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'upload_data',
                    ],
                },
            },
            description: 'Tag of Text to Upload',
        },
        {
            displayName: 'Markers',
            name: 'markers',
            type: 'string' ,
            default: '',
            placeholder: "Markers Text.. Use Comma (,) if more then one Markers",
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'upload_data',
                    ],
                },
            },
            description: 'Markers Text to Upload',
        },
        {
            displayName: 'Data',
            name: 'data',
            type: 'string' ,
            default: '',
            placeholder: "['First text', {text: 'Second text', external_id: 'ANY_ID'}, '']",
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'clasify',
                    ],
                },
            },
            description: 'A list of up to 500 data elements to classify. Each element must be either a string with the text or a data object.',
        },
        {
            displayName: 'Production Model',
            name: 'production_model',
            type: 'boolean' ,
            default: false,
            placeholder: 'false',
            required: false,
            displayOptions: {
                show: {
                    resource: [
                    'clasify',
                    ],
                },
            },
            description: 'Indicates if the classifications are performed by the production model. Only use this parameter on custom models. Note that you first need to deploy your model to production either from the UI model settings or by using the Classifier deploy API endpoint.',
        }],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];

        for (let i = 0; i < items.length; i++) {
            try{
                // For Post
                let resource = this.getNodeParameter('resource', i) as string;
                let data : IDataObject[]
                let responseData : IDataObject

                if(resource=="clasify"){
                    let temp = this.getNodeParameter('data',i) as string || "[]"
                    let model_id = this.getNodeParameter('model_id', i) as string;
                    data = JSON.parse(temp)
                    responseData = await monkeyLearnClassifyApiRequest.call(this, model_id, data);
                }else if(resource=="upload_data"){
                    let input_strategy = this.getNodeParameter('input_duplicates_strategy', i) as string
                    let existing_strategy = this.getNodeParameter('existing_duplicates_strategy', i) as string
                    let text = this.getNodeParameter('text', i) as string
                    let model_id = this.getNodeParameter('model_id', i) as string;
                    let tag_id = this.getNodeParameter('tag_id', i) as string;
                    let markers = this.getNodeParameter('markers', i) as string;

                    let fields: {[k: string]: any} = {}
                    fields["text"] = text

                    if(tag_id.length>0){
                        let tags_s = tag_id.split(",")
                        let tags = new Array()
                        for (var k = 0; k < tags_s.length; k++) {
                            tags.push(tags_s[k])
                        }
                        fields["tags"] = tags
                    }

                    if(markers.length>0){
                        let marker_s = markers.split(",")
                        let marker = new Array()
                        for (var k = 0; k < marker_s.length; k++) {
                            marker.push(marker_s[k])
                        }
                        fields["markers"] = marker
                    }

                    let body : IDataObject = {
                        input_duplicates_strategy:input_strategy,
                        existing_duplicates_strategy:existing_strategy,
                        data : [fields]
                    }
                    responseData = await monkeyLearnUploadApiRequest.call(this, model_id, body);
                }else{
                    throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
                }
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