import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


class PrivateRoute extends React.Component {

    render() {
        const { component: Component, ...rest } = this.props;

        return (<Route {...rest} render={() =>
            (localStorage.getItem('token') || sessionStorage.getItem('token')) ?
             <Component {...this.props}/> : <Redirect to='/signin' />
        }/>);
    }
}

function mapStateToProps(state) {
    return {
        auth: {...state.auth}
    }
}

export default connect(mapStateToProps)(PrivateRoute);