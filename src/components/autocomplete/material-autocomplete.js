import * as React from "react";
import Downshift from "downshift";
import { TextField, Paper, List, ListItemText, ListItem, ListItemIcon, IconButton, Tooltip, withStyles } from "@material-ui/core";
import CloudDownload from '@material-ui/icons/CloudDownload';



function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}

class MaterialAutocomplete extends React.Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    onChange(e) {
        this.props.onChange(e.target.value);
    }

    onClick(item) {
        this.props.onClick(item);
    }

    render() {
        const { classes } = this.props;
        return (
            <Downshift id="downshift-popper">
                {({
                    getInputProps,
                    getItemProps,
                    getLabelProps,
                    getMenuProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem,
                }) => {
                    return (
                        <div>
                            {renderInput({
                                fullWidth: true,
                                variant: 'outlined',
                                classes,
                                InputProps: getInputProps({
                                    placeholder: this.props.placeholder,
                                    onChange: this.onChange,
                                }),
                            })}
                            <div {...getMenuProps()}>
                                {isOpen ? (
                                    <Paper className={classes.paper} square>
                                        <List>
                                            {this.props.items.map((item, index) => {
                                                return <ListItem key={index}>
                                                    <ListItemText style={{ flexGrow: 1 }}>{item.eventType.name}</ListItemText>
                                                    <ListItemIcon><Tooltip title="Generate as JSON, CSV or XML"><IconButton onClick={() => this.onClick(item)}><CloudDownload /></IconButton></Tooltip></ListItemIcon>
                                                </ListItem>
                                            })}
                                            {this.props.items.length === 0 ? <ListItem><ListItemText>No events found with name '{inputValue}'</ListItemText></ListItem> : null}
                                        </List>
                                    </Paper>
                                ) : null}
                            </div>

                        </div>
                    )
                }}
            </Downshift>
        );
    }
}

const styles = theme => ({
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    }
});

export default withStyles(styles)(MaterialAutocomplete);