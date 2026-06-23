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

    render () {
        
        return (

            <div>
                <ul className='flex items-center justify-between'>
                    {this.renderMenu()}
                </ul>
            </div>
        )
    }

    renderMenu = () => {

            let menu_links = [];

            menu.forEach((_row) => {

                if(_row.hasOwnProperty('type') && _row.type === 'divider'){

                    menu_links.push(<Divider key={_row.key} />)

                }else if(_row.hasOwnProperty('link')){

                    const isActive = _row.key === this.props.active_page;

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
                                    
                                    <span className='uppercase text-[10px] font-semibold text-gray-600'>{_row.label}</span>
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
                                <span className='uppercase text-[10px] font-semibold'>{_row.label}</span>
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