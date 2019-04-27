import * as React from "react";
import propTypes from 'prop-types';
import { CustomMaterialTable } from "../utils/CustomMaterialTable";

const columns = [
    { title: 'Channel Name', field: 'channelName' },
]


const options = {
    actionsColumnIndex: -1,
    columnsButton: true
};


export class ChannelList extends React.Component {

    actions = [{
        icon: 'edit',
        tooltip: 'Edit channel',
        onClick: (event, rowData) => {
            this.props.onEdit(rowData);
        },
    },
    {
        icon: 'delete',
        tooltip: 'Delete channel',
        onClick: (event, rowData) => {
            this.props.onDelete(rowData)
        },
    },
    {
        icon: 'add',
        tooltip: 'Add channel',
        isFreeAction: true,
        onClick: (event) => {
            this.props.onAdd();
        },
    }];


    render() {
        return (<CustomMaterialTable data={this.props.channels}
            columns={columns}
            title="Channels"
            actions={this.actions}
            options={options} />)
    }
}

ChannelList.propTypes = {
    channels: propTypes.arrayOf(propTypes.object).isRequired,
    onEdit: propTypes.func.isRequired,
    onAdd: propTypes.func.isRequired,
    onDelete: propTypes.func.isRequired
}