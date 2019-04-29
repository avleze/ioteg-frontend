import * as React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import notify from '../lib/notifier';
import { ChannelList } from '../components/channels/ChannelList';
import confirm from '../lib/confirmation';
import Page from './Page';

const successChannelDelete = { content: "Channel deleted successfully", variant: "success" };
const errorChannelDelete = { content: "There was an error when deleting the channel", variant: "error" };

export class MyChannelsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channels: []
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);

        this.onChannelAdd = this.onChannelAdd.bind(this);
        this.onChannelEdit = this.onChannelEdit.bind(this);
        this.onChannelDelete = this.onChannelDelete.bind(this);
    }


    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const userId = jwt_decode(localStorage.getItem('token')).id;
        if (userId)
            await Axios.get(`/api/users/${userId}/channels`).then(response => {
                this.setState({
                    channels: response.data
                })
            })
    }

    onChannelAdd() {
        this.props.history.push(`/user/${this.props.id}/channels/new`);
    }

    onChannelEdit(rowData) {
        this.props.history.push(`/user/${this.props.id}/channels/edit/${rowData.id}`)
    }

    onChannelDelete(rowData) {
        confirm(() => {
            Axios.delete(`/api/users/${this.props.id}/channels/${rowData.id}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(successChannelDelete)
                })
                .catch(error => notify(errorChannelDelete));
        })
    }


    render() {
        return (
            <Page topBar={false}>
                <Grid container justify="center" spacing={24}>

                    <Grid item container xs={12} md={12} lg={5} spacing={24}>

                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>My channels</Typography>
                            <Typography variant="body2" gutterBottom>
                                Here you have your channels.

                                A channel is compound by configurable event types. If you want to edit a channel and its subcomponents, just click the pencil icon and IoT-TEG will carry you to the edition page.
                                </Typography>
                            <ChannelList channels={this.state.channels}
                                onAdd={this.onChannelAdd}
                                onDelete={this.onChannelDelete}
                                onEdit={this.onChannelEdit} />
                        </Grid>
                    </Grid>

                </Grid>

            </Page>
        )
    }
}

function mapStateToProps(state) {
    return {
        ...state.auth
    }
}

export default connect(mapStateToProps)(withRouter(MyChannelsPage));