import Immutable from 'immutable';

export default class StoreManager {
    constructor(data = {}){
        this.data = Immutable.Map(data);
    }

    getState(){
        return this.data.toJS();
    }

    getImmutableData(){
        return this.data;
    }

    setState(newState, cb){
        if(typeof newState==="object"){
            this.data = this.getImmutableData().merge(newState);
        }
        if(typeof this.updateView==='function'){
            this.updateView(cb);
        }
        return this.getState();
    }
}