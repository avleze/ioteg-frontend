import * as React from "react";
import Axios from "axios";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { withRouter } from 'react-router'
import ConfigurableEventTypeForm from "../components/configurableEventTypes/ConfigurableEventTypeForm";
import { BlockList } from "../components/blocks/BlockList";
import confirm from "../lib/confirmation";
import notify from "../lib/notifier";
import Page from "./Page";

const successBlockDelete = { content: 'Block deleted successfully', variant: 'success' }
const errorBlockDelete = { content: 'Failed when deleting the block', variant: 'error' }

class ConfigurableEventTypeEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blocks: []
        }
        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);

        this.onBlockAdd = this.onBlockAdd.bind(this);
        this.onBlockDelete = this.onBlockDelete.bind(this);
        this.onBlockEdit = this.onBlockEdit.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const channelId = this.props.match.params["channelId"];
        const configurableEventTypeId = this.props.match.params["configurableEventTypeId"];
        if (configurableEventTypeId !== undefined)
            await Axios.get(`/api/channels/${channelId}/configurableEventTypes/${configurableEventTypeId}`).then(async configurableEventType => {

                await Axios.get(`/api/events/${configurableEventType.data.eventType.id}/blocks`).then(blocks => {
                    this.setState({
                        eventId: configurableEventType.data.eventType.id,
                        blocks: blocks.data
                    });
                })
            })
    }

    onBlockAdd() {
        const eventId = this.state.eventId;
        this.props.history.push(`/events/${eventId}/blocks/new`);
    }

    onBlockDelete(blockData) {
        const eventId = this.state.eventId;
        const blockId = blockData.id;

        confirm(() => {
            Axios.delete(`/api/events/${eventId}/blocks/${blockId}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(successBlockDelete)
                })
                .catch(error => notify(errorBlockDelete))

        })
    }

    onBlockEdit(blockData) {
        const eventId = this.state.eventId;
        const blockId = blockData.id;
        this.props.history.push(`/events/${eventId}/blocks/edit/${blockId}`);
    }

    render() {
        const configurableEventTypeId = this.props.match.params["configurableEventTypeId"];
        const channelId = this.props.match.params["channelId"];

        return (
            <Page>

                <Grid container justify="center" spacing={24}>

                    <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                        <Grid item xs={12}>
                            <Grid item xs container justify="center">
                                <Typography variant="h5" align="center" gutterBottom>
                                    {configurableEventTypeId ? "Editing" : "New"} configurable event type {configurableEventTypeId}
                                </Typography>
                            </Grid>

                            <Divider variant="fullWidth" />
                            <Typography variant="h6">Configurable Event Type Data</Typography>
                            <Typography hidden={configurableEventTypeId} gutterBottom>
                                Fill the name of the event, and its configurable parameters regarding the distribution in time please. Once it is created you will be able to add the related fields.
                            </Typography>
                            <Paper style={{ padding: 15 }}>
                                <Grid container>
                                    <Grid item xs>
                                        <ConfigurableEventTypeForm id={configurableEventTypeId} channelId={channelId} key={configurableEventTypeId} />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} hidden={!configurableEventTypeId}>
                            <Typography variant="h6">Relations</Typography>
                            <BlockList blocks={this.state.blocks}
                                onAdd={this.onBlockAdd}
                                onEdit={this.onBlockEdit}
                                onDelete={this.onBlockDelete} />
                        </Grid>
                    </Grid>

                </Grid>

            </Page>
        )
    }

}

export default withRouter(ConfigurableEventTypeEditor);