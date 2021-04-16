import Vue from 'vue';
// @ts-ignore
import Vuex from 'vuex';
import {stores} from '../store';

Vue.use(Vuex);

const modules = {};

stores.forEach((s) => {
    modules[s.moduleName] = s.module;
});


export default new Vuex.Store({
    modules,
});
