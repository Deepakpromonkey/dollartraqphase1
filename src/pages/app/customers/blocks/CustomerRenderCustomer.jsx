import React, { Component } from 'react';

import Btn from 'components/Btn';

class CustomerRenderCustomer extends Component {

    constructor(props) {
        super();
        this.state = {

            customers_groups: [],
            countries: [],

            add_address: false,

            reload_address: false
        }
    }

    render(){

        return (

            <>
                {this.props.customer &&
                
                    <div className='vertical fs-12'>
                        {this.props.customer.hasOwnProperty('name') &&
                            <label className='fs-14 fw-bold'>{this.props.customer.name}</label>
                        }

                        {this.props.customer.hasOwnProperty('email') &&
                            <span>{this.props.customer.email}</span>
                        }

                        {this.props.customer.hasOwnProperty('contact') &&
                            <span>{this.props.customer.contact}</span>
                        }
                    </div>
                }
            </>
        )
    }
}

export default CustomerRenderCustomer;