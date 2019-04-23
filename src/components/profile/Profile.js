import React from 'react';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import UserEditor from './UserEditor';
import PasswordEditor from './PasswordEditor';


class Profile extends React.Component {


    render() {

        return (<React.Fragment>
            <Grid container justify="center" spacing={8}>
                <Grid item xs={12}>
                    <UserEditor />
                </Grid>
                <Grid item xs={12}>
                    <PasswordEditor />
                </Grid>
            </Grid>
        </React.Fragment>)
    }
}

function mapStateToProps(state) {
    return { ...state.auth };
}

export default connect(mapStateToProps)(Profile);