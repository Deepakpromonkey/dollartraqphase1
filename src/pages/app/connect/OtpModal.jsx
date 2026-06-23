import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

import Btn from 'components/Btn';

import Api from 'api/Api';

import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'

import Loader from 'components/Loader';

export default function OtpModal({ isOpen, onClose, phone, row_id, onVerifySuccess, updateConnectRequest }) {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [timer, setTimer] = useState(0);

    const [otp_sent, setOtpSent] = useState(false);
    const [sending, setSending] = useState(true);
    const [resend, setResending] = useState(false);
    const [can_resend, setCanResend] = useState(false);

    const [error, setError] = useState('');

    const inputRefs = useRef([]);

    const sendSms = () => {

        Api.post('handle/backend/carriers/connect/sms/send', {row_id: row_id}, (res) => {

            if(res.status){
            
                setTimer(30)
                setSending(false)
                setResending(false)
                setCanResend(true)
                setOtpSent(true)
            }else{

                setError(res.message)
            }
        })
    }

    useEffect(() => {

        if(isOpen){

            setTimeout(() => inputRefs.current[0]?.focus(), 100);
            setOtp(new Array(6).fill(''));

            sendSms()
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || timer === 0) return;
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer, isOpen]);

    if (!isOpen) return null;

    const handleChange = (value, index) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim();
        if (!/^\d{6}$/.test(pasteData)) return;

        const digits = pasteData.split('');
        setOtp(digits);
        inputRefs.current[5]?.focus();
    };

    const handleVerifySubmit = (e) => {
        e.preventDefault();
        const code = otp.join('');
        if(code.length === 6){
            
            Api.post('handle/backend/carriers/connect/sms/verify', {row_id: row_id, otp: code}, (res) => {

                if(res.status){

                    onVerifySuccess(res.connect_request);
                }else{

                    setError(res.message)
                }
            })
        }
    };

    return (
        /* Added flex items-center justify-center to the backdrop overlay container */
       <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 mx-4 relative">
                
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute right-5 top-5 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-[#111827] mb-2">Verify Phone Number</h3>
                    
                    {otp_sent &&
                    
                        <p className="text-sm text-green-800 mb-2 font-semibold">
                            We sent a 6-digit confirmation code to <span className="font-semibold">{phone}</span>
                        </p>
                    }

                    {error !== '' &&
                            
                        <div className="bg-red-50 rounded-lg p-2 mb-2 px-9">
                            <p className="text-red-500 text-xs font-semibold">{error}</p>
                        </div>
                    }

                    <form onSubmit={handleVerifySubmit} className="w-full flex flex-col items-center mt-4">
                        <div className="flex gap-2.5 sm:gap-3 justify-center mb-6" onPaste={handlePaste}>

                            {otp.map((digit, index) => (

                                <input
                                    key={index}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={1}
                                    value={digit}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all text-[#1F2937]"
                                />
                            ))}
                        </div>

                        <div className="text-sm mb-8 text-gray-500 flex items-center justify-center flex-col">

                            {sending &&
                            
                                <div className="w-[30px] h-[30px] relative">
                                    <Loader loading={true} size={20} />
                                </div>
                            }

                            {timer > 0
                                ?
                                    (
                                        can_resend &&
                                            <p>Resend code in <span className="font-semibold text-gray-700">{timer}s</span></p>
                                    )
                                :
                                    (
                                        can_resend &&
                                        
                                            <Btn    
                                                size="small"
                                                onClick={() => {
                                                    
                                                    setResending(true)
                                                    sendSms()
                                                }}
                                                className="text-[#1D4ED8] font-semibold hover:underline bg-transparent border-none outline-none"
                                                loading={resend}
                                                endIcon={<ArrowRightAlt />}
                                            >
                                                Resend Code
                                            </Btn>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={otp.join('').length !== 6}
                            className="w-full py-4 bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold text-[15px] rounded-xl shadow-md transition-all duration-200"
                        >
                            Verify & Confirm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}