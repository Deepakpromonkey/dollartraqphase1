import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import Main from '../sections/Main';

class Listing extends Component { 
    constructor(props) {
        super();
        this.state = {
        }
    }

    componentDidMount = () => {

    }

    render () {
        
        return (

            <Main title={this.props.module_name.toUpperCase() + " List"} title_action={<Link to={"/add/" + this.props.module_name}>Add</Link>}>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">Calories</TableCell>
                                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                                <TableCell align="right">Protein&nbsp;(g)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Ok
                                </TableCell>
                                <TableCell align="right">1</TableCell>
                                <TableCell align="right">2</TableCell>
                                <TableCell align="right">3</TableCell>
                                <TableCell align="right">4</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Main>
        )
    }
}

export default Listing;