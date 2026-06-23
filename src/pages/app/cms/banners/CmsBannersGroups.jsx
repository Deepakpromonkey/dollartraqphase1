import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import Edit from '@mui/icons-material/Edit';

class CmsBannersGroups extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

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
                
                page="cms_banners_groups"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Banner Groups"

                title_action={[{key: 'cms_banners_groups_add', label: 'Add New Banner Group', onClick: () => {

                    this.setState({add_new: true})
                }}]}
            >
                
                <>

                    <DataTable
                        index="cms_banners_groups"
                        label="Banner Groups"

                        active_row={this.state.active_row}

                        do_reload={this.state.do_reload}
                        relaodDone={() => {

                            this.setState({do_reload: false});
                        }}

                        columns={[
                            {name: 'Title', column: 'title', sortable: true},
                            // {name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},
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

                        api_url="backend/cms/banners/groups"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />

                    <WdForm                        
                        drawer={true}
                        open={this.state.add_new}
                        position="bottom"

                        size="small"
                        
                        title='Banner Group'
                        back_label="Cancel"
            
                        submit_url='backend/cms/banners/groups/save'
                        data_url='backend/cms/banners/groups/data'
            
                        onSubmit={(result) => {
            
                            this.setState({add_new: false, row_id: false, do_reload: true})
                        }}
                        onBack={() => {
            
                            this.setState({add_new: false, row_id: false})
                        }}
                    
                        row_id={this.state.row_id}
                        id="row_id"
                        title_field="title"
                        updated_on="updated_on_formatted"
                                                
                        fields={{
                            rows: [
                                {
                                    fields: [
                                        {key: 'title', type: 'input', name: 'title', label: 'Title', validations: ['r'], span: 12},
                                    ]
                                },
                            ]
                        }}
                    />
                </>
            </Main>
        )
    }
}

export default CmsBannersGroups;