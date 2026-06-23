import React, { Component } from 'react';
import { Link } from "react-router-dom";

import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Alert from '@mui/material/Alert';

import { connect } from 'react-redux';
import { User } from 'actions/user';

import Icon from '@mui/material/Icon';

import Btn from './Btn';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

import Api from 'api/Api';

import menu from '../modules.json';

class Main extends Component { 
    constructor(props) {
        super();
        this.state = {
            user: false,
            picture: null,
            preview_image: null,
            account_token: false,
            roles: false,
            flash_error_message: '',
            flash_success_message: '',
            active_menu_item: '',
            mobileOpen: false,
            sub_menu_shown: false,
            show_sub_menu: false,
            submenu: []
        }
        this.imageRef = null;
    }

    componentDidMount = () => {


        var user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);   
        var role = localStorage.getItem('role');
        
        if(account_token){
            this.setState({account_token: account_token});
        }

        if(user){
            var _user = JSON.parse(user);
            this.setState({user: _user});
            
            var _role = JSON.parse(role);
            this.setState({role: _role});
        }

        const flash_success_message = localStorage.getItem('flash_success_message');
        const flash_error_message = localStorage.getItem('flash_error_message');

        if(flash_success_message){
            this.setState({flash_success_message: flash_success_message})
            localStorage.removeItem('flash_success_message');

            window.setTimeout(() => {
                this.setState({flash_success_message: ''})
            }, 5000)
        }

        if(flash_error_message){
            this.setState({flash_error_message: flash_error_message})
            localStorage.removeItem('flash_error_message');

            window.setTimeout(() => {
                this.setState({flash_error_message: ''})
            }, 5000)
        }
    }

    render () {
        return (
            <div>
                {(this.props.success_message && this.props.success_message != '') &&
                    <>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={true}
                            autoHideDuration={5000}
                            key={this.props.success_message}
                        >
                            <Alert elevation={6} variant="filled" severity="success">{this.props.success_message}</Alert>
                        </Snackbar>
                    </>
                }

                {(this.props.error_message && this.props.error_message != '') &&
                    <>
                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={true}
                            autoHideDuration={5000}
                            key={this.props.error_message}
                        >
                            {this.renderMessages('error', this.props.error_message)}
                        </Snackbar>
                    </>
                }

                <Container maxWidth={false} disableGutters={true}>
                    
                    <AppHeader
                        success_message={this.props.success_message}
                        error_message={this.props.error_message}
                        active_link={this.props.active_link}
                        page={this.props.page}
                    />
                            
                    <Box className="w-full bg-[#F6F7F0]">

                        <Box id="main_container" className="container min-h-screen py-5">
                        
                            {this.props.title || this.props.title_action ? (
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                                    {this.props.title && (
                                        <div className="flex flex-col items-start justify-start text-left">
                                            
                                            {this.props.crumbs && (
                                                <div className="flex items-center gap-1 mb-1 text-sm">
                                                    {this.props.crumbs.map((_crumb, crumb_index) => (
                                                        <Link className="inline-flex items-center text-blue-600 hover:underline" key={`crumb_${crumb_index}`} to={_crumb.link}>
                                                            <strong className="fw-semibold">{_crumb.label}</strong>
                                                            <Icon className="text-sm pt-0.5">chevron_right</Icon>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            <h1 className="text-[34px] font-extrabold text-[#0B1E33] tracking-tight  mb-1">
                                                {this.props.title}
                                            </h1>

                                            {this.props.subtitle ? (
                                                <p className="text-sm text-[#94A2B9] font-normal max-w-xl leading-relaxed">
                                                    {this.props.subtitle}
                                                </p>
                                            ) : (
                                                this.props.title === "Control Tower" && (
                                                    <p className="text-sm text-[#90A3B8] font-normal max-w-2xl leading-relaxed">
                                                        Enter carrier details to activate live telemetry and predictive delivery windows.
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {/* Action buttons wrapper container row align-right */}
                                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                                        {this.renderTitleButtons()}
                                    </div>
                                </div>
                            ) : null}

                            <div>
                                {this.props.children}
                            </div>
                        </Box>

                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={this.state.flash_success_message !== '' ? true : false}
                            autoHideDuration={5000}
                            key={"success_message"}
                            onClose={() => {
                                this.setState({flash_success_message: ''})
                            }}
                        >
                            <Alert elevation={6} variant="filled" severity="success">{this.state.flash_success_message}</Alert>
                        </Snackbar>

                        <Snackbar
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={this.state.flash_error_message !== '' ? true : false}
                            autoHideDuration={5000}
                            key={"error_message"}
                            onClose={() => {
                                this.setState({flash_error_message: ''})
                            }}
                        >
                            <Alert elevation={6} variant="filled" severity="error">{this.state.flash_error_message}</Alert>
                        </Snackbar>
                    </Box>

                    <AppFooter />
                </Container>
            </div>
        )
    }
renderTitleButtons = () => {
    let title_action = this.props.title_action;

    if(title_action && this.props.title_action.length){
        return (
            <div className="flex items-center gap-3">
                {title_action.map((_title_action, index) => {
                    let props = {}

                    if(_title_action.hasOwnProperty('link')){
                        props['to'] = _title_action.link;
                    }

                    if(_title_action.onClick){
                        props['onClick'] = _title_action.onClick;
                    }

                    return (
                        <Btn 
                            key={`title_button_${index}`} 
                            variant="contained"
               sx={{
    backgroundColor: (_title_action.backgroundColor || '#00337C') + ' !important',
    color: (_title_action.textColor || '#ffffff') + ' !important',
    border: `1px solid ${_title_action.borderColor || 'transparent'}`,
    borderRadius: '14px !important',
    textTransform: 'none !important',
    fontSize: '13px',
    fontWeight: '600',
    padding: '8px 20px',
    boxShadow: 'none !important',
    mt: 4,
    '&:hover': {
        backgroundColor: (_title_action.backgroundColor || '#00337C') + ' !important'
    }
}}
style={{
    backgroundColor: _title_action.backgroundColor || '#00337C',
    color: _title_action.textColor || '#ffffff',
    borderRadius: '14px',
    textTransform: 'none',
    fontSize: '13px',
    fontWeight: '600',
    padding: '12px 20px',
    boxShadow: 'none'
}}
                            className="ml-0 flex items-center justify-center gap-1.5" 
                            {...props}
                        >
{_title_action.icon ? (
    <Icon
        className="mr-1"
        sx={{
            fontSize: 18,
            color: _title_action.textColor || '#fff'
        }}
    >
        {_title_action.icon}
    </Icon>
) : (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mr-1"
    >
        <path
            d="M6 2V10M2 6H10"
            stroke={_title_action.textColor || 'white'}
            strokeWidth="2.2"
            strokeLinecap="round"
        />
    </svg>
)}

<span style={{ verticalAlign: 'middle' }}>
    {_title_action.label}
</span>
                        </Btn>
                    )
                })}
            </div>
        )
    } else {
        return title_action
    }
}

    uploadProfileImgae = async (croppedImage) => {
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('tmp_file_name', croppedImage);
        formData.append('upload_dir', 'restaurant_gallery/');

        this.setState({image_uploading: true});
        this.setState({ temp_profile_image: null });

        var that = this;

        Api.post('clients/profile/update_profile_photo', formData, function(data){
            that.setState({picture: null, preview_image: null, logo_image_loading: false, main_img_loading: false, croppedImageUrl: null, croppedImage: null, image_uploading: false});

            if(data.status){
                that.setState({user: data.user});
                localStorage.setItem('user', JSON.stringify(data.user));
                that.props.User(data.user);
            }
        });
    }

    renderMessages = (type, message) => {
        if(typeof message == 'object'){
            var alert = [];
            for(var m in message){
                alert.push(<p style={{marginTop:0, marginBottom:5}} key={type + '_message_' + m}>{message[m]}</p>);
            }
            return <Alert elevation={6} variant="filled" severity={type}>{alert}</Alert>;
        } else {
            return <Alert elevation={6} variant="filled" severity={type}>{message}</Alert>
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    }
}

export default connect(mapStateToProps, { User } )(Main);