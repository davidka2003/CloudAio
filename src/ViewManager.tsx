import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import App from './App';
import Login from './Components/Login/Login';
import Logout from './Components/Logout/Logout';

class ViewManager extends Component {

  static Views():{[view:string]:JSX.Element} {
    return {
      viewMain: <App/>,
      viewLogin: <Login/>,
      viewLogout:<Logout/>
    }
  }

  static View(props:any) {
    let name = props.location.search.substr(1);
    let view = ViewManager.Views()[name];
    if(view == null) 
      throw new Error("View '" + name + "' is undefined");
    return view;
  }
  
  render() {
    return (
      <Router>
        <div>
          <Route path='/' component={ViewManager.View}/>
        </div>
      </Router>
    );
  }
}

export default ViewManager