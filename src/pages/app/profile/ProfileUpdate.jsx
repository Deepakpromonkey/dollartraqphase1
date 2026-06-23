import React, { Component } from 'react';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import WdForm from 'components/wd/form/WdForm';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Avatar from '@mui/material/Avatar';

import ProfileSidebar from './ProfileSidebar';

class ProfileUpdate extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            error_message: '',
            success_message: '',
            
            do_reload: false,

            add_item: false,
            
            row_id: false,
            active_row: false,

            loading: false,

            status_options: [
                {key: 0, value: 'Inactive'},
                {key: 1, value: 'Active'},
            ],

            country_states: []
        }
    }

    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);
        
        if(account_token && user){

            this.setState({account_token: account_token, user: JSON.parse(user)});
        }else{

            // window.location = Api.url + 'logout';
        }
    }

    render(){

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
                        <ProfileSidebar active="profile_update" />
                    </Grid>
                    <Grid size={{ xs: 12, md: 10 }}>

                        <Box sx={{padding: { xs: '20px 15px', sm: '20px 30px', md: '20px 50px' } }}>

                            <div className="main-title-block">
                                        
                                <h1>Profile Information</h1>
                            </div>

                            <Grid container spacing={3}>

                                <Grid size={12} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>

                                    <Avatar src={this.state.user.profile_pic_url} sx={{ width: { xs: 100, md: 140 }, height: { xs: 100, md: 140 },   backgroundColor: '#ee7f33',  fontSize: 30,   fontWeight: 'bold',  color: 'rgba(255,255,255,.5)',  textAlign: 'center'}}>{this.state.user.name}</Avatar>

                                </Grid>

                                <Grid size={12}>
                                    <div className="vertical">
                                        <label className='fs-13'>Name</label>
                                        <strong className='fs-14'>{this.state.user.first_name} {this.state.user.last_name}</strong>
                                    </div>
                                </Grid>

                                <Grid size={12}>
                                    <div className="vertical">
                                        <label className='fs-13'>Email</label>
                                        <strong className='fs-14' style={{ wordBreak: 'break-all' }}>{this.state.user.email}</strong>
                                    </div>
                                </Grid>

                                <Grid size={12}>
                                    <div className="vertical">
                                        <label className='fs-13'>Mobile</label>
                                        <strong className='fs-14'>{this.state.user.contact}</strong>
                                    </div>
                                </Grid>

                                <Grid size={12}>
                                    <div className="vertical">
                                        <label className='fs-13'>Member Since</label>
                                        <strong className='fs-14'>{this.state.user.added_on_formatted}</strong>
                                    </div>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                                        <Btn 
                                            color="primary" 
                                            variant="contained" 
                                            fullWidth={window.innerWidth < 600}
                                            onClick={() => {
                                                this.setState({ add_item: true, row_id: this.state.user.row_id })
                                            }}
                                        >
                                            Edit Profile
                                        </Btn>
                                    </Box>
                                </Grid>
                            </Grid>
                        
                            <WdForm
                                title="Profile Information"

                                drawer={true}
                                open={this.state.add_item}
                                position="right"
                                size={window.innerWidth < 600 ? "full" : "medium"}

                                onBack={() => {

                                    this.setState({add_item: false, row_id: false, active_row: false})
                                }}

                                submit_url='app/profile/update'
                                data_url='app/profile/load'

                                onSubmit={(result) => {

                                    if(result.status){

                                        if(result.user){

                                            localStorage.setItem(import.meta.env.VITE_ACCOUNT_USER, JSON.stringify(result.user));
                                            this.setState({user: result.user})
                                        }
                                    }

                                    this.setState({add_item: false, row_id: false, active_row: false, do_reload: true})
                                }}
                                    
                                row_id={this.state.row_id}
                                id="row_id"
                                title_field="first_name"
                                updated_on="updated_at_formatted"
                                                                
                                fields={{
                                    rows: [
                                        {
                                            fields: [
                                                {key: 'profile_pic', type: 'image', name: 'profile_pic', label: 'Profile Picture', validations: ['r'], span: 6, path: 'profile_pic/', formatted_field: 'profile_pic_url', allowed_types: 'jpg,png,webp'}
                                            ]
                                        },
                                        {
                                            fields: [
                                                {key: 'label', type: 'input', name: 'first_name', label: 'First Name', validations: ['r'], span: 3},
                                                {key: 'label', type: 'input', name: 'last_name', label: 'Last Name', validations: ['r'], span: 3}
                                            ]
                                        },
                                        {
                                            fields: [
                                                {key: 'label', type: 'input', name: 'contact', label: 'Mobile', validations: ['r', 'num', 'min-10'], span: 6}
                                            ]
                                        },
                                    ]
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Main>
        )
    }
}

export default ProfileUpdate;