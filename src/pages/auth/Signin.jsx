import React, { Component } from 'react';

import { Link, Navigate } from "react-router-dom";

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import ArrowBack from '@mui/icons-material/ArrowBack';

import ValidatorHelper from 'helpers/ValidatorHelper';
import LayoutHelper from 'helpers/LayoutHelper'

import Btn from 'components/Btn';
import Api from 'api/Api';

import bg_image from 'assets/images/login-bg.webp?v=4';
import logo from 'assets/images/logo.webp';

class Signin extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            loading: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            email: '',
            password: '',

            email_error: false,
            password_error: false,

            forgot_password: false,
            forgot_password_message: false,
        }
    }

    /**
     * Reads the logged-in customer object from localStorage.
     * Returns null if not present / not parsable.
     */
    static getUser = () => {

        try {

            var raw = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

            if(!raw){

                return null;
            }

            return JSON.parse(raw);

        }catch(e){

            return null;
        }
    }

    /**
     * True when the given (or currently logged-in) customer is an
     * account owner/admin, i.e. users_of is blank/null/undefined.
     * Admins get every permission regardless of roles_row.
     */
    static isAdmin = (user) => {

        var customer = (user !== undefined) ? user : Signin.getUser();

        if(!customer){

            return false;
        }

        var usersOf = customer.users_of;

        return (usersOf === '' || usersOf === null || usersOf === undefined);
    }

    /**
     * Safely parses customer.roles_row.permissions (a JSON string) into
     * an object. Returns {} if missing / not parsable.
     */
    static getPermissions = (user) => {

        var customer = (user !== undefined) ? user : Signin.getUser();

        if(!customer || !customer.roles_row || !customer.roles_row.permissions){

            return {};
        }

        try {

            return JSON.parse(customer.roles_row.permissions);

        }catch(e){

            return {};
        }
    }

    /**
     * Boolean permission check - use this for simple show/hide UI logic.
     * Granted only when the permission's value is strictly `true`
     * (or the user is admin). Values like "partial", "limited", "request",
     * "one_tier", "dual_control" are intentionally treated as NOT granted
     * here, since they represent conditional/capped access rather than
     * full access.
     */
    static can = (key, user) => {

        var customer = (user !== undefined) ? user : Signin.getUser();

        if(Signin.isAdmin(customer)){

            return true;
        }

        var permissions = Signin.getPermissions(customer);

        return permissions[key] === true;
    }

    componentDidMount = () => {
        
       var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({logged_in: true})
        }
    }

    loginSubmit = (event) => {

        if(this.state.forgot_password){

            this.forgotPassword(event)
            return;
        }

        event.preventDefault();

        var _has_error = false;

        const email = this.state.email;
        const password = this.state.password;

        if(!ValidatorHelper.validEmail(email)){

            this.setState({email_error: true})
            _has_error = true;
        }else{

            this.setState({email_error: false})
            _has_error = (!_has_error) ? false : true;
        }

        if(password === ''){

            this.setState({password_error: true})
            _has_error = true;
        }else{

            this.setState({password_error: false})
            _has_error = (!_has_error) ? false : true;
        }
        
        if(!_has_error){

            var that = this;

            var formData = new FormData();

            formData.append('email', email);
            formData.append('password', password);

            this.setState({loading: true})

            Api.post('app/account/auth/login', formData, function(data){

                that.setState({loading: false});

                if(data.status){

                    // data.customer carries users_of + roles + role_names + roles_row
                    // (roles_row.permissions / risk_authority) when the customer was
                    // invited under another account. When users_of is blank, the
                    // customer is the account owner/admin and gets every permission -
                    // see Signin.isAdmin() / Signin.can() above. We persist the whole
                    // object as-is so those static helpers can read it later from
                    // anywhere in the app without another API call.
                    localStorage.setItem(import.meta.env.VITE_ACCOUNT_TOKEN, data.account_token);
                    localStorage.setItem(import.meta.env.VITE_ACCOUNT_USER, JSON.stringify(data.customer)); 

                    localStorage.setItem('flash_success_message', data.message);
                    that.setState({success_message: data.message})

                    window.location = '/dashboard';

                }else{

                    that.setState({error_message: data.message})
                    window.setTimeout(() => {

                        that.setState({error_message: ''})
                    }, 5000)
                }
            });
        }
    }

    render(){

        if(this.state.logged_in){

            return <Navigate to="/dashboard" />
        }
    
        return (
            <Grid container spacing={2}>
                <Grid size={12} sx={{position:'relative'}}>
                    <div>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>

                            <div className='login-box'>
                                <div className='login-header'>
                                    <img
                                    src={logo}
                                    alt="DollarTraq"
                                    className="h-[50px] w-auto"
                                    />
                                </div>
                                <div className='login-body'>
                            
                                    <form onSubmit={this.loginSubmit.bind(this)}>
                                    
                                        <Grid container spacing={4}>

                                            {(this.state.error_message !== '' || this.state.success_message !== '') &&
                                            
                                                <Grid item md={12}>

                                                    {this.state.error_message !== '' &&
                                                    
                                                        <Alert severity="error" onClick={() => {

                                                            this.setState({error_message: ''})
                                                        }}>{this.state.error_message}</Alert>
                                                    }

                                                    {this.state.success_message !== '' &&
                                                    
                                                        <Alert severity="success" onClick={() => {

                                                            this.setState({success_message: ''})
                                                        }}>{this.state.success_message}</Alert>
                                                    }
                                                </Grid>
                                            }

                                            <Grid item size={12}>

                                                <div className='align-center vertical'>
                                                    <strong className='fs-20 gr-9'>Login Into Your Account</strong>
                                                </div>
                                            </Grid>
                                            <Grid item size={12} sx={{marginTop:'30px'}}>

                                            <TextField
                                                    label="Email ID"
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.email}
                                                    onChange={(e) => {
                                                        this.setState({ email: e.target.value });
                                                    }}
                                                    error={this.state.email_error}
                                                    fullWidth
                                                    helperText={this.state.email_error ? 'Please enter valid email address' : ''}
                                                    autoComplete="off"
                                                    sx={{
                                                        '& .MuiInputLabel-root': {
                                                            color: '#000',
                                                        },
                                                        '& .MuiInputLabel-root.Mui-focused': {
                                                            color: '#000',
                                                        },
                                                        '& .MuiOutlinedInput-input': {
                                                            color: '#000',
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            {this.state.forgot_password === false &&
                                            
                                                <Grid item size={12}>

                                                   <TextField
                                                        label="Password"
                                                        variant="outlined"
                                                        type="password"
                                                        size="small"
                                                        value={this.state.password}
                                                        onChange={(e) => {
                                                            this.setState({ password: e.target.value });
                                                        }}
                                                        error={this.state.password_error}
                                                        fullWidth
                                                        helperText={this.state.password_error ? 'Please enter valid password' : ''}
                                                        autoComplete="off"
                                                        sx={{
                                                            '& .MuiInputLabel-root': {
                                                                color: '#000',
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': {
                                                                color: '#000',
                                                            },
                                                            '& .MuiOutlinedInput-input': {
                                                                color: '#000',
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            }

                                            <Grid size={12} sx={{display:'flex', alignItems:'center', justifyContent:'flex-end', flexDirection:'column'}}>

                                                {this.state.forgot_password
                                                    ?
                                                        <Btn color="secondary" variant='contained' size="large" sx={{width:'100%'}} type="submit" loading={this.state.loading}>
                                                            Send Password Email
                                                        </Btn>
                                                    :
                                                        <Btn color="secondary" variant='contained' size="large" sx={{width:'100%'}} type="submit" loading={this.state.loading}>
                                                            LOGIN
                                                        </Btn>
                                                }

                                                {this.state.forgot_password
                                                    ?
                                                        <Btn rounded="full" color="primary" size="small" startIcon={<ArrowBack />} className="mt-10" onClick={() => {

                                                            this.setState({forgot_password: false, email: '', email_error: ''})
                                                        }}>Back to Login</Btn>
                                                    :
                                                        <Btn size="small" className="mt-10" onClick={() => {

                                                            this.setState({forgot_password: true, email: '', email_error: false, password: '', password_error: false})
                                                        }}>Forgot Password?</Btn>
                                                }
                                            </Grid>
                                        </Grid>
                                    </form>
                                </div>
                            </div>
                            <div className='login-container' style={{backgroundImage:`url(${bg_image})`}}>
                                <div className='login-container-wrapper'></div>
                            </div>
                        </Box>
                    </div>
                </Grid>
            </Grid>
        )
    }

    forgotPassword = (event) => {

        event.preventDefault();

        var _has_error = false;

        const email = this.state.email;

        if(email === '' || !ValidatorHelper.validEmail(email)){

            this.setState({email_error: true})
            _has_error = true;
        }else{

            this.setState({email_error: false})
            _has_error = (!_has_error) ? false : true;
        }
        
        if(!_has_error){

            let that = this;

            this.setState({loading: true})

            let formData = new FormData();

            formData.append('email', email);

            Api.post('app/account/auth/password/forgot', formData, function(data){

                that.setState({loading: false});

                if(data.status){

                    that.setState({success_message: data.message, forgot_password: false, email: ''}, () => {

                        setTimeout(() => {

                            that.setState({success_message: ''})
                        }, 12000)
                    })

                }else{

                    that.setState({error_message: data.message})
                    window.setTimeout(() => {

                        that.setState({error_message: ''})
                    }, 5000)
                }
            });
        }
    }
}

export default Signin;
