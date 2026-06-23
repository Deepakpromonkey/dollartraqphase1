import React, { Component } from 'react';

class CustomerRenderAddress extends Component {

    componentDidMount = () => {

        console.log(this.props.address);
    }

    variable = (_var) => {

        if(this.props.prefix){

            _var = `${this.props.prefix}_${_var}`
        }

        if(this.props.address.hasOwnProperty(_var)){

            return this.props.address[_var]
        }

        return false;
    }

    render(){

        return (

            <>
                {this.props.address &&
                
                    <div className='vertical fs-12'>
                        {this.props.label &&
                            <label className='fs-14 fw-bold mb-10'>{this.props.label}</label>
                        }

                        {this.variable('contact') &&
                        
                            <span>{this.variable('contact')}</span>
                        }

                        {this.variable('address') &&
                        
                            <span>{this.variable('address')}</span>
                        }

                        {this.variable('address_2') &&
                        
                            <span>{this.variable('address_2')}</span>
                        }

                        {(this.variable('city') || this.variable('zipcode')) &&
                        
                            <div>
                                {this.variable('city') &&

                                    <span>{this.variable('city')}</span>
                                }

                                {this.variable('zipcode') &&

                                    <span> - {this.variable('zipcode')}</span>
                                }
                            </div>
                        }

                        <div>
                            {this.variable('state_name') &&
                            
                                <span>{this.variable('state_name')}</span>
                            }

                            {this.variable('country_name') &&
                            
                                <span>, {this.variable('country_name')}</span>
                            }
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default CustomerRenderAddress;