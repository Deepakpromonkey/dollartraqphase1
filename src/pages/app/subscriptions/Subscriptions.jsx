import React, { Component, Suspense } from 'react';
import { Navigate } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import WdForm from 'components/wd/form/WdForm';

import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import Close from '@mui/icons-material/Close';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ChevronRight from '@mui/icons-material/ChevronRight';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import LayoutHelper from 'helpers/LayoutHelper';

import StripeCheckout from 'pages/app/stripe/StripeCheckout';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {CardElement, PaymentElement} from '@stripe/react-stripe-js';

import cargo from 'assets/images/cargo.svg'

import Loader from 'components/Loader';

const stripePromise = loadStripe(`pk_test_51Sg6ybLaZzETjM5LFUpV3NrEAZ7IxCC6cYPEPRyskSlQ5xCOyLxIppkWga01xqJnb4Em7M4ees1bDkxjq93hVoKW00CcpBAIbX`);

class Subscriptions extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            user_subscribed_plan: false,

            initing: true,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            subscription_plans: [],

            checkout_popup: false,

            countries: [],
            country_states: [],

            secret: '',
            payment_request_id: false,
            payment_id: false,

            payment_confirm: false,

            selected_plan: false,

            subscription_popup: false,

            payment_client_secret: '',

            checkout_popup: false,
            client_secret: '',

            subscription_row_id: false,

            success_popup: false,
        }

        this.plansList = React.createRef()
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({account_token: account_token})

            this.init(account_token)
            this.countries(account_token)
        }
    }

    render(){

        if(this.state.redirect !== false){

            return <Navigate to={this.state.redirect} />
        }

        return (

            <Main
                active_page="subscription"
                
                page="subscriptions"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title="Subscription"
            >
                
                <>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <img src={cargo} style={{width:'100%'}} />
                        </Grid>
                        <Grid size={{ xs: 12, md: 8 }} sx={{ display: 'flex', alignItems: 'center' }}>

                            {this.state.user === false
                                ?
                                    <Stack sx={{width:'100%'}}>
                                        <Skeleton width="70%" height={50} variant='rounded' animation="wave" />
                                        <Skeleton width="100%" height={100} variant='rounded' style={{marginTop:10}} animation="wave" />
                                    </Stack>
                                :
                                    <Box>

                                        {this.state.user.active_plan !== ''
                                            ?
                                                <Box className="card">
                                                    <strong className='fs-13'>CURRENT PLAN</strong>
                                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mt: 1 }}>
                                                        <Box>
                                                            <h2 className='mb-0 mt-10 c-green'>{this.state.user_subscribed_plan.title}</h2>
                                                            <h3 className='mt-0 gr-7'>{this.state.user_subscribed_plan.sub_title}</h3>
                                                        </Box>
                                                        <Box>
                                                            {this.priceFormat(this.state.user_subscribed_plan)}
                                                        </Box>
                                                    </Box>
                                                    <p className='fs-12'>{this.state.user_subscribed_plan.details}</p>

                                                    <Box className="justify-end">
                                                        {this.state.user_subscribed_plan.is_demo == '1' &&
                                                        
                                                            <Btn size="small" endIcon={<ChevronRight />} onClick={() => {

                                                                this.plansList.current.scrollIntoView({behavior: 'smooth', block: 'start'})
                                                            }}>Upgrade Plan</Btn>
                                                        }
                                                    </Box>
                                                </Box>
                                            :
                                                <Box>
                                                    <h2 className='mb-0 c-red'>No Subscription</h2>
                                                    <h3 className='mt-0 c-red'>You dont have any plan subscribed yet!</h3>
                                                    <p>Please choose a plan from below.</p>
                                                </Box>
                                            }
                                    </Box>
                            }
                        </Grid>

                        <Grid size={12} ref={this.plansList}>
                            <Box sx={{borderTop:'1px solid rgba(0,0,0,.2)', marginTop:2}}>
                                <Box sx={{ maxWidth: { xs: '100%', md: '70%' },  marginTop: 5, mx: { xs: 'auto', md: 0 },  textAlign: { xs: 'center', md: 'left' }, px: { xs: 2, md: 0 } }}>
                                    <strong className='mb-5'>Choose the Perfect Plan for Your Growth</strong>
                                    <p className='fs-14'>Finding the right fit shouldn't be complicated. Compare our flexible pricing tiers designed to scale alongside your business, ensuring you only pay for the features you need today while staying ready for tomorrow.</p>
                                </Box>
                            </Box>
                        </Grid>

                        {this.state.initing
                            ?
                                <>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Skeleton height={200} width="100%" />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Skeleton height={200} width="100%" />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Skeleton height={200} width="100%" />
                                    </Grid>
                                </>
                            :
                                this.state.subscription_plans.map((subscription, index) => {

                                    return (
                                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`subscription_${index}`}>
                                            <Box className="subscription-card">
                                                <Box sx={{backgroundColor:'rgba(33, 135, 229, .2)', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:40}}>
                                                    <strong className='fs-15 gr-5'>{index + 1}</strong>
                                                </Box>
                                                <Box sx={{marginTop:1}}>
                                                    <div className='vertical'>
                                                        <strong className='fs-24 c-blue'>{subscription.title}</strong>
                                                        <strong>{subscription.sub_title}</strong>
                                                    </div>

                                                    <p className='fs-13'>{subscription.details}</p>

                                                    <div className='align-center mt-20 vertical'>

                                                        {this.priceFormat(subscription)}

                                                        <Btn endIcon={<ChevronRight />} color="secondary" variant="contained" className="mt-10" onClick={() => {

                                                            this.setState({selected_plan: subscription}, () => {

                                                                this.setState({subscription_popup: true})
                                                            })
                                                            
                                                        }}>Subscribe</Btn>
                                                    </div>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    )
                                })
                        }

                        <Grid size={12} sx={{marginBottom:10}}></Grid>
                    </Grid>

                    <WdForm
                        title=''

                        hide_header={true}

                        submit_label="Continue"

                        submit_url='app/subscription/purchase'
                        data_url='backend/subscription/plans/load'

                        drawer={true}
                        open={this.state.subscription_popup}
                        size="medium"
                        position="bottom"

                        onBack={() => {

                            this.setState({subscription_popup: false}, () => {

                                this.setState({selected_plan: false})
                            })
                        }}

                        onSubmit={(result) => {

                            if(result.status){

                                this.setState({subscription_row_id: result.subscription_id, subscription_popup: false}, () => {

                                    if(this.state.selected_plan.is_demo == '1'){

                                        this.setState({success_popup: true})
                                    }else{
                                    
                                        this.setState({checkout_popup: true})
                                    }
                                })
                            }
                        }}

                        post_fields={[
                            {key: 'package', value: this.state.selected_plan.row_id},
                            {key: 'payment_client_secret', value: this.state.payment_client_secret},
                        ]}
                        
                        row_id={this.state.row_id}
                        id="row_id"
                        title_field="name"
                        updated_on="updated_on_formatted"

                        fields={{
                            rows: [
                                {
                                    fields: [
                                        {key: 'plan_details_html', span: 12, type: 'html', html: (
                                            <div className='vertical'>
                                                <Box sx={{borderBottom:'1px solid rgba(0,0,0,.3)', paddingBottom:2, marginBottom:2}}>
                                                    <strong className='fs-18'>Billing Details</strong>
                                                </Box>
                                                <label className='fs-14 fw-semibold c-blue mt-10'>Selected Plan:</label>
                                                <div>
                                                    <strong className='fs-14'>{this.state.selected_plan.title}</strong>
                                                    <Btn size="small" className="ml-10" onClick={() => {

                                                        this.setState({subscription_popup: false}, () => {

                                                            this.setState({selected_plan: false})
                                                        })
                                                    }}>Change Plan</Btn>
                                                </div>
                                            </div>
                                        )},
                                        {key: 'plan_details_html', span: 12, type: 'html', html: (
                                            <div className='vertical'>
                                                <label className='fs-14 fw-semibold c-blue'>Amount to pay:</label>
                                                <div>
                                                    {this.state.selected_plan.special_price > 0
                                                        ?
                                                            <Box className="justify-start">
                                                                <span>$ <span className='fs-20' style={{textDecoration:'line-through'}}>{this.state.selected_plan.price}</span></span>
                                                                <span className='ml-5'> <strong className='fs-20'>{this.state.selected_plan.special_price}</strong></span>
                                                            </Box>
                                                        :
                                                            <Box className="justify-start">
                                                                <span>$ <strong className='fs-20'>{this.state.selected_plan.price}</strong></span>
                                                            </Box>
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'address', type: 'textarea', name: 'address', label: 'Address', validations: ['r'], span: 9},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'city', type: 'input', name: 'city', label: 'City', validations: ['r'], span: 5},
                                        {key: 'pincode', type: 'input', name: 'pincode', label: 'Pincode', validations: ['r'], span: 4},
                                    ],
                                },
                                {
                                    fields: [
                                        {key: 'state', type: 'input', name: 'state', label: 'State', validations: ['r'], span: 5, remove: this.state.country_states.length > 0 ? true : false},
                                        {key: 'state_id', type: 'dropdown', name: 'state_id', label: 'State', validations: ['r'], span: 5, options: this.state.country_states, remove: this.state.country_states.length > 0 ? false : true},
                                        {key: 'country', type: 'dropdown', name: 'country', label: 'Country', validations: ['r'], options: this.state.countries, span: 4, onChange: (v) => {

                                            const _states = this.state.countries.find(item => item.key === v);

                                            this.setState({country_states: _states.states})
                                        }}
                                    ],
                                }
                            ]
                        }}
                    />

                    <Dialog
                        open={this.state.checkout_popup}
                        onClose={() => {

                        }}
                    >

                        <DialogTitle>Make Payment</DialogTitle>
                        <DialogContent sx={{width: {'lg': '500px', 'xs': '100%'}, minHeight: {lg: 100}}}>
                        
                            {/* {this.state.client_secret !== '' && */}

                                <>

                                    {this.state.selected_plan !== false &&
                                    
                                        <div className='fs-13 mb_30'>
                                            <div className='justify-between mb_5' style={{borderBottom: '1px solid rgba(0,0,0,.2)', paddingBottom: 20, paddingTop: 20}}>
                                                <strong style={{width: '40%'}}>Package</strong>
                                                <span>{this.state.selected_plan.title}</span>
                                            </div>
                                            <div className='justify-between mb_5' style={{borderBottom: '1px solid rgba(0,0,0,.2)', paddingBottom: 20, paddingTop: 20}}>
                                                <strong style={{width: '40%'}}>Cost</strong>
                                                <span>${this.state.selected_plan.final_price}</span>
                                            </div>
                                        </div>
                                    }
                            
                                    <Elements stripe={stripePromise}>
                                        
                                        <StripeCheckout
                                            account_token={this.state.account_token}
                                            secret={this.state.client_secret}
                                            subscription_row_id={this.state.subscription_row_id}
                                            package={this.state.selected_plan.row_id}
                                            cancel={() => {

                                                this.setState({client_secret: ''})
                                                window.location = window.location.href;
                                            }}
                                            paymentProcessing={(status) => {

                                                this.setState({payment_loader: status})
                                            }}
                                            onError={(message) => {

                                                LayoutHelper.addErrorMessage(this, message)
                                            }}
                                            onSuccess={(data) => {

                                                this.setState({success_popup: true}, () => {

                                                    this.setState({checkout_popup: false})
                                                })
                                            }}
                                        />
                                    </Elements>
                                </>
                            {/* } */}

                            {this.state.payment_confirm &&

                                <Loader />
                            }
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={this.state.success_popup}
                        onClose={() => {

                        }}
                    >
                        <Box sx={{width:500, minHeight:300}}>

                            <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>

                                <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0, 139, 139, .1)', width:150, height:150, borderRadius:100, marginTop:10}}>
                                    <ThumbUp className='c-green' style={{fontSize:80}} />
                                </Box> 

                                <Box sx={{marginTop:5, marginBottom:10, textAlign:'center'}}>
                                    <strong className='fs-20 c-green'>Congratulations!</strong>
                                    <p>Your subscription has been confirmed.</p>

                                    <Btn endIcon={<Close />} variant="contained" color="primary" onClick={() => {

                                        window.location = window.location.href;
                                    }}>
                                        Close
                                    </Btn>
                                </Box>
                            </Box>
                        </Box>
                    </Dialog>
                </>
            </Main>
        )
    }

    init = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('page', 'subscriptions');

        var self = this;
        Api.post('app/customer/load', formData, function(data){

            self.setState({initing: false})

            if(data.status){

                self.setState({
                    subscription_plans: data.plans,
                    user: data.customer
                });

                if(data.customer.hasOwnProperty('plan')){

                    self.setState({user_subscribed_plan: data.customer.plan})
                }

                localStorage.setItem(import.meta.env.VITE_ACCOUNT_USER, JSON.stringify(data.customer));
            }
        });
    }

    countries = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        var self = this;
        Api.post('app/countries/country_states/load', formData, function(data){
            

            self.setState({initing: false})

            if(data.status){

                self.setState({
                    countries: data.data
                });
            }
        });
    }

    priceFormat = (subscription) => {

        return (
            <Box className="justify-start" sx={{flexDirection: { xs: 'column', sm: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }
            }}>
                
                {subscription.is_demo == '1'
                    ?
                        <strong className='c-green'>Start Free <span className='gr-4'>(No Cost)</span></strong>
                    :
                        <div>
                            {subscription.special_price > 0
                                ?
                                    <Box className="justify-center">
                                        <span>$ <span className='fs-20' style={{textDecoration:'line-through'}}>{subscription.price}</span></span>
                                        <span className='ml-5'> <strong className='fs-20'>{subscription.special_price}</strong></span>
                                    </Box>
                                :
                                    <Box className="justify-center">
                                        <span>$ <strong className='fs-20'>{subscription.price}</strong></span>
                                    </Box>
                            }
                        </div>
                }

                <Box className="justify-start "  sx={{ ml: { xs: 0, md: 2 }, mt: { xs: 1, md: 0 }}}>
                    <strong className='gr-5'>Loads Limit:</strong>
                    <strong className='ml-5'>{subscription.loads_limit}</strong>
                </Box>
            </Box>
        )
    }
}

export default Subscriptions;