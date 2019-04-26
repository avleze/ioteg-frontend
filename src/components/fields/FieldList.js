import * as React from "react";
import { CustomMaterialTable } from "../utils/CustomMaterialTable";
import propTypes from 'prop-types';

const fieldColumns = [
    { title: 'Field name', field: 'name' },
    { title: 'Type', field: 'type' },
    { title: 'Quotes', field: 'quotes' }
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
        return (<CustomMaterialTable data={this.props.blocks}
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