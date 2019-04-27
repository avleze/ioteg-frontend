import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const optionalFieldsColumns = [
    { title: 'Mandatory', field: 'name' },
    { title: 'Fields', field: 'fields' },
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class OptionalFieldsList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit optional fields',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete optional fields',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add optional fields',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.blocks}
            columns={optionalFieldsColumns}
            title="Optional Fields"
            actions={this.actions}
            options={options} />)
    }
}

OptionalFieldsList.propTypes = {
    optionalfields: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}