import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../components/content-pages/Authentication/login';

class Auth extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/signin" component={Login}></Route>
            </Switch>
        );
    }
}

export default Auth;
