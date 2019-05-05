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

class FieldInFieldEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        }

        this.onFieldSubmit = this.onFieldSubmit.bind(this);
    }


    onFieldSubmit(field) {
        const fieldId1 = this.props.match.params["fieldId1"];
        const fieldId2 = this.props.match.params["fieldId2"];

        if (!fieldId2)
            Axios.post(`/api/fields/${fieldId1}/fields`, field)
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
            Axios.put(`/api/fields/${fieldId1}/fields/${fieldId2}`, field)
                .then(response => notify(fieldEditedSuccesfully))
                .catch(error => {
                    this.setState({
                        errors: getErrors(error)
                    });
                    notify(fieldEditedError)
                })

    }

    render() {
        const fieldId1 = this.props.match.params["fieldId1"];
        const fieldId2 = this.props.match.params["fieldId2"];
        const getFieldURL = `/api/blocks/${fieldId1}/fields/${fieldId2}`;

        return (<FieldEditor getFieldURL={getFieldURL} onSubmit={this.onFieldSubmit} fieldId={fieldId2} errors={this.state.errors} allowComplex={false} />)
    }

}

export default withRouter(FieldInFieldEditor);