import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const blockColumns = [
    { title: 'Block name', field: 'name' },
    { title: 'Repetition', field: 'repetition' }
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class BlockList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit block',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete block',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add block',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.blocks}
            columns={blockColumns}
            title="Blocks"
            actions={this.actions}
            options={options} />)
    }
}

BlockList.propTypes = {
    blocks: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}