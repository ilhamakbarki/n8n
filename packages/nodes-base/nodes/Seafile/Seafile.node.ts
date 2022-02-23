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
import {
	operationsDir,
	optionsDirCreate,
	optionsDirList,
	optionsDirRename
} from './OptionsDirectories';

import {
	operationsShareLink,
	optionsSLCreate
} from './OptionsShareLink';

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
			...optionsDirList,
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

				if (resource == "dir") {
					const repoId = this.getNodeParameter('repo', i) as string

					let qs: IDataObject = {}
					let url = `/api2/repos/${repoId}/dir/`;

					if (operation == "create") {
						const name = this.getNodeParameter('name', i) as string
						let url2 = `/api/v2.1/repos/${repoId}/dir/detail/`;
						qs["path"] = `/${name}`
						try {
							await seaFileApiRequest.call(this, `GET`, url2, {}, {}, qs)
							returnData.push({
								status: false,
								message: `Folder already exists`
							})
						} catch (err: any) {
							if (err.httpCode == "404") {
								qs["p"] = `/${name}`
								let formData: IDataObject = {
									operation: `mkdir`
								}
								let response = await seaFileApiRequest.call(this, `POST`, url, {}, formData, qs)
								let response2 = await seaFileApiRequest.call(this, `GET`, url2, {}, {}, qs)
								returnData.push({
									status: true,
									message: response,
									data: response2
								})
							} else {
								throw new NodeOperationError(this.getNode(), err);
							}
						}

					} else if (operation == "rename") {
						const name = this.getNodeParameter('name', i) as string
						qs["p"] = `/${name}`
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
					} else if (operation == "list") {
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject
						if (typeof additionalFields["path"] != "undefined") {
							qs["p"] = additionalFields["path"] as string
						}
						if (typeof additionalFields["oid"] != "undefined") {
							qs["oid"] = additionalFields["oid"] as string
						}
						if (typeof additionalFields["showItem"] != "undefined") {
							if (additionalFields["showItem"] == 2) {
								qs["t"] = "f"
							} else if (additionalFields["showItem"] == 3) {
								qs["t"] = "d"
							}
						}
						if (typeof additionalFields["recursive"] != "undefined") {
							qs["recursive"] = additionalFields["recursive"] as number
						}
						let response = await seaFileApiRequest.call(this, `GET`, url, {}, {}, qs)
						for (let r of response) {
							returnData.push(r)
						}
					} else if (operation == "detail") {
						const name = this.getNodeParameter('name', i) as string
						let url2 = `/api/v2.1/repos/${repoId}/dir/detail/`;
						qs["path"] = `/${name}`
						let response = await seaFileApiRequest.call(this, `GET`, url2, {}, {}, qs)
						returnData.push(response)
					} else {
						throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not known!`);
					}
				}
				else if (resource == "share_link") {
					const repoId = this.getNodeParameter('repo', i) as string
					const name = this.getNodeParameter('name', i) as string

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
