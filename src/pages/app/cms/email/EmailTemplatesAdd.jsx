import React, { Component } from 'react';
import { useParams, useLocation } from "react-router-dom";

import Grid from '@mui/material/Grid';

import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import EmailContentHtml from './EmailContentHtml';

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

class EmailTemplatesAdd extends Component {

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

            content: '',
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
                active_page="cms"
                page="cms_emails_add"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
            >
            
                <Grid container spacing={2}>
                    <Grid item xs={6} lg={12}>
                        
                        <WdForm
                            title='Email Template'

                            submit_url='cms/emails/save'
                            back_url='cms/emails'
                            data_url='cms/emails/data'
                            edit_url='cms/emails/add'

                            row_id={this.state.row_id}
                            id="row_id"
                            title_field="title"
                            updated_on="updated_on_formatted"

                            onDataLoad={(row_data, result) => {

                                this.setState({content: row_data.content})
                            }}

                            post_fields={[
                                {key: 'content', value: this.state.content}
                            ]}

                            is_view={this.state.is_view}

                            fields={{
                                rows: [
                                    {
                                        fields: [
                                            {key: 'title', type: 'input', name: 'title', label: 'Title', validations: ['r'], span: 8}
                                        ],
                                    },
                                    {
                                        fields: [
                                            {key: 'subject', type: 'input', name: 'subject', label: 'Subject', validations: ['r'], span: 8}
                                        ],
                                    },
                                    {
                                        fields: [
                                            {key: 'code', name: 'code', label: 'Code', type: 'input', validations: ['r', '-_'], span: 8}
                                        ]
                                    },
                                    {
                                        fields: [
                                            {key: 'content_html', label: '', type: 'html', span: 12, html: (
                                                <div>
                                                    <EmailContentHtml
                                                        content={this.state.content}
                                                        updateContent={(content) => {

                                                            this.setState({content: content})
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        ]
                                    },
                                    {
                                        fields: [
                                            {key: 'status', name: 'status', label: 'Status', type: 'switch', validations: ['r'], options: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}], span: 4}
                                        ]
                                    },
                                ]
                            }}
                        />
                    </Grid>
                </Grid>
            </Main>
        )
    }
}

export default withRouter(EmailTemplatesAdd);