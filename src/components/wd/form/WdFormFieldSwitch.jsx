import React, { Component } from 'react';

import Switch from '@mui/material/Switch';

class WdFormFieldSwitch extends Component { 
    constructor(props) {
        super();

        this.state = {
            
            value: false
        }
    }

    render () {

        return (

            <div className='justify-start'>
                <div>
                    <span
                        className={`fs-14 mr-10 ${(this.props.value === 0 || this.props.value === false) ? 'fw-bold' : ''}`}
                        style={{cursor: 'pointer'}}
                        onClick={() => {
    
                            this.props.onChange(false, false)
                        }}
                    >
                        {this.props.field.options.length > 0 ? this.props.field.options[0]['value'] : ''}
                    </span>
                    
                    <Switch
                        size="small"
                        checked={(this.props.value == '1' || this.props.value === true) ? true : false}
                        onChange={(e) => {

                            this.props.onChange(e.target.checked, e)
                        }}
                    />

                    <span
                        className={`fs-14 ml-10 ${this.props.value === 1 ? 'c-blue fw-bold' : ''}`}
                        style={{cursor: 'pointer'}}
                        onClick={() => {
    
                            this.props.onChange(true, false)
                        }}
                    >
                        {this.props.field.options.length > 0 ? this.props.field.options[1]['value'] : ''}
                    </span>
                </div>
            </div>
        )
    }
}

export default WdFormFieldSwitch;