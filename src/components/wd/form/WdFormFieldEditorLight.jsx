import React, { Component } from 'react';

import Btn from '@/components/Link';

import ContentEditable from 'react-contenteditable'
import Rangy from 'rangy';

import Api from '@/api/Api';

class WdFormFieldEditorLight extends Component { 
    constructor(props) {
        super();

        this.state = {

            selected_tools: [],

            link: '',
            link_popup: false,

            link_selection: null
        }

        this.editor = React.createRef()
        this.file = React.createRef()
        this.link_input = React.createRef()
    }

    componentDidMount = () => {

        let that = this;

        document.addEventListener('blur', function (event) {

            console.log(event.target.nodeName)
        })

        document.addEventListener('click', function (event) {
            
            const target = event.target;

            if(target.hasOwnProperty('className') && target.classList.length > 0){
            
                if(target.className.indexOf("editable") > -1){

                    document.activeElement.blur()
                    target.focus();
                }
            }

            if(target){

                if(
                    (target.nodeName === 'button' || target.nodeName === 'BUTTON')
                    &&
                    target.parentElement && (target.parentElement.nodeName === 'FIGURE' || target.parentElement.nodeName === 'figure')
                ){

                    that.removeQueueFile(target.parentElement.id);
                    target.parentElement.remove()
                }
            }
        });

        document.addEventListener('mouseover', (event) => {

            const target = event.target;

            if(target){

                if(
                    target.parentElement && (target.parentElement.nodeName === 'FIGURE' || target.parentElement.nodeName === 'figure')
                ){

                    let figure = target.parentElement;

                    let buttons = figure.getElementsByTagName('button')

                    if(buttons.length <= 0){

                        let button = document.createElement("button");
                        button.className = 'absolute w-5 h-5 rounded-full bg-red-700 flex items-center justify-center text-white font-bold';
                        button.style.top = 0;
                        button.style.right = 0;
                        button.innerHTML = 'x'

                        button.addEventListener('click', (e) => {

                            target.parentElement.remove()
                        })

                        figure.prepend(button);
                    }

                    figure.addEventListener('mouseleave', () => {

                        let buttons = figure.getElementsByTagName('button')

                        if(buttons && buttons.length > 0){
                        
                            buttons[0].remove()
                        }
                    })
                }
            }
        })
    }

    removeQueueFile = (id) => {

        if(this.props.removeQueueFile){

            this.props.removeQueueFile(id);
        }
    }

    render () {
        
        return (

            <div className='relative'>

                <div className='flex justify-between'>
                    <ul className="flex flex-wrap items-center justify-start">
                        <li>
                            {this.editButton('bold', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>)}
                        </li>
                        <li>
                            {this.editButton('italic', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>)}
                        </li>
                        <li>
                            {this.editButton('underline', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>)}
                        </li>
                        <li className='ml-3'>
                            {this.editButton('formatBlock', <span className='text-sm font-semibold text-gray-600'>H1</span>, "H1", "Heading H1")}
                        </li>
                        <li>
                            {this.editButton('formatBlock', <span className='text-sm font-semibold text-gray-600'>H2</span>, "H2", "Heading H2")}
                        </li>
                        <li>
                            {this.editButton('formatBlock', <span className='text-sm font-semibold text-gray-600'>H3</span>, "H3", "Heading H3")}
                        </li>
                        <li>
                            {this.editButton('formatBlock', <span className='text-sm font-semibold text-gray-600'>H4</span>, "H4", "Heading H4")}
                        </li>
                        <li>
                            {this.editButton('formatBlock', <span className='text-sm font-semibold text-gray-600'>H5</span>, "H5", "Heading H5")}
                        </li>

                        <li className='ml-3'>
                            {this.editButton('justifyLeft', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>, null, "Align Left")}
                        </li>
                        <li>
                            {this.editButton('justifyRight', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>, null, "Align Right")}
                        </li>

                        <li className='ml-3'>
                            {this.editButton('indent', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>, null, "Indentation")}
                        </li>
                        <li>
                            {this.editButton('outdent', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/></svg>, null, "Remove Indentation")}
                        </li>
                        <li>
                            {this.editButton('insertunorderedlist', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>, null, "Bulleted List")}
                        </li>
                        <li>
                            {this.editButton('insertorderedlist', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>, null, "Ordered List")}
                        </li>

                        <li className='ml-3'>

                            <Btn title="Insert Image" className='rounded-full p-2 hover:bg-gray-200 flex items-center justify-center w-9 h-9' onClick={() => {

                                this.file.current.click()
                            }}>
                                <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            </Btn>
                            <input ref={this.file} type="file" accept=".jpg,.jpeg,.png,.svg" className="hidden" onChange={(e) => {this._handleImageChange(e, document)}} style={{display:'hidden'}} />
                        </li>
                        <li>

                            <Btn title="Insert Link" className='rounded-full p-2 hover:bg-gray-200 flex items-center justify-center w-9 h-9' onClick={() => {

                                var sel = Rangy.getSelection();

                                let wrapper = document.createElement('div');
                                wrapper.innerHTML = sel.toHtml();

                                if(wrapper.firstChild){

                                    if(wrapper.firstChild.href){

                                        this.setState({link: wrapper.firstChild.href})
                                    }
                                }

                                wrapper.remove();

                                this.setState({link_selection: sel.getRangeAt(0).cloneRange()})

                                this.setState({link_popup: true}, () => {

                                    this.link_input.current.focus()
                                })
                            }}>
                                <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/></svg>
                            </Btn>
                        </li>
                        {/* <li style={{marginRight:0}}>
                            {this.editButton('forecolor', <div className="color-button" style={{backgroundColor:'#f00'}}></div>, '#f00')}
                        </li>
                        <li style={{marginLeft:0, marginRight:0}}>
                            {this.editButton('forecolor', <div className="color-button" style={{backgroundColor:'#0716e9'}}></div>, '#0716e9')}
                        </li>
                        <li style={{marginLeft:0, marginRight:0}}>
                            {this.editButton('forecolor', <div className="color-button" style={{backgroundColor:'#12aa4c'}}></div>, '#12aa4c')}
                        </li> */}
                    </ul>
                    <ul className="flex items-center justify-end">
                        <li>
                            {this.editButton('undo', <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>, null, "Undo")}
                        </li>
                        <li style={{marginLeft:30}}></li>
                        <li>
                            {this.editButton('removeFormat', <svg enableBackground="new 0 0 24 24" height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M21.19,21.19L2.81,2.81L1.39,4.22l4.2,4.2c-1,1.31-1.6,2.94-1.6,4.7C4,17.48,7.58,21,12,21c1.75,0,3.36-0.56,4.67-1.5 l3.1,3.1L21.19,21.19z M12,19c-3.31,0-6-2.63-6-5.87c0-1.19,0.36-2.32,1.02-3.28L12,14.83V19z M8.38,5.56L12,2l5.65,5.56l0,0 C19.1,8.99,20,10.96,20,13.13c0,1.18-0.27,2.29-0.74,3.3L12,9.17V4.81L9.8,6.97L8.38,5.56z"/></svg>, null, "Clear Formatting")}
                        </li>
                    </ul>
                </div>

                {this.state.link_popup &&
                
                    <div className='bg-white w-full p-8 absolute shadow-lg' style={{zIndex: 999, top:-110, left:0}}>

                        <div className='flex'>
                            <div className='grow'>
                                <input type="text" className='bg-gray-100 border border-gray-300 px-3 py-1 w-full rounded-md text-lg' placeholder='Enter URL Here' ref={this.link_input} onChange={(e) => {

                                    this.setState({link: e.target.value});

                                }} value={this.state.link} />
                            </div>
                            <div className='flex'>
                                <Btn className="ml-2 bg-blue-100" onClick={() => {

                                    this.editor.current.focus();

                                    let sel = this.state.link_selection;

                                    Rangy.getSelection().setSingleRange(sel);

                                    this.setState({link_popup: false, link: ''})

                                    document.execCommand("createLink", false, this.state.link);

                                }}>Insert Link</Btn>
                                <Btn className="ml-2" onClick={() => {

                                    this.setState({link_popup: false, link: '', link_selection: null})
                                }}>Cancel</Btn>
                            </div>
                        </div>
                    </div>
                }

                <ContentEditable
                    innerRef={this.editor}
                    margin="normal"
                    className={`editable ${this.props.className ? this.props.className : ''}`}
                    placeholder={this.props.placeholder ? this.props.placeholder : ''}
                    tagName="div"
                    html={this.props.html}
                    disabled={false}
                    onChange={(e) => {

                        this.props.onChange(e);
                    }}
                    onFocus={(e) => {

                        if(this.props.html === ''){

                            this.props.onFocus('<div><br></div>')
                        }
                    }}
                    // onKeyDown={(e) => {

                    //     if(e.keyCode === 8){
                            
                    //         this.props.onChange('<div><br></div>')
                    //     }
                    // }}
                />
                <span className="text-red-400">{this.props.error ? (this.props.error_message ? this.props.error_message : 'This is rquired field') : ''}</span>
            </div>
        )
    }

    editButton = (cmd, name, arg, title) => {
        return (
            <Btn
                title={title || ""}
                key={cmd}
                onMouseDown={evt => {
                    evt.preventDefault();
                    document.execCommand(cmd, false, arg);
                    
                    // var selected_tools = this.state.selected_tools;
                    // if(selected_tools.indexOf(cmd) > -1){

                    //     selected_tools.splice(selected_tools.indexOf(cmd), 1);
                    // }else{
                    //     selected_tools.push(cmd);
                    // }
                    // this.setState({selected_tools: selected_tools});
                }}
                className={`${this.state.selected_tools.indexOf(cmd) > -1 ? 'active' : ''} rounded-full p-2 hover:bg-gray-200 flex items-center justify-center w-9 h-9`}
            >
                {name || cmd}
            </Btn>
        );
    }

    _handleImageChange = async(e, document) => {

        e.preventDefault();
    
        let reader = new FileReader();
        let file = e.target.files[0];

        this.editor.current.focus();

        let id = `figure_${Math.floor(Math.random() * 10000000000)}`
        let img_id = `img_${Math.floor(Math.random() * 10000000000)}`

        // <button class="absolute w-5 h-5 rounded-full bg-red-700 flex items-center justify-center text-white font-bold" style="top:0; right:0;">x</button>

        document.execCommand("insertHTML", false, `<br /><figure id="${id}" contenteditable="false" class="relative"><div id="${img_id}" class="flex items-center flex-col"><svg class='ml-1 animate-spin' width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg><div></div></div></figure><br />`);

        reader.readAsDataURL(file);

        this.submit(file, img_id);
        // if(this.props.addFileToQueue){
        
        //     this.props.addFileToQueue(file, id)
        // }
    }

    submit = (file, id) => {

        this.setState({submitted: true})

        var that = this;

        var formData = new FormData();

        formData.append('image', file);

        Api.post('articles/article-file', formData, function(data){
        
            that.setState({loading: false})

            window.setTimeout(() => {

                document.getElementById(id).innerHTML = `<img src="${data.url}" />`
            }, 1500)
            
        });
    }
}

export default WdFormFieldEditorLight;