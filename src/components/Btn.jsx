import React, { Component } from 'react';
import { Navigate } from "react-router-dom";

import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

class Btn extends Component { 
    constructor(props) {
        super();

        this.state = {
        
            show_confirm: false,

            redirect: false,
        }

        this.buttonRef = React.createRef();
    }

    render () {

        let _props = {...this.props}

        let loader = false;
        let loader_position = 'after';

        let link = false;
        let icon = false;

        if(_props.to){

            link = _props.to;
            delete _props.to;
        }

        if(_props.link){

            link = _props.link;
            delete _props.link;
        }

        if(_props.icon){

            icon = _props.icon;
            delete _props.icon;
        }

        if(_props.loading){

            _props.disabled = true;
            
            loader = true;

            if(_props.position){

                if((_props.position === 'before' || _props.position === 'after')){
                
                    loader_position = _props.position;
                    delete _props.position;
                }
            }
        }

        let confirm = false;
        let confirm_message = "Are you sure?";
        let okText = "Yes";
        let cancelText = 'No'

        if(_props.hasOwnProperty('confirm')){

            confirm = _props.confirm;

            delete _props.confirm;
        }

        if(_props.confirm_message){

            confirm_message = _props.confirm_message;
            delete _props.confirm_message;
        }

        if(_props.hasOwnProperty('loading')){

            delete _props.loading;
        }

        if(_props.hasOwnProperty('okText')){

            okText = _props.okText;
            delete _props.okText;
        }

        if(_props.hasOwnProperty('cancelText')){

            cancelText = _props.cancelText;
            delete _props.cancelText;
        }

        if(this.state.redirect !== false){

            return <Navigate to={this.state.redirect} />
        }
        
        return (

            <>

                {this.renderButton(_props, loader, loader_position, link, confirm, icon)}

                <Popover
                    open={this.state.show_confirm}
                    anchorEl={this.buttonRef.current}
                    onClose={() => {

                        this.setState({show_confirm: false})
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    elevation={3}
                >
                    <Paper elevation={3} sx={{backgroundColor: '#fff', borderRadius: '10px'}}>

                        <Box sx={{padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,.1)', backgroundColor: 'rgba(0,0,0,.03)', borderRadius: '10px 10px 0 0'}}>
                            <h2 className='fs-14' style={{margin: 0}}>Alert</h2>
                        </Box>
                        <Box sx={{padding: '20px 20px'}}>
                            <div className='fs-14'>{confirm_message}</div>
                        </Box>
                        <Box sx={{padding: '10px 20px', borderTop: '1px solid rgba(0,0,0,.1)', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            <Button size="small" onClick={() => {

                                this.setState({show_confirm: false})
                            }}>{cancelText}</Button>
                            <Button size="small" color="secondary" variant='contained' onClick={() => {

                                this.setState({show_confirm: false});

                                if(link){

                                    this.setState({redirect: link})
                                }else{

                                    if(this.props.onClick){
                                    
                                        this.props.onClick()
                                    }
                                }
                            }}>{okText}</Button>
                        </Box>
                    </Paper>
                </Popover>
            </>
        )
    }

    renderButton = (_props, loader, loader_position, link, confirm, icon) => {

        return this.button(_props, loader, loader_position, confirm, icon, link)
    }

    button = (_props, loader, loader_position, confirm, icon, link) => {

        if(confirm){

            _props.onClick = () => {

                this.setState({show_confirm: true})
            }
        }

        if(link){
            _props.onClick = () => {

                this.setState({redirect: link})
            }
        }

        if(icon){

            return (
                <IconButton {..._props} ref={this.buttonRef}>
                    {this.loader('before', loader, loader_position, _props)}
                    {this.props.children}
                    {this.loader('after', loader, loader_position, _props)}
                </IconButton>
            )
        }else{

            return (
                <Button {..._props} ref={this.buttonRef}>
                    {this.loader('before', loader, loader_position, _props)}
                    {this.props.children}
                    {this.loader('after', loader, loader_position, _props)}
                </Button>
            )
        }
    }

    loader = (position, loading, _position, _props) => {

        let size = 20;
        let color = 'secondary';

        if(this.props.size){

            if(this.props.size === 'medium'){

                size = 25
            }
            if(this.props.size === 'large'){

                size = 35
            }
        }

        if(_props.variant && _props.variant === 'contained'){

            color = 'primary';
        }

        if(loading){

            if(position === _position){

                return (
                    <div className={`${position === 'before' ? 'mr-5' : 'ml-5'} align-center`}>
                        <CircularProgress size={size} color={color} />
                    </div>
                )
            }
        }
    }
}

export default Btn;