import * as React from "react";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { withRouter } from 'react-router'
import Page from "./Page";
import FieldForm from "../components/fields/FieldForm";
import Axios from "axios";
import notify from "../lib/notifier";
import { FieldList } from "../components/fields/FieldList";
import confirm from "../lib/confirmation";

const fieldCreatedSuccesfully = { content: 'Field created successfully', variant: 'success' };
const fieldCreatedError = { content: 'Failed when creating the field', variant: 'error' };

const fieldEditedSuccesfully = { content: 'Field edited successfully', variant: 'success' };
const fieldEditedError = { content: 'Failed when editing the field', variant: 'error' };

const fieldDeletedSuccessfully = { content: 'Field deleted successfully', variant: 'success' };
const fieldDeletedError = { content: 'Failed when deleting the field', variant: 'error' };


class FieldEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            field: { id: null },
            type: undefined,
            fields: [],
            attributes: [],
            errors: {}
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
        this.onFieldSubmit = this.onFieldSubmit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);

        this.onFieldAdd = this.onFieldAdd.bind(this);
        this.onFieldDelete = this.onFieldDelete.bind(this);
        this.onFieldEdit = this.onFieldEdit.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const fieldId = this.props.match.params["fieldId"];
        const blockId = this.props.match.params["blockId"];

        if (fieldId) {
            Promise.all([Axios.get(`/api/blocks/${blockId}/fields/${fieldId}`),
            Axios.get(`/api/fields/${fieldId}/fields`)])
                .then(responses => {
                    this.setState({
                        field: responses[0].data,
                        type: responses[0].data.type,
                        fields: responses[1].data
                    });
                });
        }


    }

    onChangeType(type) {
        this.setState({
            type: type
        });
    }

    getErrors(error) {
        let errors = {};

        error.response.data["subErrors"].forEach(error => {
            errors[error.field] = error.message;
        });

        return errors;
    }

    onFieldSubmit(field) {
        const fieldId = this.props.match.params["fieldId"];
        const blockId = this.props.match.params["blockId"];

        if (!fieldId)
            Axios.post(`/api/blocks/${blockId}/fields`, field)
                .then(response => notify(fieldCreatedSuccesfully))
                .catch(error => {
                    this.setState({
                        errors: this.getErrors(error)
                    });
                    notify(fieldCreatedError);
                })
        else
            Axios.put(`/api/blocks/${blockId}/fields/${fieldId}`, field)
                .then(response => notify(fieldEditedSuccesfully))
                .catch(error => {
                    this.setState({
                        errors: this.getErrors(error)
                    });
                    notify(fieldEditedError)
                })
    }

    onFieldAdd() {
        const fieldId1 = this.props.match.params["fieldId"];
        this.props.history.push(`/fields/${fieldId1}/fields/new`)
    }

    onFieldDelete(rowData) {
        confirm(() => {
            const fieldId1 = this.props.match.params["fieldId"];
            Axios.delete(`/api/fields/${fieldId1}/fields/${rowData.id}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(fieldDeletedSuccessfully)
                })
                .catch(error => notify(fieldDeletedError));
        })
    }

    onFieldEdit(rowData) {
        const fieldId1 = this.props.match.params["fieldId"];
        this.props.history.push(`/fields/${fieldId1}/fields/edit/${rowData.id}`)
    }

    render() {
        const fieldId = this.props.match.params["fieldId"];


        console.log(!fieldId && this.state.type !== "ComplexType")
        return (<Page>

            <Grid container justify="center" spacing={24}>

                <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">
                            {fieldId ? "Editing" : "New"} field {fieldId}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider variant="fullWidth" />
                        <Typography variant="h6">Field Data</Typography>
                        <Typography hidden={fieldId} gutterBottom>
                            Fill the name of the field, and its type. Once you have selected a type and a generation, the options will be displayed.
                        </Typography>
                        <Typography hidden={fieldId} gutterBottom>
                            If the type is complex or you have chosen the CustomBehaviour generation, then once you create the field you will be able to
                            add the related fields.
                        </Typography>
                        <Paper style={{ padding: 15 }}>
                            <Grid container>
                                <Grid item xs>
                                    <FieldForm field={this.state.field}
                                        key={this.state.field.id}
                                        onSubmit={this.onFieldSubmit}
                                        onChangeType={this.onChangeType}
                                        errors={this.state.errors}
                                        allowComplex />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} hidden={!(fieldId && (this.state.field.type === "ComplexType" || this.state.type === 'ComplexType'))}>
                        <FieldList fields={this.state.fields}
                            onAdd={this.onFieldAdd}
                            onEdit={this.onFieldEdit}
                            onDelete={this.onFieldDelete} />
                    </Grid>

                </Grid>
            </Grid>

        </Page >)
    }

}

export default withRouter(FieldEditor);