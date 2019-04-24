import * as React from 'react';
import MaterialTable from "material-table";


export class CustomMaterialTable extends React.Component {

    render() {
        return (<div style={{ boxShadow: "0px 0px 2px gray"}}>
            <MaterialTable {...this.props} />
        </div>)
    }
}