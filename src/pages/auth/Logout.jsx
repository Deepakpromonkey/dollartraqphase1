import React, { Component } from 'react';
 
import { useParams } from "react-router-dom";
 
import Api from 'api/Api';
 
export function withRouter(Children){
 
    return(props) => {
 
        const params = {params: useParams()};
        return <Children {...props} params={params} />
    }
}
 
class Logout extends Component {
    constructor(props) {
        super();
        this.state = {
            redirect: false
        }
    }
 
    componentDidMount = () => {
 
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
 
        if(account_token){
 
            const auto_logout = this.props.params.params.auto_logout;
 
            if(auto_logout){
 
                this.logout(account_token, true);
            }else{
 
                this.logout(account_token, false);
            }
           
        }else{
 
            this.reset();
        }
    }
 
    logout = (account_token, auto_logout) => {
 
        var formData = new FormData();
        var that = this;
 
        formData.append('account_token', account_token);
 
        if(auto_logout){
 
            formData.append('auto_logout', 'yes');
        }
 
        this.setState({loading: true})
 
      
            this.reset();
        
    }
 
    reset = () => {
 
        localStorage.setItem('is_logged_in', 0);
        localStorage.removeItem(import.meta.env.VITE_ACCOUNT_USER);
        localStorage.removeItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        localStorage.removeItem('account_token');
 
        window.location = "https://staging.dollartraq.com/";
    }
   
    render () {
        return (
            <></>
        )
    }
}
 
export default withRouter(Logout)
 
