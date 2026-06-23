import React, { Component } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Api from 'api/Api';

function uploadAdapter(loader) {
    return {
        upload: () => {
            
            return new Promise((resolve, reject) => {
            
                const body = new FormData();
            
                loader.file.then((file) => {
                
                    body.append("image", file);
                    fetch(
                        `${Api.api_url}imageuploader`,
                        {
                            method: 'POST',
                            body: body,
                            headers: {
                                'X-API-KEY': Api.api_key
                            }
                        }
                    ).then((res) => {

                        return res.json()
                    }).then((res) => {

                        resolve({
                            default: res.image
                        });
                    }).catch((err) => {
                        reject(err);
                    });
                });
            });
        }
    };
}

function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
}

function WdFormFieldEditor({value, onChange}){

    return (

        <div>
            <CKEditor
                editor={ ClassicEditor }
                
                data={value}
                onChange={ ( event, editor ) => {
                
                    const data = editor.getData();
    
                    onChange(data, event, editor)
                }}

                // onReady={ editor => {
                //     // You can store the "editor" and use when it is needed.
                //     console.log( 'Editor is ready to use!', editor );
                // } }
                // onChange={ ( event, editor ) => {
                //     const data = editor.getData();
                //     console.log( { event, editor, data } );
                // } }
                // onBlur={ ( event, editor ) => {
                //     console.log( 'Blur.', editor );
                // } }
                // onFocus={ ( event, editor ) => {
                //     console.log( 'Focus.', editor );
                // } }

                config={{
                    extraPlugins: [uploadPlugin],
                    toolbar: {
                        items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'link',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'blockQuote',
                            'insertTable',
                            '|',
                            'imageUpload',
                            'undo',
                            'redo',
                        ]
                    },
                    table: {
                        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
                    }
                }}
            />
        </div>
    )
}

export default WdFormFieldEditor;