import * as React from "react";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { withRouter } from 'react-router'
import Page from "./Page";
import FieldForm from "../components/fields/FieldForm";
import Axios from "axios";
import notify from "../lib/notifier";

const fieldCreatedSuccesfully = { content: 'Field created successfully', variant: 'success' };
const fieldCreatedError = { content: 'Failed when creating the field', variant: 'error' };

const fieldEditedSuccesfully = { content: 'Field edited successfully', variant: 'success' };
const fieldEditedError = { content: 'Failed when editing the field', variant: 'error' };

class FieldInFieldEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            field: { id: null },
            errors: {}
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
        this.onFieldSubmit = this.onFieldSubmit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const fieldId1 = this.props.match.params["fieldId1"];
        const fieldId2 = this.props.match.params["fieldId2"];

        if (fieldId2)
            Axios.get(`/api/blocks/${fieldId1}/fields/${fieldId2}`)
                .then(response => {
                    this.setState({
                        field: response.data,
                    });
                });
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
        const fieldId1 = this.props.match.params["fieldId1"];
        const fieldId2 = this.props.match.params["fieldId2"];

        if (!fieldId2)
            Axios.post(`/api/fields/${fieldId1}/fields`, field)
                .then(response => notify(fieldCreatedSuccesfully))
                .catch(error => {
                    this.setState({
                        errors: this.getErrors(error)
                    });
                    notify(fieldCreatedError);
                })
        else
            Axios.put(`/api/fields/${fieldId1}/fields/${fieldId2}`, field)
                .then(response => notify(fieldEditedSuccesfully))
                .catch(error => {
                    this.setState({
                        errors: this.getErrors(error)
                    });
                    notify(fieldEditedError)
                })
    }

    render() {
        const fieldId2 = this.props.match.params["fieldId2"];

        return (<Page>

            <Grid container justify="center" spacing={24}>

                <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">
                            {fieldId2 ? "Editing" : "New"} field {fieldId2}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider variant="fullWidth" />
                        <Typography variant="h6">Field Data</Typography>
                        <Typography hidden={fieldId2} gutterBottom>
                            Fill the name of the field, and its type. Once you have selected a type and a generation, the options will be displayed.
                        </Typography>
                        <Typography hidden={fieldId2} gutterBottom>
                            If you have chosen the CustomBehaviour generation, then once you create the field you will be able to
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
                                        allowComplex={false} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>

        </Page >)
    }

}

export default withRouter(FieldInFieldEditor);