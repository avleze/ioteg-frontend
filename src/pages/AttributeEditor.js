import * as React from "react";
import { Paper, Grid, Typography, Divider, CircularProgress } from "@material-ui/core";
import { withRouter } from 'react-router'
import Page from "./Page";
import Axios from "axios";
import notify from "../lib/notifier";
import confirm from "../lib/confirmation";
import AttributeForm from "../components/attributes/AttributeForm";

const attributeCreatedSuccesfully = { content: 'Attribute created successfully', variant: 'success' };
const attributeCreatedError = { content: 'Failed when creating the attribute', variant: 'error' };

const attributeEditedSuccesfully = { content: 'Field edited successfully', variant: 'success' };
const attributeEditedError = { content: 'Failed when editing the attribute', variant: 'error' };

class AttributeEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            attribute: { id: null },
            type: undefined,
            errors: {},
            fetching: true,
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
        this.onAttributeSubmit = this.onAttributeSubmit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const fieldId = this.props.match.params["fieldId"];
        const attributeId = this.props.match.params["attributeId"];

        if (attributeId) {
            this.setState({
                fetching: true
            })
            Axios.get(`/api/fields/${fieldId}/attributes/${attributeId}`)
                .then(response => {
                    this.setState({
                        attribute: response.data,
                        fetching: false
                    });
                });
        } else  
        this.setState({
            fetching: false
        })


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

    onAttributeSubmit(attribute) {
        confirm(() => {
            const fieldId = this.props.match.params["fieldId"];
            const attributeId = this.props.match.params["attributeId"];

            if (!attributeId)
                Axios.post(`/api/fields/${fieldId}/attributes`, attribute)
                    .then(response => {
                        this.props.history.goBack();
                        notify(attributeCreatedSuccesfully)
                    })
                    .catch(error => {
                        this.setState({
                            errors: this.getErrors(error)
                        });
                        notify(attributeCreatedError);
                    })
            else
                Axios.put(`/api/fields/${fieldId}/attributes/${attributeId}`, attribute)
                    .then(response => {
                        this.setState({
                            errors: {}
                        });
                        notify(attributeEditedSuccesfully)
                    })
                    .catch(error => {
                        this.setState({
                            errors: this.getErrors(error)
                        });
                        notify(attributeEditedError)
                    })
        })
    }

    render() {
        const attributeId = this.props.match.params["attributeId"];

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
                        <Typography variant="h5" align="center">
                            {attributeId ? "Editing" : "New"} Attribute {attributeId}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider variant="fullWidth" />
                        <Typography variant="h6">Attribute Data</Typography>
                        <Typography hidden={attributeId} gutterBottom>
                            Fill type of the attribute. Once you have selected a type and a generation, the options will be displayed.
                        </Typography>
                        <Paper style={{ padding: 15 }}>
                            <Grid container>
                                <Grid item xs>
                                    <AttributeForm attribute={this.state.attribute}
                                        key={this.state.attribute.id}
                                        onSubmit={this.onAttributeSubmit}
                                        onChangeType={this.onChangeType}
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

export default withRouter(AttributeEditor);