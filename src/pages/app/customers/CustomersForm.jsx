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

class CustomersForm extends Component {

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

                <WdForm
                    title='Customer'

                    drawer={true}
                    open={this.props.open}
                    position="right"

                    submit_url='customers/save'
                    data_url='customers/data'

                    onBack={() => {
                
                        this.props.onBack()
                    }}
                    onSubmit={(result) => {
                
                        this.props.onSubmit(result)
                    }}

                    row_id={this.props.row_id}
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
                                            {key: 'newsletter', type: 'switch', name: 'newsletter', label: 'Newsletter Subscription', options: [{key: '0', value: 'No'}, {'key': '1', value: 'Yes'}]}
                                        ]
                                    },
                                    {
                                        fields: [
                                            {key: 'status', type: 'switch', name: 'status', label: 'Status', options: [{key: '0', value: 'Disabled'}, {'key': '1', value: 'Enabled'}]}
                                        ]
                                    }
                                ]
                            },
                            {
                                key: 'address',
                                title: 'Address',
                                icon: <Home />,
                                rows: [
                                    {
                                        fields: [
                                            {key: 'address_html', span: 12, type: 'html', html: (
                                                <div>
                                                    {this.props.row_id !== false
                                                        ?
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
                                                                    // {name: 'Newsletter Subscription', column: 'newsletter', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: [{key: '0', value: 'No'}, {key: '1', value: 'Yes'}]},
                                                                ]}

                                                                row_actions={(row, row_index) => {

                                                                    return (

                                                                        <div className="hoverable-action">
                                                                            <div className="align-start">

                                                                                <Btn to={`/customers/add/${row.row_id}`} size="small" color="secondary" startIcon={<Edit style={{fontSize: 15}} />}>
                                                                                    Edit
                                                                                </Btn>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }}

                                                                default_sort_by="added_on"

                                                                api_url="customers/address/listing"

                                                                account_token={this.state.account_token}
                                                                
                                                                row_id="row_id"
                                                            />
                                                        :
                                                            <div>
                                                                <p className='fs-14 fw-bold c-primary'>Address can be added after customer is created.</p>
                                                            </div>
                                                    }
                                                </div>
                                            )}
                                        ]
                                    }
                                ]
                            }
                        ]
                    }}
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

export default CustomersForm;