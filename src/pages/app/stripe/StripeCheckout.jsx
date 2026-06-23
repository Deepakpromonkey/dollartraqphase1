import React, { Component } from 'react';

import {ElementsConsumer} from '@stripe/react-stripe-js';

import CardForm from './CardForm';

class StripeCheckout extends Component {

    render(){

        return (

            <ElementsConsumer>
                {({stripe, elements}) => (

                    <>
                        <CardForm
                            account_token={this.props.account_token}
                            subscription_row_id={this.props.subscription_row_id}
                            package={this.props.package}
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

export default StripeCheckout;