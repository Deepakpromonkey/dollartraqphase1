"use client"

import React from 'react';

import DOMPurify from 'dompurify'

export default function RenderHtml(props){

    const sanitizedData = () => ({
        __html: DOMPurify.sanitize(props.html)
    })

    return (

        <>
            {(props.tag && props.tag === 'p')
                ?
                    <p
                        className={`content ${props.size ? props.size : ''} ${props.className ? props.className : ''}`}
                        dangerouslySetInnerHTML={{__html: props.html}}
                    />
                :
                    <div
                        className={`content ${props.size ? props.size : ''} ${props.className ? props.className : ''}`}
                        dangerouslySetInnerHTML={{__html: props.html}}
                    />
            }
        </>
    )
}