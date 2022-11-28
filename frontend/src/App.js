import './App.css';
import MainPage from './components/Main/MainPage';
import Login from './components/Main/Login';
import Register from './components/Main/Register';
import Navbar from './components/Main/Navbar';
import UserProfile from './components/Main/UserProfile';
import 'bootstrap/dist/css/bootstrap.css'
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import rootReducer from "./Store/reducers/index"
import { Provider } from "react-redux"
import { createStore } from 'redux'
import { SetAuth } from './Store/actions/actions';
import axios from 'axios';
import PrivateRoute from './ProtectedRoute';

const URL_BACKEND = "http://localhost:4000/api/Users"

class App extends Component {

  state = { isAuth: false, id: "" }

  async componentDidMount() {
    const Token = localStorage.getItem("Token")

    if (Token) {

      axios.get(`${URL_BACKEND}/GetUserToken`, {
        headers: { Authorization: Token }
      }).then(res => {
        const dbToken = res.data
        // console.log(dbToken);
        if (dbToken) {
          this.Store.dispatch(SetAuth(true))
          this.setState({ isAuth: true })
        }
        else {
          this.Store.dispatch(SetAuth(false))
          this.setState({ isAuth: false })
        }
        axios.get(`${URL_BACKEND}/GetUserData`, {
          headers: { Authorization: Token }
        }).then(res => {
          if (res)
            this.setState({ id: res.data.result[0].id })
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }
    else {
      this.Store.dispatch(SetAuth(false))
      this.setState({ isAuth: false })
    }
    await this.Store.subscribe(() => {
      // console.log({ isAuth:this.Store.getState()["CheckAction"]["isAuth"] });
      this.setState({ isAuth: this.Store.getState()["CheckAction"]["isAuth"] })
    })
    // console.log(this.state);
  }

  Store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  LogOut = () => {
    localStorage.removeItem("Token")
    this.Store.dispatch(SetAuth(false))
    axios.put(`${URL_BACKEND}/deleteToken/${this.state.id}`, []).then(res => console.log(res)).catch(err => console.log(err))
    window.location.pathname = "/Login"
  }

  render() {
    return (
      <Provider store={this.Store}>
        <Router>
          <Navbar Store={this.Store} LogOut={this.LogOut} />
          <PrivateRoute exact path='/Profile' isAuth={this.Store.getState()["CheckAction"]["isAuth"]} component={UserProfile} />
          <PrivateRoute exact path='/' isAuth={this.Store.getState()["CheckAction"]["isAuth"]} component={MainPage} />
          <Route exact path='/Register' isAuth={this.Store.getState()["CheckAction"]["isAuth"]} component={Register} />
          <Route exact path='/Login' component={Login} />
        </Router>
      </Provider>
    );
  }
}

export default App;
