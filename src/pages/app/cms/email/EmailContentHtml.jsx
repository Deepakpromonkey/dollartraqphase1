import React, { Component } from 'react';

import Btn from 'components/Btn';

class EmailContentHtml extends Component {

    constructor(props) {
        super();
        this.state = {
            text: '',

            variables: {
                'activate_url': 'Activate URL',
                'admin_email': 'Admin Email',
                'confirm_link': 'Confirm Link',
                'currency': 'Currency',
                'dashboard': 'Dashboard',
                'date': 'Date',
                'display_name': 'Display Name',
                'invoice_id': 'Invoice Id',
                'link': 'Link',        
                'link_review': 'Link Review',
                'message': 'Message',
                'payment': 'Payment',
                'reason': 'Reason',
                'sender': 'Sender',
                'sitename': 'SiteName',
                'site_url': 'Site Url',
                'title': 'Title',
                'total': 'Total',
                'user_email': 'User Email',
                'user_login': 'User Login',
                'user_name': 'User Name',
                'order_number': 'Order Number',
                'order_amount': 'Order Amount',
                'order_date': 'Order Date',
                'customer_name': 'Customer Name',
                'customer_email': 'Customer Email',
                'customer_contact': 'Customer Contact',
            }
        }

        this.ele = new React.createRef();
    }

    renderButtons = () => {

        let variables = this.state.variables;

        let buttons = [];

        for(let v in variables){

            buttons.push(
                <li key={`list_btn_${v}`} className='mr-5 mb-5'>
                    <Btn size="small" style={{backgroundColor: 'rgba(106, 130, 251, .1)'}} onClick={() => {

                        this.pushVariable(v)
                    }}>{variables[v]}</Btn>
                </li>
            )
        }

        return buttons;
    }

    render(){

        return (

            <div>

                <div className='mb-10'>
                    <ul style={{padding: 0, margin: 0, listStyleType: 'none', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap'}}>

                        {this.renderButtons()}
                    </ul>
                </div>

                <textarea
                    className='fs-13'
                    ref={this.ele}
                    style={{width: '100%', fontFamily: 'Open Sans'}}
                    rows={20}
                    value={this.props.content}
                    onChange={(e) => {

                        this.props.updateContent(e.target.value)
                    }}
                />
            </div>
        )
    }

    pushVariable = (_var) => {

        let _ele = this.ele.current;

        if(document.selection){
            _ele.focus();
            let _sel = document.selection.createRange();
            _sel.text = _var;
            return;
        }

        let ele_value = this.props.content;
        
        if(_ele.selectionStart || _ele.selectionStart == "0"){

            var _start = _ele.selectionStart;
            var _end = _ele.selectionEnd;
            var _v_start = ele_value.substring(0, _start);
            
            //add space before variable
            let _v_start_length = _v_start.length;
            if(_v_start_length > 0){

                let _last_char = _v_start.charAt((_v_start_length-1));
                
                if(_last_char != ' '){
                    _v_start = _v_start + ' ';
                }
            }
            
            var _v_end = ele_value.substring(_end, ele_value.length);
            ele_value = _v_start + '{{' + _var + '}}' + _v_end;
        }else{
            ele_value += '{{' + _var + '}}';
        }

        this.props.updateContent(ele_value)
    }
}

export default EmailContentHtml;