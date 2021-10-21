import { OptionsWithUri } from 'request';
import {
	IExecuteFunctions,
	IPollFunctions
} from 'n8n-core';

import {
  NodeApiError,
} from 'n8n-workflow';

export async function executeCypher(this: IPollFunctions | IExecuteFunctions, cypher: string) : Promise<any> {
  const credentials = await this.getCredentials('neo4j') as {
    username : string;
    password : string;
    url : string;
    database : string;
  };

  if (credentials === undefined) {
    throw new Error('No credentials got returned!');
  }
  try{
    const httpBasicAuth = Buffer.from(`${credentials.username}:${credentials.password}`).toString("base64");

    const body = {
      "statements": [
      {
        "statement": cypher
      }]
    };

    const options: OptionsWithUri = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${httpBasicAuth}`
      },
      method: "POST",
      body: body,
      uri: `${credentials.url}/db/${credentials.database}/tx/commit`,
      json: true
    };

    return await this.helpers.request(options);
  } catch (error) {
    throw new NodeApiError(this.getNode(), error);
  }
}

export function parseNeo(neo4jResult: any): Array<{[k: string]: any}> {
  let result = neo4jResult.results.map( (r:any) => {
    let mapped = r.data.map( (data:any) => {
      var mappedData = data.row.map((value:any, index:any) => {
        let key = r.columns[index];
        let obj: {[k: string]: string} = {};
        obj[key] = value
        return obj;
      });

      let mapped2 = mappedData.reduce( (a:any, b:any) => {
        return { ...a, ...b };
      }, {});
      
      return mapped2;
    });
    return mapped;
  });

  return result[0];
}