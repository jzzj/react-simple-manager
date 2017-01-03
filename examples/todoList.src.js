import {StateManager, StoreManager, ViewManager} from '../lib/';

class ListManager extends StateManager {
    static get events(){
      return ["last", "list"];
    }

    last(num){
        return this.store.getState().list.pop();
    }

    list(){
        return this.store.getState().list;
    }
}

let ListStore = new StoreManager({
    list: "asdfxbmklfs".split("")
});

class FakeReactView {
    componentWillMount(){
        this.manager = new ViewManager(ListStore, ListManager);
        this.manager.bindView(this);
        return this.manager;
    }
}

var view = new FakeReactView();
var manager = view.componentWillMount();
document.getElementById("example").innerHTML = manager.dispatch('list');