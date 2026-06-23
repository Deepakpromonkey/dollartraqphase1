import React, { Component } from 'react';

class ItemCard extends Component { 
    constructor(props) {
        super();
    }

    render () {
        
        return (

            <div className={(this.props.className ? "item-card " + this.props.className : "item-card")}>
                
                {this.props.title || this.props.sub_title
                    ?
                        <div className="header">
                    
                            <div>
                            
                                {this.props.title &&
                                
                                    <h2>{this.props.title}</h2>
                                }

                                {this.props.sub_title &&
                                
                                    <h3>{this.props.sub_title}</h3>
                                }
                            </div>
                        </div>
                    :
                        null
                }

                <div className="content">

                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default ItemCard;