import * as React from "react";
import { CustomMaterialTable } from "../utils/CustomMaterialTable";
import propTypes from "prop-types";
import Axios from "axios";


export class ChannelEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channelName: "",
            configurableEventTypes: null
        }
    }

    async componentDidMount() {
        const channelId = this.props.channelId;
        console.log("hola")
        if(channelId !== undefined)
            await Axios.get(`/api/users/${this.props.userId}/channels/${channelId}`).then(async channel => {
                
                await Axios.get(`/api/channels/${channelId}/configurableEventTypes`).then(configurableEventTypes => {
                    this.setState({
                        id: channelId,
                        channelName: channel.data["channelName"],
                        configurableEventTypes: configurableEventTypes.data
                    });
                })
            })
    }

    render() {
        return (<React.Fragment>
            
            {JSON.stringify(this.state)}
            {/**/}
            
        /></React.Fragment>)
    }

}

ChannelEditor.propTypes = {
    channelId: propTypes.number
}