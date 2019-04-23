import * as React from 'react';
import { TextField, Button, Paper, Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PasswordVerificationIndicator from '../utils/PasswordVerificationIndicator';

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
            disable: true
        }

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            currentPassword: "",
            newPassword: "",
            repeatNewPassword: "",
            disable: true
        })
    }

    onFieldChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value
        }, () => this.setState({
            disable: this.needsToBeDisabled(this.state)
        }));
    }

    needsToBeDisabled(data) {
        return data.currentPassword === "" || data.newPassword === "" || data.repeatNewPassword === "" || data.newPassword !== data.repeatNewPassword;
    }

    onSubmit(ev) {
        ev.preventDefault();
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
                        fullWidth
                        required
                    />
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