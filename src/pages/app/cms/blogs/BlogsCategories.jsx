import React, { Component } from 'react';

import Grid from '@mui/material/Grid';

import Main from 'components/Main';

import BlogsCategoriesTree from './BlogsCategoriesTree';

class BlogsCategories extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({account_token: account_token})
        }
    }

    render(){

        return (

            <Main
                active_page="cms"
                
                page="cms_blogs_categories"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Blog Categories"
            >
                
                <Grid container spacing={3}>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        <BlogsCategoriesTree />
                    </Grid>
                </Grid>
            </Main>
        )
    }
}

export default BlogsCategories;