import * as React from 'react';
import { TextField, Button, Paper, Typography, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

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
        }

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            username: this.props.username,
            email: this.props.email,
            changed: false
        })
    }

    onFieldChange(ev) {
        this.setState({
            [ev.target.name]: ev.target.value
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
                        fullWidth
                    />
                    <TextField
                        className={this.props.classes.formControl}
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        value={this.state.email}
                        onChange={this.onFieldChange}
                        autoComplete="email"
                        fullWidth
                    />
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