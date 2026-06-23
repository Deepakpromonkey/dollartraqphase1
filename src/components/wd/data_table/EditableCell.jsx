import React, { Component } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Popover from '@mui/material/Popover';

import Chip from '@mui/material/Chip';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Edit from '@mui/icons-material/Edit';

import Btn from 'components/Btn';
import Loader from 'components/Loader';

import Api from 'api/Api';

import 'assets/styles/datatable.css';

class EditableCell extends Component { 
    constructor(props) {
        super();

        this.state = {

            editable_cell: false,

            selected_row_data: false,

            value: '',

            updating: false,

            flash_success_message: '',
            flash_error_message: ''
        }
    }

    renderLabel = () => {

        if(this.props.column.hasOwnProperty('chip_colors')){

            let chip_colors = this.props.column.chip_colors;

            if(chip_colors.hasOwnProperty(this.props.original_value)){

                return <Chip size="small" color={chip_colors[this.props.original_value]} label={this.props.value} />
            }
        }else{

            return <div>{this.props.value}</div>
        }
    }

    render () {
        
        let _props = {}

        if(this.props.column.hasOwnProperty('width')){

            _props['width'] = this.props.column.width
        }

        return (
            <>
                <TableCell className='col-cell' {..._props}>

                    {this.renderLabel()}

                    {(this.props.column.hasOwnProperty('editable') && this.props.column.editable === true) &&
                
                        <div className='col-cell-edit-action'>
                            <IconButton size="small" onClick={(e) => {

                                this.setState({
                                    selected_row_data: this.props.column,
                                    editable_cell: e.target,
                                    value: this.props.row_data
                                })

                                this.props.onClick({editable_cell: e})
                            }}>
                                <Edit fontSize='inherit' />
                            </IconButton>
                        </div>
                    }

                    <Popover
                        onClose={() => {
                            // this.setState({editable_cell: false})
                        }}
                        open={this.state.editable_cell ? true : false}
                        anchorEl={this.state.editable_cell}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                    >
                        <div className="popover-confirm lg">

                            <Box sx={{marginTop: 0}}>

                                <form>

                                    <Grid container spacing={2} className="">

                                        <Grid item xs={12} lg={12}>
                                            <strong style={{fontSize: 12}}>UPDATE</strong>
                                        </Grid>

                                        <Grid item xs={12} lg={12}>
                                            {this.state.selected_row_data !== false &&
                                            
                                                <>
                                                    {this.state.selected_row_data.input_type === 'textarea' &&
                                                    
                                                        <TextField
                                                            fullWidth
                                                            rows={8}
                                                            size="small"
                                                            multiline
                                                            value={this.state.value}
                                                            style={{fontSize:14}}
                                                            onChange={(e) => {

                                                                this.setState({value: e.target.value})
                                                            }}
                                                        />
                                                    }

                                                    {this.state.selected_row_data.input_type === 'input' &&
                                                    
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={this.state.value}
                                                            style={{fontSize:14}}
                                                            onChange={(e) => {

                                                                this.setState({value: e.target.value})
                                                            }}
                                                        />
                                                    }
                                                </>
                                            }
                                        </Grid>

                                        <Grid item xs={12} lg={12}>
                                            <div className='popover-confirm-footer'>

                                                <Btn size="small" confirm={true} confirm_message="Do you really want to cancel? Edited data will be lost." onClick={() => {

                                                    this.setState({
                                                        editable_cell: false,
                                                        selected_row_data: false,
                                                        selected_row_index: false,
                                                        value: ''
                                                    })

                                                    this.props.onCancel()
                                                }}>Cancel</Btn>

                                                <Btn size="small" color="primary" variant="contained" onClick={() => {

                                                    this.update(this.props.column)
                                                }}>Update</Btn>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Box>

                            <Loader loading={this.state.updating} />
                        </div>
                    </Popover>

                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={this.state.flash_success_message !== '' ? true : false}
                        autoHideDuration={5000}
                        key={"success_message"}
                        onClose={() => {

                            this.setState({flash_success_message: ''})
                        }}
                    >
                        <Alert elevation={6} variant="filled" severity="success">{this.state.flash_success_message}</Alert>
                    </Snackbar>

                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={this.state.flash_error_message !== '' ? true : false}
                        autoHideDuration={5000}
                        key={"error_message"}
                        onClose={() => {

                            this.setState({flash_error_message: ''})
                        }}
                    >
                        <Alert elevation={6} variant="filled" severity="error">{this.state.flash_error_message}</Alert>
                    </Snackbar>
                </TableCell>
            </>
        )
    }

    update = (column) => {

        const row = this.props.row;
        const _row_id = row[column.row_id];

        var that = this;

        var formData = new FormData();

        formData.append('account_token', this.props.account_token);
        formData.append('key', column.column);
        formData.append('data', this.state.value);
        formData.append('row_id', _row_id);

        that.setState({updating: true});

        Api.post(this.props.cell_update_url, formData, function(data){

            that.setState({updating: false});

            if(data.status){

                that.props.onUpdate(data.row, column);
                that.props.onCancel()

                that.setState({
                    editable_cell: false,
                    selected_row_data: false,
                    selected_row_index: false,
                    value: '',
                    flash_success_message: data.message
                })

            }else{

                that.setState({flash_error_message: data.message})
            }
        });
    }
}

export default EditableCell;
