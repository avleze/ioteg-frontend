import React from 'react';
import { TextField, Grid, Button } from '@material-ui/core';

export default class SearchChannel extends React.Component {



    render() {
        return (<React.Fragment>
            <Grid container justify="center" spacing={8}>

                <Grid item xs={12} sm={10} lg={6}>
                    <img alt="The logo of IoT-TEG" src="/logo.png" style={{ margin: "auto", display: "block", width: 'calc(70% - 150px)', maxWidth: 300, minWidth: 125 }} />
                    <TextField
                        id="standard-full-width"
                        style={{ marginTop: 50 }}
                        placeholder="Search for events"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Grid container spacing={8} alignContent="center" justify="center">
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" fullWidth>Create new channel</Button>
                        </Grid>
                        {/* <Grid item xs={12} sm={6}>
                            <input
                                accept="application/json"
                                id="import"
                                type="file"
                                style={{display:"none"}}
                            />
                            <label htmlFor="import">
                                <Button variant="contained" component="span" type="file" color="primary" fullWidth>Import from file</Button>
                            </label>
                    </Grid> */}
                    </Grid>
                </Grid>

            </Grid>
        </React.Fragment >)
    }
}