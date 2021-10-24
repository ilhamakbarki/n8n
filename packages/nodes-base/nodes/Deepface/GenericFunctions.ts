import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	IDataObject, NodeApiError, NodeOperationError,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';

const imageToBase64 = require('image-to-base64');

/**
 * Make an API request to Upload Data MonkeyLearn
 *
 * @param {IHookFunctions} this
 * @param {string} url_api
 * @param {object} body
 * @returns {Promise<any>}
 */

 export async function uploadApi(this: IHookFunctions | IExecuteFunctions, url_api: string, body: IDataObject) : Promise<any> {
 	try {
 		let url = `https://deepface.nclzn.co/${url_api}`
 		const options: OptionsWithUri = {
 			method:"POST",
 			body,
 			qs: {},
 			uri:url,
 			json: true,
 			headers : {
 				'Content-type' : 'application/json',
 			}
 		};

 		return await this.helpers.request(options);
 	} catch (error) {
 		throw new NodeApiError(this.getNode(), error);
 	}
 }

 export async function get_base64Image(this: IHookFunctions | IExecuteFunctions, url:string) : Promise<any> {
 	try{
 		return await imageToBase64(url)
 		.then((response:any) => {
 			return `data:image/jpeg;base64,${response}`
 		})
 		.catch((error:any) => {
 			throw error
 		})
 	}catch(error){
 		throw new NodeApiError(this.getNode(), error);
 	}
 }