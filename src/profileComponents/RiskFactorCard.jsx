import React from 'react';

import {
    CheckCircle,
    Cancel,
    ErrorOutlineOutlined
} from '@mui/icons-material';

function RiskFactorCard(props) {

    const isRisk =
        props.type === 'risk';

    const styles = {
        icon: isRisk
            ? <ErrorOutlineOutlined className='!text-[20px]' />
            : <CheckCircle className='!text-[20px]' />,

        iconWrapper: isRisk
            ? 'bg-[#fff5f5] text-[#ef4444]'
            : 'bg-[#ecfbf2] text-[#2f9e55]',

        badge: isRisk
            ? 'bg-[#fff5f5] text-[#ef4444]'
            : 'bg-[#ecfbf2] text-[#2f9e55]',

        bullet: isRisk
            ? (
                <Cancel className='!text-[18px] text-[#ef4444]' />
            )
            : (
                <CheckCircle className='!text-[18px] text-[#2ecc71]' />
            )
    };

    const items = Array.isArray(props.items)
        ? props.items
        : [];

    return (

        <div className='rounded-[16px] border border-[#d9e1ef] bg-white shadow-sm'>

            <div className='flex flex-col gap-[16px] border-b border-[#f1f5f9] px-[18px] py-[20px] sm:px-[24px] sm:py-[22px] xl:flex-row xl:items-center xl:justify-between xl:px-[32px] xl:py-[24px]'>

                <div className='flex items-center gap-[12px]'>

                    <div
                        className={`grid h-[40px] w-[40px] shrink-0 place-items-center rounded-full ${styles.iconWrapper}`}
                    >

                        {styles.icon}

                    </div>

                    <h3 className='text-[15px] font-[800] uppercase tracking-tight text-[#334155] sm:text-[16px] xl:text-[18px]'>

                        {props.title ?? 'NA'}

                    </h3>

                </div>

                <span
                    className={`w-fit rounded-full px-[14px] py-[6px] text-[10px] font-[800] uppercase tracking-wider sm:text-[11px] ${styles.badge}`}
                >

                    {props.badge ?? 'NA'}

                </span>

            </div>

            <div className='px-[18px] pb-[10px] sm:px-[24px] xl:px-[32px] xl:pb-[16px]'>

                <div className='grid grid-cols-1 gap-x-[40px] sm:grid-cols-2'>

                    {items.length > 0 ? (

                        items.map(function (item, idx) {

                            return (

                                <div
                                    key={idx}
                                    className='flex items-start gap-[12px] border-b border-[#f1f5f9] py-[18px] sm:items-center sm:py-[20px]'
                                >

                                    <div className='flex shrink-0 items-center'>

                                        {styles.bullet}

                                    </div>

                                    <span className='text-[13px] font-[500] leading-[1.5] text-[#4b5563] sm:text-[14px] sm:leading-none'>

                                        {item ?? 'NA'}

                                    </span>

                                </div>

                            );
                        })

                    ) : (

                        <div className='py-[24px] text-[14px] font-[500] text-[#64748b]'>

                            NA

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}

export default RiskFactorCard;