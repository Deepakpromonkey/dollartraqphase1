import React, { Component } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import Close from '@mui/icons-material/Close';
import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import CloudUpload from '@mui/icons-material/CloudUpload';

import Btn from 'components/Btn';

import Loader from 'components/Loader';

import Api from 'api/Api';

class WdFormFieldImage extends Component { 
    constructor(props) {
        super();

        this.state = {
            
            loading: false
        }
    }

    render () {

        let field = this.props.field;

        return (

            <FormControl fullWidth className='wd-form-select' error={this.props.input_errors.hasOwnProperty(field.name) ? true : false}>

                <div className='align-start vertical'>

                    {field.type !== 'gallery' &&
                    
                        <label className='fs-13 fw-semibold gr-9'>{field.label}</label>
                    }

                    {field.hasOwnProperty('path') && field.path !== ''
                        ?
                            <div style={{position: 'relative', marginTop: field.type === 'gallery' ? 0 : 20}}>
                    
                                <div className='align-start'>

                                    {this.props.files_data && this.props.files_data.hasOwnProperty(field.name)
                                        ?
                                            <div className='vertical'>

                                                {((field.type === 'image') || (field.type === 'file')) &&
                                                    <>
                                                        <div className='uploaded-item'>

                                                            <Btn icon={true} size="small" style={{position: 'absolute', right: 4, top: 5, backgroundColor: 'rgba(255,255,255,.8)', padding: 3, zIndex: 99}} confirm={true} confirm_message="Do you really want to remove this image?" onClick={() => {

                                                                let input_data = this.props.input_data;

                                                                if(input_data.hasOwnProperty(field.name)){

                                                                    input_data[field.name] = '';
                                                                }

                                                                let files_data = this.props.files_data;

                                                                if(files_data.hasOwnProperty(field.name)){

                                                                    delete files_data[field.name]
                                                                }

                                                                this.props.updateFilesData(files_data, input_data)
                                                            }}>
                                                                <Close className='c-red' style={{fontSize: 16}} />
                                                            </Btn>

                                                            <a target='_blank' href={this.props.files_data[field.name]['url']}>
                                                                <div className='align-center vertical'>
                                                                    
                                                                    {
                                                                        (field.type === 'image' || (field.hasOwnProperty('gallery_type') && field.gallery_type === 'image'))
                                                                        &&
                                                                        (this.props.files_data.hasOwnProperty(field.name) && this.props.files_data[field.name].hasOwnProperty('url') && this.props.files_data[field.name]['url'] !== '')
                                                                        ?
                                                                            <div style={{minHeight: 110, minWidth: 110}} className='align-center'>

                                                                                <img src={this.props.files_data[field.name]['url']} style={{maxWidth: 120, maxHeight: 120, zIndex: 9}} />
                                                                            </div>
                                                                        :
                                                                            <div style={{minHeight: 110, minWidth: 110}} className='align-center'>
                                                                                <DescriptionTwoTone style={{fontSize: 70}} />
                                                                                <strong className='fs-12 c-blue' style={{textTransform: 'uppercase'}}>{this.props.files_data[field.name]['extension']}</strong>
                                                                            </div>
                                                                    }
                                                                </div>
                                                            </a>
                                                        </div>

                                                        {field.type === 'gallery'
                                                            ?
                                                                null
                                                            :
                                                                <div>
                                                                    <label style={{backgroundColor: 'rgba(106, 130, 251, .2)', cursor: 'pointer', padding: '3px 20px', color: '#000', fontWeight: 'bold', display: 'flex', borderRadius: '20px', alignItems: 'center', justifyContent:'center', marginTop: 5}}>
                                                                        <input type="file" className="hidden" onChange={(e) => {

                                                                            this.uploadDoc(e, field)
                                                                        }} accept={field.allowed_types} />

                                                                        <span className='fs-11'>Change</span>
                                                                    </label>
                                                                </div>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        :
                                            null
                                    }

                                    {
                                        (
                                            (field.type === 'gallery')
                                            ||
                                            (field.type === 'image' || field.type === 'file') && (this.props.files_data && !this.props.files_data.hasOwnProperty(field.name))
                                        )
                                            &&

                                                <label className="upload-panel sm" style={{width: 110}}>
                                                    <input type="file" className="hidden" onChange={(e) => {

                                                        this.uploadDoc(e, field)
                                                    }} accept={field.allowed_types} />

                                                    <div className='upload-panel-button'>
                                                        <CloudUpload />
                                                        <span className='fs-11'>Upload</span>
                                                    </div>
                                                </label>
                                    }
                                </div>

                                <Loader loading={this.state.loading} />
                            </div>
                        :
                            <div>
                                <strong className='c-red fs-11'>"path" prop is missing.</strong>
                            </div>
                    }

                    {this.props.input_errors.hasOwnProperty(field.name) &&
                        
                        <FormHelperText sx={{marginLeft: 0}}>{this.props.input_errors[field.name]}</FormHelperText>
                    }
                </div>
            </FormControl>
        )
    }

uploadDoc = (e, field) => {

    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("tmp_file_name", file);

    if(field.hasOwnProperty('allowed_types') && field.allowed_types !== ''){
        formData.append('allowed_types', field.allowed_types);
    }

    if(field.hasOwnProperty('path') && field.path !== ''){
        formData.append('upload_dir', field.path);
    }

    if(this.props.row_id && this.props.row_id !== ''){
        formData.append('row_id', this.props.row_id);
    }

    var self = this;

    this.setState({loading: true})

    Api.post('imageuploader', formData, function (data) {

        self.setState({loading: false});

        if(data.status === 'success'){

            let url = `${data.random_dir}${data.main_file_name}`;

            let files_data = {};

            if(self.props.files_data){

                files_data = self.props.files_data;
            }

            let input_data = self.props.input_data;

            if(field.type === 'file' || field.type === 'image'){

                if(!input_data.hasOwnProperty(field.name)){

                    input_data[field.name] = ''
                }

                input_data[field.name] = url;
            }

            if(field.type === 'gallery'){

                if(!input_data.hasOwnProperty(field.name)){

                    input_data[field.name] = [{path: url, extension: data.extension, url: `${data.media_url}${data.upload_dir}${data.random_dir}${data.main_file_name}`}]
                }else{

                    input_data[field.name].push({path: url, extension: data.extension, url: `${data.media_url}${data.upload_dir}${data.random_dir}${data.main_file_name}`})
                }
            }

            files_data[field.name] = {path: url, url: `${data.media_url}${data.upload_dir}${data.random_dir}${data.main_file_name}`, extension: data.extension}

            self.props.updateFilesData(files_data, input_data)

        }else{

            self.setState({error_message: data.message}, () => {

                window.setTimeout(() => {

                    self.setState({error_message: ''})
                }, 5000)
            });
        }
    });
}
}

export default WdFormFieldImage;