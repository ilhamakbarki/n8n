import {
	flow,
	sortBy,
	uniqBy,
} from 'lodash';

export type DataCustomFields = {
	customField: Array<{ field: string; value: string; }>;
};

type CustomFields = Array<{ name: string, value: string }>;

const ensureName = (customFields: CustomFields) => customFields.filter(o => o.name);
const sortByName = (customFields: CustomFields) => sortBy(customFields, ['name']);
const uniqueByName = (customFields: CustomFields) => uniqBy(customFields, o => o.name);

export const processNames = flow(ensureName, sortByName, uniqueByName);
