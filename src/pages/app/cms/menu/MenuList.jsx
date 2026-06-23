import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import WdForm from 'components/wd/form/WdForm';

import Grid from '@mui/material/Grid';
import Main from 'components/Main';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import NoData from 'components/blocks/NoData';

import Btn from 'components/Btn';

import Api from 'api/Api';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';

import MenuForm from './MenuForm';
import MenuRender from './MenuRender';

import LayoutHelper from 'helpers/LayoutHelper';

class MenuList extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            success_message: '',
            error_message: '',

            redirect: false,

            logged_in: false,

            menu: [],
            cms_pages: [],

            no_menu: false,
            
            menu_items: [],

            add_new_menu: false,

            selected_menu: {},
            
            row_id: false
        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({account_token: account_token})
            this.init(account_token)
        }
    }

    render(){

        if(this.state.redirect !== false){

            return <Navigate to={this.state.redirect} />
        }

        return (

            <Main
                active_page="cms"
                
                page="cms_menu"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Menu Manager"

                title_action={[{key: 'add_new_menu', label: 'Add New Menu', onClick: (e) => {

                    this.setState({add_new_menu: true})
                }}]}
            >

                {this.state.menu.length > 0 &&

                    <Grid container spacing={5}>
                        <Grid item xs={3}>
                            <div className='mt-20'>
                                <strong className='fs-14 gr-8'>Menus <span className='gr-4'>({this.state.menu.length})</span></strong>
                                <List sx={{width:'100%'}}>

                                    {this.state.menu.map((_menu, index) => {

                                        return (
                                            <ListItemButton key={`menu_item_${index}`} sx={{bgcolor: this.state.selected_menu && this.state.selected_menu.row_id === _menu.row_id ? '#5e6bf4' : 'background.paper', marginBottom: 1, borderRadius: '5px', '&:hover': {bgcolor: 'rgba(94, 107, 244, .5)'}}} onClick={() => {

                                                this.loadMenu(_menu)
                                            }}>
                                                <ListItemText
                                                    sx={{marginTop: 0}}
                                                    primary={
                                                        <span className={`fw-bold fs-12 ${this.state.selected_menu && this.state.selected_menu.row_id === _menu.row_id ? 'c-w' : 'gr-8'}`}>
                                                            {_menu.title}
                                                        </span>
                                                    }
                                                    secondary={
                                                        <span className={`fs-12 ${this.state.selected_menu && this.state.selected_menu.row_id === _menu.row_id ? 'c-w' : 'gr-8'}`}>
                                                            <div className="vertical mt-5">
                                                                <strong className='fs-10 op-5'>POSITION</strong>
                                                                <span>{_menu.position}</span>
                                                            </div>
                                                        </span>
                                                    }
                                                />
                                            </ListItemButton>
                                        )
                                    })}
                                </List>
                            </div>
                        </Grid>
                        <Grid item xs={9}>

                            <div className='mt-20'>
                                <Grid container spacing={6}>

                                    <Grid item xs={7}>

                                        {Object.keys(this.state.selected_menu).length > 0
                                            ?

                                                <>
                                                    <strong className='fs-14 gr-8'>{this.state.selected_menu.title}</strong>

                                                    <MenuRender
                                                        selected_menu={this.state.selected_menu}
                                                        menu_items={this.state.menu_items}

                                                        cms_pages={this.state.cms_pages}
                                                        
                                                        removeItem={(item) => {

                                                            this.removeItem(item)
                                                        }}

                                                        onEleDrag={(i, j, parent) => {

                                                            let menu_items = this.state.menu_items;

                                                            if(parent === 0){

                                                                const _i = menu_items.findIndex(row => row.row_id === i);
                                                                const _j = menu_items.findIndex(row => row.row_id === j);

                                                                let t = menu_items[_i];

                                                                menu_items[_i] = menu_items[_j];
                                                                menu_items[_j] = t;
                                                            }

                                                            this.setState({menu_items: menu_items})
                                                        }}
                                                        updateChild={(child, parent) => {

                                                            console.log(child, parent);
                                                        }}
                                                        onEleMove={() => {

                                                            // window.setTimeout(() => {

                                                            //     let menu_items = this.state.menu_items;

                                                            //     let _menu_index = [];

                                                            //     menu_items.forEach((menu_item, index) => {

                                                            //         _menu_index.push({index: index, row_id: menu_item.row_id, menu: menu_item.menu_title})
                                                            //     })

                                                            //     this.updateSortOrder(_menu_index)
                                                            // }, 200)
                                                        }}
                                                    />

                                                    {this.state.menu_items.length === 0 &&
                                            
                                                        <NoData size="small" icon={<FormatListBulleted />}>
                                                            <div className='fs-14 gr-6 vertical align-center'>
                                                                <span>Menu items not created yet.</span>
                                                                <span>Create menu items from the right side.</span>
                                                            </div>
                                                        </NoData>
                                                    }
                                                </>
                                            :
                                                <NoData size="small" icon={<FormatListBulleted />}>
                                                    <div className='fs-14 gr-6 vertical align-center'>
                                                        <span>Choose a menu from the left side list.</span>
                                                    </div>
                                                </NoData>
                                        }
                                    </Grid>
                                    <Grid item xs={5}>

                                        {Object.keys(this.state.selected_menu).length > 0 &&
                                        
                                            <MenuForm
                                                menu={this.state.selected_menu}
                                                account_token={this.state.account_token}
                                                cms_pages={this.state.cms_pages}

                                                updateMenu={(menu_items) => {

                                                    this.setState({menu_items: menu_items})
                                                }}

                                                onSuccess={(message) => {

                                                    LayoutHelper.addSuccessMessage(this, message)
                                                }}

                                                onError={(message) => {

                                                    LayoutHelper.addErrorMessage(this, message)
                                                }}
                                            />
                                        }
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                }
                
                {this.state.no_menu &&

                    <Grid container spacing={3}>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={8}>
                            <div className='align-center'>
                                <NoData size="small" icon={<FormatListBulleted />}>
                                    <div className='fs-14 gr-6 vertical align-center'>
                                        <span>Menu is not created yet.</span>
                                        <Btn className="mt-10" color="secondary" variant="contained" onClick={() => {

                                            this.setState({add_new_menu: true})
                                        }}>Add New Menu</Btn>
                                    </div>
                                </NoData>
                            </div>
                        </Grid>
                    </Grid>
                }

                <WdForm
                    size="medium"
                    
                    drawer={true}
                    open={this.state.add_new_menu}
                    position="bottom"
                    
                    title='Menu'
                    back_label="Cancel"
        
                    submit_url='cms/menu/save'
                    data_url='cms/menu/data'
        
                    onSubmit={(result) => {
        
                        this.setState({add_new_menu: false, row_id: false, no_menu: false})
                        this.init(this.state.account_token)
                    }}
                    onBack={() => {
        
                        this.setState({add_new_menu: false, row_id: false})
                    }}
                
                    row_id={this.state.row_id}
                    id="row_id"
                    title_field="title"
                    updated_on="updated_on_formatted"
                                            
                    fields={{
                        rows: [
                            {
                                fields: [
                                    {key: 'title', type: 'input', name: 'title', label: 'Menu Title', validations: ['r'], span: 12},
                                ]
                            },
                            {
                                fields: [
                                    {key: 'position', type: 'input', name: 'position', label: 'Menu Code', validations: ['r', 'unique|cms/menu/unique_position'], span: 12, comment: 'This code will be used to display the menu on frontend.'},
                                ]
                            }
                        ]
                    }}
                />
            </Main>
        )
    }

    loadMenu = (menu) => {

        this.setState({selected_menu: menu})

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('menu', menu.row_id);

        var self = this;
        Api.post('backend/cms/menu/load', formData, function(data){

            if(data.status){

                self.setState({
                    menu_items: data.menu_items
                });
            }
        });
    }

    init = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        var self = this;
        Api.post('cms/menu/listing', formData, function(data){

            if(data.status){

                self.setState({
                    menu: data.records,
                    cms_pages: data.cms_pages
                });

                if(data.records.length === 0){

                    self.setState({no_menu: true})
                }
            }else{

                self.setState({no_menu: true})
            }
        });
    }

    removeItem = (item) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('item', item.row_id);

        var self = this;
        Api.post('backend/cms/menu/remove_item', formData, function(data){

            if(data.status){

                let menu_items = self.state.menu_items;

                const menu_item_index = menu_items.findIndex(row => row.row_id === item.row_id);

                if(menu_item_index > -1){

                    menu_items.splice(menu_item_index, 1);

                    self.setState({
                        menu_items: menu_items
                    });
                }
            }
        });
    }

    updateSortOrder = (items) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('items', JSON.stringify(items));

        var self = this;
        Api.post('backend/cms/menu/update_sort_order', formData, function(data){

            if(data.status){

                // let menu_items = self.state.menu_items;

                // const menu_item_index = menu_items.findIndex(row => row.row_id === item.row_id);

                // if(menu_item_index > -1){

                //     menu_items.splice(menu_item_index, 1);

                //     self.setState({
                //         menu_items: menu_items
                //     });
                // }
            }
        });
    }
    
}

export default MenuList;