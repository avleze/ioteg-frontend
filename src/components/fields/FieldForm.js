import * as React from 'react'
import { TextField, Button, Grid, FormHelperText, MenuItem, Typography, FormControlLabel, Switch } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { propertiesByType, generationsByType, fieldsByTypeAndGeneration } from './fieldsConstants';
import confirm from '../../lib/confirmation';
import _ from 'lodash';

const items = ["Integer", "Float", "Long", "String", "Time", "Date", "Alphanumeric", "Boolean"];
const itemsWithComplexType = [...items, "ComplexType"];

const formFields = [
    {
        id: "name",
        name: "name",
        type: "text",
        label: "Field Name",
        errorField: "name",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "type",
        name: "type",
        type: "select",
        label: "Type",
        errorField: "type",
        items: items,
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "quotes",
        name: "quotes",
        type: "switch",
        label: "Has quotes",
        errorField: "quotes",
        xs: 12,
        md: 6,
        lg: 6
    },
    {
        id: "injectable",
        name: "injectable",
        type: "switch",
        label: "Is injectable",
        errorField: "injectable",
        xs: 12,
        md: 6,
        lg: 6
    },

]


class FieldForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            quotes: false,
            chooseone: false,
            dependence: "false",
            injectable: false,
            type: null,
            value: null,
            min: 0,
            step: null,
            unit: null,
            max: 10,
            precision: null,
            length: 10,
            strCase: null,
            begin: null,
            end: null,
            endcharacter: null,
            format: null,
            isNumeric: false,
            customBehaviour: null
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    componentDidMount() {
        if (this.props.field) {
            this.setState({
                ...this.props.field
            })
        }
    }

    onSubmit(e) {
        e.preventDefault();
        confirm(() => {
            this.props.onSubmit(this.state);
        })
    }

    onFieldChange(e) {
        let value = {
            errors: {}
        }
        _.set(value, e.target.name, e.target.value)


        if (e.target.name === 'type') {
            this.props.onChangeType(e.target.value)
            if (e.target.value !== 'ComplexType')
                value['generationType'] = 'Fixed';
            else
                value['generationType'] = 'Complex';

            if (e.target.value !== "Float")
                value['customBehaviour'] = null;
        }

        if (e.target.name === 'generationType') {
            value['begin'] = null;
            value['step'] = null;
            value['end'] = null;

            value['value'] = null;
            value['min'] = 0;
            value['max'] = 10;

            this.props.onChangeGenerationType(e.target.value);

            if (e.target.value !== "CustomBehaviour")
                value['customBehaviour'] = null;
        }



        this.setState({
            ...value
        });
    }

    handleSwitchChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    renderFields(fields) {

        return fields.map((formField, key) => {
            if (formField.name === "type" && this.props.allowComplex)
                formField.items = itemsWithComplexType;
            else if (formField.name === "type")
                formField.items = items;

            if (formField.type === 'switch') {
                return <FormControlLabel key={key}
                    control={
                        <Switch
                            checked={this.state[formField.name] ? this.state[formField.name] : false}
                            onChange={this.handleSwitchChange(formField.name)}
                        />
                    }
                    label={formField.label}
                />
            }
            else
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

    renderPropertiesByType(type) {
        if (type && propertiesByType[type].length > 0)
            return <React.Fragment>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>General Properties</Typography>
                </Grid>
                {this.renderFields(propertiesByType[type])}
            </React.Fragment>;
    }

    renderGenerationPropertiesByGenerationType(type, generationType) {
        if (generationType && type && fieldsByTypeAndGeneration[type][generationType].length > 0)
            return <React.Fragment>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Generation Properties</Typography>
                </Grid>
                {this.renderFields(fieldsByTypeAndGeneration[type][generationType])}
            </React.Fragment>;
    }

    renderGenerationSelectByType(type) {
        if (type) {
            const selectGeneration = {
                id: "generationType",
                name: "generationType",
                type: "select",
                label: "Generation",
                errorField: "generationType",
                items: generationsByType[type],
                xs: 12,
                md: 12,
                lg: 12
            }

            return this.renderFields([selectGeneration])
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Grid container spacing={8}>
                    {
                        this.renderFields(formFields)
                    }
                    {
                        this.renderGenerationSelectByType(this.state.type)
                    }

                    {
                        this.renderPropertiesByType(this.state.type)
                    }
                    {
                        this.renderGenerationPropertiesByGenerationType(this.state.type, this.state.generationType)
                    }
                    <Grid item container xs={12} justify="flex-end">
                        <Button type="submit" variant="contained" color="primary">SUBMIT</Button>
                    </Grid>
                </Grid>
            </form>
        )
    }
}

export default withRouter(FieldForm);