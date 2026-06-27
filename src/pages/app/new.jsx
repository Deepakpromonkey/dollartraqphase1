
import React, { useState, useRef, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Headset, UploadCloud, FileText, X } from 'lucide-react';

import OtpModal from './OtpModal';
import ESign from './ESign'
import PdfViewer from './PdfViewer'
import ESignUpload from './ESignUpload'

import { useSearchParams } from 'react-router-dom';

import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Badge from '@mui/icons-material/Badge'
import DoneAll from '@mui/icons-material/DoneAll'
import AccountBalance from '@mui/icons-material/AccountBalance'
import Edit from '@mui/icons-material/Edit'
import Upload from '@mui/icons-material/Upload'

import Loader from 'components/Loader';

import Btn from 'components/Btn';

import Api from 'api/Api';

const steps = [
    { id: 1, label: 'CARRIER DETAILS' },
    { id: 2, label: 'GOVERNMENT ID' },
    // { id: 3, label: 'ELD INFORMATION' },
    { id: 3, label: 'BANK VERIFICATION' },
    { id: 4, label: 'E-SIGN & Submit' },
];

const stepOneValidation = Yup.object().shape({
    dotNumber: Yup.string().matches(/^\d+$/, 'DOT Number must be numeric').required('DOT Number is required'),

    name: Yup.string().min(2, 'Name is too short').required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
});

const stepTwoValidation = Yup.object().shape({
    file: Yup.mixed().required('A registration document file is required'),
});

export default function OnboardPage() {

    const [searchParams] = useSearchParams();
    const { row_id } = useParams();
console.log(row_id,"first");
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);
    const [isOtpOpen, setIsOtpOpen] = useState(false);

    const [initing, setIniting] = useState(true);

    const [carrier, setCarrier] = useState(null);
    const [connect_request, setConnectRequest] = useState(null);

    const [eSignType, setESignType] = useState('draw');

    const [success_message, setSuccessMessage] = useState(null);
    const [error_message, setErrorMessage] = useState(null);

    const [screen_loading, setScreenLoading] = useState(false);

    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isDiditVerified, setIsDiditVerified] = useState(false);
    const [isBankVerified, setIsBankVerified] = useState(false);

    const [isFreightBroker, setIsFreightBroker] = useState(false);
const [brokerDoc, setBrokerDoc] = useState(null);
const brokerFileInputRef = useRef(null);

    const [doc, setDoc] = useState(null);

    const fileInputRef = useRef(null);

     useEffect(() => {
    if (!row_id) {
        navigate("/carrier/invalid-access");
        return;
    }

    const fetchCustomer = async () => {
        try {
            const response = await fetch(
                "https://laravel.dollartraq.com/api/handle/backend/carriers/connect/load",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer 4|w9eRtO8kzBdvfZhnOC7wi3qKJITIfw1KRCL5Oz605c4d2386`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ row_id }),
                }
            );

            const res = await response.json();

            if (res.status) {
                setCarrier(res.row);
                setConnectRequest(res.connect_request);
                setDoc(res.connect_request.doc_url);

                if (res.connect_request.mobile_verified) setIsPhoneVerified(true);
                if (res.connect_request.didit_verified) setIsDiditVerified(true);
                if (res.connect_request.bank_verified) setIsBankVerified(true);
            } else {
                navigate("/carrier/invalid-access");
            }
        } catch (error) {
            console.error("Fetch Customer Error:", error);
            navigate("/carrier/invalid-access");
        } finally {
            setIniting(false);
        }
    };

    fetchCustomer();

    const verificationSessionId = searchParams.get("verificationSessionId");
    if (verificationSessionId) {
        verifyDiditResponse(verificationSessionId);
    }

}, [row_id]);
       

    const initialValues = {
        dotNumber: carrier?.dot_number ?? '',
        docketNumber: carrier?.docket_number ?? '',
        name: carrier?.legal_name ?? '',
        email: carrier?.email_address ?? '',
        phone: carrier?.telephone ?? '',
        file: null,
    };

const handleNextStep = (values, actions) => {

        if (currentStep === 1) {

            if (!isPhoneVerified) {

                setErrorMessage('Please verify your phone number.');
                return;
            }

            setCurrentStep(2);
            actions.setTouched({});
            actions.setSubmitting(false);

        } else if (currentStep === 2) {

            if (isDiditVerified) {

                setCurrentStep(3)
            } else {

                setErrorMessage('Please verify your Government Id')
            }
        } else if (currentStep === 3) {
             if (isFreightBroker && !brokerDoc) {

            setErrorMessage('Please upload your broker authority document.');
            return;
        }

            if (isBankVerified) {

                setCurrentStep(4)
            } else {

                setErrorMessage('Please connect your bank.')
            }
        }
    };



    const handleBackStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const verifyWithDidit = async () => {
        setScreenLoading(true);

        try {
            const response = await fetch(
                `https://laravel.dollartraq.com/api/handle/backend/carriers/didit/auth`,
                {
                    method: 'POST',
                     headers: {
                        Authorization: `Bearer 4|w9eRtO8kzBdvfZhnOC7wi3qKJITIfw1KRCL5Oz605c4d2386`,
                        "Content-Type": "application/json",
                        
                    },
                    body: JSON.stringify({
                        row_id: row_id,
                    }),
                }
            );

            const res = await response.json();

            setScreenLoading(false);

            if (res.status) {
                window.location.href = res.url;
            } else {
                setErrorMessage(res.message);
            }
        } catch (error) {
            console.error(error);
            setScreenLoading(false);
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

 const verifyDiditResponse = async () => {
 
    setScreenLoading(true);
 
    try {

        const response = await fetch(

            `https://laravel.dollartraq.com/api/handle/backend/carriers/didit/verify`,

            {

                method: 'POST',

                headers: {

                    Authorization: `Bearer 4|w9eRtO8kzBdvfZhnOC7wi3qKJITIfw1KRCL5Oz605c4d2386`,

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    row_id: row_id,

                }),

            }

        );
 
        const res = await response.json();
 
        setScreenLoading(false);
 
        if (res.status) {
 
            if (res.connect_request.didit_verified) {

                setIsDiditVerified(true);

            }
 
            setCurrentStep(3);

            setSuccessMessage(res.message);

            navigate(`/carrier/connect/${row_id}`);

        } else {
 
            setCurrentStep(2);

            setErrorMessage(res.message);

            navigate(`/carrier/connect/${row_id}`);

        }

    } catch (error) {

        console.error(error);

        setScreenLoading(false);

        setErrorMessage('Something went wrong. Please try again.');

    }

}; 


    const connectStripe = async () => {
 
    setScreenLoading(true);
 
    try {
        const response = await fetch(
            `https://laravel.dollartraq.com/api/handle/backend/carrier/stripe/connect`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer 4|w9eRtO8kzBdvfZhnOC7wi3qKJITIfw1KRCL5Oz605c4d2386`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    row_id: row_id,
                }),
            }
        );
 
        const res = await response.json();
console.log(res);
alert("ok");
 
        if (res.status) {
            window.location.href = res.url;
        } else {
            setScreenLoading(false);
            setErrorMessage(res.message);
        }
    } catch (error) {
        console.error(error);
        setScreenLoading(false);
        setErrorMessage('Something went wrong. Please try again.');
    }
};
 
const verifyStripeConnect = async () => {
 
    setScreenLoading(true);
 
    try {
        const response = await fetch(
            `https://laravel.dollartraq.com/api/handle/backend/carrier/stripe/verify`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer 4|w9eRtO8kzBdvfZhnOC7wi3qKJITIfw1KRCL5Oz605c4d2386`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    row_id: row_id,
                }),
            }
        );
 
        const res = await response.json();
 console.log(res);
alert("ok");
        setScreenLoading(false);
 
        if (res.status) {
 
            if (res.connect_request.bank_verified) {
                setIsBankVerified(true);
            }
 
            setCurrentStep(4);
            setSuccessMessage(res.message);
            navigate(`/carrier/connect/${row_id}`);
        } else {
 
            setCurrentStep(3);
            setErrorMessage(res.message);
            navigate(`/carrier/connect/${row_id}`);
        }
    } catch (error) {
        console.error(error);
        setScreenLoading(false);
        setErrorMessage('Something went wrong. Please try again.');
    }
};

    return (
        <div className="min-h-screen bg-white font-sans text-[#1A1A1A] flex flex-col items-center py-10 px-4 select-none relative">

            <Snackbar
                open={success_message}
                autoHideDuration={6000}
                onClose={() => {

                    setSuccessMessage(null)
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {success_message}
                </Alert>
            </Snackbar>

            <Snackbar
                open={error_message}
                autoHideDuration={6000}
                onClose={() => {

                    setErrorMessage(null)
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error_message}
                </Alert>
            </Snackbar>

            {/* Stepper Header Progress */}
            <div className="w-full max-w-5xl mb-16 px-4 select-none">
                <div className="relative w-full h-12">
                    <div className="absolute left-4 right-4 top-6 h-[2px] bg-[#E5E7EB] z-0">
                        <div
                            className="h-full bg-[#1D4ED8] transition-all duration-300 ease-in-out"
                            style={{
                                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
                            }}
                        />
                    </div>

                    <div className="absolute inset-0 flex justify-between items-center z-10 pointer-events-none">

                        {steps.map((step) => {

                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;

                            return (
                                <div
                                    key={step.id}
                                    className="flex items-center pointer-events-auto bg-white first:pl-0 last:pr-0"
                                >
                                    <div className="flex items-center px-2 bg-white">
                                        <div
                                            className={`w-8 h-8 rounded-full font-bold text-xs shrink-0 flex items-center justify-center transition-colors duration-300 ${isActive
                                                ? 'bg-[#1D4ED8] text-white'
                                                : isCompleted
                                                    ? 'bg-[#1D4ED8] text-white opacity-90'
                                                    : 'border-2 border-[#E5E7EB] bg-white text-[#9CA3AF]'
                                                }`}
                                        >
                                            <span className="flex !items-center justify-center text-center font-sans h-full w-full leading-none">
                                                {step.id}
                                            </span>
                                        </div>

                                        <span
                                            className={`ml-3 text-xs font-bold tracking-wider transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#1F2937]' : 'text-[#9CA3AF]'
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-[#EFF6FF] text-[#1E40AF] font-bold text-[11px] tracking-widest px-4 py-1.5 rounded-full mb-4 uppercase">
                STEP {currentStep} OF 4
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-[#111827] mb-2">
                {currentStep === 1
                    ?
                    'Carrier Details'
                    :
                    currentStep === 2
                        ?
                        'Government ID'
                        :
                        currentStep === 3
                            ?
                            'Bank Verification'
                            :
                            'E-Sign'
                }
            </h1>
            <p className="text-sm text-[#4B5563] mb-12">
                Note: To be filled by the signing authority of your organization
            </p>

            {initing
                ?
                <div className='w-full max-w-3xl'>
                    <div className="grid grid-cols-12 gap-6">

                        {[0, 1, 2, 3, 4, 5, 6, 7].map((_r, index) => {

                            return (
                                <div className='col-span-6' key={`skeleton-${index}`}>
                                    <Skeleton width="100%" height={100} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                :

                <div className="w-full max-w-3xl flex flex-col">

                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        validationSchema={currentStep === 1 ? stepOneValidation : undefined}
                        onSubmit={handleNextStep}
                    >
                        {({ errors, touched, values, setFieldValue, setFieldTouched }) => (

                            <>

                                <Form className="w-full max-w-3xl flex flex-col">

                                    {currentStep === 1 && (

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">

                                            {/* <div className="flex flex-col space-y-2">
                                                    <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase">MC Number</label>
                                                    <Field
                                                        name="mcNumber"
                                                        type="text"
                                                        className={`w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.mcNumber && touched.mcNumber ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'
                                                            }`}
                                                    />
                                                    <ErrorMessage name="mcNumber" component="span" className="text-xs text-red-500 mt-1" />
                                                </div> */}

                                            {/* DOT Number */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase">DOT Number</label>
                                                <div className={`h-[52px] w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.dotNumber && touched.dotNumber ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'}`}>
                                                    {carrier.dot_number}
                                                </div>
                                                {/* <Field
                                                        name="dotNumber"
                                                        type="text"
                                                        className={`w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.dotNumber && touched.dotNumber ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'
                                                            }`}
                                                    /> */}
                                                <ErrorMessage name="dotNumber" component="span" className="text-xs text-red-500 mt-1" />
                                            </div>

                                            {/* Docket Number */}
                                            <div className="flex flex-col space-y-2">

                                                <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase">Docket Number</label>
                                                <div className={`h-[52px] w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.docketNumber && touched.docketNumber ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'}`}>
                                                    {carrier.docket_number ? carrier.dot_number : '10000'}
                                                </div>
                                                {/* <Field
                                                        name="docketNumber"
                                                        type="text"
                                                        className={`w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.docketNumber && touched.docketNumber ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'
                                                            }`}
                                                    /> */}
                                                <ErrorMessage name="docketNumber" component="span" className="text-xs text-red-500 mt-1" />
                                            </div>

                                            {/* Name */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase">Name</label>
                                                <div className={`h-[52px] w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.name && touched.name ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'}`}>
                                                    {carrier.legal_name}
                                                </div>
                                                {/* <Field
                                                        name="name"
                                                        type="text"
                                                        className={`w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.name && touched.name ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'
                                                            }`}
                                                    /> */}
                                                <ErrorMessage name="name" component="span" className="text-xs text-red-500 mt-1" />
                                            </div>

                                            {/* Email */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase">Email</label>
                                                <div className={`h-[52px] w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.email && touched.email ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'}`}>
                                                    {carrier.email_address}
                                                </div>
                                                {/* <Field
                                                        name="email"
                                                        type="email"
                                                        className={`w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.email && touched.email ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'
                                                            }`}
                                                    /> */}
                                                <ErrorMessage name="email" component="span" className="text-xs text-red-500 mt-1" />
                                            </div>

                                            {/* Phone Field with working Verification Logic */}
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase">Phone</label>
                                                <div className="relative flex items-center">
                                                    {/* <Field
                                                            name="phone"
                                                            type="text"
                                                            placeholder="+1 (555) 000-0000"
                                                            disabled={isPhoneVerified}
                                                            className={`w-full pl-4 pr-24 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${isPhoneVerified
                                                                    ? 'bg-gray-50 border-emerald-200 text-gray-500 cursor-not-allowed'
                                                                    : errors.phone && touched.phone
                                                                        ? 'border-red-500 focus:ring-red-200'
                                                                        : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'
                                                                }`}
                                                        /> */}

                                                    <div className={`h-[52px] w-full px-4 py-3.5 border rounded-xl text-[15px] text-[#1F2937] focus:outline-none focus:ring-2 transition-all ${errors.phone && touched.phone ? 'border-red-500 focus:ring-red-200' : 'border-[#E5E7EB] focus:ring-blue-100 focus:border-blue-500'}`}>
                                                        {carrier.telephone}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={!values.phone || isPhoneVerified}
                                                        onClick={() => setIsOtpOpen(true)}
                                                        className={`absolute right-2 px-4 py-1.5 font-medium text-sm rounded-lg transition-colors duration-200 ${isPhoneVerified
                                                            ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                                            : !values.phone
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-[#E6F4EA] hover:bg-[#D2ECD7] text-[#137333]'
                                                            }`}
                                                    >
                                                        {isPhoneVerified ? 'Verified ✓' : 'Verify'}
                                                    </button>
                                                </div>
                                                <ErrorMessage name="phone" component="span" className="text-xs text-red-500 mt-1" />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (

                                        <div className="flex flex-col mb-8 w-full items-center">
                                            <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase mb-3">
                                                National ID Card, Passport, Driver's license, Residence Permit
                                            </label>

                                            {/* <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    name="file"
                                                    accept=".pdf,.png,.jpeg,.jpg"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        if (e.currentTarget.files && e.currentTarget.files[0]) {
                                                            setFieldValue('file', e.currentTarget.files[0]);
                                                            setFieldTouched('file', true);
                                                        }
                                                    }}
                                                /> */}

                                            {/* <div
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                            setFieldValue('file', e.dataTransfer.files[0]);
                                                            setFieldTouched('file', true);
                                                        }
                                                    }}
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className={`w-full border-2 border-dashed rounded-2xl py-12 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#FAFBFD] ${errors.file && touched.file
                                                        ? 'border-red-400 bg-red-50/20'
                                                        : 'border-[#CBD5E1] hover:border-[#1D4ED8] hover:bg-blue-50/10'
                                                        }`}
                                                >
                                                    {!values.file ? (
                                                        <>
                                                            <div className="w-12 h-12 bg-[#EFF6FF] rounded-full flex items-center justify-center text-[#1D4ED8] mb-4">
                                                                <UploadCloud className="w-6 h-6" />
                                                            </div>
                                                            <p className="text-[15px] font-medium text-gray-700 mb-1">
                                                                <span className="text-[#1D4ED8] font-semibold underline">Choose file</span> or drop here
                                                            </p>
                                                            <p className="text-xs text-gray-400">Maximum file size upload limit : 20MB</p>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center space-x-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-md w-full relative group">
                                                            <div className="p-2 bg-blue-50 rounded-lg text-[#1D4ED8]">
                                                                <FileText className="w-6 h-6" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-gray-800 truncate">{values.file.name}</p>
                                                                <p className="text-xs text-gray-400">{(values.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setFieldValue('file', null);
                                                                }}
                                                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div> */}

                                            <div className={`w-xl border-2 border-dashed rounded-2xl min-h-[200px] flex items-center justify-center cursor-pointer transition-all group flex flex-col ${isDiditVerified ? 'border-green-300 bg-green-50 hover:border-green-300' : 'border-gray-300 bg-[#FAFBFD] hover:border-blue-500'}`} onClick={() => {

                                                if (isDiditVerified) {

                                                    setCurrentStep(3)
                                                } else {

                                                    verifyWithDidit()
                                                }
                                            }}>

                                                <Badge style={{ fontSize: 100 }} className={`transition-all ${isDiditVerified ? 'text-green-700 opacity-20 group-hover:text-green-700' : 'text-blue-100 group-hover:text-blue-200'}`} />

                                                <h4 className={`uppercase text-md font-bold text-blue-200 group-hover:text-blue-300 transition-all`}>
                                                    {isDiditVerified
                                                        ?
                                                        <div className="flex items-center gap-2">
                                                            <DoneAll className="text-green-600" />
                                                            <span className="text-xl fontBold text-green-600">Verified</span>
                                                        </div>
                                                        :
                                                        <span>Click to Start</span>
                                                    }
                                                </h4>
                                            </div>
                                            <ErrorMessage name="file" component="span" className="text-xs text-red-500 mt-2 ml-1" />
                                        </div>
                                    )}

{currentStep === 3 && (

    <div className="flex flex-col mb-8 w-full items-center">
        <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase mb-3">
            Connect & Verify your bank account
        </label>

        <div className={`w-xl border-2 border-dashed rounded-2xl min-h-[200px] flex items-center justify-center cursor-pointer transition-all group flex flex-col ${isBankVerified ? 'border-green-300 bg-green-50 hover:border-green-300' : 'border-gray-300 bg-[#FAFBFD] hover:border-blue-500'}`} onClick={() => {

            if(isBankVerified){

                if (isFreightBroker && !brokerDoc) {

                    setErrorMessage('Please upload your broker authority document.');
                    return;
                }

                setCurrentStep(4)
            }else{
            
                connectStripe()
            }
        }}>
            
            <AccountBalance style={{fontSize:100}} className={`transition-all ${isBankVerified ? 'text-green-700 opacity-20 group-hover:text-green-700' : 'text-blue-100 group-hover:text-blue-200'}`} />

            <h4 className={`uppercase text-md font-bold text-blue-200 group-hover:text-blue-300 transition-all`}>
                {isBankVerified
                    ?
                        <div className="flex items-center gap-2">
                            <DoneAll className="text-green-600" />
                            <span className="text-xl fontBold text-green-600">Verified</span>
                        </div>
                    :
                        <span>Click to Start</span>
                }
            </h4>
        </div>
         <div
            className="flex items-center justify-between w-xl mt-6 px-4 py-3 bg-[#FAFBFD] border border-[#E5E7EB] rounded-xl"
            onClick={(e) => e.stopPropagation()}
        >
            <span className="text-sm font-semibold text-[#374151]">
                Are you a freight broker?
            </span>

            <button
                type="button"
                role="switch"
                aria-checked={isFreightBroker}
                onClick={() => setIsFreightBroker(!isFreightBroker)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isFreightBroker ? 'bg-[#1D4ED8]' : 'bg-gray-300'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isFreightBroker ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>

        {isFreightBroker && (
            <div className="w-xl mt-4">

                <label className="text-xs font-bold tracking-wider text-[#9CA3AF] uppercase mb-2 block">
                    Upload Broker Authority Document
                </label>

                <input
                    type="file"
                    ref={brokerFileInputRef}
                    accept=".pdf,.png,.jpeg,.jpg"
                    className="hidden"
                    onChange={(e) => {
                        if (e.currentTarget.files && e.currentTarget.files[0]) {
                            setBrokerDoc(e.currentTarget.files[0]);
                        }
                    }}
                />

                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            setBrokerDoc(e.dataTransfer.files[0]);
                        }
                    }}
                    onClick={() => brokerFileInputRef.current?.click()}
                    className="w-full border-2 border-dashed rounded-2xl py-8 px-4 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#FAFBFD] border-[#CBD5E1] hover:border-[#1D4ED8] hover:bg-blue-50/10"
                >
                    {!brokerDoc ? (
                        <>
                            <div className="w-10 h-10 bg-[#EFF6FF] rounded-full flex items-center justify-center text-[#1D4ED8] mb-3">
                                <UploadCloud className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                                <span className="text-[#1D4ED8] font-semibold underline">Choose file</span> or drop here
                            </p>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm w-full relative group">
                            <div className="p-2 bg-blue-50 rounded-lg text-[#1D4ED8]">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{brokerDoc.name}</p>
                                <p className="text-xs text-gray-400">{(brokerDoc.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setBrokerDoc(null);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {!brokerDoc && (
                    <span className="text-xs text-red-500 mt-2 ml-1 block">
                        This document is required for freight brokers
                    </span>
                )}
            </div>
        )}
        <ErrorMessage name="file" component="span" className="text-xs text-red-500 mt-2 ml-1" />
    </div>
)} 



                                    {currentStep === 4 &&

                                        <div className="w-[100%] m-auto">

                                            <div className="grid grid-cols-12 gap-8">

                                                <div className="col-span-7">

                                                    {doc !== null &&

                                                        <div>
                                                            <PdfViewer
                                                                pdfUrl={doc}
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                                <div className="col-span-5">

                                                    <strong className="text-sm text-gray-400">Digital Signature</strong>

                                                    <div className="bg-[#F1F5F9CC] p-2 rounded-lg flex items-center justify-between mb-5 mt-2">

                                                        <button type="button" className={`flex-1 ${eSignType === 'draw' ? 'bg-white' : ''} rounded-lg py-1 flex items-center justify-center cursor-pointer`} onClick={() => {

                                                            setESignType('draw')
                                                        }}>
                                                            <Edit className={`${eSignType === 'draw' ? 'text-[#006C49]' : 'text-gray-500'}`} style={{ fontSize: 14 }} />
                                                            <span className={`${eSignType === 'draw' ? 'text-[#006C49]' : 'text-gray-500'} text-xs font-semibold ml-1`}>Sign</span>
                                                        </button>

                                                        <button type="button" className={`flex-1 ${eSignType === 'upload' ? 'bg-white' : ''} rounded-lg py-1 flex items-center justify-center cursor-pointer`} onClick={() => {

                                                            setESignType('upload')
                                                        }}>
                                                            <Upload className={`${eSignType === 'upload' ? 'text-[#006C49]' : 'text-gray-500'}`} style={{ fontSize: 14 }} />
                                                            <span className={`${eSignType === 'upload' ? 'text-[#006C49]' : 'text-gray-500'} text-xs font-semibold ml-1`}>Upload</span>
                                                        </button>
                                                    </div>

                                                    {eSignType === 'draw'
                                                        ?
                                                        <ESign />
                                                        :
                                                        <ESignUpload />
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <div className="w-full h-[1px] bg-[#E5E7EB] my-6" />

                                    {currentStep !== 4 &&

                                        <div className="flex items-center justify-between mt-2">

                                            {currentStep === 1 ? (
                                                <button
                                                    type="button"
                                                    className="flex items-center space-x-2 text-sm font-semibold text-[#4B5563] hover:text-black transition-colors"
                                                >
                                                    <Headset className="w-4 h-4" />
                                                    <span>Contact Support</span>
                                                </button>
                                            ) : (
                                                <>
                                                    <Btn
                                                        onClick={() => {

                                                            setCurrentStep(currentStep + 1)
                                                        }}
                                                        color="secondary"
                                                        variant="contained"
                                                        confirm
                                                        confirm_message="Do you really want to skip this step?"
                                                    >
                                                        Skip
                                                    </Btn>
                                                </>
                                            )}

                                            <button
                                                // disabled={!values.phone || !isPhoneVerified || !isDiditVerified || !isBankVerified}
                                                type="submit"
                                                className="px-10 py-3.5 bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-semibold text-sm rounded-xl tracking-wide shadow-md hover:shadow-lg transition-all duration-200"
                                            >
                                                Continue to Step {currentStep + 1}
                                            </button>
                                        </div>
                                    }

                                </Form>

                                <OtpModal
                                    isOpen={isOtpOpen}
                                    onClose={() => setIsOtpOpen(false)}
                                    phone={values.phone}
                                    row_id={row_id}
                                    onVerifySuccess={(request) => {
                                        setIsOtpOpen(false);
                                        setIsPhoneVerified(true);
                                        setFieldValue('phone', values.phone);

                                        setConnectRequest(request)

                                        if (request.mobile_verified) {

                                            setIsPhoneVerified(true)
                                        }

                                        setSuccessMessage('Phone number has been verified successfully.')
                                    }}
                                />
                            </>
                        )}
                    </Formik>
                </div>
            }

            <Loader loading={screen_loading} />
        </div>
    );
}
