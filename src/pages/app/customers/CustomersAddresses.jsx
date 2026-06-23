import React, { Component } from 'react';

import WdForm from 'components/wd/form/WdForm';
import DataTable from 'components/wd/data_table/DataTable';

import Btn from 'components/Btn';

import Dns from '@mui/icons-material/Dns';
import Home from '@mui/icons-material/Home';
import Edit from '@mui/icons-material/Edit';
import Add from '@mui/icons-material/Add';

import Api from 'api/Api';

import LayoutHelpers from 'helpers/LayoutHelper';

class CustomersAddresses extends Component {

    constructor(props) {
        super();
        this.state = {

            customers_groups: [],
            countries: [],

            add_address: false,

            reload_address: false
        }
    }

    componentDidMount = () => {

        var account_token = localStorage.getItem('sbcm_chit');
        
        if(account_token){
            
            this.init(account_token)
        }
    }

    render(){

        return (

            <>
                <DataTable
                    index="customer_address"
                    label="Address"

                    toolbar_actions={[
                        {key: 'add_customer_address_action', label: 'Add New Address', 'startIcon': <Add />, onClick: (e) => {
                
                            this.setState({add_address: true})
                        }}
                    ]}

                    do_reload={this.state.reload_address}
                    relaodDone={() => {

                        this.setState({reload_address: false});
                    }}

                    filter_params={[
                        {key: 'customer_id', value: this.props.row_id}
                    ]}

                    columns={[
                        {name: 'Contact', column: 'contact', sortable: true},
                        {name: 'Address', column: 'address', sortable: true},
                        {name: 'City', column: 'city', sortable: true},
                        {name: 'Zipcode', column: 'zip_code', sortable: true},
                        {name: 'Address Type', column: 'address_type', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: 'b', value: 'Billing Address'}, {'key': 's', value: 'Shipping Address'}]},
                    ]}

                    row_actions={(row, row_index) => {

                        return (

                            <div className="hoverable-action">
                                <div className="align-start">

                                    {this.props.source === 'sales' &&

                                        <Btn size="small" color="secondary" startIcon={<Add style={{fontSize: 15}} />} onClick={() => {

                                            this.props.addAddress(row)
                                        }}>
                                            Use Address
                                        </Btn>
                                    }

                                    {this.props.source === 'customer' &&

                                        <Btn to={`/customers/add/${row.row_id}`} size="small" color="secondary" startIcon={<Edit style={{fontSize: 15}} />}>
                                            Edit
                                        </Btn>
                                    }
                                </div>
                            </div>
                        )
                    }}

                    default_sort_by="added_on"

                    api_url="customers/address/listing"

                    account_token={this.state.account_token}
                    
                    row_id="row_id"
                />

                <WdForm
                    title='Customer Address'

                    size="medium"

                    drawer={true}
                    open={this.state.add_address}
                    position="right"

                    submit_url='customers/address/save'
                    data_url='customers/address/data'

                    onBack={() => {
                
                        this.setState({add_address: false})
                    }}
                    onSubmit={(result) => {

                        this.setState({reload_address: true, add_address: false})
                        LayoutHelpers.addSuccessMessage(this, result.message)
                    }}

                    post_fields={[
                        {key: 'customer_id', value: this.props.row_id}
                    ]}

                    row_id={false}
                    id="row_id"
                    title_field="name"
                    updated_on="updated_on_formatted"

                    is_view={this.state.is_view}

                    fields={{
                        rows: [
                            {
                                fields: [
                                    {key: 'address_type', type: 'radio', name: 'address_type', label: 'Address Type', validations: ['r'], options: [{key: 'b', value: 'Billing Address'}, {'key': 's', value: 'Shipping Address'}]}
                                ]
                            },
                            {
                                fields: [
                                    {key: 'contact', type: 'input', name: 'contact', label: 'Contact', validations: ['r', 'min-10'], span: 6}
                                ],
                            },
                            {
                                fields: [
                                    {key: 'address', type: 'input', rows: 3, name: 'address', label: 'Address', validations: ['r'], span: 12}
                                ],
                            },
                            {
                                fields: [
                                    {key: 'city', type: 'input', name: 'city', label: 'City', validations: ['r'], span: 6},
                                    {key: 'state', type: 'input', name: 'state', label: 'State', validations: ['r'], span: 6}
                                ],
                            },
                            {
                                fields: [
                                    {key: 'zip_code', type: 'input', name: 'zip_code', label: 'Zipcode', validations: ['r'], span: 6},
                                    {key: 'country', type: 'dropdown', name: 'country', label: 'Country', validations: ['r'], span: 6, options: this.state.countries}
                                ],
                            },
                            {
                                fields: [
                                    {key: 'is_primary', type: 'switch', name: 'is_primary', label: 'Is Primary', options: [{key: '0', value: 'No'}, {'key': '1', value: 'Yes'}]}
                                ]
                            }
                        ]
                    }}
                />
            </>
            
        )
    }

    init = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        var self = this;
        Api.post('customers/init', formData, function(data){

            if(data.status){

                self.setState({
                    customers_groups: data.customers_groups,
                    countries: data.countries
                });
            }
        });
    }
}

export default CustomersAddresses;