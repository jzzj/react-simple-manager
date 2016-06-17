# react-simple-manager
Simple way to manager your react/react-native apps. Only includes state、view. However, will make your app more strong and maintainable.


# Usage
in your view
<pre>
  <code>
  import { ViewManager } from 'react-simple-manager';
  import YourStore from 'Logistics/store/TaskStore';
  
  class TodoView extends React.Component{
    componentWillMount(){
      this.manager = new ViewManager(YourStore, new TaskManager());
      this.manager.bindView(this);          //pass ref of view to manager
      this.manager.dispatch(ACTIONTYPE);    //dispatch an action
    }
  }
  </code>
</pre>

in your biz-manager
<pre>
  <code>
  import { StateManager } from 'react-simple-manager';
  class TodoManager extends StateManager{
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
  
  });
  </code>
</pre>


That's all.
It's should be clear.
