/*
 * manage store、events and events's handlers
 */

export default class ViewManager {
    constructor(store, ...managers){
        this.__store = store;
        let events = [], handlers = [];
        managers.forEach((manager, idx) => {
            //pass store to state manager if manager.store not exists
            if(!manager.store){
                manager.store = store;
            }
            manager.__viewManager = this;
            const managerEvents = manager.constructor.events || manager.events || {};
            console.log(managerEvents, 'managerEvents');
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
                    //handlers.push(handler.bind(manager));
                    this[keys[i]] = handler.bind(manager);
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
            return handler.apply(this, argv);
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
    }

    updateViewState(){
        const newestState = this.__store.getState();
        return this.__view.setState(newestState);
    }
}