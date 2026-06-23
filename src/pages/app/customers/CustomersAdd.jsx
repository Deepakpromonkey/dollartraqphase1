import React, { Component } from 'react';
import { useParams, useLocation } from "react-router-dom";

import Grid from '@mui/material/Grid';

import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import Dns from '@mui/icons-material/Dns';

import Api from 'api/Api';

export function withRouter(Children){

    return(props) => {

        const location = useLocation();
        const params = {params: useParams()};

        const pathname = location.pathname;

        let is_view = false;

        if(pathname.indexOf('view') > -1){

            is_view = true;
        }

        params['is_view'] = is_view;

        return <Children {...props} params={params} />
    }
}

class CustomersAdd extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,
            
            row_id: false,
            is_view: false,

            loading: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            customers_groups: []
        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem('sbcm_chit');
        
        if(account_token){
            
            this.setState({account_token: account_token});
            this.init(account_token)
        }

        let row_id = this.props.params.params.row_id;

        if(row_id){

            this.setState({row_id: row_id})
        }

        let is_view = this.props.params.is_view;
        this.setState({is_view: is_view})
    }

    render(){

        return (

            <Main
                active_page="customers"
                page="customers_groups_add"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
            >
            
                <Grid container spacing={2}>
                    <Grid item xs={6} lg={12}>
                        
                        <WdForm
                            title='Customer'

                            submit_url='customers/save'
                            back_url='customers'
                            data_url='customers/data'
                            edit_url='customers/add'

                            row_id={this.state.row_id}
                            id="row_id"
                            title_field="name"
                            updated_on="updated_on_formatted"

                            is_view={this.state.is_view}

                            fields={{
                                tabs: [
                                    {
                                        key: 'general',
                                        title: 'Customer Details',
                                        icon: <Dns />,
                                        rows: [
                                            {
                                                fields: [
                                                    {key: 'customer_group', name: 'customer_group', label: 'Customer Group', type: 'dropdown', validations: ['r'], options: this.state.customers_groups, span: 4}
                                                ]
                                            },
                                            {
                                                fields: [
                                                    {key: 'name', type: 'input', name: 'name', label: 'Name', validations: ['r'], span: 8}
                                                ],
                                            },
                                            {
                                                fields: [
                                                    {key: 'email', type: 'input', name: 'email', label: 'Email', validations: ['r', 'email', 'unique|customers/email_unique'], span: 4},
                                                    {key: 'contact', type: 'input', name: 'contact', label: 'Contact', validations: ['r', 'min-10', 'unique|customers/contact_unique'], span: 4}
                                                ],
                                            },
                                            {
                                                fields: [
                                                    {key: 'newsletter', type: 'switch', name: 'newsletter', label: 'Newsletter Subscription', validations: ['r'], options: [{key: '0', value: 'No'}, {'key': '1', value: 'Yes'}]}
                                                ]
                                            },
                                            {
                                                fields: [
                                                    {key: 'status', type: 'switch', name: 'status', label: 'Status', validations: ['r'], options: [{key: '0', value: 'Disabled'}, {'key': '1', value: 'Enabled'}]}
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }}
                        />
                    </Grid>
                </Grid>
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

export default withRouter(CustomersAdd);