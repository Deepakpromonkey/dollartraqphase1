import React, { Component } from 'react';
import { useParams, useLocation, Navigate } from "react-router-dom";

import WdForm from 'components/wd/form/WdForm';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Main from 'components/Main';

import Api from 'api/Api';

import Icon from '@mui/material/Icon';

export function withRouter(Children){

    return(props) => {

        const params = {params: useParams()};

        return <Children {...props} params={params} />
    }
}

class SettingsPageMain extends Component {

    constructor(props) {
        super();
        this.state = {

            account_token: false,
            user: false,

            redirect: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            active_setting: '',

            settings: [],

            active_sub_tab: ''
        }
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){

            let setting = this.props.params.params.setting;

            if(setting){

                this.setState({active_setting: setting})
            }
            
            this.setState({account_token: account_token}, () => {

                this.init(account_token, setting)
            })
        }
    }

    render(){

        if(this.state.redirect !== false){

            return <Navigate to={this.state.redirect} />
        }

        return (

            <Main
                active_page="settings"
                
                page="settings_master"
                
                error_message={this.state.error_message}
                success_message={this.state.success_message}

                title=""
            >
                
                <div className={`form-wrapper full`}>
                    <div className='form-container'>

                        <div className="form-header">
                            <div className="form-header-block">
                                <div className="">
                                    <h1>Settings</h1>
                                    <strong className="subtitle">Global Settings</strong>
                                </div>
                                <div></div>
                            </div>
                        </div>
                        <div className='form-body'>
                            <div className='form-tabbed'>

                                <div className='form-tabs'>
                                    <Tabs
                                        value={this.state.active_setting}
                                        onChange={(e, tab_num) => {

                                            const _setting_tab = this.state.settings.find(row => row.key === tab_num);

                                            if(_setting_tab){

                                                this.setState({active_sub_tab: _setting_tab.tabs[0].key})
                                            }

                                            this.setState({active_setting: tab_num})
                                        }}
                                        orientation="vertical"
                                    >

                                        {this.state.settings.map((setting, index) => {

                                            return <Tab icon={<Icon>{setting.icon}</Icon>} iconPosition="top" key={`setting_main_${setting.key}_${index}`} label={setting.label} value={setting.key} />
                                        })}
                                    </Tabs>
                                </div>

                                <div className='form-tab-fields'>

                                    {this.state.settings.map((setting, index) => {

                                        return (
                                            <div role="tabpanel" hidden={this.state.active_setting !== setting.key} key={`setting_main_tab_${setting.key}_${index}`} value={setting.key} index={index}>

                                                <div className={`form-body-wrapper`}>

                                                    {/* <h4 className='title'>{setting.label}</h4> */}

                                                    {this.state.active_setting === setting.key &&
                                                    
                                                        <div className='inner-form'>

                                                            <div className='form-tabbed'>

                                                                <div className='form-tabs'>

                                                                    <Tabs
                                                                        value={this.state.active_sub_tab}
                                                                        onChange={(e, tab_num) => {

                                                                            this.setState({active_sub_tab: tab_num})
                                                                        }}
                                                                        orientation="vertical"
                                                                    >

                                                                        {setting.tabs.map((_setting_tab, _setting_tab_name) => {

                                                                            return (
                                                                                <Tab
                                                                                    key={`form_tab_${setting.key}_${index}_${_setting_tab_name}`}
                                                                                    label={_setting_tab.title}
                                                                                    // className={(this.state.tab_errors.hasOwnProperty(e.key) && (this.state.tab_errors[e.key] === true)) ? 'tab-error' : ''}
                                                                                    value={_setting_tab.key}
                                                                                />
                                                                            )
                                                                        })}
                                                                    </Tabs>
                                                                </div>

                                                                <div className='form-tab-fields'>

                                                                    {setting.tabs.map((_setting_tab, _setting_tab_index) => {

                                                                        return (

                                                                            <div role="tabpanel" hidden={this.state.active_sub_tab !== _setting_tab.key} key={`${setting.key}_${index}_${_setting_tab_index}`} value={_setting_tab.key} index={_setting_tab.key}>

                                                                                <WdForm
                                                                                    title={_setting_tab.title}

                                                                                    hide_header={true}

                                                                                    tab_form={true}
                                                                                    hide_back={true}

                                                                                    submit_url='backend/settings/save'
                                                                                    data_url='backend/settings/data'

                                                                                    data_fields={[
                                                                                        {key: 'setting', value: setting.key}
                                                                                    ]}

                                                                                    row_id={1}

                                                                                    fields={{
                                                                                        rows: _setting_tab.rows
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </Main>
        )
    }

    init = (account_token, setting) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        if(setting){

            formData.append('setting', setting);
        }

        var self = this;
        Api.post('backend/settings/load', formData, function(data){

            if(data.status){

                const _setting_tab = data.settings.find(row => row.key === data.active_setting);

                if(_setting_tab){

                    self.setState({active_sub_tab: _setting_tab.tabs[0].key})
                }

                self.setState({
                    settings: data.settings,
                    active_setting: data.active_setting
                });
            }
        });
    }
}

export default withRouter(SettingsPageMain);