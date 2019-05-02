import * as React from 'react'
import { TextField, Button, Grid, FormHelperText, MenuItem, FormControlLabel, Switch } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import notify from '../../lib/notifier';
import confirmate from '../../lib/confirmation';


const formFields = [
    {
        id: "eventName",
        name: "name",
        type: "text",
        label: "Event Name",
        errorField: "eventType.name",
        xs: 12,
        md: 12,
        lg: 12
    },
    {
        id: "delay",
        name: "delay",
        type: "number",
        label: "Delay",
        errorField: "delay",
        xs: 12,
        md: 12,
        lg: 4
    },
    {
        id: "period",
        name: "period",
        type: "number",
        label: "Period",
        errorField: "period",
        xs: 12,
        md: 12,
        lg: 4
    },
    {
        id: "unit",
        name: "unit",
        type: "select",
        label: "Unit",
        errorField: "unit",
        items: ["NANOSECONDS", "MICROSECONDS", "MILLISECONDS", "SECONDS", "MINUTES", "HOURS", "DAYS"],
        xs: 12,
        md: 12,
        lg: 4
    },
    {
        id: "eventPublicity",
        name: "isPublic",
        type: "switch",
        label: "Is public",
        errorField: "eventType.isPublic",
        xs: 12,
        md: 12,
        lg: 12
    },
]

const successCreateNotification = { content: 'Configurable event type created successfully', variant: "success" };
const errorCreateNotification = { content: 'Failed when creating configurable event type.', variant: "error" };

const successEditNotification = { content: 'Configurable event type edited successfully', variant: "success" };
const errorEditNotification = { content: 'Failed when editing configurable event type.', variant: "error" };

class ConfigurableEventTypeForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            isPublic: false,
            delay: 0,
            period: "",
            unit: "SECONDS",
            errors: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    componentDidMount() {
        if (this.props.id)
            Axios.get(`/api/channels/1/configurableEventTypes/${this.props.id}`).then(async configurableEventType => {
                this.setState({
                    name: configurableEventType.data.eventType.name,
                    isPublic: configurableEventType.data.eventType.isPublic,
                    ...configurableEventType.data
                });
            })
    }

    onSubmit(e) {
        e.preventDefault();

        confirmate(() => {
            let configurableEventType = {
                eventType: {
                    name: this.state.name,
                    isPublic: this.state.isPublic
                },
                delay: this.state.delay,
                period: this.state.period,
                unit: this.state.unit
            }

            if (this.props.id) {
                configurableEventType["id"] = this.props.id;
                configurableEventType["eventType.id"] = this.props.id;
                Axios.put(`/api/channels/1/configurableEventTypes/${this.props.id}`, configurableEventType)
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
                Axios.post(`/api/channels/${this.props.channelId}/configurableEventTypes`, configurableEventType)
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
                            if (formField.type === 'switch') {
                                return <Grid item xs={formField.xs} md={formField.md} lg={formField.lg} key={key}><FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state[formField.name] ? this.state[formField.name] : false}
                                            onChange={this.handleSwitchChange(formField.name)}
                                        />
                                    }
                                    label={formField.label}
                                /></Grid>
                            }
                            else
                                return <Grid item xs={formField.xs} md={formField.md} lg={formField.lg} key={key}>
                                    <TextField id={formField.id}
                                        select={formField.type === "select"}
                                        label={formField.label}
                                        variant="outlined"
                                        name={formField.name}
                                        type={formField.type}
                                        value={this.state[formField.name]}
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

export default withRouter(ConfigurableEventTypeForm);