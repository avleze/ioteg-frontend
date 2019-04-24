import * as React from 'react'
import propTypes from 'prop-types';
import { TextField, Button, Grid, FormHelperText } from '@material-ui/core';
import Axios from 'axios';
import notify from '../../lib/notifier';
import { withRouter } from 'react-router-dom';

class ChannelForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channelName: props.channelName || "",
            errors: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            channelName: this.props.channel.channelName,
            errors: {}
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const channel = { ...this.state };
        const channelId = this.props.channel.id;
        const userId = this.props.userId;

        if (channelId)
            Axios.put(`/api/users/${userId}/channels/${channelId}`, channel)
                .then(response => {
                    notify({ content: "Channel edited successfully", variant: "success" })
                })
                .catch(error => {
                    let errors = {};

                    error.response.data["subErrors"].forEach(error => {
                        errors[error.field] = error.message;
                    });

                    this.setState({
                        errors: errors
                    });

                    notify({ content: "There was an error editing the channel", variant: "error" })
                })
        else
            Axios.post(`/api/users/${userId}/channels`, channel)
                .then(response => {
                    notify({ content: "Channel created successfully", variant: "success" })
                    this.props.history.goBack();
                })
                .catch(error => {
                    let errors = {};

                    error.response.data["subErrors"].forEach(error => {
                        errors[error.field] = error.message;
                    });

                    this.setState({
                        errors: errors
                    });

                    notify({ content: "There was an error creating the channel", variant: "error" })
                })
    }

    onFieldChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            errors: {}
        });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <TextField id="channelName" label="Channel Name" name="channelName" type="text" value={this.state.channelName} onChange={this.onFieldChange} fullWidth error={this.state.errors.channelName}/>
                        <FormHelperText error hidden={!this.state.errors.channelName}>{this.state.errors.channelName}</FormHelperText>
                    </Grid>
                    <Grid item container xs={12} justify="flex-end">
                        <Button type="submit" variant="contained" color="primary">SUBMIT</Button>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

ChannelForm.propTypes = {
    channel: propTypes.object.isRequired
}

export default withRouter(ChannelForm);