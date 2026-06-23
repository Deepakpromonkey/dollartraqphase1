import React, { Component } from 'react';

import Grid from '@mui/material/Grid';

import Btn from 'components/Btn';

import DescriptionTwoTone from '@mui/icons-material/DescriptionTwoTone';
import Close from '@mui/icons-material/Close';

import WdFormFieldImage from './WdFormFieldImage';

class WdFormGallery extends Component { 
    constructor(props) {
        super();

        this.state = {
            show: false,

            element: null
        }
    }

    render () {

        return (

            <Grid container spacing={3}>

                <Grid item xs={12}>
                    <label className='fs-13 fw-semibold gr-9'>{this.props.field.label}</label>
                </Grid>

                {this.renderGallery()}
                
                <Grid item xs={2}>

                    <WdFormFieldImage
                        field={this.props.field}
                        input_errors={this.props.input_errors}

                        input_data={this.props.input_data}
                        files_data={this.props.files_data}

                        updateFilesData={(files_data, input_data) => {

                            this.props.updateData(files_data, input_data)
                        }}
                    />
                </Grid>
            </Grid>
        )
    }

    renderGallery = () => {

        let input_data = this.props.input_data;

        let field = this.props.field;

        if(input_data.hasOwnProperty(field.name)){

            let _gallery = input_data[field.name];

            if(_gallery.length > 0){

                return _gallery.map((_gallery_item, index) => {

                    return (
                        <Grid item xs={2} key={`gallery_item_${index}_${field.name}`}>
                            <div className='uploaded-item'>

                                <Btn icon={true} size="small" style={{position: 'absolute', right: 4, top: 5, backgroundColor: 'rgba(255,255,255,.8)', padding: 3}} confirm={true} confirm_message="Do you really want to remove this image?" onClick={() => {

                                    let input_data = this.props.input_data;
                                    let files_data = this.props.files_data;

                                    let _gallery = input_data[field.name];
                                    let _files_gallery = files_data[field.name];

                                    _gallery.splice(index, 1);
                                    
                                    this.props.updateInputData(_gallery, _files_gallery)
                                }}>
                                    <Close className='c-red' style={{fontSize: 16}} />
                                </Btn>

                                <a target='_blank' href={_gallery_item.url}>
                                    <div className='align-center vertical'>

                                        {((field.hasOwnProperty('gallery_type') && field.gallery_type === 'image'))
                                            ?
                                                <img src={_gallery_item.url} style={{maxWidth: 120, maxHeight: 120}} />
                                            :
                                                <>
                                                    <DescriptionTwoTone style={{fontSize: 70}} />
                                                    <strong className='fs-12 c-blue' style={{textTransform: 'uppercase'}}>{_gallery_item.extension}</strong>
                                                </>
                                        }
                                    </div>
                                </a>
                            </div>
                        </Grid>
                    )
                })
            }
        }
    }
}

export default WdFormGallery;