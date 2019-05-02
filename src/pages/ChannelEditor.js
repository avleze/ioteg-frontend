import * as React from "react";
import Axios from "axios";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import ChannelForm from "../components/channels/ChannelForm";
import notify from "../lib/notifier";
import { withRouter } from 'react-router';
import { ConfigurableEventTypeList } from "../components/configurableEventTypes/ConfigurableEventTypeList";
import confirm from "../lib/confirmation";
import Page from "./Page";
import SelectDialog from "../components/configurableEventTypes/SelectDialog";
import AsyncGenerationDialog from "../components/configurableEventTypes/AsyncGenerationDialog";
import { connect } from 'react-redux';

const successConfigurableEventTypeDelete = { content: "Configurable event type deleted successfully", variant: "success" };
const errorConfigurableEventTypeDelete = { content: "There was an error when deleting the configurable event type", variant: "error" };

class ChannelEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channelName: "",
            configurableEventTypes: [],
            chooseFormatOpened: false,
            asyncGenerationOpened: false
        }

        this.onConfigurableEventTypeAdd = this.onConfigurableEventTypeAdd.bind(this);
        this.onConfigurableEventTypeDelete = this.onConfigurableEventTypeDelete.bind(this);
        this.onConfigurableEventTypeEdit = this.onConfigurableEventTypeEdit.bind(this);
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

    onConfigurableEventTypeAdd() {
        this.props.history.push(`/channels/${this.state.id}/configurableEventTypes/new`)
    }

    onConfigurableEventTypeDelete(rowData) {
        confirm(() => {
            const channelId = this.props.match.params["channelId"];
            const configurableEventTypeId = rowData.id;
            Axios.delete(`/api/channels/${channelId}/configurableEventTypes/${configurableEventTypeId}`)
                .then(response => {
                    Axios.get(`/api/channels/${channelId}/configurableEventTypes`).then(configurableEventTypes => {
                        this.setState({
                            configurableEventTypes: configurableEventTypes.data
                        });
                    })
                    notify(successConfigurableEventTypeDelete)
                })
                .catch(error => notify(errorConfigurableEventTypeDelete));
        });
    }

    onConfigurableEventTypeEdit(rowData) {
        this.props.history.push(`/channels/${this.state.id}/configurableEventTypes/edit/${rowData.id}`)
    }

    render() {
        const channelId = this.props.match.params["channelId"];

        return (<Page>

            <Grid container justify="center" spacing={24}>

                <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center" gutterBottom>
                            {this.props.match.params["channelId"] ? "Editing" : "New"} channel {this.props.match.params["channelId"]}
                        </Typography>


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
                    <Grid item xs={12} hidden={this.props.match.params["channelId"] === undefined}>
                        <Typography variant="h6">Relations</Typography>
                        <ConfigurableEventTypeList configurableEventTypes={this.state.configurableEventTypes}
                            onAdd={this.onConfigurableEventTypeAdd}
                            onEdit={this.onConfigurableEventTypeEdit}
                            onDelete={this.onConfigurableEventTypeDelete}
                            onGenerate={(rowData) => { this.setState({ chooseFormatOpened: true, selected: rowData }) }}
                            onGenerateAsync={(rowData) => {
                                this.setState({
                                    asyncGenerationOpened: true,
                                    selectedEventId: rowData.id,
                                    topic: `/channel/${channelId}/event/${rowData.id}/<format>/${this.props.mqttApiKey}`
                                })
                            }} />
                    </Grid>
                </Grid>

            </Grid>

            <AsyncGenerationDialog open={this.state.asyncGenerationOpened}
                channelId={channelId}
                eventId={this.state.selectedEventId}
                topic={this.state.topic}
                key={this.state.topic}
                onClose={() => {
                    this.setState({
                        asyncGenerationOpened: false,
                    })
                }}
            />

            <SelectDialog open={this.state.chooseFormatOpened} onClose={(item) => {
                if (item)
                    Axios.get(`/api/generation/${this.state.selected.id}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': `application/${item}`.toLowerCase()
                            }
                        })
                        .then(response => {
                            let data = response.data;
                            if (item === 'JSON')
                                data = JSON.stringify(data, null, 2);

                            const url = window.URL.createObjectURL(new Blob([data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', this.state.selected.eventType.name + `.${item}`.toLowerCase());
                            document.body.appendChild(link);
                            link.click();
                        });

                this.setState({
                    chooseFormatOpened: false
                })
            }} />
        </Page>
        )
    }

}

function mapStateToProps(state) {
    return {
        ...state.auth
    }
}

export default connect(mapStateToProps)(withRouter(ChannelEditor));