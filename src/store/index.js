import {SCHEMA, schema} from './modules/schema';
import { GraphList, graph } from './modules/graphList';

const stores = [
    {
        moduleName: SCHEMA,
        module: schema,
    },
    {
        moduleName: GraphList,
        module: graph,
    },
];

export { stores, SCHEMA, GraphList };
