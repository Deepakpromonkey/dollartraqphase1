import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, FormHelperText } from '@material-ui/core';

import ReactCrop from 'react-image-crop';

class Cropper extends Component { 
    constructor(props) {
        super();
        this.state = {

            temp_item_image: null,

            picture_uploading: null,

            profile_image_preview: null,

            croppedImageUrl: null,

            croppedImage: null,

            crop: {
                unit: 'px',
                width: 200,
                height: 200,
                maxWidth: 200,
                maxHeight: 200,
                aspect: 1 / 1
            },
        }

        this.imageRef = null;
    }

    componentDidMount = () => {

        if(this.props.crop){

            this.setState({crop: this.props.crop})
        }
    }

    render () {
        
        return (

            <>

                <label className="cloud-uploader-container">
                    
                    {!this.state.picture_uploading &&
                        <input type="file" className="hidden" onChange={(e) => {this._handleImageChange(e)}} ref={(input)=> this.myinput = input}/>
                    }

                    {this.props.picker}

                    {this.state.picture_uploading &&
                        <CircularProgress color="secondary" />
                    }
                </label>

                {this.props.helper_text &&
                    <FormHelperText>{this.props.helper_text}</FormHelperText>
                }

                {this.state.temp_item_image &&

                    <Dialog
                        open={this.state.temp_item_image ? true : false}
                        // onClose={}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                            
                        <DialogContent>
                            <ReactCrop
                                src={this.state.temp_item_image}
                                crop={this.state.crop}
                                onImageLoaded={(image) => {
                                    this.imageRef = image;
                                }}
                                onChange={(newCrop) => {
                                    this.setState({crop: newCrop})
                                }}
                                onComplete={(crop) => {
                                    this.makeClientCrop(crop);
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({
                                    temp_item_image: null,
                                    croppedImageUrl: null,
                                    croppedImage: null,
                                    picture_uploading: false
                                })
                            }} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={() => {
                                this.props.updateCroppedImage(this.state.croppedImage, this.state.croppedImageUrl);
                                this.setState({
                                    temp_item_image: null,
                                    croppedImageUrl: null,
                                    croppedImage: null,
                                    picture_uploading: false
                                })
                            }} color="primary" autoFocus>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                }
            </>
        )
    }

    getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
    
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        var that = this;

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    console.error('Canvas is empty');
                    return;
                }
                blob.name = 'profile-pic.png';
                window.URL.revokeObjectURL(this.fileUrl);
                this.fileUrl = window.URL.createObjectURL(blob);
                resolve(this.fileUrl);

                var file = new File([blob], "profile-pic.png");
                that.setState({croppedImage: file});
            }, 'image/png');
        });
    }

    makeClientCrop = async(crop) => {

        if(this.imageRef && crop.width && crop.height) {
          
            const croppedImageUrl = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            this.setState({ croppedImageUrl });

            this.toBase64(croppedImageUrl);
        }
    }

    _handleImageChange = async (e) => {

        if(this.state.picture_uploading){
            return false;
        }
        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            this.setState({
                temp_item_image: [reader.result]
            })
        }.bind(this);
    }

    toBase64 = async(url) => {

        var that = this;
        var xhr = new XMLHttpRequest();       
        xhr.open("GET", url, true); 
        xhr.responseType = "blob";
        xhr.onload = function (e) {
            var reader = new FileReader();
            reader.onload = function(event) {
                var res = event.target.result;
                // that.setState({croppedImage: res});
            }
            var file = this.response;
            reader.readAsDataURL(file)
        };
        xhr.send();
    }

    getEmergencyFoundImg = urlImg => {
        var img = new Image();
        img.src = urlImg;
        img.crossOrigin = 'Anonymous';
      
        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d');
      
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        ctx.drawImage(img, 0, 0);
      
        var b64 = canvas.toDataURL('image/png').replace(/^data:image.+;base64,/, '');
        return b64;
    }
}

export default Cropper;