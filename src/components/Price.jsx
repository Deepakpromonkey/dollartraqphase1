
import React, { Component } from 'react';

import Rupee from 'components/Rupee';

class Price extends Component { 

    constructor(props) {
        super();
        this.state = {

            price: 0,
            special_price: 0,

            discount: 0
        }
    }

    componentDidMount = () => {

        this.setState({price: this.props.price})

        if(this.props.special_price && parseFloat(this.props.special_price) > 0 && parseFloat(this.props.special_price) < parseFloat(this.props.price)){

            this.setState({special_price: this.props.special_price, discount: Math.floor(parseFloat(this.props.price) - parseFloat(this.props.special_price))})
        }
    }

    componentDidUpdate = (prevProps) => {

        if(
            prevProps.price !== this.props.price
            ||
            prevProps.special_price !== this.props.special_price
        ){

            this.setState({price: this.props.price})

            if(this.props.special_price && parseFloat(this.props.special_price) > 0 && parseFloat(this.props.special_price) < parseFloat(this.props.price)){

                this.setState({special_price: this.props.special_price, discount: parseFloat(this.props.price) - parseFloat(this.props.special_price)})

                // this.setState({discount_percentage: Math.ceil( ((parseFloat(this.props.price) - parseFloat(this.props.special_price)) * 100 ) / parseFloat(this.props.price))})
            }   
        }
    }

    render(){

        let size = this.props.size ? this.props.size : 'xl';
        let sm_size = 'fs-12';

        let sizes = {
            'xs': 'fs-11',
            'sm': 'fs-12',
            'md': 'fs-14',
            'lg': 'fs-16',
            'xl': 'fs-20',
            '2xl': 'fs-24',
            '3xl': 'fs-24',
        }

        if(this.props.size in sizes){

            sm_size = sizes[this.props.size];
        }

        return (
            <div className={`flex items-center justify-end`}>

                {this.props.hide_icon
                    ?
                        null
                    :
                        <span>
                            <Rupee size={this.props.icon_size ? this.props.icon_size : 10} />
                        </span>
                }

                {this.state.special_price > 0
                    ?
                        <div className={`flex ${this.props.vertical ? 'flex-col items-start justify-start leading-tight mr-2' : ''}`}>
                            <span className={`${this.props.vertical ? '' : 'mr-2 ml-2'} ${sm_size} opacity-50 line-through`}>{this.state.price}</span>
                            <span className={`fw-semibold ${sm_size}`}>{this.state.special_price}</span>
                            <span className={`fw-semibold ${sm_size}`}>/-</span>
                        </div>
                    :
                        <span className={`fw-semibold ${sm_size}`}>{this.state.price}/-</span>
                }
            </div>
        )
    }
}

export default Price;