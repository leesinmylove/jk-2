import * as _ from 'lodash';

const SCHEMA = 'SCHEMA';

const schema = {
    namespaced: true,
    state: {
        kgSchema: new Map(),
        kgNameStatus: new Map(),
    },
    mutations: {
        setSchema(state, payload) {
            const graph = {
                schema: {},
                schemaTree: {},
            };
            graph.schema = payload.schema;
            const list = _.cloneDeep(payload.schema.types);
            const root = [];
            for (const item of list) {
                const parentNode = _.find(list, ['id', item.parentId]);
                item.value = item.id;
                item.label = item.name;
                if (parentNode) {
                    if (parentNode.children) {
                        parentNode.children.push(item);
                    } else {
                        parentNode.children = [item];
                    }
                } else {
                    root.push(item);
                }
            }
            graph.schemaTree = root;
            state.kgSchema.set(payload.kgName, graph);
            state.kgNameStatus.set(payload.kgName, 'resolved');
        },
        setkgNameStatus: (state, payload) => {
            state.kgNameStatus.set(payload.kgName, payload.status);
        },
    },
    getters: {
        getSchema: (state) => {
            return (kgName) => {
                return state.kgSchema.get(kgName) ? (state.kgSchema.get(kgName)).schema : undefined;
            };
        },
        getSchemaTree: (state) => {
            return (kgName) => {
                return state.kgSchema.get(kgName) ?
                    (state.kgSchema.get(kgName)).schemaTree : undefined;
            };
        },
        getKgNameStatus: (state) => {
            return (kgName) => {
                return state.kgNameStatus.get(kgName) ?
                    state.kgNameStatus.get(kgName) : null;
            };
        },
    },
};

export {SCHEMA, schema};
