import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import DataTable from 'components/wd/data_table/DataTable';

import Main from 'components/Main';

import Btn from 'components/Btn';

import Api from 'api/Api';

import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';

import ChevronRight from '@mui/icons-material/ChevronRight';

import ArrowForward from '@mui/icons-material/ArrowForward';

import OpenInNew from '@mui/icons-material/OpenInNew';

import Edit from '@mui/icons-material/Edit';

import { format } from 'date-fns';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {

            account_token: false,
            user: false,

            initing: true,
            user_subscribed_plan: false,

            logged_in: false,

            error_message: '',
            success_message: '',

            active_row: false
        }
    }

    componentDidMount = () => {

        const account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        const user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

        if (account_token) {

            this.setState({ account_token: account_token, logged_in: true }, () => {

                this.init(account_token);
            });
        }

        if (user) {

            const parsedUser = JSON.parse(user);
            this.setState({ user: parsedUser });
            
            if (parsedUser && parsedUser.hasOwnProperty('plan')) {

                this.setState({ user_subscribed_plan: parsedUser.plan });
            }
        }
    };

    init = (account_token) => {

        const formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('page', 'dashboard');

        this.setState({ initing: true });

        Api.post('app/customer/load', formData, (data) => {

            this.setState({ initing: false });

            if (data.status) {

                this.setState({ user: data.customer });

                if (data.customer.hasOwnProperty('plan')) {

                    this.setState({ user_subscribed_plan: data.customer.plan });
                }

                localStorage.setItem(import.meta.env.VITE_ACCOUNT_USER, JSON.stringify(data.customer));
            }
        });
    };

    render() {

        const now = new Date();
        const dayNum = format(now, 'd');
        const dayName = format(now, 'EEEE').toUpperCase();
        const monthYear = format(now, 'MMMM, yyyy');

        const consumedLoads = this.state.user ? (this.state.user.consumed_loads || 0) : 0;
        const loadsLimit = this.state.user_subscribed_plan ? (this.state.user_subscribed_plan.loads_limit || 0) : 0;
        const loadsUsed = this.state.user_subscribed_plan ? (this.state.user_subscribed_plan.consumed || 0) : 0;
        const loadsPercent = loadsLimit > 0 ? Math.round((loadsUsed / loadsLimit) * 100) : 0;

        const activeShipments = this.state.user ? (this.state.user.active_shipments || 0) : 0;
        const deliveredShipments = this.state.user ? (this.state.user.delivered_shipments || 0) : 0;
        const delayedShipments = this.state.user ? (this.state.user.delayed_shipments || 0) : 0;

        return (

            <Main
                page="dashboard"
                active_page="dashboard"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
                title=""
            >
                <div className="flex items-center justify-between mb-6">

                    <h1 className="text-[32px] font-normal text-[#1a1a1a] m-0 tracking-[-0.5px]">
                        Overview <strong className="font-bold">Dashboard</strong>
                    </h1>

                    <div className="flex items-center gap-3.5 bg-white border border-[#e5e5e5] rounded-[14px] py-2.5 px-5">

                        <div className="text-center min-w-[42px]">

                            <div className="text-[32px] font-bold text-[#185FA5] line-height-1">{dayNum}</div>
                            <div className="text-[9px] text-[#888] font-semibold tracking-[0.5px]">{dayName}</div>
                        </div>

                        <div className="border-l border-[#e5e5e5] h-12 mx-0.5" />

                        <div>
                            <div className="text-xs font-bold text-[#333]">{monthYear}</div>

                            <div className="flex items-center gap-1.5 mt-1">

                                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
                                <span className="text-[11px] text-[#565E74] font-medium">Service Operational</span>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-[1fr_380px] gap-5 mb-8">

                    <div className="bg-white rounded-2xl border border-[#e8e8e8] p-8 pb-6 flex flex-col justify-between">

                        <div className="flex justify-between items-start">

                            <div>

                                <div className="text-[11px] font-bold tracking-[1.8px] text-[#404752] uppercase">
                                    Logistics Performance
                                </div>

                                <div className="text-xs text-[#8a94a6] mt-2.5">
                                    Real-time tracking and delivery analytics for the current cycle.
                                </div>

                            </div>

                            <span className="flex items-center gap-1 text-[10px] font-bold text-[#185FA5] border border-[#cbd5e1] rounded-[20px] py-0.5 px-2.5 bg-[#f8fafc]">

                                <span className="w-1 h-1 rounded-full bg-[#185FA5]" />
                                LIVE
                            </span>

                        </div>

                        <div className="flex items-center gap-4 my-8">

                            <span className="text-[75px] font-extrabold text-[#0f172a] leading-none tracking-[-1px]">
                                {consumedLoads}
                            </span>

                            <div className="flex flex-col justify-center">

                                <div className="text-[26px] font-bold text-[#64748B] leading-[1.2]">Shipments</div>
                                <div className="text-xs text-[#0284c7] font-semibold mt-1">Processed Successfully</div>

                            </div>
                            
                            <div className="ml-auto flex flex-col items-end text-right gap-0.5">

                                <div className="flex items-center gap-1.5 text-medium text-[#185FA5] font-bold">
                                    <CheckCircleOutlined style={{ fontSize: 16 }} />
                                    Efficiency target met
                                </div>

                                <span className="text-[#404752] text-[11px] font-medium">Processed Successfully</span>
                            </div>

                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            
                            <div className="bg-[#f4f5f7] p-3.5 px-4.5 border border-transparent rounded-xl">

                                <div className="text-[10px] font-bold tracking-[0.5px] text-[#8a94a6] uppercase mb-1.5">Active</div>

                                <div className="text-2xl font-bold text-[#1e293b]">
                                    {String(activeShipments).padStart(2, '0')}
                                </div>

                            </div>

                            <div className="bg-[#f4f5f7] p-3.5 px-4.5 border border-transparent rounded-xl">
                                
                                <div className="text-[10px] font-bold tracking-[0.5px] text-[#8a94a6] uppercase mb-1.5">Delivered</div>

                                <div className="text-2xl font-bold text-[#1e293b]">
                                    {String(deliveredShipments).padStart(2, '0')}
                                </div>

                            </div>

                            <div className="bg-[#F2F4F6] p-3.5 px-4.5 border border-[#BA1A1A1A] rounded-xl">

                                <div className="text-[10px] font-bold tracking-[0.5px] text-[#dc2626] uppercase mb-1.5">Delayed</div>

                                <div className="text-2xl font-bold text-[#b91c1c]">
                                    {String(delayedShipments).padStart(2, '0')}
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="bg-[#005EA4] rounded-2xl p-6 text-white flex flex-col justify-between relative min-h-[280px]">

                        <button className="absolute top-4 right-4 bg-white/10 border-none rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer">
                        
                            <SettingsOutlined style={{ fontSize: 18, color: '#fff' }} />
                        </button>

                        <div>

                            <div className="text-[10px] font-semibold tracking-wider uppercase opacity-60 mb-1.5">
                                Account Status
                            </div>

                            <h2 className="text-[28px] font-bold text-white m-0 tracking-[-0.5px]">
                                {this.state.user_subscribed_plan ? this.state.user_subscribed_plan.title : 'Demo Plan'}
                            </h2>

                            <p className="text-xs opacity-75 mt-2.5 leading-normal">

                                {!this.state.user_subscribed_plan || this.state.user_subscribed_plan?.is_demo === '1'
                                    ? 'You are currently using the trial environment. Upgrade to unlock cross-border automation.'
                                    : (this.state.user_subscribed_plan?.sub_title && this.state.user_subscribed_plan.sub_title.trim() !== '' && this.state.user_subscribed_plan.sub_title !== 'Try DollarTraq'
                                        ? this.state.user_subscribed_plan.sub_title 
                                        : 'Your premium plan features are active.')}

                            </p>
                        </div>

                        <div className="my-5">

                            <div className="flex justify-between text-[11px] font-semibold opacity-90 mb-2">
                                <span className="uppercase tracking-wider">Loads Utilization</span>
                                <span>{loadsUsed} of {loadsLimit  } Used</span>
                            </div>
                            
                            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                                <div 
                                    className="bg-white rounded-full h-full transition-all duration-500 ease-in-out"
                                    style={{ width: `${loadsPercent}%` }} 
                                />
                            </div>

                        </div>

                        <div className="flex flex-col gap-3">

                            <Link to="/subscriptions" className="block text-center bg-white text-[#185FA5] text-xs font-bold rounded-lg py-3.5 no-underline">
                                Upgrade to Professional
                            </Link>

                            <Link to="/subscriptions" className="flex items-center justify-center gap-1 text-xs font-semibold text-white/85 no-underline">
                                View Plan Details <ChevronRight style={{ fontSize: 16 }} />
                            </Link>

                        </div>

                    </div>

                </div>

                <div className="flex items-center justify-between mb-4">

                    <div className="flex items-center gap-2.5">
                        <span className="text-lg font-bold text-[#1a1a1a]">Recent Activity</span>
                        <span className="text-[10px] font-bold bg-[#eef0f2] border border-[#dcdfe3] rounded py-0.5 px-2 text-[#616e7c]">LAST 24H</span>
                    </div>

                    <a href="#" className="flex items-center gap-1 text-xs font-semibold text-[#185FA5] no-underline">
                        Full Activity Log <OpenInNew style={{ fontSize: 14 }} />
                    </a>

                </div>

                <DataTable
                    index="dashboard_shipments"
                    label="Shipments"
                    active_row={this.state.active_row}
                    columns={[
                        { name: 'Shipment ID',  column: 'shipment_number',  sortable: true },
                        { name: 'Carrier',      column: 'shippment_carrier', sortable: true },
                        { name: 'Load No.',     column: 'load_no',           sortable: true },
                        { name: 'Method',       column: 'tracking_method',   sortable: true },
                        { name: 'Contact',      column: 'contact',           sortable: true },
                        { name: 'Driver Auth',  column: 'driver_auth',       sortable: true },
                        { name: 'Status',       column: 'status',            sortable: true },
                    ]}

                    row_actions={(row) => (
                        <div className="hoverable-action">
                            <div className="align-start flex items-center gap-2">
                                <Btn
                                    to={`/shipment/${row.row_id}`}
                                    size="small"
                                    color="primary"
                                    startIcon={<Edit style={{ fontSize: 14 }} />}
                                >
                                    Edit
                                </Btn>
                                <Btn
                                    to={`/shipment/${row.row_id}`}
                                    size="small"
                                    color="default"
                                >
                                    <ArrowForward style={{ fontSize: 14 }} />
                                </Btn>
                            </div>
                        </div>
                    )}
                    default_sort_by="added_on"
                    api_url="app/shipment/dashboard_recent"
                    account_token={this.state.account_token}
                    row_id="row_id"
                />
            </Main>
        );
    }
}

export default Dashboard;