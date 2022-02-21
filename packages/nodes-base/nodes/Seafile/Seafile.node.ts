import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { seaFileApiRequest } from './GenericFunctions';
import { operationsDir, optionsDirCreate, optionsDirRename } from './OptionsDirectories';
import { operationsShareLink, optionsSLCreate } from './OptionsShareLink';

import {
	seaFileResource
} from './SeafileResource';

export class Seafile implements INodeType {
	description: INodeTypeDescription = {
		version: 1,
		defaults: {
			name: 'Seafile API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'seaFileApi',
				required: true,
			}
		],
		icon: 'file:seafile.png',
		displayName: 'Seafile',
		name: 'seaFile',
		group: ['transform'],
		description: 'Consume Seafile API',
		properties: [
			...seaFileResource,
			//Operations
			...operationsDir,
			...operationsShareLink,
			// Options Directories
			...optionsDirCreate,
			...optionsDirRename,
			// Options Share Link
			...optionsSLCreate
		]
	};

	methods = {
		loadOptions: {
			async getRepos(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					let resp = await seaFileApiRequest.call(this, `GET`, `/api2/repos`)
					for (let d of resp) {
						let repoType
						switch (d['type']) {
							case `repo`:
								repoType = "My Self"
								break;
							case `srepo`:
								repoType = "Shared to me"
								break;
							case `grepo`:
								repoType = "Group"
								break;
							default:
								repoType = "Wrong"
								break;
						}
						returnData.push({
							name: d["name"],
							value: d["id"],
							description: `This Library type is ${repoType} and Repo owned by ${d['owner_name']}`
						})
					}
					return returnData
				} catch (error) {
					throw new NodeApiError(this.getNode(), error);
				}
			}
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string
				const operation = this.getNodeParameter('operation', i) as string
				const repoId = this.getNodeParameter('repo', i) as string
				const name = this.getNodeParameter('name', i) as string

				if (resource == "dir") {
					let qs: IDataObject = {
						p: `/${name}`
					}
					let url = `/api2/repos/${repoId}/dir/`;

					if (operation == "create") {
						let formData: IDataObject = {
							operation: `mkdir`
						}
						let response = await seaFileApiRequest.call(this, `POST`, url, {}, formData, qs)
						returnData.push({
							status: true,
							message: response,
						})
					} else if (operation == "rename") {
						const newName = this.getNodeParameter('newName', i) as string
						let formData: IDataObject = {
							operation: `rename`,
							newname: `${newName}`
						}
						let response = await seaFileApiRequest.call(this, `POST`, url, {}, formData, qs)
						returnData.push({
							status: true,
							message: response,
						})
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				}
				else if (resource == "share_link") {
					if (operation == "create") {
						let url = `/api/v2.1/share-links/`

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject
						let body: IDataObject = {
							repo_id: repoId,
							path: `/${name}`
						}

						if (typeof additionalFields["password"] != "undefined") {
							body["password"] = additionalFields["password"] as string
						}

						if (typeof additionalFields["expire_days"] != "undefined") {
							body["expire_days"] = additionalFields["expire_days"] as number
						}

						if (typeof additionalFields["permissions"] != "undefined") {
							let permission = additionalFields["permissions"] as number
							let can_edit: boolean = false, can_download: boolean = false, can_upload: boolean = false
							if (permission == 1) {
								can_edit = true, can_download = true, can_upload = true
							} else if (permission == 2) {
								can_edit = true, can_download = true
							} else if (permission == 3) {
								can_edit = true, can_upload = true
							} else if (permission == 4) {
								can_upload = true, can_download = true
							} else if (permission == 5) {
								can_edit = true
							} else if (permission == 6) {
								can_upload = true
							} else {
								can_download = true
							}
							body["permissions"] = {
								can_edit,
								can_download,
								can_upload
							}
						} else {
							body["permissions"] = {
								can_edit: true,
								can_download: true,
								can_upload: true
							}
						}
						let response = await seaFileApiRequest.call(this, `POST`, url, body)
						returnData.push(response)
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				}
				else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
