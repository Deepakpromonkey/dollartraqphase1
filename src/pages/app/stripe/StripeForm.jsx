import React, { Component } from 'react';

import {loadStripe} from '@stripe/stripe-js';
import {Elements, CardElement, ElementsConsumer} from '@stripe/react-stripe-js';

import CardForm from './CardForm';

class StripeForm extends Component {

    render(){

        return (

            <ElementsConsumer>
                {({stripe, elements}) => (

                    <>
                        <CardForm
                            stripe={stripe}
                            elements={elements}
                            secret={this.props.secret}
                            cancel={() => {

                                this.props.cancel()
                            }}
                            paymentProcessing={(status) => {

                                this.props.paymentProcessing(status);
                            }}
                            onError={(message) => {

                                this.props.onError(message)
                            }}
                            onSuccess={(data) => {

                                this.props.onSuccess(data)
                            }}
                        />
                    </>
                )}
            </ElementsConsumer>
        )
    }
}

export default StripeForm;