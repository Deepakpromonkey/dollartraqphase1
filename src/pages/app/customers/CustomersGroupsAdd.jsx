import React, { Component } from 'react';
import { useParams, useLocation } from "react-router-dom";

import Grid from '@mui/material/Grid';

import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

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

class CustomersGroupsAdd extends Component {

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
        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem('sbcm_chit');
        
        if(account_token){
            
            this.setState({account_token: account_token});
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
                            title='Customer Groups'

                            submit_url='customers/groups/save'
                            back_url='customers/groups'
                            data_url='customers/groups/data'
                            edit_url='customers/groups/add'

                            row_id={this.state.row_id}
                            id="row_id"
                            title_field="title"
                            updated_on="updated_on_formatted"

                            is_view={this.state.is_view}

                            size="small"

                            fields={{
                                rows: [
                                    {
                                        fields: [
                                            {key: 'title', type: 'input', name: 'title', label: 'Title', validations: ['r', 'unique|customers/groups/title_unique'], span: 8}
                                        ],
                                    },
                                    {
                                        fields: [
                                            {key: 'status', type: 'switch', name: 'status', label: 'Status', validations: ['r'], options: [{key: '0', value: 'Disabled'}, {'key': '1', value: 'Enabled'}]}
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
}

export default withRouter(CustomersGroupsAdd);