import * as React from "react";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { withRouter } from 'react-router'
import Page from "./Page";
import Axios from "axios";
import notify from "../lib/notifier";
import confirm from "../lib/confirmation";
import VariableForm from "../components/custom_behaviour/VariableForm";

const variableCreatedSuccesfully = { content: 'Variable created successfully', variant: 'success' };
const variableCreatedError = { content: 'Failed when creating the variable', variant: 'error' };

const variableEditedSuccesfully = { content: 'Variable edited successfully', variant: 'success' };
const variableEditedError = { content: 'Failed when editing the variable', variant: 'error' };

class VariableEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            variable: { id: null },
            errors: {}
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
        this.onVariableSubmit = this.onVariableSubmit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const customBehaviourId = this.props.match.params["customBehaviourId"];
        const variableId = this.props.match.params["variableId"];

        if (variableId) {
            Axios.get(`/api/customBehaviour/${customBehaviourId}/variables/${variableId}`)
                .then(response => {
                    this.setState({
                        variable: response.data
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

    onVariableSubmit(variable) {
        confirm(() => {
            const customBehaviourId = this.props.match.params["customBehaviourId"];
            const variableId = this.props.match.params["variableId"];
            if (variableId)
                Axios.put(`/api/customBehaviour/${customBehaviourId}/variables/${variableId}`, variable)
                    .then(response => notify(variableEditedSuccesfully))
                    .catch(errors => {
                        this.setState({
                            errors: this.getErrors(errors)
                        })
                        notify(variableEditedError);
                    })
            else
                Axios.post(`/api/customBehaviour/${customBehaviourId}/variables`, variable)
                    .then(response => notify(variableCreatedSuccesfully))
                    .catch(errors => {
                        this.setState({
                            errors: this.getErrors(errors)
                        })
                        notify(variableCreatedError)
                    })
        })
    }

    render() {
        const variableId = this.props.match.params["variableId"];

        return (<Page>

            <Grid container justify="center" spacing={24}>

                <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">
                            {variableId ? "Editing" : "New"} Variable {variableId}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider variant="fullWidth" />
                        <Typography variant="h6">Variable Data</Typography>
                        <Typography hidden={variableId} gutterBottom>
                            Fill the name of the variable and the maximum and minimum or the value.
                        </Typography>
                        <Paper style={{ padding: 15 }}>
                            <Grid container>
                                <Grid item xs>
                                    <VariableForm variable={this.state.variable}
                                        key={this.state.variable.id}
                                        onSubmit={this.onVariableSubmit}
                                        errors={this.state.errors}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                </Grid>
            </Grid>

        </Page >)
    }

}

export default withRouter(VariableEditor);