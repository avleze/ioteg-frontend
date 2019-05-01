import React from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent, DialogActions, Typography, Button, Paper, TextField, Tab, Tabs, AppBar } from '@material-ui/core';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Stop from '@material-ui/icons/Stop';
import mqtt from 'mqtt';
import { write } from 'fs';
import Axios from 'axios';

export default class AsyncGenerationDialog extends React.Component {

    constructor(props) {
        super(props);
        var client = mqtt.connect("mqtt://192.168.1.48:9001", { username: "admin", password: "admin" })

        client.on('message', (topic, message) => this.writeData(topic, message))

        this.state = {
            client: client,
            tab: 0
        }

        this.writeData = this.writeData.bind(this);
        this.handleControl = this.handleControl.bind(this);
    }

    writeData(topic, message) {
        if (topic.includes('json'))
            this.setState({
                dataJSON: message.toString(),
            })
        if (topic.includes('xml'))
            this.setState({
                dataXML: message.toString(),
            })
        if (topic.includes('csv'))
            this.setState({
                dataCSV: message.toString(),
            })
    }

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
        let topic = (this.props.topic || "").replace("<format>", "json");
        this.state.client.unsubscribe(topic);
        topic = (this.props.topic || "").replace("<format>", "csv");
        this.state.client.unsubscribe(topic);
        topic = (this.props.topic || "").replace("<format>", "xml");
        this.state.client.unsubscribe(topic);

    };

    handleListItemClick = value => {
        this.props.onClose(value);
    };

    componentDidMount() {
        let topic = (this.props.topic || "").replace("<format>", "json");
        this.state.client.subscribe(topic);
        topic = (this.props.topic || "").replace("<format>", "csv");
        this.state.client.subscribe(topic);
        topic = (this.props.topic || "").replace("<format>", "xml");
        this.state.client.subscribe(topic);
    }

    handleControl(action) {
        if(action === 'start') {
            let topic = (this.props.topic || "").replace("<format>", "json");
            this.state.client.subscribe(topic);
            topic = (this.props.topic || "").replace("<format>", "csv");
            this.state.client.subscribe(topic);
            topic = (this.props.topic || "").replace("<format>", "xml");
            this.state.client.subscribe(topic);
        }

        Axios.post(`/api/generation/channel/${this.props.channelId}/event/${this.props.eventId}/${action}`);
    }

    render() {
        const tab = this.state.tab;
        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.props.open} maxWidth="md" fullWidth>
                <DialogTitle id="simple-dialog-title" >Async Generation Manager</DialogTitle>
                <DialogContent>
                    <Typography>This topic allows you to connect with the MQTT broker.</Typography>
                    <TextField label="Topic" variant="filled" defaultValue={this.props.topic} fullWidth />

                    <AppBar position="static">
                        <Tabs value={this.state.tab} onChange={(event, value) => this.setState({ tab: value })}>
                            <Tab label="XML" />
                            <Tab label="JSON" />
                            <Tab label="CSV" />
                        </Tabs>
                    </AppBar>
                    <Paper style={{padding: 20}}>
                        <code style={{ width: "100%", whiteSpace: "pre-wrap"}} hidden={tab !== 0}>
                            {this.state.dataXML}
                        </code>

                        <code style={{ width: "100%", whiteSpace: "pre-wrap"}} hidden={tab !== 1}>
                            {this.state.dataJSON}
                        </code>

                        <code style={{ width: "100%", whiteSpace: "pre-wrap"}} hidden={tab !== 2}>
                            {this.state.dataCSV}
                        </code>
                    </Paper>


                </DialogContent>
                <DialogActions>
                    <Button variant="text" fullWidth onClick={() => this.handleControl('stop')}>
                        Stop <Stop />
                    </Button>
                    <Button variant="text" fullWidth onClick={() => this.handleControl('start')}>
                        Play <PlayArrow />
                    </Button>
                </DialogActions>
            </Dialog >
        );
    }
}

AsyncGenerationDialog.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    topic: PropTypes.string,
    selectedValue: PropTypes.string,
};