"use client";

import React, { Component } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Btn from '@/components/Btn';

import Main from '@/components/Main';

import TextField from '@mui/material/TextField';

import Api from '@/api/Api';

import ProfileSidebar from './ProfileSidebar';

import LayoutHelper from '@/helpers/LayoutHelper';


class ProfilePassword extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,
            row_id: false,

            error_message: '',
            success_message: '',

            loading: false,

            old_password: '',
            password: '',
            confirm_password: '',

            old_password_error: false,
            password_error: false,
            confirm_password_error: false,
        }
    }


    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

        if (!account_token) {account_token = localStorage.getItem("cnc_employees_chip");}

        if (!user) {user = localStorage.getItem("cnc_employees_user");}

        if (account_token && user) {


            this.setState({account_token: account_token,user: JSON.parse(user),row_id: JSON.parse(user)?.row_id || false,});

        } else {

            this.setState({error_message: 'Login details not found.',});
        }
    }


    render() {

        return (

            <Main
                page="profile"
                active_page="profile"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
                full_width={true}
            >
                <Grid container spacing={0}>


                    <Grid size={{ xs: 12, md: 2 }}>

                        <ProfileSidebar
                            active="profile_change_password"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 10 }}>

                        <Box sx={{ padding: { xs: '20px 15px', sm: '20px 30px', md: '20px 50px' } }}>

                            <div className="main-title-block">

                                <h1>Update Password</h1>
                            </div>

                            <Grid container spacing={2}>

                                <Grid size={{ xs: 12, sm: 10, md: 6, lg: 4 }}>
                                    <TextField
                                        label="Current Password"
                                        placeholder='Enter Current Password'
                                        variant="outlined"
                                        size="small"
                                        value={this.state.old_password}
                                        onChange={(e) => {


                                            this.setState({ old_password: e.target.value })
                                        }}
                                        error={this.state.old_password_error}
                                        type="password"
                                        fullWidth
                                        helperText={this.state.old_password_error ? 'This is required field' : ''}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid size={12}></Grid>
                                <Grid size={{ xs: 12, sm: 10, md: 6, lg: 4 }}>
                                    <TextField
                                        label="New Password"
                                        placeholder='Enter New Password'
                                        variant="outlined"
                                        size="small"
                                        type="password"
                                        value={this.state.password}
                                        onChange={(e) => {

                                            this.setState({ password: e.target.value })
                                        }}
                                        error={this.state.password_error}
                                        fullWidth
                                        helperText={this.state.password_error ? 'Password must be at least 6 characters.' : ''}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid size={12}></Grid>
                                <Grid size={{ xs: 12, sm: 10, md: 6, lg: 4 }}>
                                    <TextField
                                        label="Confirm Password"
                                        placeholder='Enter Confirm Password'
                                        variant="outlined"
                                        size="small"
                                        type="password"
                                        value={this.state.confirm_password}
                                        onChange={(e) => {

                                            this.setState({ confirm_password: e.target.value })
                                        }}
                                        error={this.state.confirm_password_error}
                                        fullWidth
                                        helperText={this.state.confirm_password_error ? 'Must match new password.' : ''}
                                        autoComplete="off"
                                    />
                                </Grid>
                                <Grid size={12}></Grid>
                                <Grid size={{ xs: 12, sm: 10, md: 6, lg: 4 }}>

                                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' } }}>

                                        <Btn
                                            color="primary"
                                            variant='contained'
                                            type="submit"
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                            loading={this.state.loading}
                                            onClick={() => {

                                                this.submit()
                                            }}
                                        >
                                            Reset Password
                                        </Btn>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Main>
        )
    }


    submit = () => {

        var _has_error = false;

        const old_password = this.state.old_password;
        const password = this.state.password;
        const confirm_password = this.state.confirm_password;
        const row_id = this.state.row_id;

        if (old_password === '') {

            this.setState({ old_password_error: true })
            _has_error = true;
        } else {

            this.setState({ old_password_error: false })
            _has_error = (!_has_error) ? false : true;
        }

        if (password === '' || password.length < 6) {

            this.setState({ password_error: true })
            _has_error = true;
        } else {

            this.setState({ password_error: false })
            _has_error = (!_has_error) ? false : true;
        }

        if (confirm_password === '' || confirm_password !== password) {

            this.setState({ confirm_password_error: true })
            _has_error = true;
        } else {

            this.setState({ confirm_password_error: false })
            _has_error = (!_has_error) ? false : true;
        }

        if (!row_id) {

            LayoutHelper.addErrorMessage(this, 'User row_id not found.');
            _has_error = true;
        }

        if (!_has_error) {

            let that = this;

            const formData = new FormData();

            formData.append('row_id', row_id)
            formData.append('old_password', old_password)
            formData.append('new_password', password)
            formData.append('password', confirm_password)
            formData.append('account_token', this.state.account_token)

            this.setState({ loading: true })

            Api.post('app/profile/update/password', formData, function (data) {

                that.setState({ loading: false });

                if (data.status) {

                    localStorage.setItem('flash_success_message', data.message)
                    window.location = '/logout';

                } else {

                    LayoutHelper.addErrorMessage(that, data.message)
                }
            });
        }
    }
}


export default ProfilePassword;