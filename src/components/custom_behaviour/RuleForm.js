import * as React from 'react'
import { TextField, Button, Grid, FormHelperText, MenuItem } from '@material-ui/core';
import _ from 'lodash';


const formFields = [
    {
        id: "weight",
        name: "weight",
        type: "number",
        label: "Weight",
        errorField: "weight",
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
        id: "sequence",
        name: "sequence",
        type: "select",
        label: "Sequence",
        errorField: "sequence",
        items: [null, "inc", "dec"],
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


export default class RuleForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            weight: 0,
            min: null,
            max: null,
            sequence: null,
            value: null
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount() {
        if (this.props.rule) {
            this.setState({
                ...this.props.rule
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
        if (e.target.name === 'min' || e.target.name === 'max' || e.target.name === 'sequence')
            value['value'] = null;
        if (e.target.name === 'value') {
            value['min'] = null;
            value['max'] = null;
        }
    
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
                    inputProps={{ step: 0.01, min: 0, max: 1 }}
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

