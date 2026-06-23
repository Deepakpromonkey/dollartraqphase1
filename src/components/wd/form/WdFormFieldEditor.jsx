
import React, { Component } from "react";

import { Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import DOMPurify from "dompurify";

import Btn from "components/Btn";

class WdFormFieldEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            previewMode: false,
        };

        this.editor = null;
    }

    dedupeExtensions = (exts = []) => {
        const seen = new Set();
        const out = [];
    
        for(const ext of exts){

            const name = (ext && ext.name) || (ext && ext.constructor && ext.constructor.name) || JSON.stringify(ext);
      
            if(!seen.has(name)){
        
                seen.add(name);
                out.push(ext);
            }else{

            }
        }
    
        return out;
    };

    createEditor = () => {

        if(typeof window === "undefined") return;

        if(this.editor){
      
            try {
        
                this.editor.destroy();
            }catch (err){

            }

            this.editor = null;
        }

        const exts = [
      
            StarterKit.configure({
      
            }),
            Underline,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ];

        const uniqueExts = this.dedupeExtensions(exts);

        this.editor = new Editor({
            content: this.props.value || "",
            extensions: uniqueExts,
            onUpdate: ({ editor }) => {
            
                const html = editor.getHTML();

                const cleanHTML = DOMPurify.sanitize(html, {
                    ALLOWED_TAGS: [
                        "p",
                        "b",
                        "strong",
                        "i",
                        "em",
                        "u",
                        "ul",
                        "ol",
                        "li",
                        "br",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "span",
                        "div",
                    ],
                    ALLOWED_ATTR: ["style"],
                });

                this.props.onChange(cleanHTML);
            },
        });

        this.forceUpdate();
    };

    componentDidMount = () => {
    
        this.createEditor();
    }

    componentDidUpdate = (prevProps) => {
    
        if(prevProps.content !== this.props.value && this.editor){
      
            if(this.props.value !== this.editor.getHTML()){
        
                this.editor.commands.setContent(this.props.value || "");
            }
        }
    }

    componentWillUnmount = () => {
    
        if(this.editor){
        
            try{
                
                this.editor.destroy();
            }catch (err){

            }

            this.editor = null;
        }
    }

    insertVariable = (key) => {
    
        if(!this.editor) return;
        this.editor.chain().focus().insertContent(`{{${key}}}`).run();
    };

    renderButtons = () => {
    
        return Object.entries(this.state.variables).map(([key, label]) => (
            <li key={key} className="mr-5 mb-5">
                <Btn
                    size="small"
                    style={{ backgroundColor: "rgba(106, 130, 251, .1)" }}
                    onClick={() => this.insertVariable(key)}
                >
                    {label}
                </Btn>
            </li>
        ));
    }

    renderPreview = () => (
    
        <div
            className="fs-13"
            style={{ border: "1px solid #ccc", minHeight: 200, padding: 10, background: "#fafafa" }}
            dangerouslySetInnerHTML={{ __html: this.props.value }}
        />
    );

    renderEditor = () => {
    
        if(!this.editor) return null;
    
        return (
            <EditorContent
                editor={this.editor}
                className="fs-13 tiptap-editor"
            />
        );
    };

    renderToolbar = () => {
    
        if(!this.editor) return null;

        return (
            <div className="flex justify-between">
                <ul className="flex flex-wrap items-center justify-start" style={{ padding: 0, marginBottom: 0, marginTop: 5 }}>
                    <li>
                        <Btn size="small"size="small" icon={true} onClick={() => this.editor.chain().focus().toggleBold().run()}>
                            <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                        </Btn>
                    </li>
                    <li>
                        <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().toggleItalic().run()}>
                            <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                        </Btn>
                    </li>
                    <li>
                        <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().toggleUnderline().run()}>
                            <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/></svg>
                        </Btn>
                    </li>

                    {[1, 2, 3, 4, 5].map((h) => (
                        <li key={h}>
                            <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().toggleHeading({ level: h }).run()}>
                                <strong className='fs-13'>H{h}</strong>
                            </Btn>
                        </li>
                    ))}

                    <li>
                        <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().setTextAlign("left").run()} title="Align Left">
                            <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
                        </Btn>
                    </li>
                    <li>
                        <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().setTextAlign("center").run()} title="Align Center">
                            <svg height="18px" viewBox="0 -960 960 960" width="18px" fill="#000000"><path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/></svg>
                        </Btn>
                    </li>
                    <li>
                        <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().setTextAlign("right").run()} title="Align Right">
                            <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/></svg>
                        </Btn>
                    </li>

                    <li>
                        <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().toggleBulletList().run()} title="Bulleted List">
                            <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                        </Btn>
                    </li>
                    <li>
                        <Btn size="small"icon={true} onClick={() => this.editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
                            <svg height="18px" viewBox="0 0 24 24" width="18px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                        </Btn>
                    </li>
                </ul>

                {/* <Btn size="small"onClick={() => this.setState({ previewMode: !this.state.previewMode })} style={{ marginLeft: 20 }}>
                {this.state.previewMode ? "Edit Mode" : "Preview Mode"}
                </Btn> */}
            </div>
        );
    };

    render(){
    
        return (
            <div>
                <div className="mb-10">
                    {/* <ul
                        style={{
                        padding: 0,
                        margin: 0,
                        listStyleType: "none",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flexWrap: "wrap",
                        }}
                    >
                        {this.renderButtons()}
                    </ul> */}

                    {!this.state.previewMode && this.renderToolbar()}
                </div>

                {this.state.previewMode ? this.renderPreview() : this.renderEditor()}
            </div>
        );
    }
}

export default WdFormFieldEditor;
