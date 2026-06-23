import React, { Component } from 'react';

import Chip from '@mui/material/Chip';

import moment from 'moment';

class WdFormVIewField extends Component { 
    constructor(props) {
        super();

        this.state = {
            show: false,

            element: null
        }
    }

    render () {

        return (

            <>
                {this.props.field.hasOwnProperty('type') &&
                
                    this.renderField(this.props.field)
                }
            </>
        )
    }

    renderView = (label, value) => {

        return (
            <div className='view'>
                <label>{label}</label>
                <div>{value}</div>
            </div>
        )
    }

    renderField = (field) => {

        if(field.type === 'input'){

            return this.renderView(field.label, this.props.value !== '' ? this.props.value : <span className='gr-4'>empty</span>)
        }

        if(field.type === 'dropdown'){

            return this.renderView(field.label, this.props.value !== '' ? this.extractValue(field, this.props.value) : <span className='gr-4'>empty</span>)
        }

        if(field.type === 'multiselect'){

            if(this.props.value.length > 0 && field.hasOwnProperty('options')){

                let chips = this.extractChips(this.props.value, field)

                if(chips.length > 0){

                    return this.renderView(field.label, chips)
                }
            }

            return <span className='gr-4'>empty</span>
        }

        if(field.type === 'date'){

            return this.renderView(field.label, this.renderDate(this.props.value, 'DD-MM-YYYY'))
        }
    }

    extractValue = (field, value) => {

        if(field.hasOwnProperty('options')){

            const _row = field.options.find(row => row.key === value);

            if(_row){

                return _row.value;
            }
        }

        return <span className='gr-4'>empty</span>
    }

    extractChips = (values, field) => {

        let chips = [];

        for(let v in values){

            let _v = values[v];

            const _row = field.options.find(row => row.key === _v);

            if(_row){

                chips.push(
                    <Chip key={`selected_options_${field.name}_${v}`} label={_row.value} size="small" className='mr-5' />
                )
            }
        }

        return chips;
    }

    renderDate = (_value, _format) => {

        if(_value !== '' && moment(_value).isValid()){

            return moment(_value).format(_format);
        }

        return <span className='gr-4'>empty</span>;
    }
}

export default WdFormVIewField;