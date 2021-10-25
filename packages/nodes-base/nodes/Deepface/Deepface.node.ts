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
    uploadApi,
    get_base64Image
} from './GenericFunctions';

export class Deepface implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Deepface',
        name: 'deepface',
        icon: 'file:deepface.png',
        group: ['transform'],
        version: 1,
        credentials: [],
        description: 'Custom Nodes Deepface API',
        defaults: {
            name: 'Deepface',
            color: '#1C4E63',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
        {
            displayName: 'Resource',
            name: 'resource',
            type: 'options',
            required : true,
            options: [
            {
                name: 'Face recognition - VGG',
                value: 'vgg',
            },
            {
                name: 'Facial Attribute Analysis',
                value: 'analysis',
            },
            ],
            default: 'vgg',
            description: 'The resource to operate on.',
        },
        {
            displayName: 'Image URL 1',
            name: 'image1',
            type: 'string' ,
            default: '',
            placeholder: 'https://example.com/image/image.png',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'vgg',
                    'analysis'
                    ],
                },
            },
            description: 'URL Image 1',
        },
        {
            displayName: 'Image URL 2',
            name: 'image2',
            type: 'string' ,
            default: '',
            placeholder: 'https://example.com/image/image2.png',
            required: true,
            displayOptions: {
                show: {
                    resource: [
                    'vgg'
                    ],
                },
            },
            description: 'URL Image 2',
        }
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];

        for (let i = 0; i < items.length; i++) {
            try{
                let resource = this.getNodeParameter('resource', i) as string;
                let data : IDataObject[]
                let responseData : IDataObject

                if(resource=="analysis"){
                    let image1 = this.getNodeParameter('image1', i) as string
                    let body : IDataObject = {
                        img : [
                            await get_base64Image.call(this, image1)
                        ]
                    }
                    responseData = await uploadApi.call(this, "analyze", body);
                }else if(resource=="vgg"){
                    let image1 = this.getNodeParameter('image1', i) as string
                    let image2 = this.getNodeParameter('image2', i) as string
                    let body : IDataObject = {
                        model_name:"VGG-Face",
                        img : [
                        {
                            img1 : await get_base64Image.call(this, image1),
                            img2 : await get_base64Image.call(this, image2),
                        }
                        ]
                    }
                    responseData = await uploadApi.call(this, "verify", body);
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