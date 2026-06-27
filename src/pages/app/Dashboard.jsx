import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
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
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Chat from '@mui/icons-material/Chat';
import LayoutHelper from 'helpers/LayoutHelper';

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
            active_row: false,
            aiQuery: '',

            // shipment totals from API
            all_shipment: 0,
            pending_shipment: 0,
            active_shipment: 0,
            awaiting_pickup: 0,
            in_transit: 0,
            delivered: 0,

            // data needed by the action-centre style DataTable
            shipments_carriers: [],
            tracking_methods: [],
            status: [],
            status_colors: [],
            sending_request: false,
            do_reload: false,
            init_chat: false,

            redirect: false,
        }
    }

    componentDidMount = () => {
        const account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        const user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

        if (account_token) {
            this.setState({ account_token: account_token, logged_in: true }, () => {
                this.init(account_token);
                this.loadShipmentTotals(account_token);
                this.initActionCentre(account_token);
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

    loadShipmentTotals = (account_token) => {
        const formData = new FormData();
        formData.append('account_token', account_token);

        Api.post('app/shipment/load_search_total', formData, (data) => {
            if (data.status) {
                this.setState({
                    all_shipment:     data.all_shipment     || 0,
                    pending_shipment: data.pending_shipment || 0,
                    active_shipment:  data.active_shipment  || 0,
                    awaiting_pickup:  data.awaiting_pickup  || 0,
                    in_transit:       data.in_transit       || 0,
                    delivered:        data.delivered        || 0,
                });
            }
        });
    };

    // Same init used by ActionCentre — populates the dropdown/search data
    // and status colors that the action-centre style columns rely on.
    initActionCentre = (account_token) => {
        const formData = new FormData();
        formData.append('account_token', account_token);

        Api.post('app/action_centre/init', formData, (data) => {
            if (data.status) {
                this.setState({
                    shipments_carriers: data.shipments_carriers,
                    tracking_methods: data.tracking_methods,
                    status: data.status,
                    status_colors: data.status_colors
                });
            }
        });
    };

    updateActionCentre = (row) => {
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('shipment_row_id', row.shipment_row_id);

        this.setState({ sending_request: row.shipment_row_id });

        Api.post('drivers/request/send', formData, (data) => {
            if (data.status) {
                this.setState({ do_reload: true, sending_request: false });
                LayoutHelper.addSuccessMessage(this, data.message);
            } else {
                this.setState({ do_reload: true, sending_request: false });
                LayoutHelper.addErrorMessage(this, data.message);
            }
        });
    };

    render() {

        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }

        const now = new Date();
        const dayNum    = format(now, 'd');
        const dayName   = format(now, 'EEEE').toUpperCase();
        const monthYear = format(now, 'MMMM, yyyy');

        const consumedLoads  = this.state.user ? (this.state.user.consumed_loads || 0) : 0;
        const loadsLimit     = this.state.user_subscribed_plan ? (this.state.user_subscribed_plan.loads_limit || 0) : 0;
        const loadsUsed      = this.state.user_subscribed_plan ? (this.state.user_subscribed_plan.consumed    || 0) : 0;
        const loadsPercent   = loadsLimit > 0 ? Math.round((loadsUsed / loadsLimit) * 100) : 0;

        // use API values for shipment stats
        const activeShipments    = this.state.active_shipment;
        const deliveredShipments = this.state.delivered;
        const delayedShipments   = this.state.pending_shipment;

        return (
            <Main
                page="dashboard"
                active_page="dashboard"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
                title=""
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-[32px] font-normal text-[#1a1a1a] m-0 tracking-[-0.5px]">
                            Overview <strong className="font-bold text-[#185FA5]">Dashboard</strong>
                        </h1>
                        <p className="text-sm text-[#71717a] mt-1.5 m-0">
                            Real-time vetting, tracking and payment analytics for your carrier network.
                        </p>
                    </div>

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

                {/* AI Bar */}
                <div className="bg-white border border-[#edf0f2] rounded-2xl p-2.5 flex items-center justify-between gap-4 mb-6 shadow-sm">
                    <div className="flex items-center gap-3 pl-2.5 flex-1">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
                        </span>
                        <span className="text-sm text-[#7c8ba1] font-medium mr-1 whitespace-nowrap">Ask the Concierge —</span>
                        <input
                            type="text"
                            className="w-full bg-transparent border-none outline-none text-sm text-[#1a1a1a] placeholder-[#94a3b8]"
                            placeholder='"vet MC 1234567", "track SH000025", "who&apos;s expiring this week?"'
                            value={this.state.aiQuery}
                            onChange={(e) => this.setState({ aiQuery: e.target.value })}
                        />
                    </div>
                    <button className="bg-[#1d4ed8] hover:bg-blue-700 text-white font-semibold text-sm rounded-xl py-2.5 px-5 flex items-center gap-2 transition-all shadow-sm border-none cursor-pointer">
                        <AutoAwesomeOutlined style={{ fontSize: 16 }} />
                        Ask AI
                    </button>
                </div>

                {/* Dashboard Cards Grid */}
                <div className="grid grid-cols-[1fr_380px] gap-5 mb-8">

                    {/* Left card — Logistics Performance */}
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

                          <button onClick={() => this.setState({ redirect: '/load-search' })}
                                className="bg-[#EFF6FF] p-3.5 px-4 border border-[#BFDBFE] rounded-xl text-left cursor-pointer group transition-all hover:bg-[#DBEAFE] hover:border-[#93C5FD]"
                                style={{ all: 'unset', display: 'block', cursor: 'pointer', background: '#EFF6FF', padding: '14px 16px', border: '1px solid #BFDBFE', borderRadius: '12px' }}
                            >
                                <div className="text-[10px] font-bold tracking-[0.5px] text-[#1D4ED8] uppercase mb-1.5 flex items-center gap-1">
                                    <LocalShippingOutlined style={{ fontSize: 13 }} />
                                    TRACKING NOW
                                </div>
                                <div className="text-2xl font-bold text-[#1E40AF]">
                                    {String(activeShipments).padStart(2, '0')}
                                </div>
                                
                            </button>

                          <div className="bg-[#f4f5f7] p-3.5 px-4 border border-transparent rounded-xl flex-1">
        <div className="text-[10px] font-bold tracking-[0.5px] text-[#8a94a6] uppercase mb-1.5">
            COIs expiring ≤7d
        </div>
        <div className="text-2xl font-bold text-[#1e293b]">
            05
        </div>
    </div>

    {/* 2. At-Risk Loads Card */}
    <div className="bg-[#F2F4F6] p-3.5 px-4 border border-[#BA1A1A1A] rounded-xl flex-1">
        <div className="text-[10px] font-bold tracking-[0.5px] text-[#dc2626] uppercase mb-1.5">
            At-risk loads
        </div>
        <div className="text-2xl font-bold text-[#b91c1c]">
            02
        </div>
    </div>
                        </div>
                    </div>

                    {/* Right card — Account Status */}
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
                                <span>{loadsUsed} of {loadsLimit} Used</span>
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

                {/* Recent Activity */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <span className="text-lg font-bold text-[#1a1a1a]">Recent Activity</span>
                        
                    </div>
                    <a href="#" className="flex items-center gap-1 text-xs font-semibold text-[#185FA5] no-underline">
                        Full Activity Log <OpenInNew style={{ fontSize: 14 }} />
                    </a>
                </div>

                <DataTable
                    index="track_shipment"
                    label="Track Shipment"
                    active_row={this.state.active_row}
                    do_reload={this.state.do_reload}
                    per_page={5}
                     hide_actions={true}
                    relaodDone={() => {
                        this.setState({do_reload: false});
                    }}
                    columns={[
                        {
                            name: 'Shipment Number', column: 'shipment_number', sortable: true,
                            renderer: (row) => (
                                <span className="text-[#003178] font-bold">{row.shipment_number}</span>
                            )
                        },
                        { name: 'Shippping Carrier', column: 'shippment_carrier', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.shipments_carriers, renderer: (row) => <span className="font-bold">{row.carrier_title}</span> },
                        { name: 'Load Number', column: 'update_type', sortable: true },
                        { name: 'Action', column: 'row_id', sortable: false, hide_search: true, width: 160, renderer: (row) => {
                            return (
                                <div>
                                    <Btn size="small" confirm confirm_message="Do you really want to send the link to this driver?" onClick={() => {
                                            this.updateActionCentre(row)
                                        }} loading={this.state.sending_request === row.shipment_row_id ? true : false}
                                    >
                                        Send Link
                                    </Btn>
                                </div>
                            )
                        }},
                        { name: 'Tracking Method', column: 'tracking_method', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.tracking_methods, renderer: (row) => {
                            return row.tracking_method_title
                        }},
                        { name: 'Contact', column: 'tracking_full_number', sortable: false, renderer: (row) => <span className="font-bold">{row.tracking_full_number}</span> },
                        { name: 'Accepted By Driver', column: 'driver', sortable: false, hide_search: true, renderer:(row) => {
                            if(row.shipment_driver != ''){
                                return <Chip label="Yes" variant="contained" size="small" color="success" />
                            }else{
                                return <Chip label="No" variant="contained" size="small" color="warning" />
                            }
                        }},
                        { name: 'Status', column: 'status', sortable: true, search_type: 'match', search_input: 'dropdown', search_data: this.state.status, chip_colors: this.state.status_colors},
                    ]}
                    row_actions={(row, row_index) => {
                        return (
                            <div className="hoverable-action">
                                <div className="align-start">
                                    <Btn
                                        to={`/shipment/${row.shipment_row_id}`}
                                        size="small"
                                        variant="text"
                                        disableRipple
                                        sx={{
                                            color: '#1e40af',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            padding: '8px 10px',
                                            '& .MuiButton-endIcon': {
                                                marginLeft: '15px',
                                            },
                                        }}
                                        endIcon={
                                            <ArrowForwardIcon
                                                sx={{
                                                    fontSize: '12px',
                                                    transform: 'scale(0.75, 0.9)',
                                                }}
                                            />
                                        }
                                    >
                                        View
                                    </Btn>

                                    {row.shipment_driver !== '' && (
                                        <Btn
                                            size="small"
                                            variant="text"
                                            disableRipple
                                            sx={{
                                                color: '#1e40af',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                padding: '8px 10px',
                                                '& .MuiButton-endIcon': {
                                                    marginLeft: '15px',
                                                },
                                            }}
                                            endIcon={
                                                <Chat
                                                    sx={{
                                                        fontSize: '14px',
                                                        transform: 'scale(0.9)',
                                                    }}
                                                />
                                            }
                                            onClick={() => {
                                                this.setState({ init_chat: row });
                                            }}
                                        >
                                            Chat
                                        </Btn>
                                    )}
                                </div>
                            </div>
                        )
                    }}
                    default_sort_by="shipment.added_on"
                    api_url="app/action_centre/list"
                    account_token={this.state.account_token}
                    row_id="row_id"
                />

             
            </Main>
        );
    }
}

export default Dashboard;