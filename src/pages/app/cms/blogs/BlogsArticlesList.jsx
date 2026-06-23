import React, { Component } from 'react';
import { Navigate } from "react-router-dom";

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Edit from '@mui/icons-material/Edit';
import Dns from '@mui/icons-material/Dns';
import Newspaper from '@mui/icons-material/Newspaper';

import BlogsCategoriesTree from './BlogsCategoriesTree';

class BlogsArticlesList extends Component {

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

            add_new: false,

            categories: [],

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
                active_page="cms"
                
                page="cms_blogs_articles"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Blog Articles"

                title_action={[{key: 'cms_blogs_articles_add', label: 'Add New Article', onClick: () => {

                    this.setState({add_new: true})
                }}]}
            >
                
                <>

                    <DataTable
                        index="cms_blogs_articles"
                        label="Blog Articles"

                        active_row={this.state.active_row}

                        do_reload={this.state.do_reload}
                        relaodDone={() => {

                            this.setState({do_reload: false});
                        }}

                        columns={[
                            {name: 'Title', column: 'title', sortable: true},
                            {name: 'Slug', column: 'slug', sortable: true},
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

                        api_url="backend/cms/blogs/articles/listing"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />

                    <WdForm
                        title='Blog Article'

                        drawer={true}
                        open={this.state.add_new}
                        position="right"

                        submit_url='backend/cms/blogs/articles/save'
                        data_url='backend/cms/blogs/articles/data'
                        edit_url='cms/pages/add'

                        onSubmit={(result) => {
            
                            this.setState({add_new: false, do_reload: true, row_id: false})
                        }}
                        onBack={() => {
            
                            this.setState({add_new: false, row_id: false})
                        }}

                        onDataLoad={(row, result) => {
                            
                            this.setState({categories: row.category})
                        }}

                        row_id={this.state.row_id}
                        id="row_id"
                        title_field="title"
                        updated_on="updated_on_formatted"

                        post_fields={this.state.post_fields}

                        is_view={this.state.is_view}

                        fields={{
                            tabs: [
                                {
                                    key: 'general',
                                    title: 'Details',
                                    icon: <Dns />,
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
                                                {key: 'categories_html', type: 'html', name: 'categories_html', label: 'Categories', html: (
                                                    <div>
                                                        <label className='fs-13 fw-bold gr-7'>Categories</label>
                                                        <BlogsCategoriesTree
                                                            mode="selection"

                                                            selected_categories={this.state.categories}
                                                            onSelection={(categories) => {
                                        
                                                                this.setState({categories: categories}, () => {
                                        
                                                                    let post_fields = this.state.post_fields;
                                        
                                                                    const category_index = post_fields.findIndex(row => row.key === 'category');
                                        
                                                                    if(category_index > 0){
                                        
                                                                        post_fields[category_index]['value'] = JSON.stringify(categories);
                                                                    }else{
                                        
                                                                        post_fields.push({key: 'category', value: JSON.stringify(categories)})
                                                                    }
                                        
                                                                    this.setState({post_fields: post_fields})
                                                                })
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            ],
                                        },
                                        {
                                            fields: [
                                                {key: 'thumb', type: 'image', name: 'thumb', label: 'Thumb', validations: [], span: 6, path: 'cms/blogs/articles/', allowed_types: 'jpg,png,webp', formatted_field: 'thumb_url', span: 4},
                                                {key: 'banner', type: 'image', name: 'banner', label: 'Image', validations: [], span: 6, path: 'cms/blogs/articles/', allowed_types: 'jpg,png,webp', formatted_field: 'banner_url'},
                                            ],
                                        },
                                        {
                                            fields: [
                                                {key: 'article', type: 'editor', name: 'article', label: 'Content', validations: [], span: 12},
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
                                                {key: 'slug', type: 'input', name: 'slug', label: 'SEO Url (Slug)', validations: [], span: 12}
                                            ],
                                        },
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
}

export default BlogsArticlesList;