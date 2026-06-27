import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import menu from '../modules.json';

const buildPermissionMap = () => {

    var _map = {};

    var addItem = (_item) => {

        if(_item.hasOwnProperty('link') && _item.hasOwnProperty('permission') && _item.permission){

            _map['/' + _item.link.toLowerCase()] = _item.permission;
        }
    };

    menu.forEach((_row) => {

        addItem(_row);

        if(_row.hasOwnProperty('childs')){

            _row.childs.forEach(addItem);
        }
    });

    return _map;
};

const PERMISSION_MAP = buildPermissionMap();

class ProtectedRoute extends Component {


    static getUser = () => {

        try {

            var raw = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

            if(!raw){

                return null;
            }

            var parsed = JSON.parse(raw);

            if(!parsed || typeof parsed !== 'object'){

                return null;
            }

            return parsed;

        }catch(e){

            return null;
        }
    }

    static getToken = () => {

        try {

            var raw = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);

            if(!raw || typeof raw !== 'string' || raw.trim() === ''){

                return null;
            }

            return raw;

        }catch(e){

            return null;
        }
    }

    static isAdmin = (user) => {

        var customer = (user !== undefined) ? user : ProtectedRoute.getUser();

        if(!customer){

            return false;
        }

        var usersOf = customer.users_of;

        return (usersOf === '' || usersOf === null || usersOf === undefined);
    }

    static getPermissions = (user) => {

        var customer = (user !== undefined) ? user : ProtectedRoute.getUser();

        if(!customer || !customer.roles_row || !customer.roles_row.permissions){

            return {};
        }

        try {

            var parsed = JSON.parse(customer.roles_row.permissions);

            if(!parsed || typeof parsed !== 'object'){

                return {};
            }

            return parsed;

        }catch(e){

            return {};
        }
    }
    static can = (key, user) => {

        if(!key || typeof key !== 'string'){

            return false;
        }

        var customer = (user !== undefined) ? user : ProtectedRoute.getUser();

        if(ProtectedRoute.isAdmin(customer)){

            return true;
        }

        var permissions = ProtectedRoute.getPermissions(customer);

        return permissions[key] === true;
    }

    /**
     * Normalizes a route path the same way it's keyed in PERMISSION_MAP -
     * trims, lowercases (so "/Users" can't dodge the check), and strips
     * a trailing slash (so "/users/" and "/users" match the same entry).
     */
    static normalizePath = (path) => {

        var _path = (path || '').trim().toLowerCase().replace(/\/+$/, '');

        return (_path === '') ? '/' : _path;
    }

    render(){

        var account_token = ProtectedRoute.getToken();

        // Not logged in at all (missing, blank, or whitespace-only) ->
        // straight back to Signin, regardless of whether this path even
        // has a permission requirement.
        if(!account_token){

            return <Navigate to="/" replace />
        }

        var path = ProtectedRoute.normalizePath(this.props.path);
        var required_permission = PERMISSION_MAP[path];

        // Logged in, but this path has no permission declared in
        // modules.json -> open to any logged-in user.
        if(!required_permission){

            return this.props.children;
        }

        // Logged in, but missing the specific permission this path needs.
        if(!ProtectedRoute.can(required_permission)){

            localStorage.setItem('flash_error_message', 'Unauthorized Access!');

            return <Navigate to="/dashboard" replace />
        }

        return this.props.children;
    }
}

export default ProtectedRoute;