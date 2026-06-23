import React, { Component } from 'react';

import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

class Confirm extends Component { 
    constructor(props) {
        super();

        this.state = {
            show: false,

            element: null
        }
    }

    render () {

        let _props = {...this.props}

        let alert = false;
        let icon_button = false;

        if(_props.alert){

            alert = _props.alert;
            delete _props.alert;
        }

        if(_props.type && _props.type === 'icon_button'){

            icon_button = true;
            delete _props.type;
        }
        
        return (

            <>
                <Popover
                    open={this.state.show}
                    anchorEl={this.state.element}
                    onClose={() => {

                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <div className="popover-confirm">

                        <div className="content" style={{padding:'10px 15px'}}>
                        
                            <strong>Alert!</strong>
                            <p className="fs-14 cg-6">{this.props.message ? this.props.message : 'Are you sure?'}</p>
                        </div>

                        <div className="popover-actions">
                            <Button size="small" color="primary" onClick={(e) => {

                                this.setState({show: false, element: null})

                                if(this.props.onOk){
                                
                                    this.props.onOk();
                                }

                                e.stopPropagation();

                            }}>Ok</Button>

                            {alert
                                ?
                                    null
                                :
                                    <Button size="small" color="secondary" onClick={(e) => {

                                        this.setState({show: false, element: null})

                                        if(this.props.onCancel){

                                            this.props.onCancel()
                                        }

                                        e.stopPropagation();
                                    }}>No</Button>
                            }
                        </div>
                    </div>
                </Popover>

                {this.renderButton(_props, icon_button)}
            </>
        )
    }

    renderButton = (_props, icon_button) => {

        if(icon_button){

            return <IconButton onClick={(e) => {

                this.setState({element: e.currentTarget, show: true});
                e.stopPropagation();

            }} {..._props}>{this.props.children}</IconButton>
        }

        return <Button onClick={(e) => {

            this.setState({element: e.currentTarget, show: true})

        }} {..._props}>{this.props.children}</Button>
    }
}

export default Confirm;