import * as React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { CustomMaterialTable } from '../components/utils/CustomMaterialTable';
import { connect } from 'react-redux';
import Axios from 'axios';


const columns = [
    { title: 'Channel Name', field: 'channelName' },
]


export class MyChannelsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channels: []
        }

        this.getDataFromEndpoint = this.getDataFromEndpoint.bind(this);
    }


    async componentDidMount() {
        this.getDataFromEndpoint();
    }

    async getDataFromEndpoint() {
        const userId = this.props.id;
        if (userId)
            await Axios.get(`/api/users/${userId}/channels`).then(response => {
                this.setState({
                    channels: response.data
                })
            })
    }

    render() {
        return (
            <React.Fragment>


                <Grid container justify="center">
                    <Grid item xs={12} md={12} lg={6}>
                        <Paper style={{ padding: 25 }}>
                            <Typography variant="h4" style={{ marginBottom: 10 }}>My channels</Typography>
                            <CustomMaterialTable data={this.state.channels}
                                columns={columns}
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
                                            Axios.delete(`/api/users/${this.props.id}/channels/${rowData.id}`).then(response => {
                                                this.getDataFromEndpoint();
                                            })
                                        },
                                    },
                                ]
                                }
                                options={{
                                    actionsColumnIndex: -1,
                                    columnsButton: true,
                                }}></CustomMaterialTable>
                        </Paper>
                    </Grid>

                </Grid>


            </React.Fragment >)
    }
}

function mapStateToProps(state) {
    return {
        ...state.auth
    }
}

export default connect(mapStateToProps)(MyChannelsPage);