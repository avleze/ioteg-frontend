import * as React from "react";
import { Paper, Grid, Typography, Divider, CircularProgress } from "@material-ui/core";
import { withRouter } from 'react-router'
import Axios from "axios";
import { FieldList } from "../components/fields/FieldList";
import confirm from "../lib/confirmation";
import notify from "../lib/notifier";
import Page from "./Page";
import OptionalFieldsForm from "../components/optionalfields/OptionalFieldsForm";

const fieldDeleteSuccess = { content: 'Field deleted successfully.', variant: 'success'}
const fieldDeleteError = { content: 'Failed when deleting the field.', variant: 'error'}

const optionalFieldsCreatedSuccesfully = { content: 'OptionalFields created successfully', variant: 'success' };
const optionalFieldsCreatedError = { content: 'Failed when creating the OptionalFields', variant: 'error' };

const optionalFieldsEditedSuccesfully = { content: 'OptionalFields edited successfully', variant: 'success' };
const optionalFieldsEditedError = { content: 'Failed when editing the OptionalFields', variant: 'error' };

class OptionalFieldsEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optionalFields: { id: null },
            fields: [],
            fetching: true,
        }

        this.onFieldDelete = this.onFieldDelete.bind(this);
        this.onFieldAdd = this.onFieldAdd.bind(this);
        this.onFieldEdit = this.onFieldEdit.bind(this);

        this.onOptionalFieldsSubmit = this.onOptionalFieldsSubmit.bind(this);

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const blockId = this.props.match.params["blockId"];
        const optionalFieldsId = this.props.match.params["optionalFieldsId"];
        if (optionalFieldsId) {
            this.setState({fetching: true})
            Promise.all([Axios.get(`/api/blocks/${blockId}/optionalFields/${optionalFieldsId}`),
            Axios.get(`/api/optionalFields/${optionalFieldsId}/fields`)])
                .then(responses => {
                    this.setState({
                        fields: responses[1].data,
                        optionalFields: responses[0].data,
                        fetching: false
                    })
                })
        } else
         this.setState({
             fetching: false
         })
    }

    getErrors(error) {
        let errors = {};

        error.response.data["subErrors"].forEach(error => {
            errors[error.field] = error.message;
        });

        return errors;
    }


    onOptionalFieldsSubmit(optionalFields) {
        confirm(() => {
            const blockId = this.props.match.params["blockId"];
            const optionalFieldsId = this.props.match.params["optionalFieldsId"];
            if (optionalFieldsId)
                Axios.put(`/api/blocks/${blockId}/optionalFields/${optionalFieldsId}`, optionalFields)
                    .then(response => {
                        this.getDataFromEndpoint();
                        notify(optionalFieldsEditedSuccesfully)
                    })
                    .catch(errors => {
                        this.setState({
                            errors: this.getErrors(errors)
                        })
                        notify(optionalFieldsEditedError)
                    })
            else
                Axios.post(`/api/blocks/${blockId}/optionalFields`, optionalFields)
                    .then(response => {
                        this.props.history.goBack();
                        notify(optionalFieldsCreatedSuccesfully)
                    })
                    .catch(errors => {
                        this.setState({
                            errors: this.getErrors(errors)
                        })
                        notify(optionalFieldsCreatedError)
                    })
        })

    }

    onFieldAdd() {
        const optionalFieldsId = this.props.match.params["optionalFieldsId"];
        this.props.history.push(`/optionalFields/${optionalFieldsId}/fields/new`);
    }

    onFieldEdit(rowData) {
        const optionalFieldsId = this.props.match.params["optionalFieldsId"];
        const fieldId = rowData.id;
        this.props.history.push(`/optionalFields/${optionalFieldsId}/fields/edit/${fieldId}`);
    }

    onFieldDelete(rowData) {
        const optionalFieldsId = this.props.match.params["optionalFieldsId"];
        const fieldId = rowData.id;
        confirm(() => {
            Axios.delete(`/api/optionalFields/${optionalFieldsId}/fields/${fieldId}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(fieldDeleteSuccess)
                })
                .catch(error => notify(fieldDeleteError));
        })
    }

    render() {
        const optionalFieldsId = this.props.match.params["optionalFieldsId"];

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
                                {optionalFieldsId ? "Editing" : "New"} OptionalFields {optionalFieldsId}
                            </Typography>
                        </Grid>

                        <Divider variant="fullWidth" />
                        <Typography variant="h6">OptionalFields Data</Typography>
                        <Typography hidden={optionalFieldsId} gutterBottom>
                            Decide if this OptionalFields is mandatory or not. Once it is created you will be able to add the related fields.
                        </Typography>
                        <Paper style={{ padding: 15 }}>
                            <Grid container>
                                <Grid item xs>
                                    <OptionalFieldsForm optionalFields={this.state.optionalFields}
                                        key={this.state.optionalFields.id}
                                        onSubmit={this.onOptionalFieldsSubmit} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} hidden={!optionalFieldsId}>
                        <FieldList fields={this.state.fields}
                            onAdd={this.onFieldAdd}
                            onEdit={this.onFieldEdit}
                            onDelete={this.onFieldDelete} />
                    </Grid>
                </Grid>
            </Grid>
        </Page>
        )
    }

}

export default withRouter(OptionalFieldsEditor);