# react-simple-manager
Simple way to manager your react/react-native apps. Only includes state、view. However, will make your app more strong and maintainable.


# Usage
in your view
<pre>
  <code>
  import { ViewManager } from 'react-simple-manager';
  import TodoManager from '../manager/TodoManager';
  import YourStore from '../store/YourStore';
  
  class TodoView extends React.Component{
    componentWillMount(){
      this.manager = new ViewManager(YourStore, new TodoManager());
      this.manager.bindView(this);          //pass ref of view to manager
      this.manager.dispatch(ACTIONTYPE);    //dispatch an action
    }
  }
  </code>
</pre>

in your manager
<pre>
  <code>
  import { StateManager } from 'react-simple-manager';
  class TodoManager extends StateManager{
    //All actions go here. manager.dispatch(ACTIONTYPE) will trigger it.
    static events = {
        [ACTIONTYPE]: "getTodoList"
    }
    
    constructor(store){
        super(store);
    }
    
    getTodoList(){
      fetch(url, ret=>{
        this.store.setState(ret);
      });
    }
  }
  </code>
</pre>

in your store
<pre>
  <code>
  import {StoreManager} from 'react-simple-manager';

  export default new StoreManager({
    //design shape of your store.
    list: []
  });
  </code>
</pre>


That's all.
It's should be clear and simple enough.
