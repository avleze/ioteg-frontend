import * as React from "react";
import { Paper, Grid, Typography, Divider, Button } from "@material-ui/core";
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import { withRouter } from 'react-router'
import Axios from "axios";
import BlockForm from "./BlockForm";
import { FieldList } from "../fields/FieldList";
import { OptionalFieldsList } from "../optionalfields/OptionalFieldsList";
import confirm from "../../lib/confirmation";
import notify from "../../lib/notifier";

const fieldDeleteSuccess = {content: 'Field deleted successfully.'} 
const fieldDeleteError = {content: 'Failed when deleting the field.'} 

class BlockEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            block: {id: null},
            optionalFields: [],
            fields: [], 
            injectedFields: []
        }

        this.onFieldDelete = this.onFieldDelete.bind(this);
    }

    async componentDidMount() {
        const eventId = this.props.match.params["eventTypeId"];
        const blockId = this.props.match.params["blockId"];
        if(blockId)
            await Axios.get(`/api/events/${eventId}/blocks/${blockId}`).then(block => {
                this.setState({
                    block: block.data
                })
            })
    }

    onFieldDelete(rowData) {
        const blockId = this.props.match.params["blockId"];
        const fieldId = rowData.id;
        confirm(() => {
            Axios.delete(`/api/blocks/${blockId}/fields/${fieldId}`)
            .then(response => notify(fieldDeleteSuccess))
            .catch(error => notify(fieldDeleteError));
        })
    }

    render() {
        const eventId = this.props.match.params["eventTypeId"];
        const blockId = this.state.block.id;

        return (<React.Fragment>
            <Paper style={{ padding: 60 }} elevation={5}>

                <Grid container justify="center" spacing={24}>

                    <Grid item container xs={12} md={12} lg={8} xl={5} spacing={24} justify="center">
                        <Grid item xs={12}>
                            <Grid item xs container justify="center">
                                <Grid item xs={4}>
                                    <Button variant="contained" color="primary" onClick={() => this.props.history.goBack()}>
                                        <ChevronLeft /> BACK
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="h5" align="center">
                                        {blockId ? "Editing" : "New"} block {blockId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                </Grid>
                            </Grid>

                            <Divider variant="fullWidth" />
                            <Typography variant="h6">Block Data</Typography>
                            <Typography hidden={blockId} gutterBottom>
                                Fill the name of the block, and its repetition if it is not a header or a footer. Once it is created you will be able to add the related fields.
                            </Typography>
                            <Paper style={{ padding: 15 }}>
                                <Grid container>
                                    <Grid item xs>
                                        <BlockForm eventId={eventId} block={this.state.block} key={blockId}/>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} hidden={!blockId}>
                            <FieldList fields={this.state.fields} 
                                onAdd={this.onFieldAdd}
                                onEdit={this.onFieldEdit}
                                onDelete={this.onFieldDelete}/>
                        </Grid>
                        <Grid item xs={12} hidden={!blockId}>
                            <OptionalFieldsList optionalFields={this.state.optionalFields} />
                        </Grid>
                    </Grid>

                </Grid>

            </Paper>
        </React.Fragment >)
    }

}

export default withRouter(BlockEditor);