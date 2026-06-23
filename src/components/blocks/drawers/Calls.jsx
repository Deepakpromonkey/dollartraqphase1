import React, { Component } from 'react';

import { Drawer, IconButton } from '@material-ui/core';

import { Clear } from '@material-ui/icons';

import DataTable from '../data_table/DataTable';
class Calls extends Component { 
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
                <Drawer anchor="right" open={this.props.drawer} onClose={() => {
                    this.props.closeDrawer();
                }}>
                    <div className="drawer-container">
                        <div className="bg-primary drawer-heading">
                            <h2>{this.props.list_type == 'outbound' ? 'Outbound Calls' : 'Answered Calls'}</h2>

                            <IconButton size="small" onClick={() => {
                                this.props.closeDrawer();
                            }}>
                                <Clear style={{color:'rgba(0,0,0,.7)'}} />
                            </IconButton>
                        </div>
                    
                        <div className="drawer-body">

                            <div className="drawer-content">

                                {this.props.list_type == 'answered' &&
                                    
                                    <DataTable
                                        index="leads"
                                        label="Leads"

                                        columns={[
                                            {name: 'Name', column: 'first_name', sortable: true, renderer: (_data) => {

                                                return <span>{_data.first_name} {_data.last_name}</span>
                                            }},
                                            {name: 'Number', column: 'mobile_number', sortable: true},

                                            {name: 'Date', column: 'added_on', sortable: true, renderer: (_data) => {

                                                return <span>{_data.date_formatted}</span>
                                            }},
                                            
                                            {name: 'Call Recording', column: 'call_recording', sortable: true, renderer: (_data) => {

                                                if(_data.call_recording != ''){
                                                
                                                    return <span><a target="_blank" href={_data.call_recording}>Link</a></span>
                                                }
                                            }},

                                        ]}

                                        default_sort_by="added_on"

                                        api_url="leads/user_leads"

                                        account_token={this.props.account_token}

                                        post_params={this.props.post_params}
                                        
                                        row_id="id"
                                    />
                                }

                                {this.props.list_type == 'outbound' &&
                                    
                                    <DataTable
                                        index="leads"
                                        label="Leads"

                                        columns={[
                                            {name: 'Name', column: 'leads.first_name', sortable: true, renderer: (_data) => {

                                                return <span>{_data.first_name} {_data.last_name}</span>
                                            }},
                                            {name: 'Number', column: 'mobile_number', sortable: true},

                                            {name: 'Date', column: 'added_on', sortable: true, renderer: (_data) => {

                                                return <span>{_data.task_date_formatted}</span>
                                            }},

                                            {name: 'Created By', column: 'users.id', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.props.agents, renderer: (_data) => {

                                                return <span>{_data.user_first_name} {_data.user_last_name}</span>
                                            }},

                                            {name: 'Status', column: 'status', search_type: 'match', search_input: 'dropdown', search_data: [{key: 'new', value: 'Pending'}, {key: 'done', value: 'Done'}, {key: 'not_done', value: 'Not Done'}, {key: 'missed', value: 'Missed'}], renderer: (_data) => {

                                                return (
                                                    <>
                                                        <span className="badge bg-green">{_data.status === 'new' ? 'Pending' : _data.status}</span>
                                                    </>
                                                )
                                            }},

                                        ]}

                                        default_sort_by="added_on"

                                        api_url="leads/user_leads"

                                        account_token={this.props.account_token}

                                        post_params={this.props.post_params}
                                        
                                        row_id="id"
                                    />
                                }

                            </div>
                        </div>

                    </div>
                </Drawer>
            </>
        )
    }

}
export default Calls;