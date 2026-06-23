import React, { Component } from 'react';

import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import Btn from 'components/Btn';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CatalogCategoriesTree from 'pages/app/catalog/categories/CatalogCategoriesTree';

import MenuFormPage from './MenuFormPage';

import Api from 'api/Api';

class MenuForm extends Component {

    constructor(props) {
        super();
        this.state = {

            expended: false,

            menu_title: '',
            selected_cms_page: '',
            menu_classes: '',

            menu_link: '',
            external: false,

            selected_cms_page_error: false,

            selected_category: '',
            categories: [],
            include_childs: false,
            selected_group: false,

            selected_category_error: false,
        }
    }

    componentDidMount = () => {
        
        
    }

    render(){

        return (

            <div>
                <strong className='fs-14' style={{marginBottom: 8}}>Add Menu Item</strong>

                <Accordion sx={{boxShadow: 'none', marginTop: 1}} expanded={this.state.expended === 'page'} onChange={() => {

                    if(this.state.expended === 'page'){

                        this.setState({expended: false, selected_cms_page: '', menu_title: '', menu_classes: ''})
                        this.setState({menu_link: ''})
                        this.setState({selected_category: '', categories: [], include_childs: false})
                    }else{

                        this.setState({expended: 'page'})
                    }
                }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className={`fs-12 fw-bold ${this.state.expended === 'page' ? 'c-primary' : ''}`}>CMS Page</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <MenuFormPage
                            cms_pages={this.props.cms_pages}
                            addMenuItem={(type, data) => {

                                this.setState({type: type, ...data}, () => {

                                    this.addMenuItem(type)
                                })
                            }}
                        />
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{boxShadow: 'none', marginTop: 1}} expanded={this.state.expended === 'link'} onChange={() => {

                    if(this.state.expended === 'link'){

                        this.setState({expended: false, selected_cms_page: '', menu_title: '', menu_classes: ''})
                        this.setState({menu_link: ''})
                        this.setState({selected_category: '', categories: [], include_childs: false})
                    }else{

                        this.setState({expended: 'link'})
                    }
                }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className={`fs-12 fw-bold ${this.state.expended === 'link' ? 'c-primary' : ''}`}>Link</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='' style={{padding: 15, backgroundColor: 'rgba(0,0,0,.06)', borderRadius: 7}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Menu Title"
                                        variant="standard"
                                        value={this.state.menu_title}
                                        onChange={(e) => {

                                            this.setState({menu_title: e.target.value})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Menu Link"
                                        variant="standard"
                                        value={this.state.menu_link}
                                        onChange={(e) => {

                                            this.setState({menu_link: e.target.value})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="CSS Classes"
                                        variant="standard"
                                        size="small"
                                        value={this.state.menu_classes}
                                        onChange={(e) => {

                                            this.setState({menu_classes: e.target.value})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={<Checkbox onChange={(e) => {

                                            this.setState({external: e.target.checked})
                                        }}/>}
                                        label="External Link"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <div className='justify-end'>
                                        <Btn size="small" color="secondary" variant="outlined" onClick={() => {

                                            this.addMenuItem('link')
                                        }}>Add Item</Btn>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>

                <Accordion sx={{boxShadow: 'none', marginTop: 1}} expanded={this.state.expended === 'category'} onChange={() => {

                    if(this.state.expended === 'category'){

                        this.setState({expended: false, selected_cms_page: '', menu_title: '', menu_classes: ''})
                        this.setState({menu_link: ''})
                        this.setState({selected_category: '', categories: [], include_childs: false})
                    }else{

                        this.setState({expended: 'category'})
                    }
                }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <span className={`fs-12 fw-bold ${this.state.expended === 'category' ? 'c-primary' : ''}`}>Categories</span>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className='' style={{padding: 15, backgroundColor: 'rgba(0,0,0,.06)', borderRadius: 7}}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>

                                    <CatalogCategoriesTree
                                        mode="selection"
                                        group_selection={true}
                                        hide_add_new={true}

                                        selected_group={this.state.selected_group}
                                        onGroupSelection={(selected_group) => {

                                            this.setState({selected_group: selected_group})
                                        }}

                                        selected_categories={this.state.categories}
                                        onSelection={(categories) => {

                                            let selected_category = this.state.selected_category;

                                            if(selected_category !== ''){

                                                categories.splice(categories.indexOf(selected_category), 1);
                                            }

                                            this.setState({categories: categories, selected_category: categories[0], selected_category_error: false})
                                        }}
                                    />

                                    {this.state.selected_category_error &&
                                    
                                        <span className='c-red fs-11'>Please choose category or Include Category Group</span>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        checked={this.state.include_childs}
                                        control={<Checkbox onChange={(e) => {

                                            this.setState({include_childs: e.target.checked})
                                        }}/>}
                                        label="Include All Child Categories."
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="CSS Classes"
                                        variant="standard"
                                        size="small"
                                        value={this.state.menu_classes}
                                        onChange={(e) => {

                                            this.setState({menu_classes: e.target.value})
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <div className='justify-end'>
                                        <Btn size="small" color="secondary" variant="outlined" onClick={() => {

                                            this.addMenuItem('category')
                                        }}>Add Item</Btn>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        )
    }

    addMenuItem = (type) => {

        if(!this.props.menu.hasOwnProperty('row_id')){

            this.props.onError("Menu not selected. Please choose menu from the menu list.");
            return false;
        }

        const formData = new FormData();

        let selected_cms_page = this.state.selected_cms_page;

        let menu_title = this.state.menu_title
        let menu_classes = this.state.menu_classes;

        if(type === 'page'){

            if(selected_cms_page === ''){

                this.setState({selected_cms_page_error: true})
                return false;
            }

            formData.append('ref_id', selected_cms_page);
        }

        if(type === 'category'){

            if(this.state.selected_category === '' && this.state.selected_group === false){

                this.setState({selected_category_error: true})
                return false;
            }

            if(this.state.selected_category !== ''){
            
                formData.append('ref_id', this.state.selected_category);
            }

            if(this.state.include_childs){

                formData.append('include_childs', 1);
            }

            if(this.state.selected_group){

                formData.append('selected_group', this.state.selected_group);
            }
        }

        formData.append('account_token', this.props.account_token);
        formData.append('menu', this.props.menu.row_id);

        formData.append('menu_title', menu_title);
        formData.append('type', type);
        formData.append('css_classes', menu_classes);

        if(type === 'link'){
        
            formData.append('menu_link', this.state.menu_link);
        }

        if(this.state.external === true){

            formData.append('external', 1);
        }

        let that = this;
        Api.post('backend/cms/menu/save_item', formData, function(data){

            if(data.status){

                that.props.onSuccess(data.message)
                that.props.updateMenu(data.menu_items);

                that.setState({
                    menu_classes: '',
                    menu_title: '',
                    expended: '',
                    selected_cms_page: '',
                    external: false,
                    menu_link: '',
                    selected_category: '',
                    categories: [],
                    include_childs: false
                })
            }else{

                that.props.onError(data.message)
            }
        });
    }
}

export default MenuForm;