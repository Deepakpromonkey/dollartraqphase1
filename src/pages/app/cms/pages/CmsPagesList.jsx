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

class CmsPagesList extends Component {

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
                
                page="cms_pages"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="CMS Pages"

                title_action={[{key: 'cms_pages_add_action', label: 'Add New Page', onClick: () => {

                    this.setState({add_new: true})
                }}]}
            >
                
                <>

                    <DataTable
                        index="cms_pages"
                        label="CMS Pages"

                        active_row={this.state.active_row}

                        do_reload={this.state.do_reload}
                        relaodDone={() => {

                            this.setState({do_reload: false});
                        }}

                        columns={[
                            {name: 'Title', column: 'title', sortable: true},
                            {name: 'Visibility', column: 'visibility', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.visibility_options},
                            {name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},
                        ]}

                        row_actions={(row, row_index) => {

                            return (

                                <div className="hoverable-action">
                                    <div className="align-start">

                                        <Btn onClick={() => {

                                            this.setState({add_new: true, row_id: row.row_id})
                                        }} size="small" color="secondary" startIcon={<Edit style={{fontSize: 15}} />}>
                                            Edit
                                        </Btn>
                                    </div>
                                </div>
                            )
                        }}

                        default_sort_by="added_on"

                        api_url="cms/pages"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />

                    <WdForm
                        title='CMS Page'

                        drawer={true}
                        open={this.state.add_new}
                        position="right"

                        submit_url='cms/pages/save'
                        data_url='cms/pages/data'
                        edit_url='cms/pages/add'

                        onSubmit={(result) => {
            
                            this.setState({add_new: false, do_reload: true, row_id: false})
                        }}
                        onBack={() => {
            
                            this.setState({add_new: false, row_id: false})
                        }}

                        row_id={this.state.row_id}
                        id="row_id"
                        title_field="title"
                        updated_on="updated_on_formatted"

                        is_view={this.state.is_view}

                        fields={{
                            tabs: [
                                {
                                    key: 'general',
                                    title: 'Page Details',
                                    icon: <Dns />,
                                    rows: [
                                        {
                                            fields: [
                                                {key: 'title', type: 'input', name: 'title', label: 'Title', validations: ['r'], span: 12}
                                            ],
                                        },
                                        {
                                            fields: [
                                                {key: 'visibility', name: 'visibility', label: 'Page Visibility', type: 'radio', validations: ['r'], options: this.state.visibility_options, span: 4}
                                            ]
                                        },
                                        {
                                            fields: [
                                                {key: 'status', name: 'status', label: 'Status', type: 'switch', validations: ['r'], options: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}], span: 4}
                                            ]
                                        },
                                    ]
                                },
                                {
                                    key: 'info_tab',
                                    title: 'Description',
                                    icon: <ReceiptLong />,
                                    rows: [
                                        {
                                            fields: [
                                                {key: 'content', type: 'editor', name: 'content', label: 'Content', validations: [], span: 12},
                                            ],
                                        },
                                    ]
                                },
                                {
                                    key: 'meta_tab',
                                    title: 'Meta Data',
                                    icon: <Newspaper />,
                                    rows: [
                                        {
                                            fields: [
                                                {key: 'meta_title', type: 'input', rows: 2, name: 'meta_title', label: 'Meta Title', validations: [], span: 12},
                                            ],
                                        },
                                        {
                                            fields: [
                                                {key: 'meta_keywords', type: 'input', rows: 2, name: 'meta_keywords', label: 'Meta Keywords', validations: [], span: 12},
                                            ],
                                        },
                                        {
                                            fields: [
                                                {key: 'meta_description', type: 'input', rows: 2, name: 'meta_description', label: 'Meta Description', validations: [], span: 12},
                                            ],
                                        },
                                    ]
                                }
                            ]
                        }}
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

export default CmsPagesList;