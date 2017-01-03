import {StateManager, StoreManager, ViewManager} from '../lib/';
import assert from 'assert';

class ListManager extends StateManager {
    static events = ["last", "list"]

    last(num){
        return this.store.getState().list.pop();
    }

    list(){
        return this.store.getState().list;
    }
}

const gList = "asdfxbmklfs".split("");
let ListStore = new StoreManager({
    list: gList
});

class FakeReactView {
    componentWillMount(){
        this.manager = new ViewManager(ListStore, ListManager);
        this.manager.bindView(this);
        return this.manager;
    }
}

describe('should manager works', function() {
    var view, manager;
    beforeEach(function(){
        view = new FakeReactView();
        manager = view.componentWillMount();
    });

    it('get last one of list', function() {
        var last = manager.dispatch('last');
        assert.equal(last, 's');
    });

    it('get the list', function() {
        var list = manager.dispatch('list');
        assert.equal(list.length, gList.length);
    });
});