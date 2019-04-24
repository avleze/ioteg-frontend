import * as React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { CustomMaterialTable } from '../components/utils/CustomMaterialTable';
import { connect } from 'react-redux';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import notify from '../lib/notifier';

const columns = [
    { title: 'Channel Name', field: 'channelName' },
]


export class MyChannelsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channels: []
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
    }


    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const userId = jwt_decode(localStorage.getItem('token')).id;
        console.log(userId)
        if (userId)
            await Axios.get(`/api/users/${userId}/channels`).then(response => {
                this.setState({
                    channels: response.data
                })
            })
    }



    render() {
        return (
            <React.Fragment>

                <Paper style={{ padding: 60 }} elevation={5}>

                    <Grid container justify="center" spacing={24}>

                        <Grid item container xs={12} md={12} lg={5} spacing={24}>

                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>My channels</Typography>
                                <Typography variant="body2" gutterBottom>
                                    Here you have your channels.

                                    A channel is compound by configurable event types. If you want to edit a channel and its subcomponents, just click the pencil icon and IoT-TEG will carry you to the edition page.
                                </Typography>
                                <CustomMaterialTable data={this.state.channels}
                                    columns={columns}
                                    title="Channels"
                                    actions={[
                                        {
                                            icon: 'edit',
                                            tooltip: 'Edit channel',
                                            onClick: (event, rowData) => {
                                                this.props.history.push(`/user/${this.props.id}/channels/edit/${rowData.id}`)
                                            },
                                        },
                                        {
                                            icon: 'delete',
                                            tooltip: 'Delete channel',
                                            onClick: (event, rowData) => {
                                                Axios.delete(`/api/users/${this.props.id}/channels/${rowData.id}`).then(response => {
                                                    this.getDataFromEndpoint();
                                                    notify({content: "Channel deleted successfully", variant: "success"})
                                                })
                                                .catch(error => notify({content: "There was an error when deleting the channel", variant: "error"}));
                                            },
                                        },
                                        {
                                            icon: 'add',
                                            tooltip: 'Add channel',
                                            isFreeAction: true,
                                            onClick: (event) => {
                                                this.props.history.push(`/user/${this.props.id}/channels/new`);
                                            },
                                        },
                                    ]
                                    }
                                    options={{
                                        actionsColumnIndex: -1,
                                        columnsButton: true,
                                    }}></CustomMaterialTable>
                            </Grid>
                        </Grid>

                    </Grid>

                </Paper>
            </React.Fragment>)
    }
}

function mapStateToProps(state) {
    return {
        ...state.auth
    }
}

export default connect(mapStateToProps)(withRouter(MyChannelsPage));