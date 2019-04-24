import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import UserEditor from '../components/profile/UserEditor';
import PasswordEditor from '../components/profile/PasswordEditor';


class ProfilePage extends React.Component {


    render() {

        return (<React.Fragment>

            <Grid container justify="center">
                <Grid item xs={12} md={6} lg={4} container spacing={8} justify="center">
                    <Grid item xs={12}>
                        <UserEditor userId={this.props.id} />
                    </Grid>
                    <Grid item xs={12}>
                        <PasswordEditor userId={this.props.id} />
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>)
    }
}

function mapStateToProps(state) {
    return { ...state.auth };
}

export default connect(mapStateToProps)(ProfilePage);