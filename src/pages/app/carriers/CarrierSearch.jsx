import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Skeleton from '@mui/material/Skeleton';

import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Main from 'components/Main';

import CarrierCard from 'components/blocks/CarrierCards';

import { useNavigate, useSearchParams } from 'react-router-dom';

import Api from 'api/Api';

const DEFAULT_FILTERS = {
    authority_active: false,
    authority_inactive: false,
    type_interstate: false,
    type_intrastate: false,
    authority_verified: false,
    insurance_current: false,
    risk_low: false,
    risk_medium: false,
    risk_high: false,
    fleet_min: '',
    fleet_max: ''
};

function CarrierCardSkeleton() {

    return (

        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">

            <Skeleton variant="text" width="40%" height={24} />
            <Skeleton variant="text" width="60%" height={20} />

            <Skeleton variant="rectangular" height={80} className="rounded-lg" />

            <div className="flex gap-3">

                <Skeleton variant="text" width="20%" />
                <Skeleton variant="text" width="20%" />

            </div>

        </div>
    );
}


function CarrierSearch() {

    const [accountToken, setAccountToken] = useState(false);
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('sortByNameAsc');
    const [filters] = useState(DEFAULT_FILTERS);
    const [carriers, setCarriers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sortOptions, setSortOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [selectedRisk, setSelectedRisk] = useState('');
    const [authorityVerified, setAuthorityVerified] = useState('');
	const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(function () {

        const token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);

        if (token) {setAccountToken(token);}

        loadFilters(token);

        const q = searchParams.get('q');

        if (q) {

            setQuery(q);
            runSearch(q, 1, sortBy);
        }

    }, []);

function handleCarrierClick(carrier) {
 
    const formData = new FormData();
 
    if (accountToken) {
 
        formData.append('account_token', accountToken);
    }
 
    formData.append('carrier_id', carrier.row_id);
   
    formData.append('dot_no', carrier.dot_number);
 
    Api.post('app/profile/carriers/searched/save', formData, function (data) {
 
        navigate('/carriers/' + carrier.row_id);
    });
}

    useEffect(function () {

        if (query.trim() !== '') {

            runSearch(query, 1, sortBy);

        }
        
    }, [selectedRisk, authorityVerified]);

    function loadFilters(accountToken) {

        const formData = new FormData();

        if (accountToken) {

            formData.append('account_token', accountToken);
        }

        Api.post('backend/carrier/search/filters', formData, function (data) {

                if (data.status) {

                    setSortOptions(data.sort_options || []);
                }
            }
        );
    }

    function runSearch(searchText, page, sortValue) {

        let pageNumber = page || 1;

        if (!searchText || searchText.trim() === '') {

            setCarriers([]);
            setTotal(0);
            setCurrentPage(1);
            setLastPage(1);

            return;
        }

        setLoading(true);

        const params = new URLSearchParams();

        params.append('query', searchText);
        params.append('sort', sortValue || sortBy);
        params.append('page', pageNumber);
        params.append('per_page', 10);

        if (selectedRisk === 'Low') {

            params.append('risk_low', 'true');

        }

        if (selectedRisk === 'Medium') {

            params.append('risk_medium', 'true');

        }

        if (selectedRisk === 'High') {

            params.append('risk_high', 'true');

        }

        if (authorityVerified === 'Yes') {

            params.append('authority_verified', 'true');

        }

        if (authorityVerified === 'No') {

            params.append('authority_verified', 'false');

        }

        fetch( `https://laravel.dollartraq.com/api/carrier/search?${params}`,
            
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`
                }
            }
        )
            .then(function (res) {

                return res.json();

            })

            .then(function (data) {

                setCarriers(data.data || []);
                setTotal(data.total || (data.data || []).length);
                setCurrentPage(pageNumber);
                setLastPage(data.last_page || 1);

            })
            .catch(function (err) {

                console.log(err);

            })
            .finally(function () {

                setLoading(false);

            });
    }

    function handleKeyDown(event) {

        if (event.key === 'Enter') {

            runSearch(query, 1);
        }
    }

    function handleClearSearch() {

        setQuery('');
        setCarriers([]);
        setTotal(0);
        setErrorMessage('');
        setCurrentPage(1);
        setLastPage(1);
    }

    function handlePrevPage() {

        if (currentPage > 1) {

            runSearch(query, currentPage - 1);
        }
    }

    function handleNextPage() {

        if (currentPage < lastPage) {

            runSearch(query, currentPage + 1);
        }
    }

    function handleSortChange(event) {
        const value = event.target.value;

        setSortBy(value);

        if (query.trim() !== '') {
            runSearch(query, 1, value);
        }
    }

    function renderSortLabel(selected) {

    const labelMap = {
            sortByNameAsc: 'Name (A to Z)',
            sortByNameDesc: 'Name (Z to A)',
            'Most Relevant': 'Most Relevant'
        };

        return (
            <div className='flex items-center gap-2'>
                <span style={{ color: '#111827', fontSize: '13px', fontWeight: 700 }}>
                    SORT BY:
                </span>

                <span style={{ color: '#4E73DF', fontSize: '15px', fontWeight: 600 }}>
                    {labelMap[selected] || selected}
                </span>
            </div>
        );
}

    return (

        <Main active_page='search' page='carrier_search' error_message={errorMessage} success_message={successMessage} full_width>

            <Grid container spacing={3}>

                <Grid size={12}>

                    <div className='min-h-screen p-3 md:p-4 lg:p-6'>

                        <div className='max-w-[1100px] mx-auto mb-[30px]'>

                            <div className='relative'>

                                <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-gray-400' />

                                <input
                                    type='text'
                                    value={query}
                                    onChange={function (event) {

                                        setQuery(event.target.value);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder='Search MC, DOT, Company, and Phone'
                                    style={{ width: '100%', padding: '14px 140px 14px 48px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 15, color: '#111827', outline: 'none', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                                />

                                <button
                                    onClick={function () {

                                        runSearch(query, 1);
                                    }}
                                    className='absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 md:px-4 py-2 rounded-lg text-sm'
                                >
                                    Search
                                </button>

                                {query !== '' && (

                                    <Close
                                        onClick={handleClearSearch}
                                        className='absolute right-[85px] md:right-[95px] top-1/2 -translate-y-1/2 cursor-pointer text-gray-400'
                                    />
                                )}

                            </div>

                        </div>

                        <div className='max-w-[1100px] mx-auto'>

                           <div className='flex justify-between items-center mb-10 max-md:flex-col max-md:items-start max-md:gap-4'>


                                <div className='text-sm text-gray-500'>

                                    <span className='text-sm mr-2 inline-flex items-center gap-1 font-semibold mb-2 text-[#8B93A7]'>

                                        <FiberManualRecordIcon sx={{ fontSize: 8, color: '#2563EB' }} />
                                        
                                        Search Results
                                    </span>

                                    <br />

                                    <span style={{ color: '#4B5563', fontSize: '16px', fontWeight: 400 }}>
                                        We found{' '}
                                    </span>

                                    <strong className='text-gray-900 text-[16px]'>
                                        {total.toLocaleString()} results
                                    </strong>

                                </div>

                                <div className='flex flex-wrap items-center gap-3'>

                                    {/* Risk Dropdown */}
                                    {/* <div className={`relative inline-flex items-center h-9 rounded-full border px-2.5 min-w-[115px] transition-all duration-200 ${selectedRisk ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>

                                        <span className={`text-xs font-bold mr-1.5 uppercase tracking-wider ${selectedRisk ? 'text-blue-500' : 'text-gray-400'}`}>
                                            Risk:
                                        </span>

                                        <select
                                            value={selectedRisk}
                                            onChange={(e) => setSelectedRisk(e.target.value)}
                                            className="bg-transparent outline-none pr-5 text-sm font-semibold appearance-none cursor-pointer z-10  w-[55px]"
                                        >
                                            <option value="">All</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>

                                        {selectedRisk ? (
                                            <Close
                                                onClick={() => setSelectedRisk('')}
                                                className="absolute right-2.5 cursor-pointer text-blue-500 hover:text-blue-700 z-20"
                                                sx={{ fontSize: 14 }}
                                            />
                                        ) : (
                                            <KeyboardArrowDownIcon
                                                className="absolute right-2 pointer-events-none text-gray-400"
                                                sx={{ fontSize: 18 }}
                                            />
                                        )}

                                    </div> */}

                                    {/* Verified Dropdown */}
                                    {/* <div className={`relative inline-flex items-center h-10 rounded-full border px-3 transition-all duration-200 ${authorityVerified ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'}`}>

                                        <span className={`text-xs font-bold mr-1.5 uppercase tracking-wider ${authorityVerified ? 'text-blue-500' : 'text-gray-400'}`}>
                                            Verified:
                                        </span>

                                        <select
                                            value={authorityVerified}
                                            onChange={(e) => setAuthorityVerified(e.target.value)}
                                            className="bg-transparent outline-none pr-5 text-sm font-semibold appearance-none cursor-pointer z-10"
                                        >
                                            <option value="">All</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>

                                        {authorityVerified ? (
                                            <Close
                                                onClick={() => setAuthorityVerified('')}
                                                className="absolute right-2.5 cursor-pointer text-blue-500 hover:text-blue-700 z-20"
                                                sx={{ fontSize: 14 }}
                                            />
                                        ) : (
                                            <KeyboardArrowDownIcon
                                                className="absolute right-2 pointer-events-none text-gray-400"
                                                sx={{ fontSize: 18 }}
                                            />
                                        )}

                                    </div> */}

                                    {/* <Select
                                        value={sortBy}
                                        onChange={handleSortChange}
                                        IconComponent={KeyboardArrowDownIcon}
                                        size='small'
                                        displayEmpty
                                        sx={{
                                            minWidth: 260,
                                            height: 42,
                                            borderRadius: '999px',
                                            background: '#EEF3FF',
                                            overflow: 'hidden',
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '999px'
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: '1px solid #C7D2E9',
                                                borderRadius: '999px'
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                border: '1px solid #C7D2E9'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                border: '1px solid #C7D2E9'
                                            },
                                            '& .MuiSelect-select': {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '0 18px !important',
                                                height: '42px !important',
                                                fontSize: '15px',
                                                fontWeight: 600
                                            },
                                            '& .MuiSelect-icon': {
                                                color: '#4E73DF',
                                                right: 14,
                                                fontSize: 22
                                            }
                                        }}
                                        renderValue={renderSortLabel}
                                    >

                                        <MenuItem value="sortByNameAsc">
                                            Name (A - Z)
                                        </MenuItem>

                                        <MenuItem value="sortByNameDesc">
                                            Name (Z - A)
                                        </MenuItem>

                                        {sortOptions.map(function (option) {

                                            return (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            );
                                        })}

                                    </Select> */}

                                </div>

                            </div>


                            <div className='flex flex-col gap-4 mt-9'>

                                {loading && (

                                    <div className='flex flex-col gap-4'>

                                        {[...Array(6)].map(function (_, index) {

                                            return (

                                                <CarrierCardSkeleton key={index} />
                                            );
                                        })}

                                    </div>
                                )}


                                {!loading && carriers.length === 0 && (

                                    <div className='text-center py-[50px] text-sm text-gray-500'>
                                        No data found
                                    </div>
                                )}


                                {!loading && carriers.length > 0 && (

                                    <>

                                        {carriers.map(function (carrier) {

                                            return (

                                                <CarrierCard
													key={carrier.id}
													carrier={carrier}
													onClick={handleCarrierClick}
												/>
                                            );
                                        })}


                                        <div className='flex flex-wrap justify-center items-center gap-4 mt-1'>

                                            <button disabled={currentPage === 1} onClick={handlePrevPage}>

                                                <ChevronLeft />

                                            </button>

                                            <div className='text-sm mt-1 font-medium'>

                                                Page {currentPage} of {lastPage}

                                            </div>

                                            <button disabled={currentPage === lastPage} onClick={handleNextPage}>

                                                <ChevronRight />

                                            </button>

                                        </div>

                                    </>

                                )}

                            </div>

                        </div>

                    </div>

                </Grid>

            </Grid>

        </Main>
    );
}

export default CarrierSearch;
