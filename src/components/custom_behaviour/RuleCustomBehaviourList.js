import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const ruleColumns = [
    { title: 'Weight', field: 'weight', type: 'string'},
    { title: 'Minimum', field: 'min', type: 'string' },
    { title: 'Maximum', field: 'max', type: 'string' },
    { title: 'Value', field: 'value', type: 'string' },
    { title: 'Sequence', field: 'sequence', type: 'string' },
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class RuleCustomBehaviourList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit rule',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete rule',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add rule',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.rules}
            columns={ruleColumns}
            title="Rules"
            actions={this.actions}
            options={options} />)
    }
}

RuleCustomBehaviourList.propTypes = {
    rules: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}