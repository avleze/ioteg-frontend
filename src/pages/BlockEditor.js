import * as React from "react";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { withRouter } from 'react-router'
import Axios from "axios";
import BlockForm from "../components/blocks/BlockForm";
import { FieldList } from "../components/fields/FieldList";
import { OptionalFieldsList } from "../components/optionalfields/OptionalFieldsList";
import confirm from "../lib/confirmation";
import notify from "../lib/notifier";
import Page from "./Page";

const fieldDeleteSuccess = { content: 'Field deleted successfully.' }
const fieldDeleteError = { content: 'Failed when deleting the field.' }

class BlockEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            block: { id: null },
            optionalFields: [],
            fields: [],
            injectedFields: []
        }

        this.onFieldDelete = this.onFieldDelete.bind(this);
        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const eventId = this.props.match.params["eventTypeId"];
        const blockId = this.props.match.params["blockId"];
        if (blockId) {
            Promise.all([Axios.get(`/api/events/${eventId}/blocks/${blockId}`),
            Axios.get(`/api/blocks/${blockId}/fields`)
            ])
                .then(responses => {
                    console.log(responses);
                    this.setState({
                        block: responses[0].data,
                        fields: responses[1].data,
                        //optionalFields: responses[2].data
                    })
                })

        }
    }

    onFieldDelete(rowData) {
        const blockId = this.props.match.params["blockId"];
        const fieldId = rowData.id;
        confirm(() => {
            Axios.delete(`/api/blocks/${blockId}/fields/${fieldId}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(fieldDeleteSuccess)
                })
                .catch(error => notify(fieldDeleteError));
        })
    }

    render() {
        const eventId = this.props.match.params["eventTypeId"];
        const blockId = this.state.block.id;

        return (<Page>
            <Grid container justify="center" spacing={24}>
                <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                    <Grid item xs={12}>
                        <Grid item xs container justify="center">
                            <Typography variant="h5" align="center" gutterBottom>
                                {blockId ? "Editing" : "New"} block {blockId}
                            </Typography>
                        </Grid>

                        <Divider variant="fullWidth" />
                        <Typography variant="h6">Block Data</Typography>
                        <Typography hidden={blockId} gutterBottom>
                            Fill the name of the block, and its repetition if it is not a header or a footer. Once it is created you will be able to add the related fields.
                            </Typography>
                        <Paper style={{ padding: 15 }}>
                            <Grid container>
                                <Grid item xs>
                                    <BlockForm eventId={eventId} block={this.state.block} key={blockId} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} hidden={!blockId}>
                        <FieldList fields={this.state.fields}
                            onAdd={this.onFieldAdd}
                            onEdit={this.onFieldEdit}
                            onDelete={this.onFieldDelete} />
                    </Grid>
                    <Grid item xs={12} hidden={!blockId}>
                        <OptionalFieldsList optionalFields={this.state.optionalFields} />
                    </Grid>
                </Grid>
            </Grid>
        </Page>
        )
    }

}

export default withRouter(BlockEditor);