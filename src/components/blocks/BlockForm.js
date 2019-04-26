import * as React from 'react'
import { TextField, Button, Grid, FormHelperText, MenuItem } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import notify from '../../lib/notifier';
import confirmate from '../../lib/confirmation';
import propTypes from 'prop-types';

const formFields = [
    {
        id: "name",
        name: "name",
        type: "text",
        label: "Block name",
        errorField: "name",
        xs: 12,
        md: 12,
        lg: 6
    },
    {
        id: "repetition",
        name: "repetition",
        type: "number",
        label: "Repetition",
        errorField: "repetition",
        xs: 12,
        md: 12,
        lg: 6
    }
]

const successCreateNotification = { content: 'Block created successfully', variant: "success" };
const errorCreateNotification = { content: 'Failed when creating the block.', variant: "error" };

const successEditNotification = { content: 'Block edited successfully', variant: "success" };
const errorEditNotification = { content: 'Failed when editing the block.', variant: "error" };

class BlockForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.block.name || "",
            repetition: props.block.repetition || null,
            errors: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount() {
        console.log(this.props.block)
        if (this.props.block)
            this.setState({
                ...this.props.block
            })
    }

    onSubmit(e) {
        e.preventDefault();

        const eventId = this.props.eventId;
        const blockId = this.state.id;

        let block = {
            name: this.state.name,
            repetition: this.state.repetition
        }

        confirmate(() => {

            if (this.state.id) {
                Axios.put(`/api/events/${blockId}/blocks/${blockId}`, block)
                    .then(response => notify(successEditNotification))
                    .catch(error => {
                        let errors = {};

                        error.response.data["subErrors"].forEach(error => {
                            errors[error.field] = error.message;
                        });

                        this.setState({
                            errors: errors
                        });
                        notify(errorEditNotification);
                    });
            } else {
                Axios.post(`/api/events/${eventId}/blocks`, block)
                    .then(response => notify(successCreateNotification))
                    .catch(error => {
                        let errors = {};

                        error.response.data["subErrors"].forEach(error => {
                            errors[error.field] = error.message;
                        });

                        this.setState({
                            errors: errors
                        });
                        notify(errorCreateNotification);
                    });
            }

        })
    }

    onFieldChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            errors: {}
        });
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container spacing={8}>

                    {
                        formFields.map((formField, key) => {
                            return <Grid item xs={formField.xs} md={formField.md} lg={formField.lg} key={key}>
                                <TextField id={formField.id}
                                    select={formField.type === "select"}
                                    label={formField.label}
                                    variant="outlined"
                                    name={formField.name}
                                    type={formField.type}
                                    value={this.state[formField.name] ? this.state[formField.name] : ""}
                                    onChange={this.onFieldChange}
                                    fullWidth
                                    error={this.state.errors[formField.errorField]}>
                                    {
                                        (formField.items || []).map((item) =>
                                            <MenuItem value={item} key={item}>
                                                {item}
                                            </MenuItem>)
                                    }
                                </TextField>
                                <FormHelperText error hidden={!this.state.errors[formField.errorField]}>{this.state.errors[formField.errorField]}</FormHelperText>
                            </Grid>
                        })
                    }

                    <Grid item container xs={12} justify="flex-end">
                        <Button type="submit" variant="contained" color="primary">SUBMIT</Button>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

BlockForm.propTypes = {
    eventId: propTypes.string.isRequired,
    block: propTypes.object
}

export default withRouter(BlockForm);