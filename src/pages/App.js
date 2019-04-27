import React, { Suspense } from 'react';
import Menu from '../components/header/Menu';
import SearchChannel from '../components/search/SearchChannel';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from '../components/routing/PrivateRoute';
import Notifier from '../components/Notifier';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

const ConfigurableEventTypeEditor = React.lazy(() => import('../pages/ConfigurableEventTypeEditor'))
const ChannelEditor = React.lazy(() => import('../pages/ChannelEditor'));
const BlockEditor = React.lazy(() => import('../pages/BlockEditor'));
const SignIn = React.lazy(() => import('../components/users/SignIn'));
const SignUp = React.lazy(() => import('../components/users/SignUp'));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'));
const MyChannelsPage = React.lazy(() => import('../pages/MyChannelsPage'));

function WaitingComponent(Component) {
    return props => (
        <Suspense fallback={<div>Loading...</div>}>
            <Component {...props} />
        </Suspense>
    );
}


export default class App extends React.Component {

    render() {
        return (
            <Router>
                <Menu>
                    <div style={{ height: 65 }}></div>
                    <div>
                        <Switch>
                            <Route exact path="/signin" component={WaitingComponent(SignIn)} />
                            <Route exact path="/signup" component={WaitingComponent(SignUp)} />
                            <Route exact path="/" component={SearchChannel} />
                            <PrivateRoute path="/my-profile" component={WaitingComponent(ProfilePage)} />
                            <PrivateRoute path="/my-channels" component={WaitingComponent(MyChannelsPage)} />
                            <Route exact path="/user/:userId/channels/edit/:channelId" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/user/:userId/channels/new" component={WaitingComponent(ChannelEditor)} />
                            
                            <Route exact path="/channels/:channelId/configurableEventTypes/edit/:configurableEventTypeId" component={WaitingComponent(ConfigurableEventTypeEditor)} />
                            <Route exact path="/channels/:channelId/configurableEventTypes/new" component={WaitingComponent(ConfigurableEventTypeEditor)} />
                            
                            <Route exact path="/events/:eventTypeId/blocks/edit/:blockId" component={WaitingComponent(BlockEditor)} />
                            <Route exact path="/events/:eventTypeId/blocks/new" component={WaitingComponent(BlockEditor)} />
                            
                            <Route exact path="/blocks/:blockId/fields/edit/:fieldId" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/blocks/:blockId/fields/new" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/blocks/:blockId/optionalFields/edit/:optionalFieldsId" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/blocks/:blockId/optionalFields/new" component={WaitingComponent(ChannelEditor)} />
                            
                            <Route exact path="/optionalFields/:optionalFieldsId/fields/edit/:fieldId" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/optionalFields/:optionalFieldsId/fields/new" component={WaitingComponent(ChannelEditor)} />
                            
                            <Route exact path="/fields/:fieldId1/fields/edit/:fieldId2" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/fields/:fieldId1/fields/new" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/fields/:fieldId/attributes/edit/:attributeId" component={WaitingComponent(ChannelEditor)} />
                            <Route exact path="/fields/:fieldId/attributes/new" component={WaitingComponent(ChannelEditor)} />
                        </Switch>
                    </div>
                    <Notifier/>
                    <ConfirmationDialog />
                </Menu>
            </Router>)
    }
}
