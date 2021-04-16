
const GraphList = 'GraphList';
const graph = {
    namespaced: true,
    state: {
        graphDataList: [],
        graphStatus: null,
    },
    mutations: {
        setGraphData(state, payload) {
            state.graphDataList = payload;
        },
        setGraphStatus: (state, payload) => {
            state.graphStatus = payload;
        },
    },
    getters: {
        getGraphData: (state) => {
            return state.graphDataList;
        },
        getGraphStatus: (state) => {
            return state.graphStatus;
        },
    },
};

export { GraphList, graph };
