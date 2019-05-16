import * as React from "react";
import { Paper, Grid, Typography, Divider, CircularProgress } from "@material-ui/core";
import { withRouter } from 'react-router'
import Page from "./Page";
import FieldForm from "../components/fields/FieldForm";
import Axios from "axios";
import notify from "../lib/notifier";
import { FieldList } from "../components/fields/FieldList";
import confirm from "../lib/confirmation";
import { AttributeList } from "../components/attributes/AttributesList";
import { VariableCustomBehaviourList } from "../components/custom_behaviour/VariableCustomBehaviourList.1";
import { RuleCustomBehaviourList } from "../components/custom_behaviour/RuleCustomBehaviourList";
import _ from 'lodash';

const fieldDeletedSuccessfully = { content: 'Field deleted successfully', variant: 'success' };
const fieldDeletedError = { content: 'Failed when deleting the field', variant: 'error' };

const attributeDeletedSuccessfully = { content: 'Attribute deleted successfully', variant: 'success' };
const attributeDeletedError = { content: 'Failed when deleting the attribute', variant: 'error' };

const variableDeletedSuccessfully = { content: 'Variable deleted successfully', variant: 'success' };
const variableDeletedError = { content: 'Failed when deleting the variable', variant: 'error' };

const ruleDeletedSuccessfully = { content: 'Rule deleted successfully', variant: 'success' };
const ruleDeletedError = { content: 'Failed when deleting the rule', variant: 'error' };

class FieldEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            field: { id: null },
            type: undefined,
            generationType: undefined,
            fields: [],
            attributes: [],
            rules: [],
            variables: [],
            errors: {},
            fetching: true
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
        this.onFieldSubmit = this.onFieldSubmit.bind(this);
        this.onChangeType = this.onChangeType.bind(this);
        this.onChangeGenerationType = this.onChangeGenerationType.bind(this);

        this.onFieldAdd = this.onFieldAdd.bind(this);
        this.onFieldDelete = this.onFieldDelete.bind(this);
        this.onFieldEdit = this.onFieldEdit.bind(this);

        this.onAttributeAdd = this.onAttributeAdd.bind(this);
        this.onAttributeDelete = this.onAttributeDelete.bind(this);
        this.onAttributeEdit = this.onAttributeEdit.bind(this);

        this.onVariableAdd = this.onVariableAdd.bind(this);
        this.onVariableDelete = this.onVariableDelete.bind(this);
        this.onVariableEdit = this.onVariableEdit.bind(this);

        this.onRuleAdd = this.onRuleAdd.bind(this);
        this.onRuleDelete = this.onRuleDelete.bind(this);
        this.onRuleEdit = this.onRuleEdit.bind(this);
    }

    async componentDidMount() {
        await this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const fieldId = this.props.fieldId

        if (fieldId) {
            this.setState({
                fetching: true
            })
            Promise.all([Axios.get(this.props.getFieldURL),
            Axios.get(`/api/fields/${fieldId}/fields`),
            Axios.get(`/api/fields/${fieldId}/attributes`)])
                .then(responses => {
                    this.setState({
                        field: responses[0].data,
                        type: responses[0].data.type,
                        generationType: responses[0].data.generationType,
                        fields: responses[1].data,
                        attributes: responses[2].data
                    });

                    if (responses[0].data.generationType === 'CustomBehaviour')
                        Promise.all([Axios.get(`/api/customBehaviour/${responses[0].data.customBehaviour.id}/variables`),
                        Axios.get(`/api/customBehaviour/${responses[0].data.customBehaviour.id}/rules`)])
                            .then(responses => {
                                this.setState({
                                    variables: responses[0].data,
                                    rules: responses[1].data,
                                    fetching: false,
                                });
                            })
                    else
                        this.setState({
                            fetching: false,
                        })
                });
        }
        else
            this.setState({
                fetching: false
            })


    }

    onChangeType(type) {
        this.setState({
            type: type
        });
    }

    onChangeGenerationType(generationType) {
        this.setState({
            generationType: generationType
        });
    }

    onFieldSubmit(field) {
        this.props.onSubmit(field);
    }

    onFieldAdd() {
        const fieldId1 = this.props.fieldId;
        this.props.history.push(`/fields/${fieldId1}/fields/new`)
    }

    onFieldDelete(rowData) {
        confirm(() => {
            const fieldId1 = this.props.fieldId;
            Axios.delete(`/api/fields/${fieldId1}/fields/${rowData.id}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(fieldDeletedSuccessfully)
                })
                .catch(error => notify(fieldDeletedError));
        })
    }

    onFieldEdit(rowData) {
        const fieldId1 = this.props.fieldId;
        this.props.history.push(`/fields/${fieldId1}/fields/edit/${rowData.id}`)
    }

    onAttributeAdd() {
        const fieldId = this.props.fieldId;
        this.props.history.push(`/fields/${fieldId}/attributes/new`)
    }

    onAttributeDelete(rowData) {
        confirm(() => {
            const fieldId = this.props.fieldId;
            Axios.delete(`/api/fields/${fieldId}/attributes/${rowData.id}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(attributeDeletedSuccessfully)
                })
                .catch(error => notify(attributeDeletedError));
        })
    }

    onAttributeEdit(rowData) {
        const fieldId = this.props.fieldId;
        this.props.history.push(`/fields/${fieldId}/attributes/edit/${rowData.id}`);
    }


    onVariableAdd() {
        const customBehaviourId = _.get(this.state, 'field.customBehaviour.id');
        this.props.history.push(`/customBehaviour/${customBehaviourId}/variables/new`)
    }

    onVariableDelete(rowData) {
        confirm(() => {
            const customBehaviourId = _.get(this.state, 'field.customBehaviour.id');
            const variableId = rowData.id;

            Axios.delete(`/api/customBehaviour/${customBehaviourId}/variables/${variableId}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(variableDeletedSuccessfully)
                }).catch(error => notify(variableDeletedError))
        })
    }

    onVariableEdit(rowData) {
        const customBehaviourId = _.get(this.state, 'field.customBehaviour.id');
        this.props.history.push(`/customBehaviour/${customBehaviourId}/variables/edit/${rowData.id}`);
    }

    onRuleAdd() {
        const customBehaviourId = _.get(this.state, 'field.customBehaviour.id');
        this.props.history.push(`/customBehaviour/${customBehaviourId}/rules/new`)
    }

    onRuleDelete(rowData) {
        confirm(() => {
            const customBehaviourId = _.get(this.state, 'field.customBehaviour.id');
            const ruleId = rowData.id;

            Axios.delete(`/api/customBehaviour/${customBehaviourId}/rules/${ruleId}`)
                .then(response => {
                    this.getDataFromEndpoint();
                    notify(ruleDeletedSuccessfully)
                })
                .catch(error => notify(ruleDeletedError))
        })
    }

    onRuleEdit(rowData) {
        const customBehaviourId = _.get(this.state, 'field.customBehaviour.id');
        const ruleId = rowData.id;
        this.props.history.push(`/customBehaviour/${customBehaviourId}/rules/edit/${ruleId}`)
    }

    render() {
        const fieldId = this.props.fieldId;
        const customBehaviourId = _.get(this.state, 'field.customBehaviour.id');

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
                                        onChangeGenerationType={this.onChangeGenerationType}
                                        errors={this.props.errors}
                                        allowComplex={this.props.allowComplex} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} hidden={!(fieldId && this.state.type === "ComplexType")}>
                        <FieldList fields={this.state.fields}
                            onAdd={this.onFieldAdd}
                            onEdit={this.onFieldEdit}
                            onDelete={this.onFieldDelete} />
                    </Grid>
                    <Grid item xs={12} hidden={!(fieldId && this.state.type === "ComplexType")}>
                        <AttributeList attributes={this.state.attributes}
                            onAdd={this.onAttributeAdd}
                            onEdit={this.onAttributeEdit}
                            onDelete={this.onAttributeDelete} />
                    </Grid>
                    <Grid item xs={12} hidden={!(customBehaviourId && this.state.generationType === "CustomBehaviour")}>
                        <VariableCustomBehaviourList variables={this.state.variables}
                            onAdd={this.onVariableAdd}
                            onEdit={this.onVariableEdit}
                            onDelete={this.onVariableDelete} />
                    </Grid>
                    <Grid item xs={12} hidden={!(customBehaviourId && this.state.generationType === "CustomBehaviour")}>
                        <RuleCustomBehaviourList rules={this.state.rules}
                            onAdd={this.onRuleAdd}
                            onEdit={this.onRuleEdit}
                            onDelete={this.onRuleDelete} />
                    </Grid>
                </Grid>
            </Grid>

        </Page >)
    }

}


export default withRouter(FieldEditor);