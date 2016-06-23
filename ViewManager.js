/*
 * manage store、events and events's handlers
 */

export default class ViewManager {
    static __navigator = null;

    static getNavigator = function(){
        return __navigator;
    };

    constructor(store, ...managers){
        this.__store = store;
        this.__store.updateView = this.updateView.bind(this);
        let events = [], handlers = [];
        managers.forEach((manager, idx) => {
            //pass store to state manager if manager.store not exists
            if(!manager.store){
                manager.store = store;
            }
            manager.__viewManager = this;
            const managerEvents = manager.constructor.events || manager.events || {};
            
            let keys, values; 
            if(Array.isArray(managerEvents)){
                keys = values = managerEvents;
            }else{
                keys = Object.keys(managerEvents);
                values = keys.map(key=>managerEvents[key]);
            }

            events = events.concat(keys);
            values.forEach((event, i) => {
                const handler = manager[event];
                if(handler && typeof(handler)==='function'){
                    handler = handler.bind(manager);
                    const queue = this[keys[i]];
                    if(queue){
                        if(Array.isArray(queue)){
                            queue.push(handler)
                        }else{
                            queue = [queue, handler];
                        }
                    }else{
                        this[keys[i]] = handler;
                    }
                }else{
                    console.warn(keys[i], ' is not a function, please check the ', idx, ' manager');
                }
            });
        });
        this.__events = events;
        //this.__handlers = handlers;
        this.__isUnique();
    }

    dispatch(action, ...argv){
        if(this.__repeatList.indexOf(action) !== -1){
            console.warn('repeat events: ', this.__repeatList.join());
        }
        
        const handler = this[action];

        if(handler){
            if(Array.isArray(handler)){
                return handler.map(func => {
                    return func.apply(this, argv);
                });
            }else{
                return handler.apply(this, argv);
            }
        }else{
            return console.warn(action, ' have no handler');
        }
    }

    __isUnique(){
        const events = this.__events;
        let repeatList = [];
        events.forEach((item, idx)=>{
            if(events.indexOf(item) !== idx){
                repeatList.push(item);
            }
        });
        if(repeatList.length){
            console.warn('repeat events: ', events.join());
            this.__repeatList = repeatList;
            return false;
        }
        this.__repeatList = []; 
        return true;
    }

    bindView(view){
        this.__view = view;
        
        if(view && view.props && view.props.navigator){
            __navigator = view.props.navigator;
        }
    }

    getNavigator(){
        return __navigator;
    }

    updateView(){
        if(!this.__view){
            throw new Error("no view was bind to this manager, please call manager.bindView(view)!");
        }
        return this.__view.setState(this.__store.getState());
    }
}