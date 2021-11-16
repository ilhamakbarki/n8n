import { IDataObject } from "n8n-workflow";

export interface IData {
	document: IDocument;
	encodingType?: string;
}

export interface IDocument {
	type: string;
	language?: string;
	content?: string;
	gcsContentUri?: string;
	input_config?: IDataObject
}
