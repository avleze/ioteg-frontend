import React, { Suspense } from 'react';
import Menu from '../components/header/Menu';
import SearchChannel from '../components/search/SearchChannel';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from '../components/routing/PrivateRoute';
import Notifier from '../components/Notifier';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import ForbiddenPage from './ForbiddenPage';

const FieldEditorPage = React.lazy(() => import('../pages/FieldEditorPage'));
const ConfigurableEventTypeEditor = React.lazy(() => import('../pages/ConfigurableEventTypeEditor'))
const ChannelEditor = React.lazy(() => import('../pages/ChannelEditor'));
const BlockEditor = React.lazy(() => import('../pages/BlockEditor'));
const SignIn = React.lazy(() => import('../components/users/SignIn'));
const SignUp = React.lazy(() => import('../components/users/SignUp'));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'));
const MyChannelsPage = React.lazy(() => import('../pages/MyChannelsPage'));
const FieldInFieldEditor = React.lazy(() => import('./FieldInFieldEditor'));
const AttributeEditor = React.lazy(() => import('./AttributeEditor'));
const RuleEditor = React.lazy(() => import('./RuleEditor'));
const VariableEditor = React.lazy(() => import('./VariableEditor'));
const OptionalFieldsEditor = React.lazy(() => import('./OptionalFieldsEditor'));
const FieldInOptionalFieldsEditor = React.lazy(() => import('./FieldInOptionalFieldsEditor'));

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
                            <PrivateRoute path="/my-profile" component={WaitingComponent(ProfilePage)} />
                            <PrivateRoute path="/my-channels" component={WaitingComponent(MyChannelsPage)} />
                            <PrivateRoute exact path="/user/:userId/channels/edit/:channelId" component={WaitingComponent(ChannelEditor)} />
                            <PrivateRoute exact path="/user/:userId/channels/new" component={WaitingComponent(ChannelEditor)} />
                            
                            <PrivateRoute exact path="/channels/:channelId/configurableEventTypes/edit/:configurableEventTypeId" component={WaitingComponent(ConfigurableEventTypeEditor)} />
                            <PrivateRoute exact path="/channels/:channelId/configurableEventTypes/new" component={WaitingComponent(ConfigurableEventTypeEditor)} />
                            
                            <PrivateRoute exact path="/events/:eventTypeId/blocks/edit/:blockId" component={WaitingComponent(BlockEditor)} />
                            <PrivateRoute exact path="/events/:eventTypeId/blocks/new" component={WaitingComponent(BlockEditor)} />
                            
                            <PrivateRoute exact path="/blocks/:blockId/fields/edit/:fieldId" component={WaitingComponent(FieldEditorPage)} />
                            <PrivateRoute exact path="/blocks/:blockId/fields/new" component={WaitingComponent(FieldEditorPage)} />
                            <PrivateRoute exact path="/blocks/:blockId/optionalFields/edit/:optionalFieldsId" component={WaitingComponent(OptionalFieldsEditor)} />
                            <PrivateRoute exact path="/blocks/:blockId/optionalFields/new" component={WaitingComponent(OptionalFieldsEditor)} />
                            OptionalFieldsEditor
                            <PrivateRoute exact path="/optionalFields/:optionalFieldsId/fields/edit/:fieldId" component={WaitingComponent(FieldInOptionalFieldsEditor)} />
                            <PrivateRoute exact path="/optionalFields/:optionalFieldsId/fields/new" component={WaitingComponent(FieldInOptionalFieldsEditor)} />
                            
                            <PrivateRoute exact path="/fields/:fieldId1/fields/edit/:fieldId2" component={WaitingComponent(FieldInFieldEditor)} />
                            <PrivateRoute exact path="/fields/:fieldId1/fields/new" component={WaitingComponent(FieldInFieldEditor)} />
                            <PrivateRoute exact path="/fields/:fieldId/attributes/edit/:attributeId" component={WaitingComponent(AttributeEditor)} />
                            <PrivateRoute exact path="/fields/:fieldId/attributes/new" component={WaitingComponent(AttributeEditor)} />

                            <PrivateRoute exact path="/customBehaviour/:customBehaviourId/variables/edit/:variableId" component={WaitingComponent(VariableEditor)} />
                            <PrivateRoute exact path="/customBehaviour/:customBehaviourId/variables/new" component={WaitingComponent(VariableEditor)} />
                            <PrivateRoute exact path="/customBehaviour/:customBehaviourId/rules/edit/:ruleId" component={WaitingComponent(RuleEditor)} />
                            <PrivateRoute exact path="/customBehaviour/:customBehaviourId/rules/new" component={WaitingComponent(RuleEditor)} />
                            
                            <Route exact path="/forbidden" component={WaitingComponent(ForbiddenPage)} />
                            <Route path="/" component={SearchChannel} />
                        </Switch>
                    </div>
                    <Notifier/>
                    <ConfirmationDialog />
                </Menu>
            </Router>)
    }
}
