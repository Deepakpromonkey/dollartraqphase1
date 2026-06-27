import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';

import ListItemIcon from '@mui/material/ListItemIcon';

import Button from '@mui/material/Button';

import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import menu from '../modules.json';

class Navigation extends Component { 
    constructor(props) {
        super();
        this.state = {

            menu_items: {}
        }
        this.closeTimers = {};
    }

    componentDidMount = () => {

        
    }

    /**
     * Reads the logged-in customer object from localStorage.
     * Returns null if not present / not parsable.
     */
    static getUser = () => {

        try {

            var raw = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

            if(!raw){

                return null;
            }

            return JSON.parse(raw);

        }catch(e){

            return null;
        }
    }

    /**
     * True when the given (or currently logged-in) customer is an
     * account owner/admin, i.e. users_of is blank/null/undefined.
     * Admins get every permission regardless of roles_row.
     */
    static isAdmin = (user) => {

        var customer = (user !== undefined) ? user : Navigation.getUser();

        if(!customer){

            return false;
        }

        var usersOf = customer.users_of;

        return (usersOf === '' || usersOf === null || usersOf === undefined);
    }

    /**
     * Safely parses customer.roles_row.permissions (a JSON string) into
     * an object. Returns {} if missing / not parsable.
     */
    static getPermissions = (user) => {

        var customer = (user !== undefined) ? user : Navigation.getUser();

        if(!customer || !customer.roles_row || !customer.roles_row.permissions){

            return {};
        }

        try {

            return JSON.parse(customer.roles_row.permissions);

        }catch(e){

            return {};
        }
    }

    /**
     * Boolean permission check - granted only when the permission's value
     * is strictly `true` (or the user is admin). "partial"/"limited"/
     * "request"/"one_tier"/"dual_control" style values are treated as
     * NOT granted here since they represent conditional/capped access.
     */
    static can = (key, user) => {

        var customer = (user !== undefined) ? user : Navigation.getUser();

        if(Navigation.isAdmin(customer)){

            return true;
        }

        var permissions = Navigation.getPermissions(customer);

        return permissions[key] === true;
    }

    /**
     * Returns the sidebar menu (from modules.json) filtered by permission.
     * Any item or child can declare a "permission" property in modules.json
     * (e.g. "permission": "manage_users_roles") - if present, that item is
     * only shown when Navigation.can(permission) is true. Items with no
     * "permission" property are always shown, unchanged.
     * If filtering empties out a parent's childs entirely, the parent
     * itself is dropped too (no point showing an empty dropdown arrow).
     */
    getFilteredMenu = () => {

        var isAllowed = (_item) => {

            if(!_item.hasOwnProperty('permission') || !_item.permission){

                return true;
            }

            return Navigation.can(_item.permission);
        };

        return menu
            .filter(isAllowed)
            .map((_row) => {

                if(!_row.hasOwnProperty('childs')){

                    return _row;
                }

                var _filtered_childs = _row.childs.filter(isAllowed);

                return {..._row, childs: _filtered_childs};
            })
            .filter((_row) => {

                if(_row.hasOwnProperty('childs')){

                    return _row.childs.length > 0;
                }

                return true;
            });
    }

    render () {

        return (

            <div>
                <ul className='flex items-center justify-between flex-nowrap'>
                    {this.renderMenu()}
                </ul>
            </div>
        )
    }

    renderMenu = () => {

            let menu_links = [];

            let filtered_menu = this.getFilteredMenu();

            filtered_menu.forEach((_row) => {

                if(_row.hasOwnProperty('type') && _row.type === 'divider'){

                    menu_links.push(<Divider key={_row.key} />)

                }else if(_row.hasOwnProperty('link')){

const isActive = _row.link === this.props.active_page;
                    menu_links.push(
                        <li key={_row.key}>
                            
                            <Link to={`/${_row.link}`}>

                                <Button 
                                    className={`!rounded-sm !hover:bg-blue-100 ${isActive ? '!bg-blue-100' : ''}`} 
                                    size="small"
                                >
                                    
                                    {/* <div className='icon'>
                                        <Icon>{_row.icon}</Icon>
                                    </div> */}
                                    
                                    <span className='uppercase text-[10px] font-semibold text-gray-600 whitespace-nowrap'>{_row.label}</span>
                                </Button>
                            </Link>
                        </li>
                    )
                }else{

                    menu_links.push(
                        <li
                            key={_row.key}
                            onMouseLeave={() => {
                                this.closeTimers[_row.key] = setTimeout(() => this.removeMenuItem(_row), 150);
                            }}
                        >
                            <Button
                                className={`!rounded-sm !hover:bg-blue-100 ${this.state.menu_items.hasOwnProperty(_row.key) ? '!bg-blue-100' : ''}`}
                                size="small"
                                onClick={(e) => {

                                    this.updateSubmenu(_row, e)
                                }}
                                // onMouseEnter={(e) => {

                                //     clearTimeout(this.closeTimers[_row.key]);
                                //     this.openMenuItem(_row, e);
                                // }}
                            >
                                <span className='uppercase text-[10px] font-semibold whitespace-nowrap'>{_row.label}</span>
                                <KeyboardArrowDown className='text-sm text-gray-400' fontSize='small' />
                            </Button>

                            <Menu
                                anchorEl={this.state.menu_items.hasOwnProperty(_row.key) ? this.state.menu_items[_row.key] : null}
                                open={this.state.menu_items.hasOwnProperty(_row.key) ? true : false}
                                onClose={() => {

                                    this.removeMenuItem(_row)
                                }}
                                onClick={() => {

                                }}
                                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                                slotProps={{
                                    backdrop: {
                                        invisible: true,
                                    },
                                    list: {
                                        sx: {
                                            backgroundColor: '#fff'
                                        },
                                    },
                                    paper: {
                                        elevation: 0,
                                        borderRadius: 10,
                                        sx: {
                                            backgroundColor: '#fff',
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                                            borderRadius:3,
                                            padding: 1,
                                            width: 300,
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                left: 20,
                                                width: 10,
                                                height: 10,
                                                bgcolor: '#fff',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    },
                                }}
                            >

                                {_row.childs.map((_child) => {

                                    return (
                                        <MenuItem component={Link} key={_child.key} to={`/${_child.link}`}>
                                            <ListItemIcon>
                                                <Icon fontSize='small' className="text-gray-400">{_child.icon}</Icon>
                                            </ListItemIcon>
                                            
                                            <span>{_child.label}</span>
                                        </MenuItem>
                                    )
                                })}
                            </Menu>
                        </li>
                    )
                }
            })

            return menu_links;
        }

    renderSubmenu = () => {

        let submenu = this.state.submenu;

        if(submenu.length > 0){

            let submenu_html = submenu.map((_submenu, index) => {

                if(_submenu.hasOwnProperty('type') && _submenu.type === 'divider'){

                    return <li key={_submenu.key}><Divider /></li>
                }

                if(_submenu.hasOwnProperty('childs')){

                    return (
                        <ul>
                            {
                                _submenu.childs.map((_child_menu, index) => {

                                    return (
                                        <li key={_child_menu.key}>
                                            <Link to={`/${_child_menu.link}`} onClick={() => {

                                                this.setState({show_sub_menu: false}, () => {
                                                                                    
                                                    window.setTimeout(() => {
                                                        
                                                        this.setState({active_menu_item: '', sub_menu_shown: false, submenu: []})
                                                    }, 400)
                                                });
                                            }}>
                                                {_child_menu.label}
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    )
                }else{
                
                    return (
                        <li key={_submenu.key}>
                            <Link to={`/${_submenu.link}`}>
                                {_submenu.label}
                            </Link>
                        </li>
                    )
                }
            })

            return <ul>{submenu_html}</ul>
        }
    }

    openMenuItem = (ele, e) => {

        let menu_items = this.state.menu_items;
        menu_items[ele.key] = e.currentTarget;

        this.setState({menu_items: menu_items})
    }

    updateSubmenu = (ele, e) => {

        let menu_items = this.state.menu_items;

        if(menu_items.hasOwnProperty(ele.key)){

            delete menu_items[ele.key];
        }else{

            menu_items[ele.key] = e.currentTarget;
        }

        this.setState({menu_items: menu_items})
    }

    removeMenuItem = (ele) => {

        let menu_items = this.state.menu_items;

        if(menu_items.hasOwnProperty(ele.key)){

            delete menu_items[ele.key];
        }

        this.setState({menu_items: menu_items})
    }
}

export default Navigation;