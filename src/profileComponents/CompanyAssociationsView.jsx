import React, { useMemo, useState } from 'react';

import {
    Business,
    ShieldOutlined,
    WarningAmberOutlined,
    LocationOnOutlined,
    PhoneOutlined,
    EmailOutlined
} from '@mui/icons-material';

function CompanyAssociationsView({ data = [] }) {

    const [activeFilter, setActiveFilter] = useState('ALL');

    const filters = [
        { label: 'See All', value: 'ALL' },
        { label: 'Address', value: 'ADDRESS' },
        { label: 'Email', value: 'EMAIL' },
        { label: 'Phone', value: 'PHONE' }
    ];

    const filteredData = useMemo(() => {
        return data || [];
    }, [data]);

    const getFilteredAssociations = (associations = []) => {

        if (activeFilter === 'ALL') {
            return associations;
        }

        if (activeFilter === 'ADDRESS') {
            return associations.filter(
                (item) => item.type === 'address'
            );
        }

        if (activeFilter === 'EMAIL') {
            return associations.filter(
                (item) => item.type === 'email'
            );
        }

        if (activeFilter === 'PHONE') {
            return associations.filter(
                (item) => item.type === 'phone'
            );
        }

        return associations;
    };

    const getAssociationIcon = (type) => {

        switch (type) {

            case 'address':
                return (
                    <div className='flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#eff6ff]'>
                        <LocationOnOutlined className='!text-[13px] text-[#2563eb]' />
                    </div>
                );

            case 'phone':
                return (
                    <div className='flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#eff6ff]'>
                        <PhoneOutlined className='!text-[13px] text-[#2563eb]' />
                    </div>
                );

            case 'email':
                return (
                    <div className='flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#eff6ff]'>
                        <EmailOutlined className='!text-[13px] text-[#2563eb]' />
                    </div>
                );

            default:
                return null;
        }
    };

    if (!filteredData.length) {
        return (
            <div className='rounded-[16px] border border-[#d9e1ee] bg-white p-[40px] text-center'>
                <p className='text-[13px] font-[600] text-[#94a3b8]'>
                    No Data Found
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-[20px]'>

            <div className='flex items-center justify-between'>
                <h2 className='text-[13px] font-[600] text-[#111827]'>
                    Company Associations
                </h2>

                <div className='flex items-center rounded-[8px] border border-[#d9e1ee] bg-white p-[2px]'>
                    {filters.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => setActiveFilter(item.value)}
                            className={`rounded-[6px] px-[14px] py-[7px] text-[10px] font-[600] transition-all ${activeFilter === item.value
                                    ? 'bg-[#2563eb] text-white'
                                    : 'bg-white text-[#64748b]'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {filteredData.map((company, index) => {

                const associationRows = getFilteredAssociations(
                    company.associations || []
                );

                return (
                    <div
                        key={index}
                        className='rounded-[18px] border border-[#d9e1ee] bg-white px-[20px] py-[22px]'
                    >

                        <div className='flex items-start justify-between gap-[20px]'>

                            <div>

                                <h2 className='text-[16px] font-[700] uppercase leading-[24px] text-[#2563eb]'>
                                    {company.company_name}
                                </h2>

                                <div className='mt-[10px] flex flex-wrap items-center gap-[8px]'>

                                    <div
                                        className={`flex items-center gap-[5px] rounded-[6px] px-[8px] py-[4px] ${company.authority
                                                ? 'bg-[#eff6ff]'
                                                : 'bg-[#f1f5f9]'
                                            }`}
                                    >
                                        <Business
                                            className={`!text-[13px] ${company.authority
                                                    ? 'text-[#2563eb]'
                                                    : 'text-[#94a3b8]'
                                                }`}
                                        />

                                        <span
                                            className={`text-[10px] font-[600] ${company.authority
                                                    ? 'text-[#2563eb]'
                                                    : 'text-[#94a3b8]'
                                                }`}
                                        >
                                            Authority
                                        </span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-[5px] rounded-[6px] px-[8px] py-[4px] ${company.insurance
                                                ? 'bg-[#eff6ff]'
                                                : 'bg-[#f1f5f9]'
                                            }`}
                                    >
                                        <ShieldOutlined
                                            className={`!text-[13px] ${company.insurance
                                                    ? 'text-[#2563eb]'
                                                    : 'text-[#94a3b8]'
                                                }`}
                                        />

                                        <span
                                            className={`text-[10px] font-[600] ${company.insurance
                                                    ? 'text-[#2563eb]'
                                                    : 'text-[#94a3b8]'
                                                }`}
                                        >
                                            Insurance
                                        </span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-[5px] rounded-[6px] px-[8px] py-[4px] ${company.high_risk
                                                ? 'bg-[#fff1f2]'
                                                : 'bg-[#f1f5f9]'
                                            }`}
                                    >
                                        <WarningAmberOutlined
                                            className={`!text-[13px] ${company.high_risk
                                                    ? 'text-[#ef4444]'
                                                    : 'text-[#94a3b8]'
                                                }`}
                                        />

                                        <span
                                            className={`text-[10px] font-[600] ${company.high_risk
                                                    ? 'text-[#ef4444]'
                                                    : 'text-[#94a3b8]'
                                                }`}
                                        >
                                            High Risk
                                        </span>
                                    </div>

                                </div>

                            </div>

                            <div className='flex items-center gap-[40px]'>

                                <div>
                                    <p className='text-[9px] font-[600] uppercase tracking-[0.8px] text-[#94a3b8]'>
                                        Annual Mileage
                                    </p>

                                    <div className='mt-[5px] flex items-end gap-[5px]'>
                                        <h3 className='text-[16px] font-[700] text-[#111827]'>
                                            {company.annual_mileage || '--'}
                                        </h3>

                                        <span className='mb-[1px] text-[9px] font-[600] uppercase text-[#94a3b8]'>
                                            MI
                                        </span>
                                    </div>
                                </div>

                                <div className='h-[42px] w-[1px] bg-[#e5e7eb]' />

                                <div>
                                    <p className='text-[9px] font-[600] uppercase tracking-[0.8px] text-[#94a3b8]'>
                                        Fleet Size
                                    </p>

                                    <div className='mt-[5px] flex items-end gap-[5px]'>
                                        <h3 className='text-[16px] font-[700] text-[#111827]'>
                                            {company.fleet_size || '--'}
                                        </h3>

                                        <span className='mb-[1px] text-[9px] font-[600] uppercase text-[#94a3b8]'>
                                            UNIT
                                        </span>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className='mt-[22px] grid grid-cols-3 gap-[14px]'>

                            <div className='rounded-[14px] border border-[#e5e7eb] bg-white px-[16px] py-[14px]'>

                                <p className='text-[10px] font-[600] uppercase tracking-[0.8px] text-[#94a3b8]'>
                                    MC NUMBER
                                </p>

                                <h3 className='mt-[8px] text-[22px] font-[700] text-[#111827]'>
                                    {company.mc_number || '--'}
                                </h3>

                            </div>

                            <div className='rounded-[14px] border border-[#e5e7eb] bg-white px-[16px] py-[14px]'>

                                <p className='text-[10px] font-[600] uppercase tracking-[0.8px] text-[#94a3b8]'>
                                    DOT NUMBER
                                </p>

                                <h3 className='mt-[8px] text-[22px] font-[700] text-[#111827]'>
                                    {company.dot_number || '--'}
                                </h3>

                            </div>

                            <div className='rounded-[14px] border border-[#e5e7eb] bg-white px-[16px] py-[14px]'>

                                <p className='text-[10px] font-[600] uppercase tracking-[0.8px] text-[#94a3b8]'>
                                    DUNS NUMBER
                                </p>

                                <h3 className='mt-[8px] text-[22px] font-[700] text-[#111827]'>
                                    {company.duns_number || '--'}
                                </h3>

                            </div>

                        </div>

                        <div className='mt-[16px] overflow-hidden rounded-[14px] border border-[#e5e7eb]'>

                            <div className='grid grid-cols-12 bg-[#f8fafc] px-[28px] py-[10px]'>

                                <div className='col-span-3'>
                                    <p className='text-[9px] font-[700] uppercase tracking-[1px] text-[#94a3b8]'>
                                        Association Type
                                    </p>
                                </div>

                                <div className='col-span-7'>
                                    <p className='text-[9px] font-[700] uppercase tracking-[1px] text-[#94a3b8]'>
                                        Entity Value
                                    </p>
                                </div>

                                <div className='col-span-2 flex '>
                                    <p className='text-[9px] font-[700] uppercase tracking-[1px] text-[#94a3b8]'>
                                        Observation Period
                                    </p>
                                </div>

                            </div>

                            {!associationRows.length ? (

                                <div className='flex items-center justify-center border-t border-[#eef2f7] py-[22px]'>

                                    <p className='text-[12px] font-[600] text-[#94a3b8]'>
                                        {activeFilter === 'EMAIL'
                                            ? 'No Email Found'
                                            : activeFilter === 'PHONE'
                                                ? 'No Phone Found'
                                                : activeFilter === 'ADDRESS'
                                                    ? 'No Address Found'
                                                    : 'No Data Found'}
                                    </p>

                                </div>

                            ) : (

                                associationRows.map((row, idx) => (

                                    <div
                                        key={idx}
                                        className='grid grid-cols-12 items-center border-t border-[#eef2f7] px-[28px] py-[14px]'
                                    >

                                        <div className='col-span-3 flex items-center gap-[10px]'>

                                            {getAssociationIcon(row.type)}

                                            <span className='text-[12px] font-[600] text-[#111827]'>
                                                {row.label}
                                            </span>

                                        </div>

                                        <div className='col-span-7'>

                                            <p className='text-[12px] font-[500] text-[#334155]'>
                                                {row.value}
                                            </p>

                                        </div>

                                        <div className='col-span-2 flex '>

                                            <div className='rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-[10px] py-[4px] text-[9px] font-[700] text-[#2563eb]'>
                                                {row.period}
                                            </div>

                                        </div>

                                    </div>
                                ))
                            )}

                        </div>

                    </div>
                );
            })}
        </div>
    );
}

export default CompanyAssociationsView;