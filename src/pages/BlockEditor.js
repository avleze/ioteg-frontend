import * as React from "react";
import { Paper, Grid, Typography, Divider, CircularProgress } from "@material-ui/core";
import { withRouter } from 'react-router'
import Axios from "axios";
import BlockForm from "../components/blocks/BlockForm";
import { FieldList } from "../components/fields/FieldList";
import { OptionalFieldsList } from "../components/optionalfields/OptionalFieldsList";
import confirm from "../lib/confirmation";
import notify from "../lib/notifier";
import Page from "./Page";
import { InjectedFieldList } from "../components/injectedField/InjectedFieldList";
import InjectedFieldDialogForm from "../components/injectedField/InjectedFieldDialogForm";

const fieldDeleteSuccess = { content: 'Field deleted successfully.', variant: "success" }
const fieldDeleteError = { content: 'Failed when deleting the field.', variant: "error" }

const optionalFieldDeleteSuccess = { content: 'OptionalFields deleted successfully.', variant: "success" }
const optionalFieldDeleteError = { content: 'Failed when deleting the OptionalFields.', variant: "error" }

const injectedFieldDeleteSuccess = { content: 'Injected Field deleted successfully.', variant: "success" }
const injectedFieldDeleteError = { content: 'Failed when deleting the Injected Field.', variant: "error" }

const injectedFieldCreatedSuccess = { content: 'Injected Field created successfully.', variant: "success" }
const injectedFieldCreatedError = { content: 'Failed when creating the Injected Field.', variant: "error" }

class BlockEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            block: { id: null },
            optionalFields: [],
            fields: [],
            injectedFields: [],
            injectedFieldOpened: false,
            fetching: true
        }

        this.onFieldDelete = this.onFieldDelete.bind(this);
        this.onFieldAdd = this.onFieldAdd.bind(this);
        this.onFieldEdit = this.onFieldEdit.bind(this);

        this.onOptionalFieldsAdd = this.onOptionalFieldsAdd.bind(this);
        this.onOptionalFieldsDelete = this.onOptionalFieldsDelete.bind(this);
        this.onOptionalFieldsEdit = this.onOptionalFieldsEdit.bind(this);

        this.onDeleteInjectedField = this.onDeleteInjectedField.bind(this);
        this.onAddInjectedField = this.onAddInjectedField.bind(this);


        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const eventId = this.props.match.params["eventTypeId"];
        const blockId = this.props.match.params["blockId"];
        if (blockId) {
            this.setState({fetching: true})
            Promise.all([Axios.get(`/api/events/${eventId}/blocks/${blockId}`),
            Axios.get(`/api/blocks/${blockId}/fields`),
            Axios.get(`/api/blocks/${blockId}/optionalFields`),
            Axios.get(`/api/blocks/${blockId}/injectedFields`)
            ])
                .then(responses => {
                    this.setState({
                        block: responses[0].data,
                        fields: responses[1].data,
                        optionalFields: responses[2].data,
                        injectedFields: responses[3].data,
                        fetching: false
                    })
                })
        } else 
            this.setState({fetching : false})
    }

    onFieldAdd() {
        const blockId = this.props.match.params["blockId"];
        this.props.history.push(`/blocks/${blockId}/fields/new`);
    }

    onFieldEdit(rowData) {
        const blockId = this.props.match.params["blockId"];
        this.props.history.push(`/blocks/${blockId}/fields/edit/${rowData.id}`);
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

    onOptionalFieldsAdd() {
        const blockId = this.props.match.params["blockId"];
        this.props.history.push(`/blocks/${blockId}/optionalFields/new`)
    }

    onOptionalFieldsDelete(rowData) {
        const blockId = this.props.match.params["blockId"];
        const optionalFieldsId = rowData.id;
        confirm(() => {
            Axios.delete(`/api/blocks/${blockId}/optionalFields/${optionalFieldsId}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(optionalFieldDeleteSuccess)
                })
                .catch(error => notify(optionalFieldDeleteError));
        })
    }

    onOptionalFieldsEdit(rowData) {
        const blockId = this.props.match.params["blockId"];
        const optionalFieldsId = rowData.id;
        this.props.history.push(`/blocks/${blockId}/optionalFields/edit/${optionalFieldsId}`)
    }

    onDeleteInjectedField(rowData) {
        const blockId = this.props.match.params["blockId"];
        const injectedFieldId = rowData.id;
        confirm(() => {
            Axios.delete(`/api/blocks/${blockId}/injectedFields/${injectedFieldId}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(injectedFieldDeleteSuccess)
                })
                .catch(error => notify(injectedFieldDeleteError));
        })
    }

    onAddInjectedField(name) {
        const blockId = this.props.match.params["blockId"];
        Axios.post(`/api/blocks/${blockId}/injectedFields`, {name})
            .then(response => {
                this.getDataFromEndpoint();
                this.setState({injectedFieldOpened: false})
                notify(injectedFieldCreatedSuccess)
            })
            .catch(error => notify(injectedFieldCreatedError));
    }

    render() {
        const eventId = this.props.match.params["eventTypeId"];
        const blockId = this.state.block.id;

        if (this.state.fetching)
        return <Page>
            <Grid container justify="center" spacing={24}>
                <CircularProgress size={80} style={{marginTop: 50}}></CircularProgress>
            </Grid>
        </Page>

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
                        <OptionalFieldsList optionalFields={this.state.optionalFields}
                            onAdd={this.onOptionalFieldsAdd}
                            onEdit={this.onOptionalFieldsEdit}
                            onDelete={this.onOptionalFieldsDelete} />
                    </Grid>
                    <Grid item xs={12} hidden={!blockId}>
                        <InjectedFieldList injectedFields={this.state.injectedFields}
                            onAdd={() => this.setState({ injectedFieldOpened: true })}
                            onDelete={this.onDeleteInjectedField} />
                    </Grid>
                </Grid>
            </Grid>
            <InjectedFieldDialogForm open={this.state.injectedFieldOpened}
                onClose={() => this.setState({ injectedFieldOpened: false })}
                onAdd={this.onAddInjectedField}
            />
        </Page>
        )
    }

}

export default withRouter(BlockEditor);