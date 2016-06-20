/*
 * 管理状态
 */

export default class StateManager {

    static __ViewManager = null;

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