import { IExecuteFunctions } from 'n8n-core';
import { executeCypher , parseNeo} from './GenericFunctions'
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';


export class Neo4j implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Neo4j',
		name: 'neo4j',
		group: ['transform'],
		version: 1,
		description: 'Excecute cypher query against a neo4j graph database.',
		defaults: {
			name: 'Neo4j',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'neo4j',
				required: true
			}
		],
		properties: [
			{
				displayName: 'Cypher Query',
				name: 'cypher',
				type: 'string',
				default: '',
				placeholder: 'Enter cypher code',
				description: 'The cypher query to excecute',
				required : true
			}
		]
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData: IDataObject[] = [];

		const cypher = this.getNodeParameter('cypher', 0) as string;
		let returnItems = []
		let result = parseNeo(await executeCypher.call(this, cypher))
		
		if (Array.isArray(result) && result.length !== 0) {
			returnItems = this.helpers.returnJsonArray(result);
		} else {
			returnItems = this.helpers.returnJsonArray([{}]);
		}

		return this.prepareOutputData(returnItems);
	}
}