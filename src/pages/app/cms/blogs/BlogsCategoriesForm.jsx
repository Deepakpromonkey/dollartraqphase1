import React, { Component } from 'react';

import Dns from '@mui/icons-material/Dns';
import Newspaper from '@mui/icons-material/Newspaper';
import ReceiptLong from '@mui/icons-material/ReceiptLong';
import Clear from '@mui/icons-material/Clear';

import Btn from 'components/Btn';

import WdForm from 'components/wd/form/WdForm';

import BlogsCategoriesTree from './BlogsCategoriesTree';

class BlogsCategoriesForm extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,

            post_fields: [],

            show_categories: false,
            parent_titles: '',
        }
    }

    render(){

        return (

            <WdForm
                title='Blog Category'
                back_label="Cancel"

                drawer={true}
                open={this.props.show}
                position="right"
                size="large"
    
                submit_url='backend/cms/blogs/categories/save'
                data_url='backend/cms/blogs/categories/data'
    
                onSubmit={(result) => {
    
                    this.props.onSuccess(result)
                }}
                onBack={() => {
    
                    this.props.onBack()
                }}

                update_field={this.state.post_fields}
            
                row_id={this.props.selected_category !== false ? this.props.selected_category.row_id : false}
                id="row_id"
                title_field="name"
                updated_on="updated_on_formatted"
                                       
                post_fields={[
                    {key: 'parent_id', value: this.props.parent_category !== false ? this.props.parent_category.row_id : ''},
                    {key: 'level', value: this.props.level},
                ]}

                fields={{
                    tabs: [
                        {
                            key: 'general_tab',
                            title: 'General',
                            icon: <Dns />,
                            rows: [
                                {
                                    fields: [
                                        {key: 'status', type: 'switch', name: 'status', label: 'Status', validations: ['r'], span: 12, options: [{key: '0', value: 'Disabled'}, {key: '1', value: 'Enabled'}], value: '1'},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'parent_view', type: 'html', html: (
                                            <div>
                                                <strong className='gr-7 fs-13'>Parent Category</strong>

                                                {this.props.parent_category !== false
                                                    ?
                                                        <div className='justify-start fs-13 mt-10'>
                                                            <span className='fw-semibold'>{this.props.parent_titles}</span>

                                                            <Btn size="small" className="ml-10" onClick={() => {

                                                                this.setState({show_categories: true})
                                                            }}>Change Parent</Btn>

                                                            <Btn icon={true} size="small" className="ml-5" onClick={() => {

                                                                this.props.chooseParent(false, 0, '')
                                                            }}>
                                                                <Clear style={{fontSize: 16}} className='c-red' />
                                                            </Btn>
                                                        </div>
                                                    :
                                                        <div>

                                                            <Btn size="small" className="mt-10" onClick={() => {

                                                                this.setState({show_categories: true})
                                                            }}>Choose Parent</Btn>

                                                            {/* {this.state.parent_titles === ''
                                                                ?
                                                                    <Btn size="small" className="mt-10" onClick={() => {

                                                                        this.setState({show_categories: true})
                                                                    }}>Choose Parent</Btn>
                                                                :
                                                                    <div className='justify-start mt-10'>
                                                                        <span className='fw-semibold fs-13'>{this.state.parent_titles}</span>

                                                                        <Btn size="small" className=" ml-10" onClick={() => {

                                                                            let post_fields = [];

                                                                            post_fields.push({key: 'categories_group', value: this.props.categories_group})

                                                                            this.setState({show_categories: true, post_fields: post_fields, parent_titles: ''})
                                                                        }}>Change Parent</Btn>

                                                                        <Btn icon={true} size="small" className="ml-5" onClick={() => {

                                                                            let post_fields = [];

                                                                            post_fields.push({key: 'categories_group', value: this.props.categories_group})

                                                                            this.setState({post_fields: post_fields, parent_titles: ''})
                                                                            // this.props.removeParent()
                                                                        }}>
                                                                            <Clear style={{fontSize: 16}} className='c-red' />
                                                                        </Btn>
                                                                    </div>
                                                            } */}
                                                        </div>
                                                }

                                                {this.state.show_categories &&

                                                    <BlogsCategoriesTree
                                                        mode="parent"
                                                        chooseParent={(parent, level, parent_titles) => {

                                                            this.setState({show_categories: false})

                                                            this.props.chooseParent(parent, level, parent_titles)
                                                        }}
                                                    />
                                                }
                                            </div>
                                        )}
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'title', type: 'input', name: 'title', label: 'Title', validations: ['r'], span: 12},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'short_description', type: 'input', rows: 4, name: 'short_description', label: 'Short Description', validations: [], span: 12},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'banner', type: 'image', name: 'banner', label: 'Category Banner', validations: [], span: 6, path: 'cms/blogs/categories/', allowed_types: 'jpg,png,webp', formatted_field: 'banner_url'}
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'thumb', type: 'image', name: 'thumb', label: 'Thumb Image', validations: [], span: 6, path: 'cms/blogs/categories/', allowed_types: 'jpg,png,webp', formatted_field: 'thumb_url'}
                                    ],
                                },
                            ]
                        },
                        {
                            key: 'info_tab',
                            title: 'Details',
                            icon: <ReceiptLong />,
                            rows: [
                                {
                                    fields: [
                                        {key: 'description', type: 'editor', name: 'description', label: 'Description', validations: [], span: 12},
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
        )
    }
}

export default BlogsCategoriesForm;