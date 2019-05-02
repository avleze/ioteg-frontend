import * as React from 'react';
import { withRouter } from 'react-router';
import { Typography, Grid, Button } from '@material-ui/core';
import Page from './Page';
class ForbiddenPage extends React.Component {

    render() {
        return (
            <Page topBar={false}>
                <Grid container justify="center" spacing={24}>
                    <Grid item xs={8}>
                        <Typography variant="h5" gutterBottom>You are not authorized to view this resource.</Typography>
                        <Button variant="contained" color="primary" fullWidth onClick={() => this.props.history.push('/my-channels')}>GO TO MY CHANNELS</Button>
                    </Grid>
                    
                </Grid>
            </Page>);
    }
}

export default withRouter(ForbiddenPage);