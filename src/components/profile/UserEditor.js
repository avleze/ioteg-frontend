import * as React from 'react';
import { TextField, Button, Paper, Typography, Grid, FormHelperText } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Axios from 'axios';
import notify from '../../lib/notifier';
import { SET_AUTH_ACTION } from '../../config/action-types';

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
    },
});


class UserEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            changed: false,
            errors: {}
        }

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            username: this.props.username,
            email: this.props.email,
            changed: false,
            errors: {}
        })
    }

    onFieldChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value,
            errors: {}
        }, () => {
            this.setState({
                changed: this.checkIfChanged(this.state)
            })
        });
    }

    checkIfChanged(userData) {
        return userData.email !== this.props.email || userData.username !== this.props.username;
    }

    onSubmit(ev) {
        ev.preventDefault();

        Axios.put(`/api/users/${this.props.userId}`, {
            username: this.state.username,
            email: this.state.email
        }).then(response => {
            this.props.dispatch({type: SET_AUTH_ACTION, payload: {isLoggedIn: true, ...response.data}});
            notify({ content: "User modified successfully", variant: "success" });
        })
            .catch(error => {
                let errors = {};

                error.response.data["subErrors"].forEach(error => {
                    errors[error.field] = error.message;
                });

                this.setState({
                    errors: errors
                });

                notify({ content: "User modification failed", variant: "error" });
            })
    }

    render() {
        return (<React.Fragment>
            <Paper style={{ padding: "30px" }}>
                <Typography variant="h5" >{this.props.username}'s data</Typography>
                <form onSubmit={this.onSubmit}>
                    <TextField
                        className={this.props.classes.formControl}
                        id="username"
                        name="username"
                        type="text"
                        label="Username"
                        value={this.state.username}
                        onChange={this.onFieldChange}
                        autoComplete="username"
                        error={this.state.errors.username !== undefined}
                        fullWidth
                    />
                    <FormHelperText error hidden={this.state.errors.username === undefined}>{this.state.errors.username}</FormHelperText>
                    <TextField
                        className={this.props.classes.formControl}
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        value={this.state.email}
                        onChange={this.onFieldChange}
                        error={this.state.errors.email !== undefined}
                        autoComplete="email"
                        fullWidth
                    />
                    <FormHelperText error hidden={this.state.errors.email === undefined}>{this.state.errors.email}</FormHelperText>
                    <Grid container justify="flex-end">
                        <Button variant="contained" type="submit" color="primary" disabled={!this.state.changed}>Save changes</Button>
                    </Grid>
                </form>
            </Paper>
        </React.Fragment>)
    }
}

function mapStateToProps(state) {
    return { ...state.auth };
}

export default connect(mapStateToProps)(withStyles(styles)(UserEditor));