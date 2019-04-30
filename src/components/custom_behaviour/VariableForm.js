import * as React from 'react'
import { TextField, Button, Grid, FormHelperText, MenuItem } from '@material-ui/core';
import _ from 'lodash';


const formFields = [
    {
        id: "name",
        name: "name",
        type: "text",
        label: "Variable Name",
        errorField: "name",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "min",
        name: "min",
        type: "text",
        label: "Minimum",
        errorField: "min",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "max",
        name: "max",
        type: "text",
        label: "Maximum",
        errorField: "max",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "value",
        name: "value",
        type: "text",
        label: "Value",
        errorField: "value",
        xs: 12,
        md: 6,
        lg: 6
    },
]


export default class VariableForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            min: null,
            max: null,
            value: null
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount() {
        if (this.props.variable) {
            this.setState({
                ...this.props.variable
            })
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
    }

    onFieldChange(e) {
        let value = {
            errors: {}
        }
        _.set(value, e.target.name, e.target.value)

        this.setState({
            ...value
        });
    }

    renderFields(fields) {

        return fields.map((formField, key) => {
            return <Grid item xs={formField.xs} md={formField.md} lg={formField.lg} key={key}>
                <TextField id={formField.id}
                    select={formField.type === "select"}
                    label={formField.label}
                    variant="outlined"
                    name={formField.name}
                    type={formField.type}
                    value={_.get(this.state, formField.name) !== null ? _.get(this.state, formField.name) : ""}
                    onChange={this.onFieldChange}
                    fullWidth
                    error={this.props.errors[formField.errorField]}>
                    {
                        (formField.items || []).map((item) =>
                            <MenuItem value={item} key={item}>
                                {item}
                            </MenuItem>)
                    }
                </TextField>
                <FormHelperText error hidden={!this.props.errors[formField.errorField]}>{this.props.errors[formField.errorField]}</FormHelperText>
            </Grid>
        })
    }


    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container spacing={8}>
                    {
                        this.renderFields(formFields)
                    }
                    <Grid item container xs={12} justify="flex-end">
                        <Button type="submit" variant="contained" color="primary">SUBMIT</Button>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

