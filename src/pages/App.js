import React, { Suspense } from 'react';
import Menu from '../components/header/Menu';
import SearchChannel from '../components/search/SearchChannel';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from '../components/routing/PrivateRoute';
import Notifier from '../components/Notifier';

const SignIn = React.lazy(() => import('../components/users/SignIn'));
const SignUp = React.lazy(() => import('../components/users/SignUp'));
const ProfilePage = React.lazy(() => import('./ProfilePage'));
const MyChannelsPage = React.lazy(() => import('./MyChannelsPage'));

function WaitingComponent(Component) {
    return props => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
}


export default class App extends React.Component {

    componentDidMount() {

    }

    render() {
        return (
            <Router>
                <Menu>
                    <div style={{ height: 65 }}></div>
                    <div>
                        <Switch>
                            <Route exact path="/signin" component={WaitingComponent(SignIn)} />
                            <Route exact path="/signup" component={WaitingComponent(SignUp)} />
                            <PrivateRoute exact path="/my-profile" component={WaitingComponent(ProfilePage)} />
                            <PrivateRoute exact path="/my-channels" component={WaitingComponent(MyChannelsPage)} />
                            <Route path="/" component={SearchChannel} />
                        </Switch>
                    </div>
                    <Notifier/>
                </Menu>
            </Router>)
    }
}
