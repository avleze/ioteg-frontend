import * as React from "react";
import PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

export default class LateralMenuButton extends React.Component {

    render() {
        const props = this.props;

        return (
            <ListItem button onClick={this.props.onClick}>
                <ListItemIcon>{props.icon}</ListItemIcon>
                <ListItemText>{props.text}</ListItemText>
            </ListItem>
        )
    }
}

LateralMenuButton.propTypes = {
    icon: PropTypes.object,
    text: PropTypes.string,
    onClick: PropTypes.func
}