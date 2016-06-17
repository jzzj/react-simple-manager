/*
 * 管理状态
 */

export default class StateManager {
    constructor(store){
        this.store = store;
    }

    //ViewManager初始化时将自身的引用传递给stateManager
    getViewManager(){
        return this.__viewManager;
    }

    updateView(){
        return this.getViewManager().updateViewState();
    }
}