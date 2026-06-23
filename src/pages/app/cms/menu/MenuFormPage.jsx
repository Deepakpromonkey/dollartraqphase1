import React, { Component } from 'react';

import Grid from '@mui/material/Grid';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import Btn from 'components/Btn';

class MenuFormPage extends Component {

    constructor(props) {
        super();
        this.state = {

            menu_title: '',
            selected_cms_page: '',
            menu_classes: '',
        }
    }

    componentDidMount = () => {
        
        if(this.props.data){

            this.setState({
                menu_title: this.props.data.menu_title,
                selected_cms_page: this.props.data.ref_id,
                menu_classes: this.props.data.css_classes,
            })
        }
    }

    render(){

        return (
            <div className='' style={{padding: 15, backgroundColor: 'rgba(0,0,0,.06)', borderRadius: 7}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth error={this.state.selected_cms_page_error}>
                            <InputLabel>Choose Page</InputLabel>
                            <Select
                                value={this.state.selected_cms_page}
                                label="CMS Page"
                                placeholder='CMS Page'
                                variant='standard'
                                onChange={(e) => {

                                    let _value = e.target.value;

                                    if(_value !== ''){

                                        const _page = this.props.cms_pages.find(row => row.key === _value);

                                        if(_page){

                                            this.setState({menu_title: _page.value})
                                        }

                                        this.setState({selected_cms_page_error: false})
                                    }

                                    this.setState({selected_cms_page: _value})
                                }}
                            >
                                {this.props.cms_pages.map((_cms_page, index) => {

                                    return <MenuItem key={`cms_page_${index}`} value={_cms_page.key}>{_cms_page.value}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Menu Title"
                            variant="standard"
                            value={this.state.menu_title}
                            onChange={(e) => {

                                this.setState({menu_title: e.target.value})
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="CSS Classes"
                            variant="standard"
                            size="small"
                            value={this.state.menu_classes}
                            onChange={(e) => {

                                this.setState({menu_classes: e.target.value})
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div className='justify-end'>
                            <Btn size="small" color="secondary" variant="outlined" onClick={() => {

                                this.props.addMenuItem('page', {selected_cms_page: this.state.selected_cms_page, menu_title: this.state.menu_title, menu_classes: this.state.menu_classes})

                                this.setState({selected_cms_page: '', menu_title: '', menu_classes: ''})
                            }}>Add Item</Btn>
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default MenuFormPage;