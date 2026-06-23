import React, { Component } from 'react';

import Grid from '@mui/material/Grid';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import Chip from '@mui/material/Chip';

import Btn from 'components/Btn';

import CircularProgress from '@mui/material/CircularProgress';

import Add from '@mui/icons-material/Add';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import Edit from '@mui/icons-material/Edit';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';
import Search from '@mui/icons-material/Search';

import Api from 'api/Api';

import NoData from 'components/blocks/NoData';

import BlogsCategoriesForm from './BlogsCategoriesForm';
import Loader from 'components/Loader';

class BlogsCategoriesTree extends Component {

    constructor(props) {
        super();
        this.state = {

            init: true,

            account_token: false,

            success_message: '',
            error_message: '',

            categories_groups: [],

            categories_expended: {},

            categories: [],

            category_popup: false,

            level: 0,
            parent_category: false,
            parent_titles: '',

            selected_category: false,

            expended: true,
            
            search_keyword: '',
            search_results: [],

            searching: false,
        }

        this.search_interval = null;
    }

    componentDidMount = () => {
        
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            
            this.setState({account_token: account_token})

            this.loadCategories(account_token)
        }

        if(this.props.mode && this.props.mode === 'selection'){

            this.setState({expended: false})
        }
    }

    componentWillUnmount = () => {

        clearTimeout(this.search_interval);
    }

    render(){

        return (

            <>
                <Table size="small" className='mt-20'>
                    <TableBody>

                        {this.state.init
                            ?
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <Stack spacing={1}>
                                            <Skeleton variant="rectangular" height={60} />

                                            <Skeleton variant="rectangular" height={60} style={{marginTop: 30}} />
                                            <Skeleton variant="rectangular" height={60} style={{marginTop: 5}} />
                                            <Skeleton variant="rectangular" height={60} style={{marginTop: 5}} />
                                            <Skeleton variant="rectangular" height={60} style={{marginTop: 5}} />
                                            <Skeleton variant="rectangular" height={60} style={{marginTop: 5}} />
                                            <Skeleton variant="rectangular" height={60} style={{marginTop: 5}} />
                                            <Skeleton variant="rectangular" height={60} style={{marginTop: 5}} />
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            :
                                <>
                                    {(this.props.mode && this.props.mode === 'parent')
                                        ?
                                            null
                                        :
                                            <TableRow>
                                                <TableCell colSpan={3} style={{padding: 0}}>
                                                    <div className='space-between'>

                                                        {(this.props.hide_add_new)
                                                            ?
                                                                null
                                                            :
                                                                this.state.categories.length > 0 &&
                                                        
                                                                    <Btn size="small" startIcon={<Add />} onClick={() => {

                                                                        this.setState({category_popup: true, level: 0, parent_category: false, parent_titles: ''})

                                                                    }}>Add New Category</Btn>
                                                        }
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                    }

                                    {this.state.categories.length === 0
                                        ?
                                            <TableRow>
                                                <TableCell colSpan={3}>
                                                    <NoData size="small" icon={<FormatListBulleted />}>
                                                        <div className='fs-14 gr-6 vertical align-center'>
                                                            <span>Categories not created yet.</span>

                                                            <Btn size="small" variant="outlined" className="mt-20 mb-20" color="secondary" startIcon={<Add />} onClick={() => {

                                                                this.setState({category_popup: true, level: 0})
                                                                
                                                            }}>Add New Category</Btn>
                                                        </div>
                                                    </NoData>
                                                </TableCell>
                                            </TableRow>
                                        :
                                            <>

                                                {(this.props.mode && this.props.mode === 'selection') &&

                                                    <TableRow>
                                                        <TableCell colSpan={3}>
                                                            <div className='space-between'>
                                                                <div style={{paddingTop: 3, paddingBottom: 3}}>
                                                                    {this.renderCategoryTitles()}
                                                                </div>
                                                                <Btn icon={true} onClick={() => {

                                                                    this.setState({expended: !this.state.expended})
                                                                }}>
                                                                    {this.state.expended
                                                                        ?
                                                                            <ExpandLess />
                                                                        :
                                                                            <ExpandMore />
                                                                    }
                                                                </Btn>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                }

                                                {this.state.expended &&
                                                    <>
                                                        <TableRow>
                                                            <TableCell colSpan={3} sx={{borderBottom: '0 none', padding: '0 0px'}}>
                                                                <Grid container spacing={3}>
                                                                    <Grid item xs={12}>
                                                                        <div className='vertical'>
                                                                            <div className='space-between' style={{padding: '5px 10px', border: '1px solid rgba(0,0,0,.1)', margin: '10px 0', backgroundColor: 'rgba(0,0,0,.05)'}}>
                                                                                <input
                                                                                    placeholder='Search Categories'
                                                                                    style={{width: '100%', border:'0 none', padding: '8px 10px'}}
                                                                                    type="text"
                                                                                    value={this.state.search_keyword}
                                                                                    onChange={(e) => {

                                                                                        this.setState({search_keyword: e.target.value, searching: true})
                                                                                    }}
                                                                                    onKeyUp={(e) => {

                                                                                        this.searchCategories(e.target.value)
                                                                                    }}
                                                                                />
                                                                                <div className='ml-5' style={{position: 'relative'}}>

                                                                                    {this.state.searching
                                                                                        ?
                                                                                            <CircularProgress size={20} color={'secondary'} />
                                                                                        :

                                                                                            this.state.search_keyword === ''
                                                                                                ?
                                                                                                    <Search className='gr-5' />
                                                                                                :
                                                                                                    <Btn icon={true} size="small" onClick={() => {

                                                                                                        this.setState({search_keyword: '', search_results: []})
                                                                                                        clearInterval(this.search_interval)
                                                                                                    }}>
                                                                                                        <Close />
                                                                                                    </Btn>
                                                                                    }
                                                                                </div>
                                                                            </div>

                                                                            {(this.state.search_keyword !== '' && this.state.search_keyword.length > 2 && this.state.search_results.length > 0) &&
                                                                            
                                                                                <div style={{padding: '3px 10px'}}>
                                                                                    <div className='fs-12 gr-6'><strong>{this.state.search_results.length}</strong> Categories Found.</div>
                                                                                </div>
                                                                            }
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                            </TableCell>
                                                        </TableRow>

                                                        {(this.state.search_keyword !== '' && this.state.search_keyword.length > 2)
                                                            ?
                                                                <TableRow>
                                                                    <TableCell colSpan={3} sx={{borderBottom: '0 none', padding: '0 0px'}}>

                                                                        <div className='category-search-container'>
                                                                        
                                                                            {this.state.search_results.length > 0
                                                                                ?
                                                                                    <>
                                                                                        <div className='vertical'>

                                                                                            {this.state.search_results.map((_search_category, index) => {

                                                                                                let _category = _search_category.category;

                                                                                                return (
                                                                                                    <label className='hoverable' key={`search_result_${index}`} style={{padding: '5px 5px', borderBottom: '1px solid rgba(0,0,0,.1)'}}>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            checked={(this.props.selected_categories && this.props.selected_categories.indexOf(_category.row_id) > -1) ? true : false}
                                                                                                            onChange={(e) => {

                                                                                                                if(this.props.selected_categories){
                                                                                                                
                                                                                                                    let selected_categories = this.props.selected_categories;

                                                                                                                    if(e.target.checked){

                                                                                                                        if(selected_categories.indexOf(_category.row_id) <= -1){

                                                                                                                            selected_categories.push(_category.row_id)
                                                                                                                        }
                                                                                                                    }else{

                                                                                                                        if(selected_categories.indexOf(_category.row_id) >= 0){

                                                                                                                            selected_categories.splice(selected_categories.indexOf(_category.row_id), 1);
                                                                                                                        }
                                                                                                                    }

                                                                                                                    this.props.onSelection(selected_categories)
                                                                                                                }
                                                                                                            }}
                                                                                                        />

                                                                                                        <span>{_search_category.parents.join(' > ')}</span>
                                                                                                    </label>
                                                                                                )
                                                                                            })}
                                                                                        </div>
                                                                                    </>
                                                                                :
                                                                                    <div style={{position: 'relative', height: '200px'}}>

                                                                                        {this.state.searching
                                                                                            ?
                                                                                                <Loader loading={true} />
                                                                                            :
                                                                                                null
                                                                                        }
                                                                                    </div>
                                                                            }
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            :
                                                                this.state.categories.map((_category, index) => {

                                                                    return (
                                                                        <TableRow key={`category_${index}`}>

                                                                            <TableCell colSpan={3} sx={{borderBottom: '0 none', padding: '0 0px'}}>
                                                                                
                                                                                {this.renderCategory(_category)}
                                                                                
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )
                                                                })
                                                        }
                                                    </>
                                                }
                                            </>
                                    }
                                </>
                        }
                    </TableBody>
                </Table>

                <BlogsCategoriesForm

                    show={this.state.category_popup}

                    selected_category={this.state.selected_category}

                    parent_titles={this.state.parent_titles}
                    level={this.state.level}
                    parent_category={this.state.parent_category}
                    categories_group={this.state.selected_categories_groups}

                    chooseParent={(parent, level, parent_titles) => {

                        this.setState({parent_category: parent, level: level, parent_titles: parent_titles})
                    }}

                    onSuccess={(result) => {

                        this.setState({category_popup: false, selected_category: false, level: false, parent_titles: '', parent_category: false})
                        this.setState({success_message: result.message}, () => {

                            window.setTimeout(() => {

                                this.setState({success_message: ''})
                            }, 5000)
                        })

                        this.loadCategories(this.state.account_token, this.state.selected_categories_groups);
                    }}
                    onBack={() => {

                        this.setState({category_popup: false, selected_category: false, level: false, parent_titles: '', parent_category: false})
                    }}
                />

                <Snackbar
                    key={Math.floor(Math.random() * 100000)}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={this.state.success_message !== ''}
                    onClick={() => {
                        this.setState({success_message: ''});
                    }}
                    onClose={() => {
                        this.setState({success_message: ''})
                    }}
                    TransitionComponent={Slide}
                >
                    <Alert elevation={6} variant="filled" severity="success">{this.state.success_message}</Alert>
                </Snackbar>

                <Snackbar
                    key={Math.floor(Math.random() * 100000)}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={this.state.error_message !== ''}
                    onClick={() => {
                        this.setState({error_message: ''});
                    }}
                    onClose={() => {
                        this.setState({error_message: ''})
                    }}
                    TransitionComponent={Slide}
                >
                    <Alert elevation={6} variant="filled" severity="error">{this.state.error_message}</Alert>
                </Snackbar>
            </>
        )
    }

    renderCategory = (_category) => {

        return (
            <div style={{borderLeft: '1px solid #ccc', marginLeft: _category.level > 0 ? 30 : 0}}>
                <div className='has-hoverable-action'>

                    <div className='space-between hoverable' style={{paddingTop: 5, paddingBottom: 5, borderBottom: '1px solid rgba(0,0,0,.1)'}}>
                        <div>
                            <div className='justify-start'>

                                {(this.props.mode && this.props.mode === 'selection') &&
                                
                                    <>
                                        <span style={{width: 10, borderBottom: '1px solid #aaa'}}></span>
                                        <input
                                            type="checkbox"
                                            checked={this.props.selected_categories.indexOf(_category.row_id) > -1 ? true : false}
                                            onChange={(e) => {

                                                let selected_categories = this.props.selected_categories;

                                                if(e.target.checked){

                                                    if(selected_categories.indexOf(_category.row_id) <= -1){

                                                        selected_categories.push(_category.row_id)
                                                    }
                                                }else{

                                                    if(selected_categories.indexOf(_category.row_id) >= 0){

                                                        selected_categories.splice(selected_categories.indexOf(_category.row_id), 1);
                                                    }
                                                }

                                                this.props.onSelection(selected_categories)
                                            }}
                                        />
                                    </>
                                }

                                <span style={{width: 10, borderBottom: '1px solid #aaa'}}></span>

                                <Btn icon={true} size="small" style={{padding: 1, backgroundColor: 'rgba(0,0,0,.05)'}} onClick={() => {

                                    let categories_expended = this.state.categories_expended;

                                    if(categories_expended.hasOwnProperty(_category.row_id)){

                                        delete categories_expended[_category.row_id];
                                    }else{

                                        categories_expended[_category.row_id] = true;
                                    }

                                    this.setState({categories_expended: categories_expended})
                                }}>
                                    {this.state.categories_expended.hasOwnProperty(_category.row_id)
                                        ?
                                            <ExpandMore />
                                        :
                                            <ChevronRight />
                                    }
                                </Btn>

                                <strong className='fs-12 ml-10'>{_category.title} <span className='gr-5'>({_category.items_count})</span></strong>

                                {(this.props.mode && this.props.mode === 'parent') &&

                                    <div className='hoverable-action'>
                                        
                                        <Btn size="small" className="ml-5" onClick={() => {

                                            let categories = this.flattenCategories(this.state.categories, []);

                                            let parents = [];
                                            parents.push(_category.title);

                                            parents = this.findParentTitle(_category, categories, parents)

                                            const _parents = parents.reverse();
                                        
                                            this.props.chooseParent(_category, parseInt(_category.level) + 1, _parents.join(' > '))
                                        }}>Choose</Btn>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='hoverable-action'>

                            {this.props.mode && (this.props.mode === 'selection' || this.props.mode === 'parent')
                                ?
                                    null
                                :
                                    <>
                                        <Btn startIcon={<Add />} size="small" onClick={() => {

                                            let categories = this.flattenCategories(this.state.categories, []);

                                            let parents = [];
                                            parents.push(_category.title);

                                            parents = this.findParentTitle(_category, categories, parents)

                                            const _parents = parents.reverse();

                                            this.setState({category_popup: true, parent_category: _category, level: parseInt(_category.level) + 1, parent_titles: _parents.join(' > '), selected_category: false})
                                        }}>
                                            <span>Add Child</span>
                                        </Btn>
                                        <Btn startIcon={<Edit style={{fontSize: 14}} />} size="small" className="ml-5" onClick={() => {

                                            if(_category.parent_id !== ''){

                                                let categories = this.flattenCategories(this.state.categories, []);

                                                let parents = this.findParentTitle(_category, categories, []);
    
                                                const _parents = parents.reverse();

                                                const parent_category = categories.find(row => row.row_id === _category.parent_id);
    
                                                this.setState({selected_category: _category, parent_titles: _parents.join(' > '), parent_category: parent_category, level: _category.level}, () => {
    
                                                    this.setState({category_popup: true})
                                                })
                                            }else{

                                                this.setState({selected_category: _category, level: _category.level, parent_titles: '', parent_category: false}, () => {
    
                                                    this.setState({category_popup: true})
                                                })
                                            }
                                        }}>
                                            <span>Edit</span>
                                        </Btn>
                                        {/* <Btn icon={true} size="small" className="ml-5">
                                            <MoreVert className='c-blue' style={{fontSize: 14}} />
                                        </Btn> */}
                                    </>
                            }
                        </div>
                    </div>
                </div>

                {this.state.categories_expended.hasOwnProperty(_category.row_id) &&

                    this.renderChilds(_category)
                }
            </div>
        )
    }

    renderCategoryTitles = () => {

        let selected_categories = this.props.selected_categories;
        let categories = this.flattenCategories(this.state.categories, []);

        if(selected_categories.length > 0){

            return (
                <Stack direction="row" spacing={0} sx={{flexWrap: 'wrap'}}>
                    
                    {selected_categories.map((_selected_category, index) => {

                        let _category = categories.find(row => row.row_id === _selected_category);

                        if(_category){

                            return <Chip size="small" key={`chip_${_selected_category}`} style={{marginBottom: 5, marginRight: 5}} label={_category.title} onDelete={() => {

                                selected_categories.splice(selected_categories.indexOf(_selected_category), 1);

                                this.props.onSelection(selected_categories)
                            }} />
                        }
                    })}
                </Stack>
            )
        }else{

            return (
                <Btn size="small" onClick={() => {

                    this.setState({expended: !this.state.expended})
                }}>
                    <span className='fs-12 fw-bold gr-9'>Select Category</span>
                </Btn>
            )
        }
    }

    renderChilds = (category) => {

        if(category.hasOwnProperty('childs') && category.childs.length > 0){

            return category.childs.map((_category, index) => {

                return (
                    <React.Fragment key={`child_category_${_category.row_id}`}>
                        {this.renderCategory(_category)}
                    </React.Fragment>
                )
            })
        }
    }

    findParentTitle = (category, categories, parents) => {

        if(category.level > 0){

            const parent = categories.find(row => row.row_id === category.parent_id);

            if(parent){

                parents.push(parent.title)
            }

            parents = this.findParentTitle(parent, categories, parents);
        }

        return parents;
    }

    flattenCategories = (categories, _categories) => {

        categories.forEach((_category) => {

            _categories.push(_category)

            if(_category.hasOwnProperty('childs') && _category.childs.length > 0){

                _categories = this.flattenCategories(_category.childs, _categories);
            }  
        })

        return _categories;
    }

    loadCategories = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);

        var self = this;
        Api.post('backend/blogs/categories/load', formData, function(data){

            self.setState({init: false})

            if(data.status){

                self.setState({categories: data.categories});
            }
        });
    }

    searchCategories = (keyword) => {

        if(this.search_interval){

            clearTimeout(this.search_interval);
        }

        this.setState({search_keyword: keyword, searching: true});
        
        var that = this;

        this.search_interval = setTimeout(() => {

            that._searchCategories();
        }, 500);
    }

    _searchCategories = () => {

        let search_results = [];

        let search_keyword = this.state.search_keyword;

        if(search_keyword.length > 2){
        
            let categories = this.flattenCategories(this.state.categories, []);

            const items = categories.filter(item => item.title.toLowerCase().indexOf(search_keyword.toLowerCase()) > -1);

            items.map((_item) => {

                let parents = [];
                parents.push(_item.title);

                parents = this.findParentTitle(_item, categories, parents);
        
                const _parents = parents.reverse();

                search_results.push({category: _item, parents: _parents});
            })

            this.setState({search_results: search_results})
        }

        this.setState({searching: false})
    }
}

export default BlogsCategoriesTree;