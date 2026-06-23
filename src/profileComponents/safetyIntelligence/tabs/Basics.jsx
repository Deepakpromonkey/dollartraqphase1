import React, { useState, useMemo } from 'react';

import {
	AreaChart,
	Area,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer
} from 'recharts';

import {
	CalendarMonth,
	IosShare,
	ErrorOutlined,
	Search,
	CheckCircle,
	Cancel,
	FilterList
} from '@mui/icons-material';

const CATEGORY_COLORS = {
	'UNSAFE DRIVING': {
		text: '#2563eb',
		bg: '#eff6ff',
		main: '#2563eb'
	},

	'HOS COMPL.': {
		text: '#d97706',
		bg: '#fffbeb',
		main: '#f59e0b'
	},

	'VEHICLE MAINT.': {
		text: '#dc2626',
		bg: '#fef2f2',
		main: '#ef4444'
	},

	'DRIVER FITNESS': {
		text: '#059669',
		bg: '#ecfdf5',
		main: '#10b981'
	},

	HAZMAT: {
		text: '#7c3aed',
		bg: '#f5f3ff',
		main: '#8b5cf6'
	},

	'CRASH INDICATOR': {
		text: '#334155',
		bg: '#f8fafc',
		main: '#64748b'
	}
};

const METRIC_CONFIG = [
	{
		key: 'unsafeDriving',
		label: 'UNSAFE DRIVING',
		color: '#2563eb'
	},

	{
		key: 'crashIndicator',
		label: 'CRASH INDICATOR',
		color: '#3b82f6'
	},

	{
		key: 'hosCompliance',
		label: 'HOS COMPLIANCE',
		color: '#dc2626'
	},

	{
		key: 'vehicleMaint',
		label: 'MAINTENANCE',
		color: '#b91c1c'
	},

	{
		key: 'controlledSubstances',
		label: 'DRUG & ALCOHOL',
		color: '#cbd5e1'
	},

	{
		key: 'driverFitness',
		label: 'DRIVER FITNESS',
		color: '#3b82f6'
	},

	{
		key: 'hazmat',
		label: 'HAZMAT COMPL.',
		color: '#2563eb'
	}
];

function Basics({ data }) {

	const [searchTerm, setSearchTerm] =
		useState('');

	const [page, setPage] =
		useState(1);

	const [selectedRange, setSelectedRange] =
		useState('12');

	const [expandedRow, setExpandedRow] =
		useState(null);
	const [activeLines, setActiveLines] = useState({
		unsafe: true,
		maint: true
	});


	const itemsPerPage = 3;

	const basics = data || {};


	const violationData =
		basics?.violation_details || [];

	const recentViolations =
		violationData.slice(0, 2);

	const filteredLogs = useMemo(function () {

		if (!searchTerm) {

			return violationData;

		}

		return violationData.filter(function (log) {

			return (
				(log?.basic_desc || '')
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||

				(log?.section_desc || '')
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||

				(log?.group_desc || '')
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||

				(log?.viol_code || '')
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			);

		});

	}, [searchTerm, violationData]);


	const filteredTrendData =
		useMemo(function () {

			const months =
				parseInt(selectedRange);

			const trendData =
				basics?.trendData || [];

			if (!months) {

				return trendData;

			}

			return trendData.slice(-months);

		}, [selectedRange, basics]);

	const totalPages = Math.ceil(
		filteredLogs.length / itemsPerPage
	);

	const startIndex =
		(page - 1) * itemsPerPage;

	const endIndex = Math.min(
		startIndex + itemsPerPage,
		filteredLogs.length
	);

	const paginatedData = filteredLogs.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	return (

		<div className='space-y-6 bg-[#f8fafc] p-6'>

			<div className='flex items-center justify-between'>

				<div>

					<h2 className='text-xl font-extrabold text-[#001b3d]'>

						Safety Performance

					</h2>

					<p className='mt-1 text-[12px] tracking-wide text-[#94a3b8]'>

						Real-time compliance monitoring and risk assessment

					</p>

				</div>

				<div className='flex gap-2'>

					<div className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-bold text-[#001b3d] shadow-sm'>

						<CalendarMonth sx={{ fontSize: 18 }} />

						October 2023

					</div>

					<button className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-[12px] font-bold text-[#001b3d] shadow-sm'>

						<IosShare sx={{ fontSize: 18 }} />

						EXPORT

					</button>

				</div>

			</div>

{/* METRICS */}

<div className='grid grid-cols-7 gap-4'>

    {METRIC_CONFIG.map(function (config) {

        const smsMeasures = basics?.sms_measures || {};
        const inspections = basics?.inspections || [];

        let rawValue = 0;

        switch (config.key) {

            case 'unsafeDriving':

                rawValue =
                    smsMeasures?.unsafe_driv_measure || 0;

                break;

            case 'crashIndicator':

                rawValue =
                    smsMeasures?.crash_ind_measure || 0;

                break;

            case 'hosCompliance':

                rawValue =
                    smsMeasures?.hos_driv_measure || 0;

                break;

            case 'vehicleMaint':

                rawValue =
                    smsMeasures?.veh_maint_measure || 0;

                break;

            case 'controlledSubstances':

                rawValue = inspections.reduce(
                    function (sum, item) {

                        return (
                            sum +
                            Number(
                                item?.subt_alcohol_viol || 0
                            )
                        );

                    },
                    0
                );

                break;

            case 'driverFitness':

                rawValue =
                    smsMeasures?.driv_fit_measure || 0;

                break;

            case 'hazmat':

                rawValue = inspections.reduce(
                    function (sum, item) {

                        return (
                            sum +
                            Number(
                                item?.hm_viol || 0
                            )
                        );

                    },
                    0
                );

                break;

            default:

                rawValue = 0;

                break;

        }

        const roundedValue = Math.round(
            Number(rawValue) || 0
        );

        return (

            <div
                key={config.key}
                className='rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm'
            >

                <p className='mb-2 text-[10px] font-semibold uppercase text-[#94a3b8]'>

                    {config.label}

                </p>

                <span className='text-[20px] font-extrabold text-[#001b3d]'>

                    {roundedValue}

                </span>

                <div className='mt-6 h-[6px] w-full overflow-hidden rounded-full bg-slate-100'>

                    <div
                        className='h-full rounded-full'
                        style={{
                            width: `${Math.min(
                                roundedValue,
                                100
                            )}%`,
                            backgroundColor:
                                config.color
                        }}
                    />

                </div>

            </div>

        );

    })}

</div>

			<div className='flex items-center justify-between rounded-2xl border border-[#fecaca] bg-[#fff1f2] px-6 py-4'>

				<div className='flex items-center gap-3 text-[13px] font-extrabold text-[#991b1b]'>

					<ErrorOutlined sx={{ fontSize: 22 }} />

					Critical Maintenance Warning:

					{' '}

					{basics?.criticalWarning ||
						'No warnings available'}

				</div>

				<button className='rounded-xl border border-[#fecaca] bg-white px-6 py-2 text-[11px] font-[900] uppercase tracking-wider text-[#991b1b]'>

					View List

				</button>

			</div>

			<div className='grid grid-cols-12 gap-6'>

				<div className='col-span-8 flex flex-col rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-sm'>

					<div className='mb-8 flex items-center justify-between'>

						<div>

							<h3 className='text-[17px] font-[900] text-[#001b3d]'>

								Basic Measures Trend

							</h3>

							<p className='text-[12px] text-slate-400'>

								Historical percentile scores by month

							</p>

						</div>

						<select
							value={selectedRange}
							onChange={function (e) {

								setSelectedRange(
									e.target.value
								);

							}}
							className='rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-2 text-[12px] font-bold text-[#475569] outline-none'
						>

							<option value='12'>
								Last 12 Months
							</option>

							<option value='6'>
								Last 6 Months
							</option>

							<option value='3'>
								Last 3 Months
							</option>

						</select>

					</div>

					{(() => {

						const smsMeasures =
							basics?.sms_measures || {};

						const unsafeDrivingMeasure =
							parseFloat(
								smsMeasures?.unsafe_driv_measure || 0
							);

						const vehMaintMeasure =
							parseFloat(
								smsMeasures?.veh_maint_measure || 0
							);


						return (

							<>

								<div className='h-[360px] w-full'>

									<ResponsiveContainer width='100%' height='100%'>
										{(() => {
											const inspections = basics?.inspections || [];

											const monthNames = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

											const monthMap = {};
											monthNames.forEach(function (m) {
												monthMap[m] = {
													month: m,
													unsafe: 0,
													maint: 0
												};
											});

											inspections.forEach(function (item, index) {
												let month = 'Jan';
												if (item?.insp_date && !item?.insp_date.includes('-000001')) {
													const date = new Date(item.insp_date);
													month = date.toLocaleString('default', { month: 'short' });
												} else {
													month = monthNames[index % 12];
												}

												if (monthMap[month]) {
													monthMap[month].unsafe += Number(item?.unsafe_viol || 0);
													monthMap[month].maint += Number(item?.vh_maint_viol || 0);
												}
											});

											const chartData = monthNames.map(m => monthMap[m]);

											const CustomDot = (props) => {
												const { cx, cy, stroke } = props;
												if (!cx || !cy) return null;
												return (
													<svg x={cx - 6} y={cy - 6} width={12} height={12} viewBox="0 0 12 12">
														<circle cx="6" cy="6" r="4" fill="#ffffff" stroke={stroke} strokeWidth={2} />
													</svg>
												);
											};

											return (
												<AreaChart
													data={chartData}
													margin={{
														top: 25,
														right: 30,
														left: -15,
														bottom: 10
													}}
												>
													<defs>
														
														<linearGradient id='unsafeGradient' x1='0' y1='0' x2='0' y2='1'>
															<stop offset='0%' stopColor='#2563eb' stopOpacity={0.12} />
															<stop offset='100%' stopColor='#2563eb' stopOpacity={0.00} />
														</linearGradient>
														
														<linearGradient id='maintGradient' x1='0' y1='0' x2='0' y2='1'>
															<stop offset='0%' stopColor='#94a3b8' stopOpacity={0.04} />
															<stop offset='100%' stopColor='#94a3b8' stopOpacity={0.00} />
														</linearGradient>
													</defs>

													<CartesianGrid
														vertical={false}
														stroke='#f1f5f9'
													/>

													<XAxis
														dataKey='month'
														axisLine={false}
														tickLine={false}
														tick={{ fill: '#94a3b8', fontSize: 12 }}
														dy={12}
													/>

													<YAxis
														axisLine={false}
														tickLine={false}
														tick={{ fill: '#94a3b8', fontSize: 12 }}
														dx={-10}
													/>

													<Tooltip />

													{activeLines.unsafe && (
														<Area
															type='monotone'
															dataKey='unsafe'
															stroke='#2563eb'
															strokeWidth={2.5}
															fill='url(#unsafeGradient)'
															dot={<CustomDot stroke="#2563eb" />}
															activeDot={{ r: 6, fill: '#2563eb' }}
														/>
													)}

													{activeLines.maint && (
														<Area
															type='monotone'
															dataKey='maint'
															stroke='#94a3b8'
															strokeDasharray='4 4'
															strokeWidth={1.5}
															fill='url(#maintGradient)'
															dot={<CustomDot stroke="#2563eb" />}
															activeDot={{ r: 5, fill: '#94a3b8' }}
														/>
													)}
												</AreaChart>
											);
										})()}
									</ResponsiveContainer>

								</div>

								<div className='mt-6 flex items-center justify-center gap-8 border-t border-slate-100 pt-6'>

									<button
										onClick={function () {

											setActiveLines({
												...activeLines,
												unsafe:
													!activeLines.unsafe
											});

										}}
										className='flex items-center gap-3'
									>

										<div
											className={`h-4 w-4 rounded-full ${activeLines.unsafe
												? 'bg-blue-700'
												: 'bg-slate-300'
												}`}
										/>

										<span
											className={`text-[15px] font-bold ${activeLines.unsafe
												? 'text-slate-700'
												: 'text-slate-300'
												}`}
										>

											Unsafe Driving

										</span>

									</button>

									{/* MAINT */}

									<button
										onClick={function () {

											setActiveLines({
												...activeLines,
												maint:
													!activeLines.maint
											});

										}}
										className='flex items-center gap-3'
									>

										<div
											className={`h-4 w-4 rounded-full ${activeLines.maint
												? 'bg-slate-300'
												: 'bg-slate-200'
												}`}
										/>

										<span
											className={`text-[15px] font-bold ${activeLines.maint
												? 'text-slate-700'
												: 'text-slate-300'
												}`}
										>

											Maintenance

										</span>

									</button>

									<div className='flex items-center gap-3 opacity-40'>

										<div className='h-4 w-4 rounded-full bg-slate-200' />

										<span className='text-[15px] font-bold text-slate-300'>

											Crash Indicator

										</span>

									</div>

								</div>

							</>

						);

					})()}

				</div>

                <div className='col-span-4 flex flex-col rounded-[24px] border border-[#e2e8f0] bg-white p-6 shadow-sm'>

                    <div className='mb-9 flex items-center justify-between'>

                        <h3 className='text-[14px] font-[900] text-[#001b3d]'>

                            Recent Violations

                        </h3>

                        {recentViolations && recentViolations.length > 0 && (
                            <button
                                onClick={function () {

                                    const tableSection =
                                        document.getElementById(
                                            'comprehensive-log'
                                        );

                                    if (tableSection) {

                                        tableSection.scrollIntoView({
                                            behavior: 'smooth'
                                        });

                                    }

                                }}
                                className='text-[11px] font-black uppercase tracking-tighter text-blue-600'
                            >

                                View All

                            </button>
                        )}

                    </div>

                    <div className='space-y-6'>

                        {recentViolations && recentViolations.length > 0 ? (

                            recentViolations.map(
                                function (v, index) {

                                    const severity =
                                        Math.round(
                                            Number(
                                                v?.severity_weight || 0
                                            )
                                        );

                                    const category =
                                        v?.basic_desc || '';

                                    const categoryStyle =
                                        CATEGORY_COLORS[
                                        category
                                        ] || {
                                            text: '#64748b',
                                            bg: '#f8fafc'
                                        };

                                    return (

                                        <div
                                            key={index}
                                            className='border-b border-slate-100 pb-5 last:border-0'
                                        >

                                            <div className='mb-3 flex items-center justify-between'>

                                                <span
                                                    style={{
                                                        color:
                                                            categoryStyle.text,

                                                        backgroundColor:
                                                            categoryStyle.bg
                                                    }}
                                                    className='rounded-lg px-3 py-1 text-[10px] font-black uppercase'
                                                >

                                                    {category || '--'}

                                                </span>

                                                <span className='text-[12px] text-slate-400'>

                                                    {v?.insp_date || '--'}

                                                </span>

                                            </div>

                                            <p className='mb-5 text-[14px] font-[900] leading-snug text-[#0f172a]'>

                                                {v?.section_desc || '--'}

                                            </p>

                                            <div className='flex items-center gap-3'>

                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-black ${severity >= 8
                                                        ? 'bg-red-600 text-white'
                                                        : severity >= 5
                                                            ? 'border border-red-200 bg-red-50 text-red-500'
                                                            : 'border border-yellow-200 bg-yellow-50 text-yellow-600'
                                                        }`}
                                                >

                                                    {severity}

                                                </div>

                                                <p className='text-[13px] font-semibold text-slate-500'>

                                                    {v?.viol_code || '--'}

                                                </p>

                                            </div>

                                        </div>

                                    );

                                }
                            )

                        ) : (

                            <div className='flex flex-col items-center justify-center py-12 text-center'>
                                
                                <p className='text-[14px] font-bold text-slate-700'>
                                    No Violations Found
                                </p>
                                
                                <p className='mt-1 text-[12px] text-slate-400'>
                                    This carrier currently has a clean record.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

			</div>

			{/* TABLE */}

			<div
                id='comprehensive-log'
                className='overflow-hidden rounded-[24px] border border-[#e2e8f0] bg-white shadow-sm'
            >

                <div className='flex items-center justify-between border-b border-slate-100 p-8'>

                    <div>

                        <h3 className='text-[16px] font-[900] text-[#001b3d]'>

                            Comprehensive Log

                        </h3>

                        <p className='mt-1 text-[13px] text-slate-400'>

                            Filter and export violation history

                        </p>

                    </div>

                    <div className='flex items-center gap-3'>

                        <div className='relative'>

                            <Search className='absolute left-4 top-1/2 !text-[20px] -translate-y-1/2 text-slate-400' />

                            <input
                                type='text'
                                placeholder='Search by ID, driver, or type...'
                                value={searchTerm}
                                onChange={function (e) {

                                    setSearchTerm(
                                        e.target.value
                                    );

                                    setPage(1);

                                }}
                                className='w-[320px] rounded-2xl border-0 py-3 pl-12 pr-4 text-[13px] outline-none ring-1 ring-slate-200 focus:ring-blue-500'
                            />

                        </div>

                        <button className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] font-bold text-slate-500 shadow-sm hover:bg-slate-50'>

                            <FilterList
                                sx={{
                                    fontSize: 18
                                }}
                            />

                            Filters

                        </button>

                    </div>

                </div>

                {paginatedData && paginatedData.length > 0 ? (
                    <>
                        <table className='w-full'>

                            <thead className='border-b border-slate-100 bg-[#f8fafc]'>

                                <tr>

                                    <th className='px-8 py-5 text-left text-[11px] font-black text-slate-400'>
                                        Date
                                    </th>

                                    <th className='px-8 py-5 text-left text-[11px] font-black text-slate-400'>
                                        BASIC Category
                                    </th>

                                    <th className='px-8 py-5 text-left text-[11px] font-black text-slate-400'>
                                        Subgroup
                                    </th>

                                    <th className='px-8 py-5 text-left text-[11px] font-black text-slate-400'>
                                        Violation Description
                                    </th>

                                    <th className='px-8 py-5 text-left text-[11px] font-black text-slate-400'>
                                        Severity
                                    </th>

                                    <th className='px-8 py-5 text-center text-[11px] font-black text-slate-400'>
                                        OOS Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {paginatedData.map(function (
                                    log,
                                    idx
                                ) {

                                    const severity =
                                        Math.round(
                                            Number(
                                                log?.severity_weight || 0
                                            )
                                        );

                                    const isOOS =
                                        log?.oos_violation === true ||
                                        log?.oos_violation === 'true' ||
                                        log?.oos_violation === 1;

                                    const fullDescription =
                                        log?.section_desc || '--';

                                    const isExpanded =
                                        expandedRow === idx;

                                    const shortDescription =
                                        fullDescription.length > 55 &&
                                            !isExpanded
                                            ? `${fullDescription.slice(
                                                0,
                                                55
                                            )}...`
                                            : fullDescription;

                                    const category =
                                        log?.basic_desc || '';

                                    const categoryStyle =
                                        CATEGORY_COLORS[
                                        category
                                        ] || {
                                            text: '#64748b',
                                            bg: '#f8fafc'
                                        };

                                    return (

                                        <tr
                                            key={idx}
                                            className='border-b border-slate-100'
                                        >

                                            <td className='px-8 py-6 text-[14px] font-bold text-[#475569]'>

                                                {log?.insp_date || '--'}

                                            </td>

                                            <td className='px-8 py-6'>

                                                <span
                                                    style={{
                                                        color:
                                                            categoryStyle.text,

                                                        backgroundColor:
                                                            categoryStyle.bg
                                                    }}
                                                    className='rounded-lg px-3 py-1 text-[11px] font-black uppercase'
                                                >

                                                    {category || '--'}

                                                </span>

                                            </td>

                                            <td className='px-8 py-6 text-[14px] font-medium text-slate-500'>

                                                {log?.group_desc || '--'}

                                            </td>

                                            <td className='px-8 py-6 text-[14px] font-[800] text-[#0f172a]'>

                                                {shortDescription}

                                                {fullDescription.length >
                                                    55 && (

                                                        <button
                                                            onClick={function () {

                                                                setExpandedRow(
                                                                    isExpanded
                                                                        ? null
                                                                        : idx
                                                                );

                                                            }}
                                                            className='ml-2 text-[12px] font-bold text-blue-600'
                                                        >

                                                            {isExpanded
                                                                ? 'Show Less'
                                                                : 'More'}

                                                        </button>

                                                    )}

                                            </td>

                                            <td className='px-8 py-6'>

                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-black ${severity >= 8
                                                        ? 'bg-red-600 text-white'
                                                        : severity >= 5
                                                            ? 'border border-red-200 bg-red-50 text-red-500'
                                                            : 'border border-yellow-200 bg-yellow-50 text-yellow-600'
                                                        }`}
                                                >

                                                    {severity}

                                                </div>

                                            </td>

                                            <td className='px-8 py-6 text-center'>

                                                {isOOS ? (

                                                    <CheckCircle
                                                        sx={{
                                                            color: '#10b981',
                                                            fontSize: 28
                                                        }}
                                                    />

                                                ) : (

                                                    <Cancel
                                                        sx={{
                                                            color: '#dc2626',
                                                            fontSize: 28
                                                        }}
                                                    />

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                        <div className='flex items-center justify-between border-t border-slate-100 px-8 py-5'>

                            <p className='text-[13px] text-slate-500'>

                                Showing {startIndex + 1}-
                                {endIndex} of{' '}
                                {filteredLogs.length} results

                            </p>

                            <div className='flex items-center gap-2'>

                                <button
                                    disabled={page === 1}
                                    onClick={function () {

                                        setPage(page - 1);

                                    }}
                                    className='rounded-lg border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-500 disabled:opacity-40'
                                Amination>

                                    Previous

                                </button>

                                <button
                                    disabled={
                                        page === totalPages
                                    }
                                    onClick={function () {

                                        setPage(page + 1);

                                    }}
                                    className='rounded-lg border border-slate-200 px-4 py-2 text-[12px] font-semibold text-slate-500 disabled:opacity-40'
                                >

                                    Next

                                </button>

                            </div>

                        </div>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center border-t border-slate-100 py-10 text-center'>
                        
                        <p className='text-[15px] font-[900] text-slate-700'>
                            No Logs Found
                        </p>
                        
                        <p className='mt-1 text-[13px] text-slate-400'>
                            {searchTerm ? 'Try refining your search terms or filters.' : 'There are no items recorded in this layout.'}
                        </p>

                    </div>
                )}

            </div>

		</div>

	);
}

export default Basics;