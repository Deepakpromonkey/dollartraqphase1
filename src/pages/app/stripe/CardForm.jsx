import React, { Component } from 'react';

import {CardElement} from '@stripe/react-stripe-js';

import Stack from '@mui/material/Stack';

import Btn from 'components/Btn';

import Loader from 'components/Loader';

import Api from 'api/Api';

class CardForm extends Component {

    constructor(props) {
        super();

        this.state = {

            error: '',

            loading: false,

            cancel: false
        }
    }

    handleSubmit = async (e) => {
    
        e.preventDefault();

        this.setState({loading: true})

        const { paymentMethod, error } = await this.props.stripe.createPaymentMethod({
            type: 'card',
            card: this.props.elements.getElement('card'),
        });

        if(error){
      
            console.log('[error]', error);
            return;
        }

        const formData = new FormData();
        formData.append('account_token', this.props.account_token);
        formData.append('payment_method', paymentMethod.id);
        formData.append('package', this.props.package);
        formData.append('subscription_id', this.props.subscription_row_id);

        var self = this;
        Api.post('app/subscription/intent', formData, async function(data){

            if(data.status){

                self.handleSubscriptionStatus(data.subscription);
            }
        });
    };

    handleSubscriptionStatus = (subscription) => {
    
        const { latest_invoice } = subscription;
        const { payment_intent } = latest_invoice;

        this.setState({loading: false})

        let that = this;

        if(payment_intent && payment_intent.status === 'requires_action'){
      
            this.props.stripe.confirmCardPayment(payment_intent.client_secret).then((result) => {
        
                if(result.error){
                    
                    that.props.onError("There was an error while processing your request!")
                }else{
                    
                    this.props.onSuccess()
                }
            });
        }else{
      
            this.props.onSuccess()
        }
    };
    
    render() {
    
        const {stripe} = this.props;
        return (
          
            <form onSubmit={this.handleSubmit}>
                
                {/* {this.props.secret && */}
                    <div className="cc-form-container" style={{position: 'relative'}}>
                        <div className="cc-form">

                            <CardElement />
                            {/* <PaymentElement /> */}
                        </div>

                        <div className='mt_40' style={{borderTop: '1px solid #ccc', paddingTop: 20}}>
                            <Stack direction="row" alignItems="flex-end" justifyContent="flex-end">

                                <Btn size="small" loading={this.state.loading} onClick={() => {

                                    this.props.cancel()
                                }}>Cancel</Btn>

                                <Btn size="small" color="primary" variant='contained' type="submit" className="ml-10" loading={this.state.loading}>
                                    Make Payment
                                </Btn>
                            </Stack>
                        </div> 

                        {this.state.loading &&
                        
                            <Loader />
                        }
                    </div>
                {/* } */}
            </form>
        );
    }
}

export default CardForm;