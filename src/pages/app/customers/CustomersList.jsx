import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';
import Popover from '@mui/material/Popover';

import Grid from '@mui/material/Grid';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import Edit from '@mui/icons-material/Edit';

class CustomersList extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            customers_groups: []
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
                active_page="customers"
                
                page="customers_master"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Customers"

                title_action={[{key: 'customers_master_add_action', label: 'Add New Customer', 'link': '/customers/add'}]}
            >
                
                <>

                    <DataTable
                        index="customers_master"
                        label="Customers"

                        active_row={this.state.active_row}

                        columns={[
                            {name: 'Name', column: 'name', sortable: true},
                            {name: 'Email', column: 'email', sortable: true},
                            {name: 'Contact', column: 'contact', sortable: true},
                            {name: 'Customer Group', column: 'customer_group', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.customers_groups},
                            {name: 'Newsletter Subscription', column: 'newsletter', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'No'}, {key: '1', value: 'Yes'}]},
                            {name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},
                        ]}

                        row_actions={(row, row_index) => {

                            return (

                                <div className="hoverable-action">
                                    <div className="align-start">

                                        <Btn to={`/customers/add/${row.row_id}`} size="small" color="secondary" startIcon={<Edit style={{fontSize: 15}} />}>
                                            Edit
                                        </Btn>
                                    </div>
                                </div>
                            )
                        }}

                        default_sort_by="added_on"

                        api_url="customers/listing"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />
                </>
            </Main>
        )
    }

    init = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        var self = this;
        Api.post('customers/init', formData, function(data){

            if(data.status){

                self.setState({
                    customers_groups: data.customers_groups
                });
            }
        });
    }
}

export default CustomersList;