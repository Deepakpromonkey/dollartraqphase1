import React, { Component } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';

class LocationHistory extends Component {

    render(){
        
        return (

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{backgroundColor:'rgba(0,0,0,.05)'}}>
                            <TableCell>
                                Date
                            </TableCell>
                            <TableCell>
                                Latitude
                            </TableCell>
                            <TableCell>
                                Longitude
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.location_history.map((_item, index) => {

                            return (
                                <TableRow key={`row_${index}`}>
                                    <TableCell>
                                        <label>{_item.date}</label>
                                    </TableCell>
                                    <TableCell>
                                        <span>{_item.lat}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span>{_item.lng}</span>
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

export default LocationHistory
