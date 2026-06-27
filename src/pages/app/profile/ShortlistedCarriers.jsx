import React, { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import Main from 'components/Main';
import CarrierCard from 'components/blocks/CarrierCards';

import { useNavigate } from 'react-router-dom';

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

/* ---------- PAGE ---------- */
function ShortlistedCarriers() {

    const navigate = useNavigate(); 

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [loading, setLoading] = useState(true);
    const [carriers, setCarriers] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadShortlistedCarriers();
    }, []);

    /* ---------- GET REAL TOKEN FROM LOCALSTORAGE ---------- */
    function getAccountToken() {
        return localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
    }

    function handleCarrierClick(carrier) {
        navigate('/carriers/' + carrier.carrier_id);
    }

    function loadShortlistedCarriers() {
        setLoading(true);

        const account_token = getAccountToken();

        fetch(
            `${import.meta.env.VITE_ROOT_PROD}/app/profile/carriers/shortlisted/list`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`,
                    'X-ACCOUNT-TOKEN': account_token
                },
                body: JSON.stringify({
                    account_token: account_token
                })
            }
        )
            .then(res => res.json())
            .then(data => {
                const records = data.records || [];
                setCarriers(records);
                setTotal(data.total ?? records.length);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }

    function removeFromShortlist(row_id) {

        setSuccessMessage('');
        setErrorMessage('');

        const account_token = getAccountToken();

        fetch(
            `${import.meta.env.VITE_ROOT_PROD}/app/profile/carriers/shortlisted/remove`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`,
                    'X-ACCOUNT-TOKEN': account_token
                },
                body: JSON.stringify({
                    row_id,
                    account_token: account_token
                })
            }
        )
            .then(res => res.json())
            .then(data => {

                if (data?.status === false) {

                    setErrorMessage(data?.message);

                    /* AUTO CLEAR AFTER 4 SEC */
                    setTimeout(function () {
                        setErrorMessage('');
                    }, 4000);

                    return;
                }

                setCarriers(prev =>
                    prev.filter(c => c.row_id !== row_id)
                );

                setTotal(prev => Math.max(prev - 1, 0));

                setSuccessMessage(data?.message);

                /* AUTO CLEAR AFTER 4 SEC */
                setTimeout(function () {
                    setSuccessMessage('');
                }, 4000);

            })
            .catch(err => {

                console.log('Remove failed', err);

                setErrorMessage('Something went wrong');

                setTimeout(function () {
                    setErrorMessage('');
                }, 4000);

            });
    }

    return (
       <Main active_page="profile" page="shortlisted_carriers" full_width success_message={successMessage} error_message={errorMessage}>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <div className="min-h-screen p-3 md:p-4 lg:p-6 ">
                        <div className="max-w-[1100px] mx-auto">

                            <div className="mb-10">
                                <span className="text-sm inline-flex items-center gap-1 font-semibold text-[#8B93A7]">
                                    <FiberManualRecordIcon sx={{ fontSize: 8, color: '#2563EB' }} />
                                    Shortlisted Carriers
                                </span>
                                <br />
                                <span className="text-gray-600 text-[16px]">
                                    Total Shortlisted:{' '}
                                </span>
                                <strong className="text-gray-900 text-[16px]">
                                    {total.toLocaleString()}
                                </strong>
                            </div>

                            <div className="flex flex-col gap-4">

                                {loading &&
                                    [...Array(6)].map((_, i) => (
                                        <CarrierCardSkeleton key={i} />
                                    ))
                                }

                                {!loading && carriers.length === 0 && (
                                    <div className="text-center py-[50px] text-sm text-gray-500">
                                        No shortlisted carriers found
                                    </div>
                                )}

                                {!loading && carriers.length > 0 &&
                                    carriers.map(carrier => (
                                        <CarrierCard
                                            key={carrier.row_id}
                                            carrier={carrier}
                                            showRemove
                                            onRemove={removeFromShortlist}
                                            onClick={handleCarrierClick}   
                                        />
                                    ))
                                }

                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Main>
    );
}

export default ShortlistedCarriers;