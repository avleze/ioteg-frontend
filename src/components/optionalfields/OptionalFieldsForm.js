import * as React from 'react'
import { Button, Grid, FormControlLabel, Switch } from '@material-ui/core';
import { withRouter } from 'react-router-dom';



class OptionalFieldsForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mandatory: false
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    componentDidMount() {
        if (this.props.optionalFields) {
            this.setState({
                ...this.props.optionalFields
            })
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container spacing={8}>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.mandatory}
                                onChange={this.handleSwitchChange('mandatory')}
                            />
                        }
                        label={'Is mandatory'}
                    />
                    <Grid item container xs={12} justify="flex-end">
                        <Button type="submit" variant="contained" color="primary">SUBMIT</Button>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

export default withRouter(OptionalFieldsForm);