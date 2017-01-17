import {StateManager, StoreManager, ViewManager} from '../lib/';
import assert from 'assert';

class ListManager extends StateManager {
    static events = ["last", "list", "fetchUserData"]

    last(num){
        return this.store.getState().list.pop();
    }

    list(){
        return this.store.getState().list;
    }

    fetchUserData(){
        return new Promise(resolve=>{
            setTimeout(()=>{
                this.store.setState({
                    user: ['zhangsan', 'lisi']
                }, resolve);
            }, 300);
        })
    }
}

const gList = "asdfxbmklfs".split("");
let listStore = new StoreManager({
    list: gList,
    user: []
});

class FakeReactView {
    componentWillMount(){
        this.manager = new ViewManager(listStore, ListManager);
        this.manager.bindView(this);
        return this.manager;
    }

    setState(state, cb){
        cb();
    }
}

describe('should manager works', function() {
    var view, manager;
    beforeEach(function(){
        view = new FakeReactView();
        manager = view.componentWillMount();
        view.componentDidMount()
    });

    it('get last one of list', function() {
        var last = manager.dispatch('last');
        assert.equal(last, 's');
    });

    it('get the list', function() {
        var list = manager.dispatch('list');
        assert.equal(list.length, gList.length);
    });

    it('set the other state', function(done){
        manager.dispatch('fetchUserData')
            .then(()=>{
                assert.equal(listStore.getState().user.length, 2);
                done();
            })
    })
});