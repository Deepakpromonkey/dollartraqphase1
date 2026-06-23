import React, { Component } from 'react';

import LocalShipping from '@mui/icons-material/LocalShipping';

import Main from 'components/Main';

class NoPage extends Component {

    render(){

        return (

            <Main
                page="no_page"
                active_page="no_page"
                title=""
            >
                <div className='flex items-center justify-center flex-col h-full'>

                    <LocalShipping style={{fontSize:200}} className='leading-none text-gray-200 mt-9 pt-9' />

                    <h3 className='font-bold text-gray-400 text-[150px] mb-0 leading-none'>404</h3>
                    <h4 className='font-bold text-gray-300 text-3xl mt-0 leading-none'>Page Not Found</h4>
                </div>
            </Main>
        )
    }
}

export default NoPage;