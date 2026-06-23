import React, { Component } from 'react';

import { useParams, Navigate } from "react-router-dom";

export function withRouter(Children){

    return(props) => {

        const params = {params: useParams()};
        return <Children {...props} params={params} />
    }
}

class WdFormRouter extends Component { 
    constructor(props) {
        super();
        this.state = {
            redirect: false,
            module: ''
        }
    }

    componentDidMount = () => {
        
        // let url = window.location.pathname;

        // console.log(url);

        let url = ``;

        if(this.props.params.params.main_route){

            url = `${url}/${this.props.params.params.main_route}`
        }

        if(this.props.params.params.module){

            url = `${url}/${this.props.params.params.module}`
        }

        if(this.props.params.params.action){

            url = `${url}/${this.props.params.params.action}`
        }

        if(this.props.params.params.sub_action){

            url = `${url}/${this.props.params.params.sub_action}`
        }

        if(this.props.params.params.row_id){

            url = `${url}/${this.props.params.params.row_id}`
        }

        this.setState({redirect: url});
    }

    render () {
        if (this.state.redirect !== false) {
            return <Navigate to={this.state.redirect} />
        }

        return (
            null
        );
    }
}

export default withRouter(WdFormRouter)