import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import Edit from '@mui/icons-material/Edit';

class CmsBanners extends Component {

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

            add_new: false,

            banners: [],
            banner_groups: []
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
                
                page="cms_banners"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Banners"

                title_action={[{key: 'cms_banners_add', label: 'Add New Banner', onClick: () => {

                    this.setState({add_new: true})
                }}]}
            >
                
                <>

                    <DataTable
                        index="cms_banners"
                        label="Banners"

                        active_row={this.state.active_row}

                        do_reload={this.state.do_reload}
                        relaodDone={() => {

                            this.setState({do_reload: false});
                        }}

                        updateData={(data) => {

                            this.setState({banners: data.records, banner_groups: data.banner_groups})
                        }}
                        data={this.state.banners}

                        columns={[
                            {name: 'Group', column: 'banner_group', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.banner_groups},
                            {name: 'Title', column: 'title', sortable: true},
                            // {name: 'Amount', column: 'amount', sortable: true},
                            {name: 'Link', column: 'link', sortable: true},
                            {name: 'Sort Order', column: 'sort_order', sortable: true},
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

                        api_url="backend/cms/banners"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />

                    <WdForm                        
                        drawer={true}
                        open={this.state.add_new}
                        position="right"
                        size="medium"
                        
                        title='Banner'
                        back_label="Cancel"
            
                        submit_url='backend/cms/banners/save'
                        data_url='backend/cms/banners/data'
            
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
                                        {key: 'banner_group', type: 'dropdown', name: 'banner_group', label: 'Banner Group', validations: ['r'], span: 6, options: this.state.banner_groups},
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'title', type: 'input', name: 'title', label: 'Title', validations: [], span: 6},
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'banner_image', type: 'image', name: 'banner_image', label: 'Image', validations: ['r'], span: 6, path: 'cms/banners/', allowed_types: 'jpg,png,webp', formatted_field: 'banner_image_url'}
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'link', type: 'input', name: 'link', label: 'Link', validations: [], span: 8},
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'description', type: 'textarea', name: 'description', label: 'Description', validations: [], span: 12},
                                    ]
                                },
                                {
                                    fields: [
                                        // {key: 'amount', type: 'input', name: 'amount', label: 'Amount', validations: ['r', 'num'], span: 3},
                                        {key: 'sort_order', type: 'input', name: 'sort_order', label: 'Sort Order', validations: ['num'], span: 3},
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'status', type: 'switch', name: 'status', label: 'Status', validations: [], span: 6, options: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}]},
                                    ]
                                }
                            ]
                        }}
                    />
                </>
            </Main>
        )
    }
}

export default CmsBanners;