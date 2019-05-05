import * as React from "react";
import { Paper, Grid, Typography, Divider } from "@material-ui/core";
import { withRouter } from 'react-router'
import Page from "./Page";
import Axios from "axios";
import notify from "../lib/notifier";
import confirm from "../lib/confirmation";
import RuleForm from "../components/custom_behaviour/RuleForm";

const ruleCreatedSuccesfully = { content: 'Rule created successfully', variant: 'success' };
const ruleCreatedError = { content: 'Failed when creating the rule', variant: 'error' };

const ruleEditedSuccesfully = { content: 'Rule edited successfully', variant: 'success' };
const ruleEditedError = { content: 'Failed when editing the rule', variant: 'error' };

class RuleEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rule: { id: null },
            errors: {}
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
        this.onRuleSubmit = this.onRuleSubmit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const customBehaviourId = this.props.match.params["customBehaviourId"];
        const ruleId = this.props.match.params["ruleId"];

        if (ruleId) {
            Axios.get(`/api/customBehaviour/${customBehaviourId}/rules/${ruleId}`)
                .then(response => {
                    this.setState({
                        rule: response.data
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

    onRuleSubmit(rule) {
        confirm(() => {
            const customBehaviourId = this.props.match.params["customBehaviourId"];
            const ruleId = this.props.match.params["ruleId"];
            if (ruleId)
                Axios.put(`/api/customBehaviour/${customBehaviourId}/rules/${ruleId}`, rule)
                    .then(response => notify(ruleEditedSuccesfully))
                    .catch(errors => {
                        this.setState({
                            errors: this.getErrors(errors)
                        })
                        notify(ruleEditedError);
                    })
            else
                Axios.post(`/api/customBehaviour/${customBehaviourId}/rules`, rule)
                    .then(response => {
                        this.props.history.goBack();
                        notify(ruleCreatedSuccesfully)
                    })
                    .catch(errors => {
                        this.setState({
                            errors: this.getErrors(errors)
                        })
                        notify(ruleCreatedError)
                    })
        })
    }

    render() {
        const ruleId = this.props.match.params["ruleId"];

        return (<Page>

            <Grid container justify="center" spacing={24}>

                <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">
                            {ruleId ? "Editing" : "New"} Rule {ruleId}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider variant="fullWidth" />
                        <Typography variant="h6">Rule Data</Typography>
                        <Typography hidden={ruleId} gutterBottom>
                            Fill the weight of the rule and the maximum and minimum or the value.
                        </Typography>
                        <Paper style={{ padding: 15 }}>
                            <Grid container>
                                <Grid item xs>
                                    <RuleForm rule={this.state.rule}
                                        key={this.state.rule.id}
                                        onSubmit={this.onRuleSubmit}
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

export default withRouter(RuleEditor);