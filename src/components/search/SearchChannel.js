import React from 'react';
import { Grid } from '@material-ui/core';
import MaterialAutocomplete from '../autocomplete/material-autocomplete';
import Axios from 'axios';
import SelectDialog from '../configurableEventTypes/SelectDialog';

export default class SearchChannel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            chooseFormatOpened: false,
        }

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onClick(item) {
        this.setState({
            selected: item,
            chooseFormatOpened: true
        })
    }

    onChange(input) {
        Axios.get(`/api/search/events`, {
            params: {
                name: input
            }
        })
            .then(response => {
                this.setState({
                    items: response.data
                })
            })
    }

    render() {
        return (<React.Fragment>
            <Grid container justify="center" spacing={8}>

                <Grid item xs={12} sm={10} lg={6}>
                    <img alt="The logo of IoT-TEG" src="/logo.png" style={{ margin: "auto", display: "block", width: 'calc(70% - 150px)', maxWidth: 300, minWidth: 125 }} />
                    <div style={{ marginTop: 50 }}></div>
                    <MaterialAutocomplete items={this.state.items} onChange={this.onChange} onClick={this.onClick} placeholder="Search for events..." />
                </Grid>

            </Grid>
            <SelectDialog open={this.state.chooseFormatOpened} onClose={(item) => {
                if (item)
                    Axios.get(`/api/generation/${this.state.selected.id}`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': `application/${item}`.toLowerCase()
                            }
                        })
                        .then(response => {
                            let data = response.data;
                            if (item === 'JSON')
                                data = JSON.stringify(data, null, 2);

                            const url = window.URL.createObjectURL(new Blob([data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', this.state.selected.eventType.name + `.${item}`.toLowerCase());
                            document.body.appendChild(link);
                            link.click();
                        });

                this.setState({
                    chooseFormatOpened: false
                })
            }} />
        </React.Fragment >)
    }
}