import * as React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { CustomMaterialTable } from '../utils/CustomMaterialTable';
import jwt_decode from 'jwt-decode';

export class MyChannelsView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channels: []
        }
    }


    componentDidMount() {
        console.log(jwt_decode(localStorage.getItem('token').slice(7)));
    }

    render() {
        return (
            <React.Fragment>


                <Grid container justify="center">
                    <Grid item xs={12} md={12} lg={6}>
                        <Paper style={{ padding: 25 }}>
                            <Typography variant="h4" style={{marginBottom: 10}}>My channels</Typography>
                            <CustomMaterialTable data={
                                [
                                    { id: 8, name: "smartHome", events: "fridgeOpened, roomTemperature" },
                                    { name: "antonioChannel", events: "duchaEvent, irMedicoEvent" },
                                    { name: "vacuumChannel", events: "cleaningMierdaEvent" }]}
                                columns={[{
                                    title: "Channel Name", field: "name"
                                },
                                {
                                    title: "Event Types in channel", field: "events"
                                }]}
                                title="Channels"
                                actions={[
                                    {
                                        icon: 'edit',
                                        tooltip: 'Edit channel',
                                        onClick: (event, rowData) => {
                                            alert('You clicked channel ' + JSON.stringify(rowData))
                                        },
                                    },
                                    {
                                        icon: 'delete',
                                        tooltip: 'Delete channel',
                                        onClick: (event, rowData) => {
                                            alert('You clicked channel ' + rowData.name)
                                        },
                                    },
                                ]
                                }
                                options={{
                                    actionsColumnIndex: -1,
                                    columnsButton: true,
                                }}
                            />
                        </Paper>
                    </Grid>

                </Grid>


            </React.Fragment >)
    }
}