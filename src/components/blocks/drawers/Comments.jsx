import React, { Component } from 'react';

import { Drawer, IconButton } from '@material-ui/core';

import { Clear } from '@material-ui/icons';

import DataTable from '../data_table/DataTable';
class Comments extends Component { 
    constructor(props) {
        super();
        this.state = {

        }

        this.imageRef = null;
    }

    componentDidMount = () => {

    }

    render () {
        
        return (

            <>
                <Drawer anchor="right" open={this.props.comments_drawer} onClose={() => {
                    this.props.closeDrawer();
                }}>
                    <div className="drawer-container">
                        <div className="bg-primary drawer-heading">
                        <h2>Lead Comments</h2>

                            <IconButton size="small" onClick={() => {
                                this.props.closeDrawer();
                            }}>
                                <Clear style={{color:'rgba(0,0,0,.7)'}} />
                            </IconButton>
                        </div>
                    
                        <div className="drawer-body">

                            <div className="drawer-content">

                                <DataTable
                                    index="lead_comments"
                                    label="Lead Comments"

                                    columns={[
                                        {name: 'Name', column: 'first_name', sortable: true, renderer: (_data) => {

                                            return <span>{_data.first_name} {_data.last_name}</span>
                                        }},
                                        {name: 'Contact', column: 'mobile_number', sortable: true},
                                        {name: 'Comment', column: 'comment', sortable: true},

                                        {name: 'Added On', column: 'added_on', sortable: true, renderer: (_data) => {

                                            return <span>{_data.added_on_formatted}</span>
                                        }},
                                    ]}

                                    default_sort_by="added_on"

                                    api_url="leads/user_leads_comments"

                                    account_token={this.props.account_token}

                                    post_params={this.props.post_params}
                                    
                                    row_id="id"
                                />

                            </div>
                        </div>

                    </div>
                </Drawer>
            </>
        )
    }

}
export default Comments;