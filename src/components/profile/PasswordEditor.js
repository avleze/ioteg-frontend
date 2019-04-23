import * as React from 'react';
import { TextField, Button, Paper, Typography, Grid, FormHelperText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PasswordVerificationIndicator from '../utils/PasswordVerificationIndicator';
import Axios from 'axios';
import notify from '../../lib/notifier';

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
    },
});


class PasswordEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPassword: "",
            newPassword: "",
            repeatNewPassword: "",
            disable: true,
            error: false,
        }

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentPassword: "",
            newPassword: "",
            repeatNewPassword: "",
            disable: true,
            error: false
        })
    }

    onFieldChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value,
            error: false
        }, () => this.setState({
            disable: this.needsToBeDisabled(this.state)
        }));
    }

    needsToBeDisabled(data) {
        return data.currentPassword === "" || data.newPassword === "" || data.repeatNewPassword === "" || data.newPassword !== data.repeatNewPassword;
    }

    onSubmit(ev) {
        ev.preventDefault();

        Axios.patch(`/api/users/${this.props.userId}/password`, {
            oldPassword: this.state.currentPassword,
            newPassword: this.state.newPassword
        }).then(response => notify({ content: "Password changed successfully", variant: "success" }))
            .catch(error => {
                this.setState({
                    error: true,
                    errorMessage: error.response.data.subErrors[0].message
                })
                notify({ content: "There was an error changing the password", variant: "error" })
            });
    }

    render() {
        return (<React.Fragment>
            <Paper style={{ padding: "30px" }}>
                <Typography variant="h6" >Change password</Typography>
                <form onSubmit={this.onSubmit}>
                    <TextField
                        className={this.props.classes.formControl}
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        label="Current password"
                        value={this.state.currentPassword}
                        onChange={this.onFieldChange}
                        autoComplete="current-password"
                        error={this.state.error}
                        fullWidth
                        required
                    />
                    <FormHelperText error hidden={!this.state.error}>{this.state.errorMessage}</FormHelperText>
                    <TextField
                        className={this.props.classes.formControl}
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        label="New password"
                        value={this.state.newPassword}
                        onChange={this.onFieldChange}
                        autoComplete="new-password"
                        fullWidth
                        required
                    />
                    <TextField
                        className={this.props.classes.formControl}
                        id="repeatNewPassword"
                        name="repeatNewPassword"
                        type="password"
                        label="Repeat new password"
                        value={this.state.repeatNewPassword}
                        onChange={this.onFieldChange}
                        autoComplete="new-password"
                        fullWidth
                        required
                    />
                    <PasswordVerificationIndicator password={this.state.newPassword} repeatPassword={this.state.repeatNewPassword} />
                    <Grid container justify="flex-end">
                        <Button variant="contained" type="submit" color="primary" disabled={this.state.disable}>Change password</Button>
                    </Grid>
                </form>
            </Paper>
        </React.Fragment>)
    }
}


export default withStyles(styles)(PasswordEditor);