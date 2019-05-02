import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const injectedFieldColumns = [
    { title: 'Name', field: 'name', type: "string" },
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class InjectedFieldList extends React.Component {

    actions = [
    {
        icon: 'delete',
        tooltip: 'Delete injected field',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add injected field',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.injectedFields}
            columns={injectedFieldColumns}
            title="Injected Fields"
            actions={this.actions}
            options={options} />)
    }
}

InjectedFieldList.propTypes = {
    injectedFields: propTypes.arrayOf(propTypes.object).isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}