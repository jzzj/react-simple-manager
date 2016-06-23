/*
 * manage store、events and events's handlers
 */

export default class ViewManager {
    static __navigator = null;

    static getNavigator = function(){
        return ViewManager.__navigator;
    };

    constructor(store, ...managers){
        this.__store = store;
        if(!store.updateView){
            this.__store.updateView = this.__updateView.bind(this);
        }
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
                let handler = manager[event];
                if(handler && typeof(handler)==='function'){
                    handler = handler.bind(manager);
                    const queue = this[keys[i]];
                    if(queue){
                        if(Array.isArray(queue)){
                            queue.push(handler)
                        }else{
                            this[keys[i]] = [queue, handler];
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
        //this.__isUnique();
    }

    dispatch(action, ...argv){
        /*
         if(this.__repeatList.indexOf(action) !== -1){
            console.warn('repeat events: ', this.__repeatList.join());
         }
        */
        
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
        const { updateView } = this;
        
        this.__view = view;
        this.__waitFor = 0;
        this.updateView = ()=>{
            this.__waitFor++;
        };

        if(view && view.props && view.props.navigator){
            ViewManager.__navigator = view.props.navigator;
        }

        const {componentDidMount, componentWillUnmount} = view;
        Object.assign(view, {
            componentWillUnmount: (...argv)=>{
                this.__view = null;
                this.updateView = null;
                this.__store.__updateView = null;
                return componentWillUnmount.apply(view, argv);
            },
            componentDidMount: (...argv)=>{
                this.updateView = updateView;
                if(this.__waitFor > 0){
                    this.updateView();
                }

                const ret = componentDidMount.apply(view, argv);
                this.__ready = true;
                return ret;
            }
        });
        return this;
    }

    __updateView(update){
        if(!this.__ready){
            this.__waitFor = (this.__waitFor || 0) +1;
        }else{
            return this.updateView();
        }
    }

    getNavigator(){
        return ViewManager.__navigator;
    }

    updateView(){
        if(!this.__view){
            throw new Error("no view was bind to this manager, please call manager.bindView(view)!");
        }
        return this.__view.setState(this.__store.getState());
    }
}