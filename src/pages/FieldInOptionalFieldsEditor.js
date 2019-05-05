import * as React from "react";
import { withRouter } from 'react-router'
import Axios from "axios";
import notify from "../lib/notifier";
import FieldEditor from "./FieldEditor";
import { getErrors } from "../lib/errors";

const fieldCreatedSuccesfully = { content: 'Field created successfully', variant: 'success' };
const fieldCreatedError = { content: 'Failed when creating the field', variant: 'error' };

const fieldEditedSuccesfully = { content: 'Field edited successfully', variant: 'success' };
const fieldEditedError = { content: 'Failed when editing the field', variant: 'error' };


class FieldInOptionalFieldsEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        }
        this.onFieldSubmit = this.onFieldSubmit.bind(this);
    }


    onFieldSubmit(field) {
        const fieldId = this.props.match.params["fieldId"];
        const optionalFieldsId = this.props.match.params["optionalFieldsId"];

        if (!fieldId)
            Axios.post(`/api/optionalFields/${optionalFieldsId}/fields`, field)
                .then(response => {
                    this.props.history.goBack();
                    notify(fieldCreatedSuccesfully)
                })
                .catch(error => {
                    this.setState({
                        errors: getErrors(error)
                    });
                    notify(fieldCreatedError);
                })
        else
            Axios.put(`/api/optionalFields/${optionalFieldsId}/fields/${fieldId}`, field)
                .then(response => notify(fieldEditedSuccesfully))
                .catch(error => {
                    this.setState({
                        errors: getErrors(error)
                    });
                    notify(fieldEditedError)
                })
    }


    render() {
        const fieldId = this.props.match.params["fieldId"];
        const optionalFieldsId = this.props.match.params["optionalFieldsId"];

        const getFieldURL = `/api/optionalFields/${optionalFieldsId}/fields/${fieldId}`;

        return (<FieldEditor getFieldURL={getFieldURL} onSubmit={this.onFieldSubmit} fieldId={fieldId} errors={this.state.errors} allowComplex />)
    }

}

export default withRouter(FieldInOptionalFieldsEditor);