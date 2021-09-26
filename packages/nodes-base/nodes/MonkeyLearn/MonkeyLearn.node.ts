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
                    ],
                },
            },
            description: 'Model ID',
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