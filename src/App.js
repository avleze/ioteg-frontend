import React, { Suspense } from 'react';
import Menu from './components/header/Menu';
import SearchChannel from './components/search/SearchChannel';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from './components/routing/PrivateRoute';
import { MyChannelsView } from './components/channels/MyChannelsView';

const SignIn = React.lazy(() => import('./components/users/SignIn'));
const SignUp = React.lazy(() => import('./components/users/SignUp'));
const Profile = React.lazy(() => import('./components/profile/Profile'));

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
                            <PrivateRoute exact path="/my-profile" component={WaitingComponent(Profile)} />
                            <PrivateRoute exact path="/my-channels" component={WaitingComponent(MyChannelsView)} />
                            <Route path="/" component={SearchChannel} />
                        </Switch>
                    </div>
                </Menu>
            </Router>)
    }
}
