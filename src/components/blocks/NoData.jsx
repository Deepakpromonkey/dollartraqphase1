import React, { Component } from 'react';

import no_data from 'assets/images/no_data.svg';
class NoData extends Component { 
    constructor(props) {
        super();
    }

    render () {
        
        return (

            <div className={"no-data-container " + (this.props.size)} style={{...this.props.style}}>
                <div className="no-data">

                    {this.props.icon
                        ?
                            <div className='no-data-icon'>
                                {this.props.icon}
                            </div>
                        :
                            this.props.hide_image
                                ?
                                    null
                                :
                                    <img src={this.props.src ? this.props.src : no_data} />
                        
                    }
                    
                    {this.props.message !== '' &&
                    
                        <div className='text'>{this.props.message}</div>
                    }
                    
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default NoData;