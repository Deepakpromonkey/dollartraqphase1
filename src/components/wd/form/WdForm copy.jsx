import React, { Component, createRef } from 'react';

import { Navigate } from "react-router-dom";

import Popover from '@mui/material/Popover';

import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import Checkbox from '@mui/material/Checkbox';

import FormGroup from '@mui/material/FormLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';

import Btn from 'components/Btn';

import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import Done from '@mui/icons-material/Done';
import DoneAll from '@mui/icons-material/DoneAll';
import Close from '@mui/icons-material/Close';
import WarningOutlined from '@mui/icons-material/WarningOutlined';
import Edit from '@mui/icons-material/Edit';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import Loader from 'components/Loader';

import moment from 'moment';

import Api from 'api/Api';

import Drawer from '@mui/material/Drawer';

import WdFormVIewField from './WdFormVIewField';
import WdFormFieldSwitch from './WdFormFieldSwitch';
import WdFormFieldEditor from './WdFormFieldEditor';

import WdFormFieldImage from './WdFormFieldImage';
import WdFormGallery from './WdFormGallery';

class WdForm extends Component { 
    constructor(props) {
        super();

        this.state = {
            account_token: '',

            redirect: '',

            row_id: '',
            form_data: {},

            back_confirm: false,

            footer_width: '',

            active_tab: 0,

            form_error: false,
            input_data: {},
            input_errors: {},

            fields_list: [],

            tab_errors: {},

            submitting: false,

            success_message: '',
            error_message: '',

            child_success: false,
            child_result: {},

            unique_loaders: {},
            unique_field_result: {},

            upload_loaders: {},

            files_data: {},

            update_field: [],

            open_drawer: false,
        }

        this.form = createRef();
        this.formContainer = createRef();
    }

    componentDidMount = () => {

        if(this.props.row_id && this.props.row_id !== false && this.props.row_id !== ''){

            this.setState({row_id: this.props.row_id}, () => {

                this.loadData(this.props.row_id);
            })
        }

        var account_token = localStorage.getItem('drs_chit');

        if(account_token){

            this.setState({account_token: account_token})
        }

        this.prepareForm();

        let _doc_width = document.getElementById('main_container');

        this.setState({footer_width: _doc_width.offsetWidth})

        window.addEventListener("wd_field_update", this.updateField);

        if(this.props.update_field){

            this.setState({update_field: this.props.update_field})
        }
    }

    prepareForm = () => {

        let fields_map = this.mapFields();

        let input_data = [];

        fields_map.map((_field_item) => {

            if(_field_item.type === 'input' || _field_item.type === 'dropdown' || _field_item.type === 'hidden' || _field_item.type === 'radio'){

                input_data[_field_item.name] = _field_item.hasOwnProperty('value') ? _field_item.value : '';

            }else if(_field_item.type === 'switch' || _field_item.type === 'yes_no'){

                input_data[_field_item.name] = _field_item.hasOwnProperty('value') ? _field_item.value : 0;

            }else if(_field_item.type === 'date' || _field_item.type === 'time'){

                input_data[_field_item.name] = _field_item.hasOwnProperty('value') ? _field_item.value : '';

            }else if(_field_item.type === 'multiselect' || _field_item.type === 'checkbox'){

                input_data[_field_item.name] = _field_item.hasOwnProperty('value') ? _field_item.value : [];
            
            }else if(_field_item.type === 'editor' || _field_item.type === 'image' || _field_item.type === 'file'){

                input_data[_field_item.name] = _field_item.hasOwnProperty('value') ? _field_item.value : '';

            }else if(_field_item.type === 'gallery'){

                input_data[_field_item.name] = _field_item.hasOwnProperty('value') ? _field_item.value : [];
            }
        })

        this.setState({input_data: input_data})
    }

    resetForm = () => {

        let fields_map = this.mapFields();

        let input_data = [];

        fields_map.map((_field_item) => {

            if(_field_item.type === 'input' || _field_item.type === 'dropdown' || _field_item.type === 'hidden' || _field_item.type === 'radio'){

                input_data[_field_item.name] = '';

            }else if(_field_item.type === 'switch' || _field_item.type === 'yes_no'){

                input_data[_field_item.name] = 0;

            }else if(_field_item.type === 'date' || _field_item.type === 'time'){

                input_data[_field_item.name] = '';

            }else if(_field_item.type === 'multiselect' || _field_item.type === 'checkbox'){

                input_data[_field_item.name] = [];
            
            }else if(_field_item.type === 'editor' || _field_item.type === 'image' || _field_item.type === 'file'){

                input_data[_field_item.name] = '';

            }else if(_field_item.type === 'gallery'){

                input_data[_field_item.name] = [];
            }
        })

        this.setState({input_data: input_data})
    }

    mapFields = () => {

        let _fields_list = [];

        if(this.props.fields.hasOwnProperty('tabs')){

            this.props.fields.tabs.map((tab, index) => {

                if(tab.hasOwnProperty('rows')){
        
                    if(tab.rows.length > 0){
        
                        tab.rows.map((_row, index) => {

                            if(_row.hasOwnProperty('fields')){

                                _row.fields.map((_field) => {

                                    _fields_list.push(_field)
                                })
                            }else if(_row.hasOwnProperty('sections')){

                                _row.sections.map((_section) => {

                                    _section.rows.map((_row) => {

                                        _row.fields.map((_field) => {

                                            _fields_list.push(_field)
                                        })
                                    })
                                })
                            }
                        })
                    }
                }
            })
        }else{

            if(this.props.fields.hasOwnProperty('rows')){
    
                if(this.props.fields.rows.length > 0){
    
                    this.props.fields.rows.map((_row, index) => {

                        if(_row.hasOwnProperty('fields')){

                            _row.fields.map((_field) => {

                                _fields_list.push(_field)
                            })
                        }else if(_row.hasOwnProperty('sections')){

                            _row.sections.map((_section) => {

                                _section.rows.map((_row) => {

                                    _row.fields.map((_field) => {

                                        _fields_list.push(_field)
                                    })
                                })
                            })
                        }
                    })
                }
            }
        }

        this.setState({fields_list: _fields_list});

        return _fields_list
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {

        if(this.props.row_id && this.props.row_id !== this.state.row_id){

            this.setState({row_id: this.props.row_id}, () => {

                this.loadData(this.props.row_id);
            })
        }

        if(this.props.update_field && (this.props.update_field !== this.state.update_field)){

            let input_data = this.state.input_data;

            this.props.update_field.map((_update_field) => {

                if(input_data.hasOwnProperty(_update_field.name)){

                    input_data[_update_field.name] = _update_field.value;
                }
            })

            this.setState({update_field: this.props.update_field, input_data: input_data})
        }

        if(this.props.open && this.props.open === true && this.state.open_drawer === false){

            this.setState({open_drawer: true})
        }
    }

    componentWillUnmount = () => {

        window.removeEventListener("wd_field_update", this.updateField);
    }

    updateField = (data) => {

        if(data.detail && data.detail.hasOwnProperty('name')){

            if(data.detail.hasOwnProperty('value')){

                let input_data = this.state.input_data;

                input_data[data.detail.name] = data.detail.value;

                this.setState({input_data: input_data})
            }

            if(data.detail.hasOwnProperty('error')){

                let input_errors = this.state.input_errors;
                let input_data = this.state.input_data;

                input_errors[data.detail.name] = data.detail.hasOwnProperty('message') ? data.detail.message : 'There is error in this field.';

                input_data[data.detail.name] = '';

                this.setState({input_errors: input_errors, input_data: input_data})
            }
        }
    }

    render () {

        if(this.state.redirect !== ''){

            return <Navigate to={`/${this.state.redirect}`} />;
        }

        return (

            <>
                {this.props.drawer &&

                    <Drawer
                        className={`form-drawer ${this.props.size ? `${this.props.size}` : ''} ${this.props.position ? this.props.position : 'right'}`}
                        anchor={this.props.position ? this.props.position : 'right'}
                        open={this.state.open_drawer}
                    >
                        {this.formComponent()}
                    </Drawer>
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

    formComponent = () => {

        return (
            <div ref={this.formContainer} className={`form-wrapper ${this.props.size ? this.props.size : ((this.props.type && this.props.type === 'chlld_form') ? '' : 'full')}`}>
                <div className='form-container'>

                    {this.props.hide_header
                        ?
                            null
                        :

                            <div className='form-header'>

                                <div className=''>
                                    {this.props.title &&
                                    
                                        <h1>{this.state.row_id ? (this.props.is_view ? 'View' : 'Edit') : 'Add'} {this.props.title} {this.state.row_id ? ` - ${this.state.form_data[this.props.title_field]}` : ''}</h1>
                                    }

                                    {this.state.row_id && this.props.updated_on
                                        ?
                                            <strong className='subtitle'>
                                                <span className='gr-6'>Last Updated</span> - {((this.state.form_data[this.props.updated_on] && this.state.form_data[this.props.updated_on] !== '0000-00-00 00:00:00')) ? this.state.form_data[this.props.updated_on] : 'Never'}
                                            </strong>
                                        :
                                            <strong className='subtitle'>New Entry</strong>
                                    }
                                </div>
                                <div>
                                    
                                </div>
                            </div>
                    }
                    <div className='form-body'>
                        
                        {(this.props.type && this.props.type === 'chlld_form' && this.state.child_success)
                            ?

                                <div className='inline-notification success'>

                                    <div className='message'>
                                        <div className='icon'>
                                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>

                                        <div className='message-text'>
                                            <p>{this.state.child_result.hasOwnProperty('message') ? this.state.child_result.message : 'Information has been submitted successfully.'}</p>
                                        </div>

                                        <div className='message-action'>
                                            <Btn size="small" color="secondary" variant="outlined" endIcon={<Done style={{color:'#fff'}} />} onClick={() => {

                                                this.childDone()
                                            }}>Done</Btn>
                                        </div>
                                    </div>
                                </div>
                            :
                                this.mainWrapper()
                        }
                    </div>

                    {(this.props.type && this.props.type === 'chlld_form' && this.state.child_success)
                        ?
                            null
                        :
                            <>
                                {this.props.tab_form
                                    ?
                                        null
                                    :
                                
                                        <div className='form-bottom' style={
                                            {width: 
                                                (
                                                    (this.props.size && (this.props.size === 'small' || this.props.size === 'medium'))
                                                    ||
                                                    (this.props.type && this.props.type === 'chlld_form')
                                                    ||
                                                    (this.props.drawer)
                                                )
                                                    ?
                                                        'auto'
                                                    :
                                                        `${this.state.footer_width - 40}px`
                                            }
                                        }>

                                            <div>
                                                <Btn color="primary" size="small" startIcon={<ArrowBackIosNew />} confirm={this.props.is_view ? false : true} confirm_message="All the entered data will be lost. Do you want to go back?" onClick={() => {

                                                    if(this.props.onBack){

                                                        this.setState({open_drawer: false, form_data: {}, row_id: false})
                                                        this.props.onBack()
                                                        this.resetForm()
                                                    }

                                                    if(this.props.back_url){

                                                        this.setState({redirect: this.props.back_url})
                                                    }
                                                }}>
                                                    {this.props.back_label ? this.props.back_label : 'Back'}
                                                </Btn>
                                            </div>
                                            <div>

                                                {this.props.is_view
                                                    ?
                                                        <Btn startIcon={<Edit />} size="small" color="secondary" variant="outlined" to={`/edit/${this.props.edit_url}/${this.state.row_id}`}>Edit</Btn>
                                                    :
                                                        <Btn loading={this.state.submitting} position="before" color="secondary" variant="contained" size="small" endIcon={<ArrowForwardIos />} onClick={() => {

                                                            this.handleSubmit()
                                                        }}>{this.state.row_id ? 'Update' : (this.props.submit_label ? this.props.submit_label : 'Submit')}</Btn>
                                                }
                                            </div>
                                        </div>
                                }
                            </>
                    }
                </div>
            </div>
        )
    }

    mainWrapper = () => {

        let tab_form = false;

        if(this.props.tab_form && this.props.tab_form === true){

            tab_form = true;
        }

        if(this.props.fields.hasOwnProperty('tabs')){

        }else{

            tab_form = false;
        }

        if(!tab_form){

            return (
                <form onSubmit={this.formSubmit.bind(this)} ref={this.form}>
                    
                    {this.mainFormFields(tab_form)}
    
                    <button type="submit" style={{display: 'none'}}>Submit</button>
                </form>
            )
        }else{

            return this.mainFormFields(tab_form)
        }
    }

    mainFormFields = (tab_form) => {

        return (

            <>

                {this.props.fields.hasOwnProperty('tabs')
                    ?

                        <div className='form-tabbed'>

                            <div className='form-tabs'>
                                <Tabs
                                    value={this.state.active_tab}
                                    onChange={(e, tab_num) => {

                                        this.setState({active_tab: tab_num})
                                    }}
                                    orientation="vertical"
                                >

                                    {this.props.fields.tabs.map((e, index) => {

                                        let props = {}

                                        if(e.hasOwnProperty('icon')){

                                            props['icon'] = e.icon;
                                            props['iconPosition'] = 'top';
                                        }

                                        return <Tab {...props} key={`form_tab_${e.key}_${index}`} label={e.tab_title ? e.tab_title : e.title} className={(this.state.tab_errors.hasOwnProperty(e.key) && (this.state.tab_errors[e.key] === true)) ? 'tab-error' : ''} />
                                    })}
                                </Tabs>
                            </div>
                            <div className='form-tab-fields'>

                                {this.props.fields.tabs.map((tab, index) => {

                                    return (
                                        <div role="tabpanel" hidden={this.state.active_tab !== index} key={`tab_${index}`} value={index} index={index}>

                                            <div className={`form-body-wrapper ${this.props.compression ? this.props.compression : ''}`}>

                                                {tab_form === true
                                                    ?

                                                        <form onSubmit={this.formSubmit.bind(this)} rel={tab.key}>
                                                            <h4 className='title'>{tab.title}</h4>

                                                            {this.renderRows(tab)}

                                                            <button type="submit" style={{display: 'none'}}>Submit</button>
                                                        </form>
                                                    :
                                                        <>
                                                            <h4 className='title'>{tab.title}</h4>

                                                            {this.renderRows(tab)}

                                                        </>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    :
                    
                        <div className={`form-body-wrapper ${this.props.compression ? this.props.compression : ''}`}>
                        
                            {this.renderRows(this.props.fields)}
                        </div>
                }
            </>
        )
    }

    renderRows = (fields) => {

        let _fields_list = [];

        if(fields.hasOwnProperty('rows')){
        
            if(fields.rows.length > 0){

                fields.rows.map((_field, index) => {

                    _fields_list.push(
                        <React.Fragment key={`field_${index}`}>
                            {this.renderFields(_field)}
                        </React.Fragment>
                    )
                })
            }
        }

        return (
            <Grid className='form-rows-container' container spacing={this.props.compression && this.props.compression === 'high' ? 0 : 2}>
                {_fields_list}

                {this.props.tab_form &&
                        
                        <>
                            <Grid item xs={8}></Grid>
                            <Grid item xs={4}>
                                <div className='justify-end'>

                                    {this.props.hide_back
                                        ?
                                            null
                                        :
                                            <Btn color="primary" size="small" startIcon={<ArrowBackIosNew />} confirm={this.props.is_view ? false : true} confirm_message="All the entered data will be lost. Do you want to go back?" onClick={() => {

                                                if(this.props.onBack){

                                                    this.setState({open_drawer: false, form_data: {}, row_id: false})
                                                    this.props.onBack()
                                                    this.resetForm()
                                                }

                                                if(this.props.back_url){

                                                    this.setState({redirect: this.props.back_url})
                                                }
                                            }}>
                                                {this.props.back_label ? this.props.back_label : 'Back'}
                                            </Btn>
                                    }

                                    <Btn className="ml-10" loading={this.state.submitting} position="before" color="secondary" variant="contained" size="small" endIcon={<ArrowForwardIos />} onClick={() => {

                                        let _tab_key = false;

                                        if(fields.hasOwnProperty('key')){

                                            _tab_key = fields.key;
                                        }

                                        this.handleSubmit(_tab_key)
                                    }}>{this.state.row_id ? 'Update' : (this.props.submit_label ? this.props.submit_label : 'Submit')}</Btn>
                                </div>
                            </Grid>
                        </>
                    }
            </Grid>
        )
    }

    renderFields = (_fields) => {

        let fields = [];

        if(_fields.hasOwnProperty('fields')){

            fields = _fields.fields;
        }else{

            if(_fields.hasOwnProperty('sections')){

                let _sections = [];

                _fields.sections.map((_section, index) => {

                    let _fields_list = [];

                    if(_section.hasOwnProperty('rows')){
        
                        if(_section.rows.length > 0){
            
                            _section.rows.map((_field, index) => {
            
                                _fields_list.push(
                                    <React.Fragment key={`field_${index}_${_section.key}`}>
                                        {this.renderFields(_field)}
                                    </React.Fragment>
                                )
                            })
                        }
                    }

                    _sections.push(
                        <Grid key={`section_item_${_section.key}`} item xs={_section.span}>
                            <Grid container spacing={3}>
                                {_fields_list}
                            </Grid>
                        </Grid>
                    )
                })

                return _sections;
            }
        }
        
        let fields_list = [];
        let hidden_fields = [];

        if(fields.length > 0){

            let _w = 6;

            if(fields.length === 1){

                _w = 8;

            }else if(fields.length === 2 || fields.length === 3){

                _w = 4;

            }else if(fields.length < 5){

                _w = 12 / fields.length;
            }

            fields.map((_field, index) => {

                if(!_field.hasOwnProperty('remove') || (_field.hasOwnProperty('remove') && _field.remove === false)){

                    if(_field.type === 'hidden'){

                        hidden_fields.push(<input type="hidden" name={_field.name} value={_field.value} key={`field_${_field.key}_${index}`} />)

                    }else{

                        fields_list.push(

                            <Grid key={`field_${_field.key}_${index}`} item xs={12} lg={(_field.hasOwnProperty('span') && !isNaN(_field.span)) ? _field.span : _w}>

                                {_field.type === 'header'
                                    ?
                                        <h5 className='sub-heading' style={_field.hasOwnProperty('span') && _field.span < 12 ? {marginTop: 10} : {}}>{_field.label}</h5>
                                    :
                                        <>
                                            {this.props.is_view
                                                ?
                                                    <WdFormVIewField field={_field} value={this.state.input_data.hasOwnProperty(_field.name) ? this.state.input_data[_field.name] : ''} />
                                                :
                                                    <>
                                                        {this.renderField(_field)}
                                                        {this.renderComment(_field)}
                                                    </>
                                            }
                                        </>
                                }
                            </Grid>
                        )
                    }
                }
            })
        }

        if(fields_list.length > 0){

            return (
                <Grid item xs={12} lg={12}>
                    {hidden_fields}
                    <Grid container spacing={3}>
                        {fields_list}
                    </Grid>
                </Grid>
            )
        }
    }

    renderComment = (field) => {

        const is_optional = this.extractValidation(field, 'r');
        const comment = field.hasOwnProperty('comment') ? field.comment : false;

        if(is_optional === false || comment !== false){

            return (
                <div className='space-between'>

                    {comment !== false &&
                    
                        <p className="field-helper-text">{field.comment}</p>
                    }

                    {(field.type !== 'html' && field.type !== 'yes_no' && field.type !== 'switch') &&
                    
                        is_optional === false &&
                        
                            <p className="field-helper-text">Optional</p>
                    }
                </div>
            )
        }
    }

    renderField = (field) => {

        if(field.hasOwnProperty('type')){

            if(field.type === 'input' || field.type === 'textarea'){

                let _props = {}

                if(field.hasOwnProperty('disabled')){

                    _props.disabled = field.disabled;
                }

                return (
                    <div className='vertical'>

                        <div className='align-end'>
                            <TextField
                                {..._props}
                                label={field.label}
                                variant="standard"
                                value={this.state.input_data.hasOwnProperty(field.name) ? this.state.input_data[field.name] : ''}
                                onChange={(e) => {

                                    let field_value = e.target.value;

                                    let input_data = this.state.input_data;

                                    if(!input_data.hasOwnProperty(field.name)){

                                        input_data[field.name] = ''
                                    }

                                    input_data[field.name] = e.target.value;

                                    this.setState({input_data: input_data});

                                    this.validateField(field)

                                    if(field.hasOwnProperty('onChange')){

                                        field.onChange(field_value)
                                    }
                                }}
                                onBlur={(e) => {

                                    let has_error = this.validateField(field)

                                    if(!has_error){
                                    
                                        /*
                                        Unique check
                                        */
                                        let validation = this.extractValidation(field, 'unique');

                                        if(validation !== false){

                                            let _url = validation.split('|')[1];

                                            if(_url !== ''){

                                                this.validateUnique(field.name, e.target.value, _url)
                                            }
                                        }
                                    }

                                    if(field.hasOwnProperty('onBlur')){

                                        field.onBlur(e.target.value)
                                    }
                                }}
                                placeholder={field.placeholder ? field.placeholder : `Enter ${field.label}`}
                                fullWidth
                                error={this.state.input_errors.hasOwnProperty(field.name) ? true : false}
                                helperText={this.state.input_errors.hasOwnProperty(field.name) ? this.state.input_errors[field.name] : ''}
                                autoComplete="off"
                                size="small"
                                multiline={(field.type === 'textarea' || field.hasOwnProperty('rows')) ? true : false}
                                rows={(field.type === 'textarea' || field.hasOwnProperty('rows')) ? (field.hasOwnProperty('rows') ? field.rows : 3) : 1}
                            />

                            {field.hasOwnProperty('after') &&
                            
                                <div style={{flexShrink: 0, paddingLeft: 6, paddingBottom: 6}}>
                                    <div className='fs-13 gr-6 fw-semibold'>
                                        {field.after}
                                    </div>
                                </div>
                            }
                        </div>
                        
                        <div className='mt-5 justify-end'>

                            {(this.state.unique_field_result.hasOwnProperty(field.name) && this.state.unique_field_result[field.name] === 'u') &&
                            
                                <div className="align-center c-green">
                                    <DoneAll style={{fontSize:16}} />
                                    <span className='fs-12 ml-5 fw-semibold'>Unique entry.</span>
                                </div>
                            }

                            {(this.state.unique_field_result.hasOwnProperty(field.name) && this.state.unique_field_result[field.name] === 'd') &&
                            
                                <div className="align-center c-red">
                                    <WarningOutlined style={{fontSize:16}} />
                                    <span className='fs-12 ml-5 fw-semibold'>Duplicate entry.</span>
                                </div>
                            }

                            {(this.state.unique_loaders.hasOwnProperty(field.name) && this.state.unique_loaders[field.name] === true) &&

                                <div className="align-center c-blue">
                                    <CircularProgress size={14} color='secondary' />
                                    <span className='fs-12 ml-5 fw-semibold'>Checking...</span>
                                </div>
                            }
                        </div>
                    </div>
                )
            }

            if(field.type === 'editor'){

                return (
                    <FormControl fullWidth>
                        <label className='fs-13 fw-semibold gr-9'>{field.label}</label>
                        
                        <div style={{marginTop: 10}}>
                            <WdFormFieldEditor
                                value={this.state.input_data.hasOwnProperty(field.name) ? this.state.input_data[field.name] : ''}
                                onChange={(data, event, editor) => {
                                    
                                    let input_data = this.state.input_data;

                                    input_data[field.name] = data

                                    this.setState({input_data: input_data})
                                }}
                            />
                        </div>
                        
                        {this.state.input_errors.hasOwnProperty(field.name) &&
                                
                            <FormHelperText sx={{marginLeft: 0}} className='c-red'>{this.state.input_errors[field.name]}</FormHelperText>
                        }
                    </FormControl>
                )
            }

            if(field.type === 'dropdown' || field.type === 'multiselect'){

                return (
                    <div className='vertical'>

                        <div className='align-end'>
                            
                            <FormControl fullWidth className='wd-form-select' error={this.state.input_errors.hasOwnProperty(field.name) ? true : false}>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={(field.type === 'dropdown') ? this.state.input_data.hasOwnProperty(field.name) ? this.state.input_data[field.name] : '' : ''}
                                    label={field.label}
                                    variant="standard"
                                    size="small"
                                    onChange={(e) => {

                                        let input_data = this.state.input_data;

                                        if(field.type === 'multiselect'){

                                            if(!input_data.hasOwnProperty(field.name)){
                
                                                input_data[field.name] = []
                                            }

                                            input_data[field.name].push(e.target.value)
                                        }else{

                                            if(!input_data.hasOwnProperty(field.name)){
                
                                                input_data[field.name] = ''
                                            }
                
                                            input_data[field.name] = e.target.value
                                        }
            
                                        this.setState({input_data: input_data});

                                        this.validateField(field)

                                        if(field.hasOwnProperty('onChange')){

                                            field.onChange(e.target.value, e)
                                        }
                                    }}
                                >
                                    {field.hasOwnProperty('options') &&
                                    
                                        field.type === 'dropdown'
                                            ?
                                                field.options.map((_option, index) => {

                                                    return (
                                                        <MenuItem
                                                            key={`${field.key}_${_option.key}_${index}`}
                                                            value={_option.key}
                                                        >
                                                            {field.hasOwnProperty('option_renderer')
                                                                ?
                                                                    field.option_renderer(_option)
                                                                :
                                                                    <span>{_option.value}</span>
                                                            }
                                                        </MenuItem>
                                                    )
                                                })
                                            :
                                                field.options.map((_option, index) => {

                                                    if((this.state.input_data.hasOwnProperty(field.name) && this.state.input_data[field.name].indexOf(_option.key) <= -1)){
                                                    
                                                        return (
                                                            <MenuItem
                                                                key={`${field.key}_${_option.key}_${index}`}
                                                                value={_option.key}
                                                            >
                                                                {field.hasOwnProperty('option_renderer')
                                                                    ?
                                                                        field.option_renderer(_option)
                                                                    :
                                                                        <span>{_option.value}</span>
                                                                }
                                                            </MenuItem>
                                                        )
                                                    }
                                                })
                                    }
                                </Select>
                                {this.state.input_errors.hasOwnProperty(field.name) &&
                                
                                    <FormHelperText sx={{marginLeft: 0}}>{this.state.input_errors[field.name]}</FormHelperText>
                                }
                            </FormControl>

                            {field.hasOwnProperty('after') &&
                            
                                <div style={{flexShrink: 0, paddingLeft: 6, paddingBottom: 6}}>
                                    <div className='fs-14 gr-6 fw-semibold'>
                                        {field.after}
                                    </div>
                                </div>
                            }

                            {field.hasOwnProperty('child_form') &&
                            
                                <div style={{flexShrink: 0}}>
                                    <Btn size="small" color="primary" onClick={(e) => {

                                        field.child_form.onInit(e)
                                    }}>
                                        <span className='fs-11' style={{color: '#5d6cef'}}>{field.child_form.hasOwnProperty('button_label') ? field.child_form.button_label : 'Add'}</span>
                                    </Btn>

                                    <Popover
                                        open={field.child_form.initForm !== null ? true : false}
                                        anchorEl={field.child_form.initForm !== null ? field.child_form.initForm.target : null}
                                        onClose={() => {


                                        }}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                    >
                                        {field.child_form.hasOwnProperty('form') &&
                                        
                                            <div style={{width: 500}}>
                                            
                                                {field.child_form.form}
                                            </div>
                                        }
                                    </Popover>
                                </div>
                            }
                        </div>

                        {
                            (
                                field.type === 'multiselect'
                                &&
                                (this.state.input_data.hasOwnProperty(field.name) && this.state.input_data[field.name].length > 0)
                            )
                            &&
                            <div className='mt-10'>

                                <strong className='fs-11 gr-6'>Selected {field.label}</strong>
                                <Stack direction="row" spacing={1}>

                                    {field.hasOwnProperty('options') &&
                                    
                                        field.options.map((_option, index) => {

                                            if(this.state.input_data.hasOwnProperty(field.name) && this.state.input_data[field.name].indexOf(_option.key) > -1){

                                                return <Chip key={`selected_options_${field.name}_${index}`} label={_option.value} size="small" onDelete={() => {

                                                    let input_data = this.state.input_data;
                                                    let _data = input_data[field.name];

                                                    _data.splice(_data.indexOf(_option.key), 1);

                                                    input_data[field.name] = _data;

                                                    this.setState({input_data: input_data})
                                                }} />
                                            }
                                        })
                                    }
                                </Stack>
                            </div>
                        }
                    </div>
                )
            }

            if(field.type === 'date'){

                let date_value = null;

                let input_data = this.state.input_data;

                if(input_data.hasOwnProperty(field.name) && input_data[field.name] !== null){

                    if(moment(input_data[field.value]).isValid()){

                        date_value = moment(input_data[field.name]);
                    }
                }

                let _props = {}

                _props.value = date_value;

                if(field.hasOwnProperty('min_date') && field.min_date !== null && moment(field.min_date).isValid()){

                    _props.minDate = moment(field.min_date)
                }

                if(field.hasOwnProperty('max_date') && field.max_date !== null && moment(field.max_date).isValid()){

                    _props.maxDate = moment(field.max_date)
                }

                return (
                    <>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                {..._props}
                                label={field.label}
                                format='DD-MM-YYYY'
                                views={['year', 'month', 'day']}
                                slotProps={{textField: {variant: 'standard', size: 'small', error: this.state.input_errors.hasOwnProperty(field.name) ? true : false, helperText: (this.state.input_errors.hasOwnProperty(field.name) ? this.state.input_errors[field.name] : '')}}}
                                onChange={(_date) => {

                                    let input_data = this.state.input_data;

                                    if(_date && _date.isValid()){

                                        let __date = moment(_date).format('YYYY-MM-DD');

                                        input_data[field.name] = __date;
                                        
                                    }else{

                                        if(input_data.hasOwnProperty(field.name)){

                                            delete input_data[field.name];
                                        }
                                    }

                                    if(field.onChange){

                                        field.onChange(_date)
                                    }

                                    this.setState({input_data: input_data});
                                    this.validateField(field)
                                }}
                            />
                        </LocalizationProvider>
                    </>
                )
            }

            if(field.type === 'time'){

                let time_value = null;

                let input_data = this.state.input_data;

                if(input_data.hasOwnProperty(field.name) && input_data[field.name]){
                    
                    if(moment(input_data[field.value]).isValid()){

                        time_value = moment(input_data[field.name]);
                    }
                }

                return (
                    <>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                                label={field.label}
                                value={time_value}
                                slotProps={{textField: {variant: 'standard', size: 'small', error: this.state.input_errors.hasOwnProperty(field.name) ? true : false, helperText: (this.state.input_errors.hasOwnProperty(field.name) ? this.state.input_errors[field.name] : '')}}}
                                onChange={(_time) => {

                                    let input_data = this.state.input_data;

                                    if(_time && _time.isValid()){

                                        let __time = moment(_time).format('HH:mm:ss');

                                        input_data[field.name] = __time;
                                        
                                    }else{

                                        if(input_data.hasOwnProperty(field.name)){

                                            delete input_data[field.name];
                                        }
                                    }

                                    this.setState({input_data: input_data});
                                    this.validateField(field)
                                }}
                            />
                        </LocalizationProvider>
                    </>
                )
            }

            if(field.type === 'radio' || field.type === 'yes_no' || field.type === 'switch'){

                if(field.hasOwnProperty('yes_no') || field.type === 'yes_no' || field.type === 'switch'){

                    if(!field.hasOwnProperty('options')){
                    
                        field.options = [{key: 0, value: 'No'}, {key: 1, value: 'Yes'}];
                    }
                }

                return (

                    <FormControl variant='standard' error={this.state.input_errors.hasOwnProperty(field.name) ? true : false}>
                        <FormLabel>{field.label}</FormLabel>

                        {(field.hasOwnProperty('yes_no') || field.type === 'yes_no' || field.type === 'switch')
                            ?
                                <WdFormFieldSwitch
                                    field={field}
                                    input_data={this.state.input_data}
                                    onChange={(value, e) => {

                                        let input_data = this.state.input_data;

                                        input_data[field.name] = value === true ? 1 : 0;

                                        this.setState({input_data: input_data});

                                        if(field.hasOwnProperty('onChange')){

                                            field.onChange(value, e)
                                        }
                                    }}
                                    value={this.state.input_data.hasOwnProperty(field.name) ? this.state.input_data[field.name] : 0}
                                />
                            :
                                <RadioGroup
                                    row
                                    onChange={(e) => {

                                        let input_data = this.state.input_data;

                                        input_data[field.name] = e.target.value;

                                        this.setState({input_data: input_data});

                                        if(field.hasOwnProperty('onChange')){

                                            field.onChange(e.target.value, e)
                                        }
                                    }}
                                    value={this.state.input_data.hasOwnProperty(field.name) ? this.state.input_data[field.name] : ''}
                                >
                                    {(field.hasOwnProperty('options') && field.options.length > 0) &&
                                    
                                        field.options.map((_option, index) => {

                                            return <FormControlLabel key={`radio_${field.key}_${index}`} value={_option.key} control={<Radio size="small" />} label={_option.value} />
                                        })
                                    }
                                </RadioGroup>
                        }
                        
                        {this.state.input_errors.hasOwnProperty(field.name) &&
                                
                            <FormHelperText sx={{marginLeft: 0}}>{this.state.input_errors[field.name]}</FormHelperText>
                        }
                    </FormControl>
                )
            }

            if(field.type === 'checkbox'){

                return (
                    <FormControl
                        error={this.state.input_errors.hasOwnProperty(field.name) ? true : false}
                        component="fieldset"
                        variant="standard"
                    >
                        <FormLabel component="legend">{field.label}</FormLabel>
                        <FormGroup sx={{display:'flex', justifyContent: 'flex-start', alignItems: 'center'}}>

                            {(field.hasOwnProperty('options') && field.options.length > 0) &&
                            
                                field.options.map((_option, index) => {
                            
                                    return (
                                        <FormControlLabel key={`checkbox_${field.key}_${index}`} control={<Checkbox size="small" checked={this.state.input_data.hasOwnProperty(field.name) ? this.state.input_data[field.name].indexOf(_option.key) > -1 ? true : false : false} onChange={(e) =>{

                                            let input_data = this.state.input_data;

                                            let _value = input_data[field.name];

                                            if(_value.indexOf(_option.key) > -1){

                                                _value.splice(_value.indexOf(_option.key), 1);
                                            }else{

                                                _value.push(_option.key)
                                            }

                                            input_data[field.name] = _value;

                                            this.setState({input_data: input_data});

                                            if(field.hasOwnProperty('onChange')){

                                                field.onChange(e.target.value, _value, e)
                                            }
                                        }} name={field.name} />} label={<span className='fs-12 fw-semibold'>{_option.value}</span>} />
                                    )
                                })
                            }
                        </FormGroup>
                        {this.state.input_errors.hasOwnProperty(field.name) &&
                                
                            <FormHelperText sx={{marginLeft: 0}}>{this.state.input_errors[field.name]}</FormHelperText>
                        }
                    </FormControl>
                )
            }

            if(field.type === 'file' || field.type === 'image'){

                return (

                    <WdFormFieldImage
                        field={field}
                        input_errors={this.state.input_errors}

                        files_data={this.state.files_data}
                        input_data={this.state.input_data}

                        updateFilesData={(files_data, input_data) => {

                            this.setState({files_data: files_data, input_data: input_data})
                        }}
                    />
                )
            }

            if(field.type === 'gallery'){

                return (

                    <WdFormGallery
                        field={field}
                        input_errors={this.state.input_errors}

                        input_data={this.state.input_data}

                        updateData={(files_data) => {

                            let input_data = this.state.input_data;

                            if(files_data.hasOwnProperty(field.name)){

                                let _gallery = [];

                                if(input_data.hasOwnProperty(field.name)){

                                    _gallery = input_data[field.name]
                                }

                                _gallery.push(files_data[field.name])

                                input_data[field.name] = _gallery;
                            }

                            this.setState({input_data: input_data})
                        }}

                        updateInputData={(gallery) => {

                            let input_data = this.state.input_data;

                            input_data[field.name] = gallery

                            this.setState({input_data: input_data})
                        }}
                    />
                )
            }

            if(field.type === 'html'){

                return field.html;
            }
        }
    }

    formSubmit = (event) => {

        event.preventDefault();

        this.handleSubmit(event.target.rel ? event.target.rel : false);
    }

    handleSubmit = (tab) => {

        let submit_url = '';

        if(this.props.submit_url){

            submit_url = this.props.submit_url;
        }

        let has_error = false;
        let tab_errors = this.state.tab_errors;
        
        let group_names = {};
        let parent_objects = {};

        if(this.props.fields.hasOwnProperty('tabs')){

            let tabs = this.props.fields.tabs;

            tabs.forEach((tab, index) => {

                let _tab_has_error = this.validateFields(tab);

                if(has_error === false){

                    has_error = _tab_has_error;
                }

                if(_tab_has_error){

                    tab_errors[tab.key] = true;
                }else{

                    tab_errors[tab.key] = false;
                }

                let _fields = this.extractFields(tab)

                _fields.forEach((_single_field) => {

                    if(_single_field.hasOwnProperty('group_name')){

                        group_names[_single_field.name] = _single_field.group_name

                        parent_objects[_single_field.group_name] = {};
                    }
                })
            })

            this.setState({tab_errors: tab_errors});
        }else{

            let fields = this.props.fields;

            let _fields = this.extractFields(fields)

            _fields.forEach((_single_field) => {

                if(_single_field.hasOwnProperty('group_name')){

                    group_names[_single_field.name] = _single_field.group_name
                    
                    parent_objects[_single_field.group_name] = {};
                }
            })

            has_error = this.validateFields(fields)
        }        

        /*
        Validate duplicate fields
        */
        let unique_field_result = this.state.unique_field_result;

        let duplicate_fields = [];

        if(Object.keys(unique_field_result).length > 0){

            for(let _f in unique_field_result){

                if(unique_field_result[_f] === 'd'){

                    duplicate_fields.push(_f)
                }
            }
        }

        if(duplicate_fields.length > 0){

            has_error = true;
        }

        /*
        Validate if unique fields are being checked
        */
        let unique_loaders = this.state.unique_loaders;

        if(Object.keys(unique_loaders).length > 0){

            for(let ul in unique_loaders){

                if(unique_loaders[ul] === true){

                    has_error = true;
                }
            }
        }

        let error_message = [];

        if(this.props.externalValidate){

            let _return = this.props.externalValidate();

            if(_return.status === false){

                error_message = _return.message;

                if(_return.hasOwnProperty('tab_errors')){

                    let tab_errors = this.state.tab_errors;

                    _return.tab_errors.map((_tab_error, index) => {

                        tab_errors[_tab_error] = true;
                    })

                    this.setState({tab_errors: tab_errors})
                }

                has_error = true;
            }
        }

        if(!has_error){

            if(submit_url === ''){

                console.log('Submit url missing!');
                return false;
            }

            var that = this;

            var formData = new FormData();
    
            formData.append('account_token', this.state.account_token);

            let post_data = {};

            if(this.state.row_id !== ''){

                formData.append(this.props.id, this.state.row_id)
            }

            let _fields_list = this.mapFields();

            let input_data = this.state.input_data;

            _fields_list.map((_field_item) => {

                if(_field_item.hasOwnProperty('remove')){

                    if(_field_item.remove === false){

                        post_data[_field_item.name] = input_data[_field_item.name];
                    }
                }else{

                    post_data[_field_item.name] = input_data[_field_item.name];
                }
            })

            for(let _key in post_data){

                if(_key in group_names){
    
                    let _parent_row = parent_objects[group_names[_key]];
    
                    _parent_row[_key] = post_data[_key];
    
                    parent_objects[group_names[_key]] = _parent_row
                }else{
    
                    formData.append(_key, post_data[_key]);
                }
            }

            if(Object.keys(parent_objects).length > 0){

                for(let _parent_key in parent_objects){

                    formData.append(_parent_key, JSON.stringify([parent_objects[_parent_key]]));
                }
            }

            if(this.props.post_fields){

                let post_fields = this.props.post_fields;

                if(post_fields.length > 0){

                    post_fields.map((_post_field) => {

                        formData.append(_post_field.key, _post_field.value);
                    })
                }
            }
    
            this.setState({submitting: true})
    
            Api.post(submit_url, formData, function(data){
    
                that.setState({submitting: false});
    
                if(data.status){

                    if(that.props.type && that.props.type === 'chlld_form'){

                        that.setState({child_result: data, child_success: true}, () => {

                            window.setTimeout(() => {

                                that.childDone()
                            }, 5000)
                        })
                    }else{

                        if(that.props.drawer){

                            that.setState({open_drawer: false, form_data: {}, row_id: false})
                            that.resetForm()

                            that.setState({success_message: data.message}, () => {

                                window.setTimeout(() => {

                                    that.setState({success_message: ''})
                                }, 5000)
                            });
                        }
                
                        if(that.props.onSubmit){

                            that.props.onSubmit(data)
                        }else{

                            if(that.props.back_url){
                            
                                localStorage.setItem('flash_success_message', data.message);
                                that.setState({redirect: that.props.back_url})
                            }else{

                                that.setState({success_message: data.message}, () => {

                                    window.setTimeout(() => {

                                        that.setState({success_message: ''})
                                    }, 5000)
                                });
                            }
                        }
                    }
    
                }else{
    
                    that.setState({error_message: data.message}, () => {

                        window.setTimeout(() => {

                            that.setState({error_message: ''})
                        }, 5000)
                    });
                }
            });
        }else{

            if(Object.keys(this.state.input_errors).length > 0){

                error_message.push(`Please reivew the form. There are errors in ${Object.keys(this.state.input_errors).length} fields.`);
            }

            if(duplicate_fields.length > 0){

                error_message.push(`${duplicate_fields.length} fields have duplicate entry.`)
            }

            this.setState({form_error: true, error_message: this.renderErrors(error_message)})
            this.formContainer.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    renderErrors = (error_messages) => {

        if(error_messages.length > 0){

            return (
                <div>
                    {error_messages.map((error_message, index) => {

                        return <p style={{margin: 0}} key={`error_message_${index}`}>{error_message}</p>
                    })}
                </div>
            )
        }
    }

    validateFields = (fields) => {

        let has_error = false;

        let _fields = this.extractFields(fields);

        _fields.forEach((_single_field) => {

            if(_single_field.hasOwnProperty('remove')){

                if(_single_field.remove === false){
                
                    let _has_error = this.validateField(_single_field)

                    if(has_error === false){

                        has_error = _has_error;
                    }
                }
            }else{

                let _has_error = this.validateField(_single_field)

                if(has_error === false){

                    has_error = _has_error;
                }
            }
        })

        return has_error;
    }

    validateField = (field) => {

        const input_data = this.state.input_data;
        let input_errors = this.state.input_errors;

        const validations = field.validations;

        let required = false;
        let has_error = false;

        let field_value = '';

        if(input_data.hasOwnProperty(field.name) && input_data[field.name]){

            field_value = input_data[field.name];
        }

        if(typeof validations === 'object' && validations.length > 0){

            if(validations.indexOf('r') > -1){

                if(field.type === 'multiselect'){

                    if(field_value.length <= 0){

                        required = true;
                        has_error = true;
                        input_errors[field.name] = 'This is required entry.';
                    }else{

                        delete input_errors[field.name];
                    }
                }else if(field.type === 'date'){

                    if(field_value === '' || field_value === '0000-00-00' || field_value === '0000-00-00 00:00:00'){

                        required = true;
                        has_error = true;
                        input_errors[field.name] = 'This is required entry.';
                    }else{

                        delete input_errors[field.name];
                    }
                }else{
                
                    if(field_value === ''){
                
                        required = true;
                        has_error = true;
                        input_errors[field.name] = 'This is required entry.';
                    }else{

                        delete input_errors[field.name];
                    }
                }
            }

            if(!required){

                validations.forEach((_validation, index) => {

                    if(
                        _validation === 'r'
                        ||
                        _validation.indexOf('unique') > -1
                    ){

                        // Skip
                    }else{

                        if(_validation === 'email'){

                            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(!re.test(String(field_value).toLowerCase())){

                                has_error = true;
                                input_errors[field.name] = 'Please enter valid email address.';
                            }else{

                                delete input_errors[field.name];
                            }
                        }

                        if(_validation === 'num'){

                            if(isNaN(field_value)){

                                has_error = true;
                                input_errors[field.name] = 'Please enter valid number.';
                            }else{

                                delete input_errors[field.name];
                            }
                        }

                        if(_validation === '-'){

                            let regex = /^[a-zA-Z\-]+$/;

                            if(!regex.test(String(field_value).toLowerCase())){

                                has_error = true;
                                input_errors[field.name] = "Only alphabets and '-' are allowed. eg. text-text-text";
                            }else{

                                delete input_errors[field.name];
                            }
                        }

                        if(_validation === '_'){

                            let regex = /^[a-zA-Z\_]+$/;

                            if(!regex.test(String(field_value).toLowerCase())){

                                has_error = true;
                                input_errors[field.name] = "Only alphabets and '_' are allowed. eg. text_text_text";
                            }else{

                                delete input_errors[field.name];
                            }
                        }

                        if(_validation === '-_'){

                            let regex = /^[a-zA-Z\-\_]+$/;

                            if(!regex.test(String(field_value).toLowerCase())){

                                has_error = true;
                                input_errors[field.name] = "Only alphabets and '_' and '-' are allowed. eg. text-text_text";
                            }else{

                                delete input_errors[field.name];
                            }
                        }

                        if(_validation.indexOf('max-') > -1){

                            let _digit_num = _validation.split('-')[1];

                            if(field_value.length > parseInt(_digit_num)){

                                has_error = true;
                                input_errors[field.name] = `Maximum ${_digit_num} digits allowed.`;
                            }else{

                                delete input_errors[field.name];
                            }
                        }

                        if(_validation.indexOf('min-') > -1){

                            let _digit_num = _validation.split('-')[1];

                            if(parseInt(field_value.length) < parseInt(_digit_num)){

                                has_error = true;
                                input_errors[field.name] = `Please enter min ${_digit_num} digits required.`;
                            }else{

                                if(!input_errors.hasOwnProperty(field.name)){
                                
                                    delete input_errors[field.name];
                                }
                            }
                        }
                    }
                })
            }
        }

        this.setState({input_errors: input_errors})

        return has_error;
    }

    childDone = () => {

        if(this.props.onSubmit){

            this.props.onSubmit(this.state.child_result)
        }
    }

    validateUnique = (_field, _value, _url) => {

        if(_field !== '' && _value !== '' && _url !== ''){

            var that = this;

            var formData = new FormData();
    
            formData.append('account_token', this.state.account_token);

            formData.append(_field, _value);

            if(this.state.row_id){

                formData.append(this.props.id, this.state.row_id);
            }

            let unique_loaders = this.state.unique_loaders

            unique_loaders[_field] = true;
    
            this.setState({unique_loaders: unique_loaders})
    
            Api.post(_url, formData, function(data){
    
                unique_loaders[_field] = false;

                that.setState({unique_loaders: unique_loaders});
    
                if(data.status){

                    let unique_field_result = that.state.unique_field_result;

                    unique_field_result[_field] = data.code;

                    that.setState({unique_field_result: unique_field_result})
    
                }else{
    
                    that.setState({error_message: data.message}, () => {

                        window.setTimeout(() => {

                            that.setState({error_message: ''})
                        }, 5000)
                    });
                }
            });
        }
    }

    extractValidation = (field, key) => {

        if(field.hasOwnProperty('validations')){
        
            let validations = field.validations;

            if(validations && typeof validations === 'object' && validations.length > 0){

                for(let v in validations){

                    if(validations[v].indexOf(key) > -1){
        
                        return validations[v];
                    }
                }
            }
        }

        return false;
    }

    loadData = (row_id) => {

        var that = this;

        var formData = new FormData();

        formData.append('account_token', this.state.account_token);

        formData.append('row_id', row_id);

        if(this.props.data_fields){

            let data_fields = this.props.data_fields;

            if(data_fields.length > 0){

                data_fields.map((_data_field) => {

                    formData.append(_data_field.key, _data_field.value);
                })
            }
        }

        let input_data = this.state.input_data;

        Api.post(this.props.data_url, formData, function(data){

            if(data.status){

                let _row_data = data.data;

                for(let f in input_data){

                    if(_row_data.hasOwnProperty(f)){
                    
                        input_data[f] = _row_data[f];
                    }
                }

                that.setState({input_data: input_data, form_data: _row_data})

                if(that.props.onDataLoad){

                    that.props.onDataLoad(_row_data)
                }

            }else{

                that.setState({error_message: data.message}, () => {

                    window.setTimeout(() => {

                        that.setState({error_message: ''})
                    }, 5000)
                });
            }
        });
    }

    extractFields = (fields) => {

        let _fields = [];

        if(fields.hasOwnProperty('rows')){
        
            if(fields.rows.length > 0){

                fields.rows.forEach((_row, index) => {

                    if(_row.hasOwnProperty('sections')){

                        _row.sections.forEach((_section) => {

                            _section.rows.forEach((_section_row) => {

                                if(_section_row.fields.length > 0){

                                    _section_row.fields.forEach((_single_field) => {
        
                                        _fields.push(_single_field)
                                    })
                                }
                            })
                        })
                    }else{

                        if(_row.fields.length > 0){

                            _row.fields.forEach((_single_field) => {

                                _fields.push(_single_field)
                            })
                        }
                    }
                })
            }
        }

        return _fields;
    }
}

export default WdForm;
