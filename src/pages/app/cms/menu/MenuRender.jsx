import React, { Component } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import Card from '@mui/material/Card';

import Btn from 'components/Btn';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Close from '@mui/icons-material/Close';

import MenuFormPage from './MenuFormPage';

class MenuRender extends Component {

    constructor(props) {
        super();
        this.state = {

            expended: '',

            drag_index: false,

            drag_over_index: false,

            drag_over_parent_index: false
        }
    }

    onDragOver = (e) => {

        e.preventDefault();
    }

    render(){

        return (

            <div
                onDragOver={(e) => {

                    this.onDragOver(e)
                }}
            >
                {this.props.menu_items.map((_menu_item, index) => {

                    return (
                        
                        <div
                            className={`${this.state.drag_over_index === _menu_item.row_id ? 'drag_over' : ''} mb-5`}
                            key={`menu_item_${this.props.selected_menu.row_id}_${index}`}
                            draggable
                            onDrag={(e) => {

                                this.setState({drag_index: _menu_item.row_id})
                            }}
                            onDrop={(e) => {

                                // console.log(e.target.index)
                            }}
                            onDragOver={(e) => {

                                this.setState({drag_over_index: _menu_item.row_id}, () => {

                                    this.props.onEleDrag(this.state.drag_index, this.state.drag_over_index, 0)
                                })
                            }}
                            onDragEnd={() => {

                                this.props.onEleMove()
                                this.setState({drag_index: false, drag_over_index: false})
                            }}
                        >
                            <Card elevation={0} variant='outlined' sx={{padding: 1.3}}>
                                <div className='vertical'>
                                    <span className='fs-11 uppercase'>{_menu_item.heading}</span>
                                    <strong className='fs-12'>{_menu_item.menu_title}</strong>
                                </div>

                                {/* {_menu_item.type === 'page' &&
                                
                                    <MenuFormPage
                                        data={_menu_item}
                                        cms_pages={this.props.cms_pages}
                                    />
                                } */}
                            </Card>

                            {this.renderChilds(_menu_item)}

                            <div
                                className={`menu-child`}
                                onDragOver={(e) => {

                                    this.setState({drag_over_parent_index: index}, () => {
    
                                        this.props.updateChild(this.state.drag_index, this.state.drag_over_parent_index)
                                    })
                                }}
                            ></div>
                        </div>
                    )
                })}
            </div>
        )
    }

    renderChilds = (item) => {

        if(item.hasOwnProperty('childs') && item.childs.length > 0){

            return item.childs.map((_item) => {

                return (
                    <div
                        key={`menu_item_${_item.row_id}`}
                        style={{marginLeft: 20}}
                        draggable
                    >
                        <Card elevation={0} variant='outlined' sx={{padding: 1.3}}>
                            <div className='justify-between'>
                                <strong className='fs-12'>{_item.menu_title}</strong>
                            </div>
                        </Card>

                        {this.renderChilds(_item)}

                        <div
                            className={`menu-child`}
                            onDragOver={(e) => {

                                // this.setState({drag_over_parent_index: index}, () => {

                                //     this.props.updateChild(this.state.drag_index, this.state.drag_over_parent_index)
                                // })
                            }}
                        ></div>
                    </div>
                )
            })
        }
    }
}

export default MenuRender;