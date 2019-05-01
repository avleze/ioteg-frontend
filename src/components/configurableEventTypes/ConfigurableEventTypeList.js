import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const columns = [
    { title: 'Event Name', field: 'eventType.name' },
    { title: 'Delay', field: 'delay' },
    { title: 'Period', field: 'period' },
    { title: 'Unit', field: 'unit' }]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class ConfigurableEventTypeList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit configurable event type',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete configurable event type',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add configurable event type',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    },
    {
        icon: 'cloud_download',
        tooltip: 'Generate as JSON, CSV or XML',
        isFreeAction: false,
        onClick: (event, rowData) => {
            this.props.onGenerate(rowData);
        },
    },
    {
        icon: 'settings_remote',
        tooltip: 'Async generation',
        isFreeAction: false,
        onClick: (event, rowData) => {
            this.props.onGenerateAsync(rowData);
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.configurableEventTypes}
            columns={columns}
            title="Configurable Event Types"
            actions={this.actions}
            options={options} 
            />)
    }
}

ConfigurableEventTypeList.propTypes = {
    configurableEventTypes: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired,
    onGenerate: propTypes.func.isRequired
}