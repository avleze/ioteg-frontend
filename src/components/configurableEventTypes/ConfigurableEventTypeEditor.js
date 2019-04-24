import * as React from "react";
import { CustomMaterialTable } from "../utils/CustomMaterialTable";
import Axios from "axios";
import { Paper, Grid, Typography, Divider, Button, Fab } from "@material-ui/core";
import ChannelForm from "./ChannelForm";
import ChevronLeft from '@material-ui/icons/ChevronLeft';

const configurableEventTypeColumns = [
    { title: 'Event Name', field: 'name' },
]

export class ChannelEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channelName: "",
            configurableEventTypes: null
        }
    }

    async componentDidMount() {
        const channelId = this.props.match.params["channelId"];
        const userId = this.props.match.params["userId"];
        if (channelId !== undefined)
            await Axios.get(`/api/users/${userId}/channels/${channelId}`).then(async channel => {

                await Axios.get(`/api/channels/${channelId}/configurableEventTypes`).then(configurableEventTypes => {
                    this.setState({
                        id: channelId,
                        channelName: channel.data["channelName"],
                        configurableEventTypes: configurableEventTypes.data
                    });
                })
            })
    }



    render() {
        return (<React.Fragment>
            <Paper style={{ padding: 60 }} elevation={5}>

                <Grid container justify="center" spacing={24}>

                    <Grid item container xs={12} md={12} lg={5} spacing={24} justify="center">
                        <Grid item xs={12}>
                            <Grid item xs container justify="center">
                                <Grid item xs={4} alignItems="flex-start">
                                    <Button variant="contained" color="primary" onClick={() => this.props.history.goBack()}>
                                        <ChevronLeft /> BACK
                                    </Button>
                                </Grid>
                                <Grid item xs={4} alignItems="center">
                                    <Typography variant="h5" align="center">
                                        {this.state.id ? "Editing" : "New"} channel {this.props.match.params["channelId"]}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4} justify="center">
                                </Grid>
                            </Grid>

                            <Divider variant="fullWidth" />
                            <Typography variant="h6">Channel data</Typography>
                            <Typography hidden={this.state.id} gutterBottom>
                                Fill the name of the channel please. Once it is created you will be able to add the related fields.
                            </Typography>
                            <Paper style={{ padding: 15 }}>
                                <Grid container>
                                    <Grid item xs>
                                        <ChannelForm userId={this.props.match.params["userId"]} channel={this.state} key={this.state.id} onSubmit={this.onChannelFormSubmit} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} hidden={this.state.id === undefined}>

                            <Typography variant="h6">Related with Channel</Typography>
                            <CustomMaterialTable data={this.state.channels}
                                columns={configurableEventTypeColumns}
                                title="Configurable Event Types"
                                actions={[
                                    {
                                        icon: 'edit',
                                        tooltip: 'Edit configurable event type',
                                        onClick: (event, rowData) => {
                                            //this.props.history.push(`/user/${this.props.id}/channels/edit/${rowData.id}`)
                                        },
                                    },
                                    {
                                        icon: 'delete',
                                        tooltip: 'Delete configurable event type',
                                        onClick: (event, rowData) => {

                                        },
                                    },
                                    {
                                        icon: 'add',
                                        tooltip: 'Add configurable event type',
                                        isFreeAction: true,
                                        onClick: (event) => {

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


        </React.Fragment >)
    }

}
