import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Box from '@mui/material/Box';

import Person from '@mui/icons-material/Person';
import Password from '@mui/icons-material/Password';

class ProfileSidebar extends Component {

    constructor(props) {
        super();
        this.state = {

        }
    }

    render(){

        return (

            <Box sx={{ backgroundColor: '#fff', display: 'flex', flexDirection: { xs: 'row', md: 'column' },  borderRight: { xs: 'none', md: '1px solid rgba(0,0,0,.1)' }, borderBottom: { xs: '1px solid rgba(0,0,0,.1)', md: 'none' },  minHeight: { xs: 'auto', md: '100vh' }, padding: { xs: '10px 15px', md: '30px 0px 40px 20px' },  overflowX: { xs: 'auto', md: 'visible' }, whiteSpace: 'nowrap', gap: { xs: 2, md: 0 } }}>

                <strong style={{   marginBottom: '15px',  display: 'block', fontSize: '14px' }}>
                    
                    <Box component="span" sx={{ display: { xs: 'none', md: 'block' } }}>
                        Profile Settings
                    </Box>

                </strong>

                <ul className='side-list' style={{  display: 'flex',  flexDirection: window.innerWidth < 900 ? 'row' : 'column',listStyle: 'none', padding: 0, margin: 0}}>
                    <li style={{ marginBottom: '10px' }}>
                        <Link 
                            to={'/profile'} 
                            className={`${this.props.active === 'profile_update' ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                        >
                            <Person />
                            <span>Update Information</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to={'/profile/password'} 
                            className={`${this.props.active === 'profile_change_password' ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                        >
                            <Password />
                            <span>Change Password</span>
                        </Link>
                    </li>
                </ul>
            </Box>
        )
    }
}

export default ProfileSidebar;
