import React, { Component } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

class ShipmentDetails extends Component {

    render(){

        const items = [
            {key: 'shipment_number', label: 'Shipment Number'},
            {key: 'tracking_full_number', label: 'Tracking Full Number'},
            {key: 'tracking_timezone', label: 'Tracking Timezone'},
            {key: 'email_updates_to', label: 'Email Updates To'},
            {key: 'shippment_carrier_label', label: 'Carrier'},
            {key: 'tracking_method_label', label: 'Tracking Method'},
            {key: 'notes', label: 'Notes'}
        ]
        
        return (

            <TableContainer>
                <Table>
                    <TableBody>
                        {items.map((_item, index) => {

                            return (
                                <TableRow key={`row_${index}`}>
                                    <TableCell sx={{width: 200}}>
                                        <strong>{_item.label}</strong>
                                    </TableCell>
                                    <TableCell>
                                        <label>{this.props.shipment[_item.key]}</label>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default ShipmentDetails
