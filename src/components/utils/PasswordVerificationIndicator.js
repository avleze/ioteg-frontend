import * as React from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid } from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Error from '@material-ui/icons/Error';

export default class PasswordVerificationIndicator extends React.Component {

    render() {

        const { password, repeatPassword } = this.props;
        if(password === "" && repeatPassword === "")
            return null;

        const verificationText = password === repeatPassword ? 'Passwords match' : 'Passwords do not match';
        const icon = password === repeatPassword ? <CheckCircle color="primary" /> : <Error color="secondary" />;
        return (
                <Grid container alignItems="center" spacing={8}>
                    <Grid item>
                        <Typography>{verificationText}</Typography>
                    </Grid>
                    <Grid item>
                        {icon}
                    </Grid>
                </Grid>
            )
    }
}

PasswordVerificationIndicator.propTypes = {
    password: PropTypes.string.isRequired,
    repeatPassword: PropTypes.string.isRequired
}