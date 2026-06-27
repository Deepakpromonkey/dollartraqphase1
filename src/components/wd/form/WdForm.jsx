import React, { Component } from 'react';
import { Navigate } from "react-router-dom";

import Drawer from '@mui/material/Drawer';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Close from '@mui/icons-material/Close';

import WdFormBlock from './WdFormBlock';

import Loader from 'components/Loader';
import Btn from 'components/Btn';

import Skeleton from '@mui/material/Skeleton';

import Dialog from '@mui/material/Dialog';

class WdForm extends Component { 
    constructor(props) {
        super();

        this.state = {

            redirect: '',
            
            open_drawer: false,

            success_message: '',
            error_message: ''
        }
    }

    render () {

        if(this.state.redirect !== ''){

            return <Navigate to={`/${this.state.redirect}`} />;
        }

        return (

            <>
{this.props.drawer
    ?
        this.props.position === 'center'
            ?
                <Dialog
                    open={this.props.open}
                    maxWidth="md"
                    fullWidth
                >
                    {this.formBlock()}
                </Dialog>
            :
                <Drawer
                    className={`form-drawer ${this.props.size ? `${this.props.size}` : ''} ${this.props.position ? this.props.position : 'right'}`}
                    anchor={this.props.position ? this.props.position : 'right'}
                    open={this.props.open}
                >
                    {this.formBlock()}
                </Drawer>
    :
        this.formBlock()
}

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={this.state.success_message !== '' ? true : false}
                    autoHideDuration={5000}
                    key={"form_success_message"}
                    onClose={() => {

                        this.setState({success_message: ''})
                    }}
                >
                    <Alert elevation={6} variant="filled" severity="success">{this.state.success_message}</Alert>
                </Snackbar>

                <Snackbar
                    anchorOrigin={{ vertical: 'top', horizontal: this.state.form_error ? 'center' : 'right' }}
                    open={this.state.error_message !== '' ? true : false}
                    autoHideDuration={5000}
                    key={"form_error_message"}
                    onClose={() => {

                        this.setState({error_message: ''})
                    }}
                >
                    <Alert elevation={6} variant="filled" severity="error">{this.state.error_message}</Alert>
                </Snackbar>
            </>
        )
    }

    formBlock = () => {

        return (
            <>
                {(this.props.loading || this.state.loading)
                    ?
                        <div>

                            {(this.props.size && this.props.size !== 'large')
                                ?
                                    <div>
                                        <div className='justify-end' style={{alignItems:'center', marginBottom: 30}}>
                                            
                                            <Btn icon={true} onClick={() => {

                                                this.props.onBack()
                                            }}>
                                                <Close />
                                            </Btn>
                                        </div>
                                        <div style={{position: 'relative', minHeight: 200}}>
                                            <Loader loading={true} />
                                        </div>
                                    </div>
                                :
                                    <div style={{padding: 50}}>
                                        <div className='space-between' style={{alignItems:'center', marginBottom: 30}}>
                                            <Skeleton animation="wave" variant="rect" width={'70%'} height={40} style={{borderRadius:10}} />
                                            <Btn icon={true} onClick={() => {

                                                this.props.onBack()
                                            }}>
                                                <Close />
                                            </Btn>
                                        </div>
                                        <Skeleton animation="wave" variant="rect" width={'100%'} height={70} style={{borderRadius:10, marginBottom: 30}} />
                                        <Skeleton animation="wave" variant="rect" width={'100%'} height={70} style={{borderRadius:10, marginBottom: 30}} />
                                        <Skeleton animation="wave" variant="rect" width={'100%'} height={70} style={{borderRadius:10, marginBottom: 30}} />
                                        <Skeleton animation="wave" variant="rect" width={'100%'} height={70} style={{borderRadius:10, marginBottom: 30}} />
                                        <Skeleton animation="wave" variant="rect" width={'100%'} height={70} style={{borderRadius:10, marginBottom: 30}} />
                                        <Skeleton animation="wave" variant="rect" width={'100%'} height={70} style={{borderRadius:10, marginBottom: 30}} />
                                    </div>
                            }
                        </div>
                    :
                
                        this.formComponent()
                }
            </>
        )
    }

    formComponent = () => {

        return (
            <WdFormBlock
                row_id={this.props.row_id}

                loading={this.props.loading}
                
                open={this.props.open}
                drawer={this.props.drawer}
                
                size={this.props.size}
                type={this.props.type}

                hide_header={this.props.hide_header}
                is_view={this.props.is_view}
                
                title_field={this.props.title_field}
                title={this.props.title}

                updated_on={this.props.updated_on}
                
                fields={this.props.fields}
                tab_form={this.props.tab_form}
                
                post_fields={this.props.post_fields}
                data_fields={this.props.data_fields}

                update_field={this.props.update_field}

                back_url={this.props.back_url}
                back_label={this.props.back_label}
                edit_url={this.props.edit_url}
                submit_url={this.props.submit_url}
                submit_label={this.props.submit_label}
                hide_back={this.props.hide_back}
                data_url={this.props.data_url}
                
                init_url={this.props.init_url}
                init_fields={this.props.init_fields}
                onInit={(data) => {

                    if(this.props.onInit){

                        this.props.onInit(data)
                    }
                }}

                onDataLoad={(row_data, data) => {

                    if(this.props.onDataLoad){

                        this.props.onDataLoad(row_data, data)
                    }
                }}

                compression={this.props.compression}

                id={this.props.id}
                
                onSubmit={(data) => {

                    if(this.props.drawer){

                        this.setState({success_message: data.message}, () => {

                            window.setTimeout(() => {

                                this.setState({success_message: ''})
                            }, 5000)
                        });
                    }

                    if(this.props.onSubmit){
                    
                        this.props.onSubmit(data)
                    }else{

                        if(this.props.back_url){
                        
                            localStorage.setItem('flash_success_message', data.message);
                            this.setState({redirect: this.props.back_url})
                        }else{

                            this.setState({success_message: data.message}, () => {

                                window.setTimeout(() => {
        
                                    this.setState({success_message: ''})
                                }, 5000)
                            });
                        }
                    }
                }}
                onBack={() => {

                    if(this.props.onBack){
                    
                        this.props.onBack()
                    }
                }}
                externalValidate={() => {

                    if(this.props.externalValidate){
                    
                        return this.props.externalValidate()
                    }

                    return false;
                }}

                successMessage={(message) => {

                    this.setState({success_message: message}, () => {

                        window.setTimeout(() => {

                            this.setState({success_message: ''})
                        }, 5000)
                    });
                }}

                errorMessage={(message) => {

                    this.setState({error_message: message}, () => {

                        window.setTimeout(() => {

                            this.setState({error_message: ''})
                        }, 5000)
                    });
                }}
            />
        )
    }
}

export default WdForm;
