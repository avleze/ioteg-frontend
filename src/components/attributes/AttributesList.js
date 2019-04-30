import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const attributeColumns = [
    { title: 'Type', field: 'type', type: 'string' },
    { title: 'Generation', field: 'generationType', type: 'string' },
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class AttributeList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit attribute',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete attribute',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add attribute',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.attributes}
            columns={attributeColumns}
            title="Attributes"
            actions={this.actions}
            options={options} />)
    }
}

AttributeList.propTypes = {
    attributes: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}