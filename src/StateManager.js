/*
 * 管理状态
 */
let __ViewManager = null;
export default class StateManager {

    static get __ViewManager(){
        return __ViewManager;
    }

    static set __ViewManager(v){
        __ViewManager = v;
    }

    constructor(store){
        this.store = store;
    }

    getNavigator(){
        if(!__ViewManager){
            __ViewManager = require('./ViewManager');
        }
        return __ViewManager.getNavigator();
    }
}