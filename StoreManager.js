import Immutable from 'immutable';

export default function StoreManager(data = {}){
    let __data = Immutable.Map(data);
    return {
        getState(){
            return __data.toJS();
        },

        getImmutableData(){
            return __data;
        },

        setState(newState){
            if(typeof newState==="object"){
                __data = this.getImmutableData().merge(newState);
            }
            if(typeof this.updateView==='function'){
                this.updateView();
            }
            return this.getState();
        }
    };
}