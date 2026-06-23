import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import Edit from '@mui/icons-material/Edit';
import Dns from '@mui/icons-material/Dns';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Newspaper from '@mui/icons-material/Newspaper';

class CmsContactList extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            visibility_options: [],

            row_id: false,

            do_reload: false,

            add_new: false
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
                active_page="cms"
                
                page="cms_contact_listing"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Contact Queries"
            >
                
                <>

                    <DataTable
                        index="cms_contact_listing"
                        label="Contact Queries"

                        active_row={this.state.active_row}

                        do_reload={this.state.do_reload}
                        relaodDone={() => {

                            this.setState({do_reload: false});
                        }}

                        columns={[
                            {name: 'Type', column: 'type', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: 'feedback', value: 'Feedbacks / Complaints'}, {key: 'export', value: 'Export Orders'}]},
                            {name: 'First Name', column: 'first_name', sortable: true},
                            {name: 'Last Name', column: 'last_name', sortable: true},
                            {name: 'Email', column: 'email', sortable: true},
                            {name: 'Mobile', column: 'mobile', sortable: true},
                            {name: 'Message', column: 'message', sortable: true},
                            {name: 'Added On', column: 'added_on', sortable: true, renderer: (row) => {

                                return <span>{row.added_on_formatted}</span>
                            }},
                            // {name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},
                        ]}

                        // row_actions={(row, row_index) => {

                        //     return (

                        //         <div className="hoverable-action">
                        //             <div className="align-start">

                        //                 <Btn onClick={() => {

                        //                     this.setState({add_new: true, row_id: row.row_id})
                        //                 }} size="small" color="secondary" startIcon={<Edit style={{fontSize: 15}} />}>
                        //                     Edit
                        //                 </Btn>
                        //             </div>
                        //         </div>
                        //     )
                        // }}

                        default_sort_by="added_on"

                        api_url="backend/cms/contact"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />
                </>
            </Main>
        )
    }
}

export default CmsContactList;