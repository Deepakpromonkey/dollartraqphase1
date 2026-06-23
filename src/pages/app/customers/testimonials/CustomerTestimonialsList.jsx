import React, { Component } from 'react';
import { Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import Edit from '@mui/icons-material/Edit';

class CustomerTestimonialsList extends Component {

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

            post_fields: []
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
                
                page="customers_testimonials_master"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Testimonials"

                title_action={[{key: 'customers_testimonials_master_add', label: 'Add New Testimonial', onClick: () => {

                    this.setState({add_new: true})
                }}]}
            >
                
                <>

                    <DataTable
                        index="customers_testimonials_master"
                        label="Testimonials"

                        active_row={this.state.active_row}

                        do_reload={this.state.do_reload}
                        relaodDone={() => {

                            this.setState({do_reload: false});
                        }}

                        columns={[
                            {name: 'Title', column: 'title', sortable: true},
                            {name: 'Summary', column: 'summary', sortable: false},
                            {name: 'Added On', column: 'added_on', sortable: false, renderer: (row) => {

                                return <span>{row.added_on_formatted}</span>
                            }},
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

                        api_url="backend/customers/testimonials/listing"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />

                    <WdForm
                        title='Testimonial'

                        drawer={true}
                        open={this.state.add_new}
                        position="right"
                        size="medium"

                        submit_url='backend/customers/testimonials/save'
                        data_url='backend/customers/testimonials/data'

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

                        post_fields={this.state.post_fields}

                        is_view={this.state.is_view}

                        fields={{
                            rows: [
                                {
                                    fields: [
                                        {key: 'title', type: 'input', name: 'title', label: 'Title', validations: ['r'], span: 12}
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'status', name: 'status', label: 'Status', type: 'switch', validations: ['r'], options: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}], span: 4}
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'show_on_home', name: 'show_on_home', label: 'Display On Homepage', type: 'switch', validations: ['r'], options: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}], span: 4}
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'image_thumb', type: 'image', name: 'image_thumb', label: 'Thumb', validations: [], span: 6, path: 'customers/testimonials/', allowed_types: 'jpg,png,webp', formatted_field: 'image_thumb_url', span: 4},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'image_medium', type: 'image', name: 'image_medium', label: 'Medium Image', validations: [], span: 6, path: 'customers/testimonials/', allowed_types: 'jpg,png,webp', formatted_field: 'image_medium_url', span: 4},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'image', type: 'image', name: 'image', label: 'Image', validations: [], span: 6, path: 'customers/testimonials/', allowed_types: 'jpg,png,webp', formatted_field: 'image_url', span: 4},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'video_url', type: 'input', name: 'video_url', label: 'Video URL', validations: [], span: 12, comment: 'Enter youtube video url.'}
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'description', type: 'textarea', name: 'description', label: 'Content', validations: [], span: 12, rows: 6},
                                    ],
                                },
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
        Api.post('backend/blogs/categories/load', formData, function(data){

            self.setState({init: false})

            if(data.status){

                self.setState({categories: data.categories});
            }
        });
    }
}

export default CustomerTestimonialsList;