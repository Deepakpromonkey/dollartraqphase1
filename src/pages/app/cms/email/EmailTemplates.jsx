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

class EmailTemplates extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            visibility_options: []
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
                
                page="cms_emails"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Email Templates"

                title_action={[{key: 'cms_emails_add_action', label: 'Add New Template', 'link': '/cms/emails/add'}]}
            >
                
                <>

                    <DataTable
                        index="cms_emails"
                        label="Email Templates"

                        active_row={this.state.active_row}

                        columns={[
                            {name: 'Title', column: 'title', sortable: true},
                            {name: 'Subject', column: 'subject', sortable: true},
                            {name: 'Code', column: 'code', sortable: true},
                            {name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},
                        ]}

                        row_actions={(row, row_index) => {

                            return (

                                <div className="hoverable-action">
                                    <div className="align-start">

                                        <Btn to={`/cms/emails/add/${row.row_id}`} size="small" color="secondary" startIcon={<Edit style={{fontSize: 15}} />}>
                                            Edit
                                        </Btn>
                                    </div>
                                </div>
                            )
                        }}

                        default_sort_by="added_on"

                        api_url="cms/emails/listing"

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
        Api.post('cms/pages/init', formData, function(data){

            if(data.status){

                self.setState({
                    visibility_options: data.visibility_options
                });
            }
        });
    }
}

export default EmailTemplates;