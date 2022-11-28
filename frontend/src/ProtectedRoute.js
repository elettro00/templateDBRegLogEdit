import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({component: Component, isAuth, ...rest})
{
    // console.log(isAuth);
    return(
        <Route exact={rest.exact} path={rest.path} render={props => isAuth ? 
        <Component {...props}  />
        :
        <Redirect to="/Login"></Redirect>
        } />
    )
}

export default PrivateRoute