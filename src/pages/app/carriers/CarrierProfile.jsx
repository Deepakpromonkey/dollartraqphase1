import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import CarrierProfileSection from '@/profileComponents/CarrierProfileSection';
import RiskFactorCard from '@/profileComponents/RiskFactorCard';

import SafetyPerformance from '@/profileComponents/SafetyPerformance';
import FleetSummary from '@/profileComponents/FleetSummary';
import InsuranceCard from '@/profileComponents/InsuranceCard';
import HighFrequencyLanes from '@/profileComponents/HighFrequencyLanes';
import OperationalObservations from '@/profileComponents/OperationalObservations';
import SafetyIntelligenceConsole from '@/profileComponents/safetyIntelligence/SafetyIntelligenceConsole';
import FleetDetails from '@/profileComponents/FleetDetails';
import LoadHistory from '@/profileComponents/LoadHistory';
import CompanySnapshot from '@/profileComponents/CompanySnapShot';

import CompanyAssociationsView from '@/profileComponents/CompanyAssociationsView';
import EquipmentInsightsView from '@/profileComponents/EquipmentInsightsView';
import IndustryBenchMarksView from '@/profileComponents/IndustryBenchMarksView';
import ContactHistoryView from '@/profileComponents/ContactHistoryView';

import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined';
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import AlternateEmail from '@mui/icons-material/AlternateEmail';
import Language from '@mui/icons-material/Language';

import Main from '@/components/Main';

import Skeleton from '@mui/material/Skeleton';

import Api from '@/api/Api';

import {Add,Bolt,CheckCircle,WarningAmber,LocalShipping,Groups,History,InfoOutlined,Timeline,Assessment} from '@mui/icons-material';

function CarrierProfile() {

    const { row_id } = useParams();

    const navigate = useNavigate();

    const [successMessage, setSuccessMessage] = useState('');

   const [errorMessage, setErrorMessage] = useState('');

    const [carrier, setCarrier] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('RISK FACTORS');

    const [activeSidebar, setActiveSidebar] = useState('RISK FACTORS');

    const [shortlisting, setShortlisting] = useState(false);

    const [isShortlisted, setIsShortlisted] = useState(false);

    const accountToken = localStorage.getItem(
    import.meta.env.VITE_ACCOUNT_TOKEN
);
  

const [initing, setIniting] = useState(false);
const [connectRequest, setConnectRequest] = useState(null);
const [doc, setDoc] = useState(null);

const [isPhoneVerified, setIsPhoneVerified] = useState(false);
const [isDiditVerified, setIsDiditVerified] = useState(false);
const [isBankVerified, setIsBankVerified] = useState(false);

    const informationTabs = [
        'COMPANY ASSOCIATIONS',
        'EQUIPMENT INSIGHTS',
        'INDUSTRY BENCHMARKS',
        'CONTACT HISTORY'
    ];

    const sectionRefs = {
        'RISK FACTORS': useRef(null),
        'COMPANY ASSOCIATIONS': useRef(null),
        'EQUIPMENT INSIGHTS': useRef(null),
        'INDUSTRY BENCHMARKS': useRef(null),
        'CONTACT HISTORY': useRef(null),
        'OPERATIONAL OBSERVATIONS': useRef(null),
        'SAFETY INTELLIGENCE CONSOLE': useRef(null),
        'FLEET DETAILS': useRef(null),
        'LOAD HISTORY': useRef(null),
        'COMPANY SNAPSHOT': useRef(null)
    };


    useEffect(function () {

        if (!row_id) {

            setError('No carrier ID provided.');

            setLoading(false);

            return;

        }

        setLoading(true);

        setError('');

        fetch(

            `https://laravel.dollartraq.com/api/carrier/detail/${row_id}`,

            {
                method: 'POST',

                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`
                }
            }

        )

            .then(function (res) {

                if (!res.ok) {

                    throw new Error(`Server error: ${res.status}`);

                }

                const contentType = res.headers.get('content-type');

                if (
                    !contentType ||
                    !contentType.includes('application/json')
                ) {

                    throw new Error(
                        'Server returned non-JSON response'
                    );

                }

                return res.json();

            })

            .then(function (data) {

                console.log('Carrier API response:', data);

                const carrierData = data.data || data;

                if (
                    !carrierData ||
                    typeof carrierData !== 'object'
                ) {

                    throw new Error(
                        'Invalid carrier data received'
                    );

                }

    setCarrier(carrierData);

    fetch(
        `${import.meta.env.VITE_ROOT_PROD}/app/profile/carriers/shortlisted/list`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`,
                'X-ACCOUNT-TOKEN': import.meta.env.VITE_ACCOUNT_TOKEN
            },
            body: JSON.stringify({
                account_token: import.meta.env.VITE_ACCOUNT_TOKEN
            })
        }
    )
    .then(res => res.json())

    .then(shortlistData => {

        const records = shortlistData?.records || [];

        const alreadyShortlisted = records.some(function (item) {

            return (
                item?.carrier_id?.toString() === row_id?.toString()
            );

        });

        setIsShortlisted(alreadyShortlisted);

    })
    .catch(function (err) {

        console.log('Shortlist status check failed', err);

    });

            })

            .catch(function (err) {

                console.error(
                    'CarrierProfile fetch error:',
                    err.message
                );

                setError(err.message ||'Failed to load carrier profile.');

            })

            .finally(function () {

                setLoading(false);

            });

    }, [row_id]);

    function addToPreferred() {

        if (!row_id) return;

        setShortlisting(true);

        setSuccessMessage('');
        setErrorMessage('');

        fetch(
            `${import.meta.env.VITE_ROOT_PROD}/app/profile/carriers/shortlisted/save`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_BARRIER_TOKEN}`
                },
                body: JSON.stringify({
                    carrier_id: row_id
                })
            }
        )

            .then(function (res) {

                if (!res.ok) {

                    throw new Error('Failed to shortlist');

                }

                return res.json();

            })

            .then(function (data) {

                console.log('Shortlist response:', data);

                setIsShortlisted(true);

                setSuccessMessage(
                    data?.message ||
                    'Carrier added to preferred successfully.'
                );

                setErrorMessage('');

            })

            .catch(function (err) {

                console.error('Shortlist error:', err);

                setErrorMessage(
                    err?.message ||
                    'Failed to add carrier to preferred.'
                );

                setSuccessMessage('');

            })

            .finally(function () {

                setShortlisting(false);
                setTimeout(function () {

                    setSuccessMessage('');
                    setErrorMessage('');

                }, 4000);


            });

    }

const handleConnect = async () => {
    try {
        const response = await fetch(
            `https://laravel.dollartraq.com/api/handle/backend/carriers/connect/request`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer 53|N936trVmuQw3lkyiwQy28yxdeCtnu5hEOBiHW9IU57bb2cff`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    receiver: row_id, // or carrier.id
                }),
            }
        );

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            alert("Connection request sent successfully.");
        } else {
            alert(data.message || "Something went wrong.");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to send request.");
    }
};
       
    useEffect(function () {

        if (!carrier) {

            return;

        }

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    setActiveSidebar(
                        entry.target.getAttribute('data-section')
                    );

                }

            });

        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions
        );

        Object.values(sectionRefs).forEach(function (ref) {

            if (ref.current) {

                observer.observe(ref.current);

            }

        });

        return function () {

            observer.disconnect();

        };

    }, [carrier, activeTab]);

    const executeScroll = function (label) {

        const element = sectionRefs[label]?.current;

        if (element) {

            const offset = 32;

            const bodyRect =
                document.body.getBoundingClientRect().top;

            const elementRect =
                element.getBoundingClientRect().top;

            const elementPosition =
                elementRect - bodyRect;

            const offsetPosition =
                elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

        }

    };

    const scrollToSection = function (label) {

        if (label === 'INFORMATION') {

            if (informationTabs.includes(activeTab)) {

                executeScroll(activeTab);

                return;

            }

            setActiveTab('COMPANY ASSOCIATIONS');

            setTimeout(function () {

                executeScroll('COMPANY ASSOCIATIONS');

            }, 80);

            return;

        }

        if (label === 'RISK FACTORS') {

            if (activeTab !== 'RISK FACTORS') {

                setActiveTab('RISK FACTORS');

                setTimeout(function () {

                    executeScroll('RISK FACTORS');

                }, 80);

            } else {

                executeScroll('RISK FACTORS');

            }

            return;

        }

        executeScroll(label);

    };

    if (loading) {

        return (

            <Main active_page="carrier_profile" page="carrier_profile">

                <div className='min-h-screen bg-[#F6F7F0] p-[14px] sm:p-[20px] xl:p-[32px]'>

                    <div className='mx-auto max-w-[1600px] space-y-[24px]'>

                        {/* Hero Section Skeleton */}
                        <div className="bg-white rounded-[16px] p-6 border border-[#d9e1ee] shadow-sm flex flex-col md:flex-row justify-between gap-6">

                            <div className="space-y-3 flex-1">

                                <Skeleton variant="text" width="60%" height={32} />

                                <Skeleton variant="text" width="40%" height={20} />

                                <div className="flex gap-4 pt-2">

                                    <Skeleton variant="rounded" width={100} height={24} />

                                    <Skeleton variant="rounded" width={120} height={24} />

                                </div>

                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 min-w-[280px]">

                                {[1, 2, 3, 4].map((i) => (

                                    <div key={i}>

                                        <Skeleton variant="text" width={40} height={14} />

                                        <Skeleton variant="text" width={80} height={20} />

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* Contact Info Skeleton */}
                        <div className="bg-white rounded-[16px] p-6 border border-[#d9e1ee] shadow-sm">

                            <Skeleton variant="text" width={200} height={24} className="mb-4" />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                                {[1, 2, 3, 4].map((i) => (

                                    <div key={i} className="flex gap-3">

                                        <Skeleton variant="circular" width={24} height={24} className="shrink-0" />

                                        <div className="w-full">

                                            <Skeleton variant="text" width="40%" height={14} />

                                            <Skeleton variant="text" width="80%" height={20} />

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* Mid Grid Columns Skeleton */}
                        <div className='grid grid-cols-1 gap-[24px] xl:grid-cols-12 xl:gap-[32px]'>

                            <div className='space-y-[24px] xl:col-span-8 xl:space-y-[32px]'>

                                <Skeleton variant="rounded" height={280} className="w-full !rounded-[16px]" />

                                <Skeleton variant="rounded" height={220} className="w-full !rounded-[16px]" />

                            </div>

                            <div className='space-y-[24px] xl:col-span-4 xl:space-y-[32px]'>

                                <Skeleton variant="rounded" height={240} className="w-full !rounded-[16px]" />

                                <Skeleton variant="rounded" height={260} className="w-full !rounded-[16px]" />

                            </div>

                        </div>

                        {/* Bottom Layout Split (Sidebar + Content Panel) Skeleton */}
                        <div className='flex flex-col gap-[24px] xl:flex-row xl:gap-[32px]'>

                            <div className='w-full xl:w-[320px] xl:shrink-0'>

                                <div className='flex gap-[10px] overflow-x-auto rounded-[16px] border border-[#d9e1ee] bg-white p-[12px] shadow-sm xl:min-h-[400px] xl:flex-col'>

                                    {[1, 2, 3, 4, 5].map((i) => (

                                        <Skeleton key={i} variant="rounded" height={54} className="w-[140px] xl:w-full !rounded-[10px]" />

                                    ))}

                                </div>

                            </div>

                            <div className='min-w-0 flex-1 space-y-[24px] xl:space-y-[32px]'>

                                <div className='rounded-[16px] border border-[#d9e1ee] bg-white shadow-sm overflow-hidden'>

                                    <div className="bg-[#EBF5FF] px-6 py-4 border-b border-[#d9e1ee]">

                                        <div className="flex gap-6">

                                            <Skeleton variant="text" width={100} height={24} />

                                            <Skeleton variant="text" width={120} height={24} />

                                            <Skeleton variant="text" width={110} height={24} />

                                        </div>

                                    </div>

                                    <div className="p-6 space-y-4">

                                        <Skeleton variant="rounded" height={140} className="w-full !rounded-[12px]" />

                                        <Skeleton variant="rounded" height={140} className="w-full !rounded-[12px]" />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </Main>

        );

    }

    if (error || !carrier) {

        return (

            <div className='min-h-screen bg-[#F6F7F0] flex items-center justify-center'>

                <div className='bg-white rounded-xl border border-red-200 p-8 max-w-md text-center shadow-sm'>

                    <h2 className='text-lg font-bold text-gray-800 mb-2'>
                        Failed to load carrier
                    </h2>

                    <p className='text-sm text-gray-500 mb-4'>
                        {error || 'Carrier data is unavailable.'}
                    </p>

                    <button
                        onClick={function () {

                            window.location.reload();

                        }}
                        className='bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600 transition'
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }

    const allSidebarOptions = [
        {
            id: 'info',
            label: 'INFORMATION',
            icon: <InfoOutlined />
        },
        {
            id: 'risk',
            label: 'RISK FACTORS',
            icon: <WarningAmber />
        },
        {
            id: 'obs',
            label: 'OPERATIONAL OBSERVATIONS',
            icon: <Timeline />
        },
        {
            id: 'safety',
            label: 'SAFETY INTELLIGENCE CONSOLE',
            icon: <Assessment />
        },
        {
            id: 'fleet',
            label: 'FLEET DETAILS',
            icon: <LocalShipping />
        },
        {
            id: 'load',
            label: 'LOAD HISTORY',
            icon: <History />
        },
        {
            id: 'company',
            label: 'COMPANY SNAPSHOT',
            icon: <Groups />
        }
    ];

    const filteredSidebarOptions = allSidebarOptions.filter(function (opt) {

        if (
            activeTab === 'RISK FACTORS' &&
            opt.label === 'INFORMATION'
        ) {

            return false;

        }

        if (
            informationTabs.includes(activeTab) &&
            opt.label === 'RISK FACTORS'
        ) {

            return false;

        }

        return true;

    });

    const tabs = [
        'RISK FACTORS',
        'COMPANY ASSOCIATIONS',
        'EQUIPMENT INSIGHTS',
        'INDUSTRY BENCHMARKS',
        'CONTACT HISTORY'
    ];
   

    return (


       <Main active_page="carrier_profile" page="carrier_profile" error_message={errorMessage} success_message={successMessage}>

        <div className='min-h-screen bg-[#F6F7F0] p-[14px] sm:p-[20px] xl:p-[32px]'>

            <div className='mx-auto max-w-[1600px]'>

            <CarrierProfileSection
                variant='hero'
                title={carrier.company_name || 'NA'}
                subtitle={carrier.dba_name || 'NA'}
                leftItems={[
                    {
                        label: 'STATUS',
                        value: carrier.computed?.status_code || 'NA',
                        icon: (
                            <CheckCircle
                                className={`!text-[15px] ${
                                    carrier.computed?.status_code?.toLowerCase() === 'active'
                                        ? '!text-[#15924c]'
                                        : '!text-[#dc2626]'
                                }`}
                            />
                        )
                    },
                    {
                        label: 'YEARS ACTIVE',
                        value: carrier.computed?.dot_age
                            ? `${carrier.computed.dot_age} yrs`
                            : 'NA'
                    }
                ]}
                rightItems={[
                    {
                        label: 'MC#',
                        value:
                            carrier?.authority?.docket_number ||
                            'NA'
                    },
                    {
                        label: 'DOT#',
                        value: carrier.dot_number || 'NA'
                    },
                    {
                        label: 'EIN#',
                        value: carrier.ein || 'NA'
                    },
                    {
                        label: 'DUNS#',
                        value: carrier.duns || 'NA'
                    }
                ]}
            actions={[
                !isShortlisted
                    ? {
                        label: 'Add to Preferred',
                        icon: <Add />,
                        variant: 'secondary',
                        onClick: addToPreferred,
                        disabled: shortlisting,
                        loading: shortlisting
                    }
                    : {
                        label: 'Pay Now',
                        icon: <CheckCircle />,
                        variant: 'primary',
                        onClick: () => navigate('/payment'),
                    },
                    {
                        label: 'Connect',
                        icon: <Bolt className='!text-[18px]' />,
                        variant: isShortlisted ? 'secondary' : 'primary',
                        onClick: () => handleConnect(row_id)
                    }
            ]}
            />

            <div className='mt-[24px]'>

                <CarrierProfileSection
                    title='Contact Information'
                    titleIcon={
                        <DescriptionOutlined
                            className='!text-[#185abc]'
                        />
                    }
                    items={[
                        {
                            label: 'HEADQUARTERS',
                            value: [
                                carrier?.physical_address?.street,
                                carrier?.physical_address?.city,
                                carrier?.physical_address?.state,
                                carrier?.physical_address?.zip,
                                carrier?.physical_address?.country
                            ]
                                .filter(Boolean)
                                .join(', ') || 'NA',
                            icon: <LocationOnOutlined />
                        },
                        {
                            label: 'DISPATCH PHONE',
                            value:
                                carrier.phone ||
                                carrier.dispatch_phone ||
                                'NA',
                            icon: <PhoneOutlined />
                        },
                        {
                            label: 'OFFICIAL EMAIL',
                            value:
                                carrier.email ||
                                carrier.official_email ||
                                'NA',
                            icon: <AlternateEmail />
                        },
                        {
                            label: 'WEB PRESENCE',
                            value:
                                carrier.website ||
                                carrier.computed?.web_presence ||
                                'NA',
                            icon: <Language />
                        }
                    ]}
                />

            </div>

                <div className='mt-[24px] grid grid-cols-1 gap-[24px] xl:mt-[32px] xl:grid-cols-12 xl:gap-[32px]'>

                    <div className='space-y-[24px] xl:col-span-8 xl:space-y-[32px]'>

                        <SafetyPerformance
                            data={carrier}
                        />

                       <FleetSummary
                            data={carrier}
                        />

                    </div>

                    <div className='space-y-[24px] xl:col-span-4 xl:space-y-[32px]'>

                        <InsuranceCard
                            data={carrier}
                        />

                        {/* <HighFrequencyLanes
                            lanes={
                                carrier?.computed?.preferred_lanes
                            }
                        /> */}

                    </div>

                </div>

                <div className='mt-[24px] flex flex-col gap-[24px] xl:mt-[32px] xl:flex-row xl:gap-[32px] xl:items-start'>

                    <aside className='w-full xl:sticky xl:top-[32px] xl:w-[320px] xl:shrink-0'>

                        <div className='flex gap-[10px] overflow-x-auto rounded-[16px] border border-[#d9e1ee] bg-white p-[12px] shadow-sm xl:min-h-[500px] xl:flex-col xl:overflow-visible'>

                            {filteredSidebarOptions.map(function (opt) {

                                return (

                                    <button
                                        key={opt.id}
                                        onClick={() => {

                                            scrollToSection(opt.label);

                                        }}
                                        className={`flex shrink-0 items-center gap-[12px] rounded-[10px] px-[16px] py-[16px] text-[11px] font-[700] uppercase tracking-tight transition-all xl:w-full xl:py-[25px] ${
                                            activeSidebar === opt.label ||
                                            (
                                                opt.label === 'INFORMATION' &&
                                                informationTabs.includes(activeSidebar)
                                            )
                                                ? 'text-[#1656b8] bg-[#f8fbff]'
                                                : 'text-[#64748b] hover:bg-gray-50'
                                        }`}
                                    >

                                        {React.cloneElement(opt.icon, {
                                            className: '!text-[18px]'
                                        })}

                                        <span className='whitespace-nowrap'>
                                            {opt.label}
                                        </span>

                                    </button>

                                );

                            })}

                        </div>

                    </aside>

                    <main className='min-w-0 flex-1 space-y-[24px] xl:space-y-[32px]'>

                        <div className='overflow-hidden rounded-[16px] border border-[#d9e1ee] bg-white shadow-sm'>

                            <div className='sticky top-0 z-10 border-b border-[#d9e1ee] bg-[#EBF5FF]'>

                                <div className='overflow-x-auto'>

                                    <div className='flex min-w-max gap-[28px] px-[15px] sm:gap-[40px] sm:px-[30px] xl:gap-[50px] xl:px-[62px]'>

                                        {tabs.map(function (tab) {

                                            return (

                                                <button
                                                    key={tab}
                                                    onClick={() => {

                                                        setActiveTab(tab);

                                                    }}
                                                    className={`relative py-[18px] text-[10px] font-[700] uppercase tracking-[1px] transition-all sm:text-[11px] ${
                                                        activeTab === tab
                                                            ? 'text-[#1c5dbe]'
                                                            : 'text-[#7c8fac] hover:text-[#111827]'
                                                    }`}
                                                >

                                                    {tab}

                                                    {activeTab === tab && (

                                                        <div className='absolute bottom-0 left-[15%] h-[3px] w-[70%] rounded-t-[4px] bg-[#1c5dbe]' />

                                                    )}

                                                </button>

                                            );

                                        })}

                                    </div>

                                </div>

                            </div>

                            <div className='bg-[#fbfcfe] p-[16px] sm:p-[24px] xl:p-[32px]'>

                                {activeTab === 'RISK FACTORS' && (

                                    <div
                                        ref={sectionRefs['RISK FACTORS']}
                                        data-section='RISK FACTORS'
                                        className='space-y-[20px] xl:space-y-[32px]'
                                    >

                                        <RiskFactorCard
                                            type='success'
                                            title='RELIABILITY FACTORS'
                                            badge='PREMIUM STANDING'
                                            items={
                                                carrier?.reliability?.items ||
                                                []
                                            }
                                        />

                                        <RiskFactorCard
                                            type='risk'
                                            title='RISK FACTORS'
                                            badge='IMMEDIATE ATTENTION'
                                            items={
                                                carrier?.risks?.items ||
                                                []
                                            }
                                        />

                                    </div>

                                )}

                                {activeTab === 'COMPANY ASSOCIATIONS' && (

                                    <div
                                        ref={sectionRefs['COMPANY ASSOCIATIONS']}
                                        data-section='COMPANY ASSOCIATIONS'
                                        className='space-y-[24px] xl:space-y-[32px]'
                                    >

                                        <CompanyAssociationsView
                                            data={
                                                carrier?.companyAssociations ||
                                                []
                                            }
                                        />

                                    </div>

                                )}

                                {activeTab === 'EQUIPMENT INSIGHTS' && (

                                    <div
                                        ref={sectionRefs['EQUIPMENT INSIGHTS']}
                                        data-section='EQUIPMENT INSIGHTS'
                                        className='space-y-[24px] xl:space-y-[32px]'
                                    >

                                        <EquipmentInsightsView
                                           data={carrier}
                                        />

                                    </div>

                                )}

                                {activeTab === 'INDUSTRY BENCHMARKS' && (

                                    <div
                                        ref={sectionRefs['INDUSTRY BENCHMARKS']}
                                        data-section='INDUSTRY BENCHMARKS'
                                        className='space-y-[24px] xl:space-y-[32px]'
                                    >

                                        <IndustryBenchMarksView
                                            data={carrier}
                                        />

                                    </div>

                                )}

                                {activeTab === 'CONTACT HISTORY' && (

                                    <div
                                        ref={sectionRefs['CONTACT HISTORY']}
                                        data-section='CONTACT HISTORY'
                                        className='space-y-[24px] xl:space-y-[32px]'
                                    >

                                        <ContactHistoryView
                                            data={carrier}
                                        />

                                    </div>

                                )}

                            </div>

                        </div>

                        <section
                            ref={sectionRefs['OPERATIONAL OBSERVATIONS']}
                            data-section='OPERATIONAL OBSERVATIONS'
                        >

                            <OperationalObservations
                                data={carrier}
                            />

                        </section>

                        <section
                            ref={sectionRefs['SAFETY INTELLIGENCE CONSOLE']}
                            data-section='SAFETY INTELLIGENCE CONSOLE'
                            className='scroll-mt-[32px]'
                        >

                            <SafetyIntelligenceConsole
                                data={carrier}
                            />

                        </section>

                        <section
                            ref={sectionRefs['FLEET DETAILS']}
                            data-section='FLEET DETAILS'
                        >

                            <FleetDetails
                                data={carrier}
                            />

                        </section>

                        <section
                            ref={sectionRefs['LOAD HISTORY']}
                            data-section='LOAD HISTORY'
                        >

                            <LoadHistory
                                data={
                                    carrier?.loadHistory ||
                                    []
                                }
                            />

                        </section>

                        <section
                            ref={sectionRefs['COMPANY SNAPSHOT']}
                            data-section='COMPANY SNAPSHOT'
                        >

                            <CompanySnapshot
                               data={carrier}
                            />

                        </section>

                    </main>

                </div>

            </div>

        </div>

       </Main>

    );
}

export default CarrierProfile;
