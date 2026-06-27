import React, { Component } from 'react';

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Btn from 'components/Btn';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Api from 'api/Api';

import Main from 'components/Main';

import LayoutHelper from 'helpers/LayoutHelper'

class ShipmentCarriers extends Component {

    constructor(props) {
        super();
        this.state = {

            error_message: '',
            success_message: '',

            account_token: false,

            do_reload: false,

            row_id: false,

            add_new: false
        }
    }

    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({account_token: account_token})
        }
    }

    render(){

        return (

                <Main
                    page="carriers"
                    active_page="carriers"
                    title="Shipment Carriers"
                    subtitle="Monitor and manage all active shipment lifecycles with real-time driver authorization and status tracking."
                    error_message={this.state.error_message}
                    success_message={this.state.success_message}
                    title_action={[{
                        key: 'carriers_add', 
                        label: 'Add New Carrier', 
                        onClick: () => {
                            this.setState({add_new: true})
                        }
                    }]}
                >

                <DataTable
                    index="carriers"
                    label="Shipment Carriers"

                    active_row={this.state.active_row}

                    do_reload={this.state.do_reload}
                    relaodDone={() => {

                        this.setState({do_reload: false});
                    }}

                    columns={[
                       {name: 'Shipment Carrier', column: 'title', sortable: true, renderer: (row) => <span className="font-bold">{row.title}</span>},
                        {name: 'Person Name', column: 'person_name', sortable: true},
                        {name: 'Email', column: 'email', sortable: true},
                        {name: 'Mobile', column: 'mobile', sortable: true, renderer: (row) => <span className="font-bold">{row.mobile}</span>},
                    ]}

                    row_actions={(row, row_index) => {

                        return (

                            <div className="hoverable-action">
                                <div className="align-start">

                                   <Btn
                                        size="small"
                                        variant="text"
                                        disableRipple
                                        sx={{
                                            color: '#1e40af',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            padding: '8px 10px',
                                            '& .MuiButton-endIcon': {
                                            marginLeft: '15px',
                                            },
                                        }}
                                        endIcon={
                                            <ArrowForwardIcon
                                            sx={{
                                                fontSize: '12px',
                                                transform: 'scale(0.75, 0.9)',
                                            }}
                                            />
                                        }
                                        onClick={() => {
                                            this.setState({ row_id: row.row_id }, () => {
                                            this.setState({ add_new: true });
                                            });
                                        }}
                                        >
                                        View
                                        </Btn>
                                </div>
                            </div>
                        )
                    }}

                    default_sort_by="added_on"

                    api_url="app/shipment/carriers"

                    account_token={this.state.account_token}
                    
                    row_id="row_id"
                />

                <WdForm                        
                    drawer={true}
                    open={this.state.add_new}
                    position="center"
                    size="medium"
                    
                    title='Shipment Carrier'
                    back_label="Cancel"
        
                    submit_url='app/shipment/carriers/save'
                    data_url='app/shipment/carriers/single'
        
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
                                    {key: 'title', type: 'input', name: 'title', label: 'Title', validations: [], span: 12},
                                ]
                            },
                            {
                                fields: [
                                    {key: 'person_name', type: 'input', name: 'person_name', label: 'Person Name', validations: ['r'], span: 6},
                                    {key: 'mobile', type: 'input', name: 'mobile', label: 'Mobile', validations: ['r', 'number', 'min-10'], span: 6},
                                ]
                            },
                            {
                                fields: [
                                    {key: 'email', type: 'input', name: 'email', label: 'Email', validations: ['r', 'email'], span: 6},
                                ]
                            },
                        ]
                    }}
                />
            </Main>
            
        )
    }
}

export default ShipmentCarriers;