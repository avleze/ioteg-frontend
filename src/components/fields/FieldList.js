import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const fieldColumns = [
    { title: 'Field name', field: 'name', type: 'string'},
    { title: 'Type', field: 'type', type: 'string' },
    { title: 'Quotes', field: 'quotes' , type: 'boolean'}
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class FieldList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit field',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete field',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add field',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.fields}
            columns={fieldColumns}
            title="Fields"
            actions={this.actions}
            options={options} />)
    }
}

FieldList.propTypes = {
    fields: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}