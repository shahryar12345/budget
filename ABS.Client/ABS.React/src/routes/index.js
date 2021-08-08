import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Auth from './auth';
import Application from './application';

class Routes extends React.Component {
    render() {
        return (
            <Switch>
                <Route path="/signin" exact component={Auth} />
                <Route
                    path="/"
                    render={(props) => <Application {...props} />}
                />
            </Switch>
        );
    }
}

export default Routes;
