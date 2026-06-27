import React, { Component } from 'react';
import { Link, Navigate } from "react-router-dom";

import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';

import Badge from '@mui/material/Badge';

import { connect } from 'react-redux';
import { User } from 'actions/user';

import Api from 'api/Api';
import Loader from './Loader';

import PanTool from '@mui/icons-material/PanTool';
import Search from '@mui/icons-material/Search';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import AssignmentInd from '@mui/icons-material/AssignmentInd';
import Password from '@mui/icons-material/Password';
import Checklist from '@mui/icons-material/Checklist';
import Group from '@mui/icons-material/Group';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

import PowerSettingsNew from '@mui/icons-material/PowerSettingsNew';


import logo from 'assets/images/logo.webp?v=3';

import Time from './Time';
import Navigation from './Navigation';
import SearchOverlay from './SearchOverlay';
import SubscriptionsOutlined from '@mui/icons-material/SubscriptionsOutlined';



class AppHeader extends Component { 
    constructor(props) {
        super();
        this.state = {

            account_token: false,
            
            redirect: false,
            header: false,

            notifications_popup: false,

            notifications: [],
            notifications_count: 0,

            profile_menu: null,

            alert_sound: false,
            
            help_alert: false,
            help_message: '',

            alert_requests: [],

            redirect_url: false,
            search_overlay_open: false,

            notification_page: 1,
            notification_reloading: false,

            profile_links: [
                {key: "profile_page", label: "Profile", icon: <AssignmentInd />, link: "profile"},
                {key: "profile_shortlisting", label: "Carriers Shortlisted", icon: <Checklist />, link: "profile/carriers/shortlisted"},
                // {key: "profile_password", label: "Password Update", icon: <Password />, link: "profile/password"},
                {key: "scoring_weights", label: "Scoring Weights", icon: <SettingsOutlined />, link: "profile/scoring-weights"},
                {key: "users", label: "Users", icon: <Group />, link: "users", permission: "manage_users_roles"},
                {key:"pricing",label:"Subscription", icon: <SubscriptionsOutlined />, link:"subscribe"}
            ]
        }

        let interval = 0;
    }

    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);
        
        if(user && account_token){
            
            let _user = JSON.parse(user);

            this.setState({account_token: account_token});
            this.setState({user: _user});
            this.props.User(_user);

            // this.realoadNotifications();

            if(_user.job_profile != 'super_admin'){

                if(this.props.page){

                    // if(this.props.page !== 'dashboard'){
                    
                    //     var access = _user.permissions;

                    //     let page = this.props.page;

                    //     page = page.replace(/_/i, "/");

                    //     if(access.indexOf(page) < 0){

                    //         localStorage.setItem('flash_error_message', 'Unauthorized Access!');
                    //         this.setState({redirect_url: 'dashboard'})
                    //     }
                    // }
                }
            }
        }else{

            if(this.props.active_link){
            
                if(this.props.active_link != '/' && this.props.active_link != 'forgot-password' && this.props.active_link != 'reset-password'){
                    
                    window.location.href = Api.server_url + 'logout';
                }
            }
        }
    }

    getFilteredProfileLinks = () => {

        return this.state.profile_links.filter((_link) => {

            if (!_link.permission) return true;

            return Navigation.can(_link.permission);
        });
    }

    renderChilds = (menu_item) => {

        var _childs = [];

        if(menu_item.hasOwnProperty('childs')){

            for(var c in menu_item['childs']){

                var _child_item = menu_item['childs'][c];

                _childs.push(<li key={_child_item.key}><Link to={"/" + _child_item.link}>{_child_item.title}</Link></li>)
            }

            return <ul className="sub-menu">{_childs}</ul>
        }
    }

    handleScroll = (e) => {

        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

        if(bottom){

            if(!this.state.notification_reloading){

                this.fetchNotifications(false);
            }
        }
    }

    render () {

        if(this.state.redirect_url && this.state.redirect_url != ''){

            return <Navigate to={this.state.redirect_url} />
        }

        return (

            <>

                {this.state.account_token
                    ?
                        <Box className="flex items-center container-fluid h-[64px] px-6 shadow-xs border-b border-gray-100 relative gap-10">

                            <Box className="flex-shrink-0">
                                <Link to="/dashboard" className="logo">
                                    <img src={logo} style={{width: 125, marginRight:3}} alt="logo" />
                                </Link>
                            </Box>

                            <Box className="flex-1 flex justify-center">
                                <Navigation active_page={this.props.page} />
                            </Box>
                            
                            <Toolbar className="!ml-0 flex-shrink-0">

                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

                                    <IconButton
                                        id="search_button"
                                        size="small"
                                        aria-label="Search"
                                        onClick={() => {
                                            this.setState({search_overlay_open: true});
                                        }}
                                    >
                                        <Search fontSize='small' />
                                    </IconButton>

                                    <IconButton id="notification_button" size="small" onClick={(e) => {

                                        this.setState({notifications_popup: e.currentTarget});
                                        this.fetchNotifications(true);
                                    }}>
                                        <Badge badgeContent={this.state.notifications_count} color="secondary">
                                            <NotificationsOutlined fontSize='small' />
                                        </Badge>
                                    </IconButton>

                                    <Box sx={{ width: '1px', height: 24, backgroundColor: 'rgba(0,0,0,0.08)', mx: 1 }} />

                                    <Button
                                        variant="text"
                                        size="small"
                                        endIcon={<KeyboardArrowDown />}
                                        sx={{backgroundColor:'rgba(241, 245, 249, 1)', border:'1px solid rgba(226, 232, 240, 1)', padding:'4px 15px 4px 4px'}}
                                        onClick={(e) => {

                                            this.setState({profile_menu: e.currentTarget})
                                        }}
                                    >
                                        <Avatar style={{width:25, height:25}} alt={this.props.user.name} src={this.props.user.profile_pic_url} sx={{background:'linear-gradient(135deg, #3B82F6 0%, #4F46E5 100%)'}} />

                                        <span className="ml-2 capitalize font-bold text-xs">
                                            {this.props.user ? `${this.props.user.first_name} ` : ''}
                                        </span>
                                    </Button>

                                      <Link to="/logout" style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                                        <IconButton
                                            edge="end"
                                            color="inherit"
                                            className="header-logout"
                                        >
                                            
                                            <PowerSettingsNew />
                                        </IconButton>
                                    </Link>
                                </div>
                            </Toolbar>

                            <Popover
                                className="notifications-menu-container"
                                anchorEl={this.state.notifications_popup}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                id="notifications_menu"
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.notifications_popup != false ? true : false}
                                onClose={() => {
                                    this.setState({notifications_popup: false})
                                }}
                            >
                                <div style={{width:300, height:400}}>
                                    <div className="notifications-menu" onScroll={this.handleScroll}>

                                        {/* {this.renderNotificationRows()} */}
                                    </div>

                                    <div style={{position:'relative', height:60}}>
                                        <Loader loading={this.state.notification_reloading} />
                                    </div>
                                </div>
                            </Popover>

                            <Menu
                                anchorEl={this.state.profile_menu}
                                open={this.state.profile_menu !== null ? true : false}
                                onClose={() => {
    
                                    this.setState({profile_menu: null})
                                }}
                                onClick={() => {
    
                                }}
                                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                slotProps={{
                                    backdrop: {
                                        invisible: true,
                                    },
                                    list: {
                                        sx: {
                                            backgroundColor: '#fff',
                                        },
                                    },
                                    paper: {
                                        elevation: 0,
                                        borderRadius: 10,
                                        sx: {
                                            backgroundColor: '#fff',
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                            borderRadius:3,
                                            padding: 1,
                                            width: 300,
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 50,
                                                width: 10,
                                                height: 10,
                                                bgcolor: '#fff',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    },
                                }}
                            >
    
                                {this.getFilteredProfileLinks().map((_profile) => {
    
                                    return (
                                        <MenuItem component={Link} key={_profile.key} to={`/${_profile.link}`} >
                                            <ListItemIcon>
                                                {_profile.icon}
                                            </ListItemIcon>
                                            
                                            <span>{_profile.label}</span>
                                        </MenuItem>
                                    )
                                })}
                            </Menu>

                            <Snackbar
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={this.state.help_alert}
                                onClick={() => {
                                    this.setState({help_alert: false, alert_sound: false, help_message: ''});
                                }}
                                onClose={() => {
                                    this.setState({help_alert: false, alert_sound: false, help_message: ''})
                                }}
                                TransitionComponent={Slide}
                            >
                                <Alert elevation={6} variant="filled" severity="success">{this.state.help_message}</Alert>
                            </Snackbar>

                            <SearchOverlay
                                open={this.state.search_overlay_open}
                                onClose={() => this.setState({search_overlay_open: false})}
                                onSearch={(query, type) => {
                                    this.setState({
                                        search_overlay_open: false,
                                        redirect_url: `/carriers/search?q=${encodeURIComponent(query)}`
                                    });
                                }}
                            />
                        </Box>
                    :
                        null
                }
            </>
        )
    }

    routeNotification = (_notification) => {

        var redirect_url = "/notification-route/" + _notification.route;
        this.setState({redirect_url: redirect_url});
    }

    renderNotificationRows = () => {

        var notifications = this.state.notifications;
        if(notifications && notifications.length > 0){

            return (
                <List>
                    
                    {notifications.map((_notification, index) => {

                        return (
                            <ListItem key={`notification_${index}`} onClick={() => {
                                this.routeNotification(_notification)
                            }} button style={{opacity: _notification.read_status == 1 ? .5 : 1}}>
                                <ListItemIcon>
                                    <PanTool />
                                </ListItemIcon>
                            </ListItem>
                        )
                    })}
                </List>
            )
        }else{

            return null;
        }
    }

    fetchNotifications = (reset) => {

        let notification_page = this.state.notification_page;

        if(reset){

            notification_page = 1;
            this.setState({notification_page: 1, notifications: []});
        }
        
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('page', notification_page);

        this.setState({notification_reloading: true});

        var self = this;
        Api.post('notifications/load', formData, function(data){

            if(data.status){
                
                self.setState({notification_reloading: false, notification_page: notification_page + 1});

                let notifications = self.state.notifications;
                notifications = [...notifications, ...data.notifications];

                self.setState({notifications: notifications});
            }
        });
    }

    realoadNotifications = () => {

        var that = this;
        this.interval = setInterval(() => {
            that.fetchNotificationsCount(that.state.account_token);
        }, 8000);
    }

    readNotification = (notification) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('notification_id', notification.notification_id);

        var self = this;
        Api.post('clients/notifications/mark_read', formData, function(data){

            if(data.status){

                var notifications_count = self.state.notifications_count;
                notifications_count = notifications_count - 1;

                self.setState({notifications_count: notifications_count});

                self.updateNotification(notification);
            }
        });
    }

    updateNotification = (notification) => {

        var notifications = this.state.notifications;
        if(notifications && notifications.length > 0){

            for(var i in notifications){

                if(notifications[i]['notification_id'] == notification.notification_id){

                    notifications[i]['view_status'] = 1;
                    notifications[i]['read_status'] = 1;
                }
            }
        }

        this.setState({notifications: notifications});
    }

    fetchNotificationsCount = (account_token) => {

        this.setState({help_alert: false, help_message: ''});

        const formData = new FormData();
        formData.append('account_token', account_token);

        if(this.props.active_link){
            formData.append('page', this.props.active_link);
        }

        var self = this;
        Api.post('notifications/count', formData, function(data){

            if(data.status){
                self.setState({notifications_count: data.counts});
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    markAttendance = (t) => {

        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('type', t);

        var self = this;
        Api.post('employees/mark_attendance', formData, function(data){

            if(data.status){

                self.setState({help_message: data.message, help_alert: true});
            }
        });
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    }
}

export default connect(mapStateToProps, { User })(AppHeader);