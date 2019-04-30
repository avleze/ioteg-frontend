import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const variableColumns = [
    { title: 'Variable Name', field: 'name', type: 'string'},
    { title: 'Minimum', field: 'min', type: 'string' },
    { title: 'Maximum', field: 'max', type: 'string' },
    { title: 'Value', field: 'value', type: 'string' },
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class VariableCustomBehaviourList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit variable',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete variable',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add variable',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.variables}
            columns={variableColumns}
            title="Variables"
            actions={this.actions}
            options={options} />)
    }
}

VariableCustomBehaviourList.propTypes = {
    variables: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}