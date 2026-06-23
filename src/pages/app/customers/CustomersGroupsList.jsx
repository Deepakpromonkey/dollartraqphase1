import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Edit from '@mui/icons-material/Edit';

class CustomersGroupsList extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            redirect: false,

            auctions_loading: false,

            logged_in: false,

            error_message: '',
            success_message: '',
        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({account_token: account_token})
        }
    }

    render(){

        if(this.state.redirect !== false){

            return <Navigate to={this.state.redirect} />
        }

        return (

            <Main
                active_page="customers"
                
                page="customers_groups_master"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Customer Groups"

                title_action={[{key: 'customers_groups_action_add', label: 'Add New Customer Group', 'link': '/customers/groups/add'}]}
            >
                
                <>

                    <DataTable
                        index="customers_groups_master"
                        label="Customer Groups"

                        active_row={this.state.active_row}

                        columns={[
                            {name: 'Title', column: 'title', sortable: true},
                            {name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},

                        ]}

                        row_actions={(row, row_index) => {

                            return (

                                <div className="hoverable-action">
                                    <div className="align-start">

                                        <Btn to={`/customers/groups/add/${row.row_id}`} size="small" color="secondary" startIcon={<Edit style={{fontSize: 15}} />}>
                                            Edit
                                        </Btn>
                                    </div>
                                </div>
                            )
                        }}

                        default_sort_by="added_on"

                        api_url="customers/groups/listing"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />
                </>
            </Main>
        )
    }
}

export default CustomersGroupsList;