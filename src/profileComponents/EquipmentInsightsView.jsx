import React, { useMemo, useState } from 'react';

import {
    LocalShippingOutlined,
    DeveloperModeOutlined,
    KeyboardArrowLeftOutlined,
    KeyboardArrowRightOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined
} from '@mui/icons-material';

function EquipmentInsightsView({ data = {} }) {

    const [currentPage, setCurrentPage] = useState(1);

    const [isExpanded, setIsExpanded] = useState(false);

    const pageSize = isExpanded ? 6 : 4;

    const company = useMemo(function () {

        return data?.companies?.[0] || {};

    }, [data]);

    const equipmentStats = useMemo(function () {

        return {
            power_units: {
                avg_age:
                    data?.power_unit || 'NA',

                reported:
                    data?.power_unit || 'NA',

                observed: 'NA',

                external_obs: 'NA',

                other_fleet: 'NA',
            },

            trailers: {
                avg_age: 'NA',

                reported: 'NA',

                observed: 'NA',

                external_obs: 'NA',

                other_fleet: 'NA',
            },
        };

    }, [data]);

        const inspectionClassMap = {
        1: 'Full',
        2: 'Walk-around',
        3: 'Driver-Only',
        4: 'Special Study',
        5: 'Terminal',
        6: 'Radioactive'
    };

    function getInspectionLabel(value) {

        return inspectionClassMap[value] || 'NA';
    }

const equipmentRecords = useMemo(function () {

    const inspections =
        Array.isArray(data?.inspections)
            ? data.inspections
            : [];

    return inspections.flatMap(function (item, index) {

        const formattedDate =
            item?.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : 'NA';

        const records = [];

        // POWER UNIT / TRUCK
        if (
            item?.vin ||
            item?.unit_license ||
            item?.unit_make ||
            item?.unit_type_desc
        ) {

            records.push({
                id: `${index}-truck`,

                type: 'truck',

                vin: item?.vin || 'NA',

                plate: item?.unit_license || 'NA',

                classId: item?.insp_level_id ?? null,

                classLabel:
                    getInspectionLabel(item?.insp_level_id),

                description:
                    item?.unit_type_desc || 'NA',

                year: item?.unit_year || 'NA',

                make: item?.unit_make || 'NA',

                model: item?.report_state || 'NA',

                lastSeen: formattedDate
            });

        }

        // TRAILER
        if (
            item?.vin2 ||
            item?.unit_license2 ||
            item?.unit_make2 ||
            item?.unit_type_desc2
        ) {

            records.push({
                id: `${index}-trailer`,

                type: 'trailer',

                vin: item?.vin2 || 'NA',

                plate: item?.unit_license2 || 'NA',

                classId: item?.insp_level_id ?? null,

                classLabel:
                    getInspectionLabel(item?.insp_level_id),

                description:
                    item?.unit_type_desc2 || 'NA',

                year: item?.unit_year2 || 'NA',

                make: item?.unit_make2 || 'NA',

                model: item?.report_state || 'NA',

                lastSeen: formattedDate
            });

        }

        return records;

    });

}, [data]);

    const totalPages = Math.ceil(
        equipmentRecords.length / pageSize
    );

    const visibleRecords = useMemo(function () {

        return equipmentRecords.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );

    }, [
        equipmentRecords,
        currentPage,
        pageSize
    ]);

    const getEquipmentIcon = function (type) {

        if (type === 'trailer') {

            return (

                <div className='flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-[#eff6ff]'>

                    <DeveloperModeOutlined className='!text-[16px] text-[#2563eb]' />

                </div>

            );

        }

        return (

            <div className='flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-[#eff6ff]'>

                <LocalShippingOutlined className='!text-[16px] text-[#2563eb]' />

            </div>

        );

    };

    return (

        <div className='space-y-[22px] bg-white p-[12px]'>

            <div className='grid grid-cols-2 gap-[20px]'>

                <div className='rounded-[18px] border border-[#eef2f6] bg-white px-[24px] py-[22px]'>

                    <div className='flex items-center gap-[12px]'>

                        <div className='flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[#eff6ff]'>

                            <LocalShippingOutlined className='!text-[16px] text-[#2563eb]' />

                        </div>

                        <h3 className='text-[11px] font-[800] uppercase tracking-[1.5px] text-[#1e293b]'>
                            Power Units
                        </h3>

                    </div>

                    <div className='mt-[26px] grid grid-cols-5 gap-[4px]'>

                        <div>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.power_units?.avg_age || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Avg. Age
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.power_units?.reported || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Reported
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.power_units?.observed || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Observed
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.power_units?.external_obs || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Ext. Obs.
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#2563eb]'>
                                {equipmentStats?.power_units?.other_fleet || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.1px] text-[#94a3b8] leading-[11px]'>
                                Observed In
                                <br />
                                Other Fleets
                            </p>

                        </div>

                    </div>

                </div>


                <div className='rounded-[18px] border border-[#eef2f6] bg-white px-[24px] py-[22px]'>

                    <div className='flex items-center gap-[12px]'>

                        <div className='flex h-[32px] w-[32px] items-center justify-center rounded-[8px] bg-[#eff6ff]'>

                            <DeveloperModeOutlined className='!text-[16px] text-[#2563eb]' />

                        </div>

                        <h3 className='text-[11px] font-[800] uppercase tracking-[1.5px] text-[#1e293b]'>
                            Trailers
                        </h3>

                    </div>

                    <div className='mt-[26px] grid grid-cols-5 gap-[4px]'>

                        <div>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.trailers?.avg_age || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Avg. Age
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.trailers?.reported || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Reported
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.trailers?.observed || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Observed
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#0f172a]'>
                                {equipmentStats?.trailers?.external_obs || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.3px] text-[#94a3b8] leading-none'>
                                Ext. Obs.
                            </p>

                        </div>

                        <div className='border-l border-[#f1f5f9] pl-[16px]'>

                            <h2 className='text-[22px] font-[700] tracking-tight text-[#2563eb]'>
                                {equipmentStats?.trailers?.other_fleet || 'NA'}
                            </h2>

                            <p className='mt-[6px] text-[8.5px] font-[700] uppercase tracking-[0.1px] text-[#94a3b8] leading-[11px]'>
                                Observed In
                                <br />
                                Other Fleets
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div className='rounded-[18px] border border-[#eef2f6] bg-white'>

                <div className='flex items-center justify-between px-[24px] py-[20px]'>

                    <div className='space-y-[10px]'>

                        <h3 className='text-[13px] font-[700] text-[#334155]'>
                            Associated companies by equipment
                        </h3>

                        <div className='flex items-center gap-[10px]'>

                            <div className='rounded-[6px] bg-[#eff6ff] px-[8px] py-[4px] text-[9.5px] font-[800] uppercase tracking-[0.3px] text-[#2563eb]'>
                                {company?.companyType || 'NA'}
                            </div>

                            <p className='text-[13px] font-[700] text-[#0f172a]'>
                                {data?.company_name || 'NA'}
                            </p>

                            <p className='text-[11px] font-[500] text-[#94a3b8]'>
                                DOT {data?.dot_number || 'NA'}
                            </p>

                        </div>

                    </div>

                    <div className='flex items-center gap-[12px]'>

                        <p className='text-[10px] font-[800] uppercase tracking-[1px] text-[#94a3b8]'>
                            Page {String(currentPage).padStart(2, '0')} of {String(totalPages || 1).padStart(2, '0')}
                        </p>

                        <div className='flex items-center gap-[6px]'>

                            <button
                                disabled={currentPage === 1}
                                onClick={function () {

                                    setCurrentPage(function (p) {

                                        return Math.max(p - 1, 1);

                                    });

                                }}
                                className='flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white text-[#64748b] transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[#f8fafc]'
                            >

                                <KeyboardArrowLeftOutlined className='!text-[18px]' />

                            </button>

                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={function () {

                                    setCurrentPage(function (p) {

                                        return Math.min(p + 1, totalPages);

                                    });

                                }}
                                className='flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#e2e8f0] bg-white text-[#64748b] transition-all disabled:cursor-not-allowed disabled:opacity-30 hover:bg-[#f8fafc]'
                            >

                                <KeyboardArrowRightOutlined className='!text-[18px]' />

                            </button>

                        </div>

                    </div>

                </div>

                <div className='flex border-t border-[#f1f5f9] bg-[#f8fafc] px-[24px] py-[10px]'>

                    <div className='w-[10%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Type
                        </p>
                    </div>

                    <div className='w-[15%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            VIN
                        </p>
                    </div>

                    <div className='w-[15%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Plate
                        </p>
                    </div>

                    <div className='w-[10%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Class
                        </p>
                    </div>

                    <div className='w-[18%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Description
                        </p>
                    </div>

                    <div className='w-[10%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Year
                        </p>
                    </div>

                    <div className='w-[12%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Make
                        </p>
                    </div>

                    {/* <div className='w-[11%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Model
                        </p>
                    </div>

                    <div className='w-[11%]'>
                        <p className='text-[9.5px] font-[800] uppercase tracking-[0.5px] text-[#94a3b8]'>
                            Last Seen
                        </p>
                    </div> */}

                </div>

                {!visibleRecords.length ? (

                    <div className='flex items-center justify-center border-t border-[#f1f5f9] py-[45px]'>

                        <p className='text-[12px] font-[600] text-[#94a3b8]'>
                            No Equipment Records Found
                        </p>

                    </div>

                ) : (

                    visibleRecords.map(function (item, index) {

                        return (

                            <div
                                key={index}
                                className='flex items-center border-t border-[#f1f5f9] px-[24px] py-[13px] hover:bg-[#fcfdfe]'
                            >

                                <div className='w-[10%]'>
                                    {getEquipmentIcon(item.type)}
                                </div>

                                <div className='w-[15%] truncate pr-3 text-[12px] font-[600] text-[#2563eb]'>
                                    {item.vin}
                                </div>

                                <div className='w-[15%] text-[12px] font-[700] text-[#1e293b]'>
                                    {item.plate}
                                </div>

                                <div className='w-[10%]'>

                                   <div className='flex items-center gap-[6px]'>

                                <span className='text-[11px] font-[600] text-[#64748b]'>
                                    {item.classLabel}
                                </span>

                            </div>

                                </div>

                                <div className='w-[18%] text-[12px] font-[500] text-[#64748b]'>
                                    {item.description}
                                </div>

                                <div className='w-[10%] text-[12px] font-[700] text-[#0f172a]'>
                                    {item.year}
                                </div>

                                <div className='w-[15%] text-[12px] font-[500] text-[#94a3b8]'>
                                    {item.make}
                                </div>
{/* 
                                <div className='w-[11%] text-[12px] font-[500] text-[#64748b]'>
                                    {item.model}
                                </div>

                                <div className='w-[11%] text-[12px] font-[500] text-[#64748b]'>
                                    {item.lastSeen}
                                </div> */}

                            </div>

                        );

                    })

                )}

                <div className='flex justify-center border-t border-[#f1f5f9] py-[14px]'>

                    <button
                        onClick={function () {

                            setIsExpanded(!isExpanded);

                            setCurrentPage(1);

                        }}
                        className='flex items-center gap-[6px] rounded-[10px] border border-[#e2e8f0] px-[18px] py-[7px] text-[11.5px] font-[700] text-[#2563eb] transition-all hover:bg-[#eff6ff] hover:border-[#bfdbfe]'
                    >

                        {isExpanded
                            ? 'View Less Records'
                            : 'View More Records'}

                        {
                            isExpanded
                                ? <KeyboardArrowUpOutlined className='!text-[15px]' />
                                : <KeyboardArrowDownOutlined className='!text-[15px]' />
                        }

                    </button>

                </div>

            </div>

        </div>

    );
}

export default EquipmentInsightsView;