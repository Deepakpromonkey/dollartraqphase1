import React, { Component } from 'react';
import { useParams, Navigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';
import Main from 'components/Main';
import Api from 'api/Api';

import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShareIcon from '@mui/icons-material/Share';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import ShipmentDetails from '../shipment/ShipmentDetails';
import ShipmentStops from '../shipment/ShipmentStops';
import LocationHistory from './LocationHistory';
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';
import NoData from 'components/blocks/NoData';
import RenderHtml from 'components/RenderHtml';

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '380px'
};

export function withRouter(Children) {
    return (props) => {
        const params = { params: useParams() };
        return <Children {...props} params={params} />
    }
}

const MapLoader = (props) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY
    });
    return isLoaded ? props.children : props.fallback;
};

class ControlTowerShipment extends Component {
    constructor(props) {
        super();
        this.state = {
            account_token: false,
            user: false,
            loading: true,
            redirect: false,
            logged_in: false,
            error_message: '',
            success_message: '',
            row_id: false,
            shipment: false,
            active_tab: 0,
            shipment_carriers: [],
            tracking_methods: [],
            country_codes: [],
            timezones: [],
            route: [
                { lat: 46.65725559308588, lng: -105.68787278650479 }
            ],
            location_history: [],
            last_pulse: false
        }
        this.loadTimer = null;
        this.pulseTimer = null;
    }

    componentDidMount = () => {
        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        if (account_token) {
            this.setState({ account_token: account_token })
            if (this.props.params.params.row_id) {
                this.setState({ row_id: this.props.params.params.row_id }, () => {
                    this.init(account_token, this.props.params.params.row_id, true, false)
                })
            } else {
                this.setState({ redirect: '/control-tower' })
            }
        }
    }

    componentWillUnmount = () => {
        if (this.loadTimer) clearInterval(this.loadTimer);
        if (this.pulseTimer) clearInterval(this.pulseTimer);
        this.loadTimer = null;
        this.pulseTimer = null;
    }

    render() {
        if (this.state.redirect !== false) {
            return <Navigate to={this.state.redirect} />
        }

        const options = {
            strokeColor: '#2563EB',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            fillColor: '#2563EB',
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            radius: 30000,
            zIndex: 1
        };

        let matchedDriverName = "Unassigned";
        let latestStatusLabel = "Unknown Status";

        if (this.state.shipment && this.state.shipment.progress) {
            let driverLog = this.state.shipment.progress.find(p => p.value && p.value.toLowerCase().includes("driver"));
            if (driverLog && driverLog.label) {
                matchedDriverName = driverLog.label.replace(/<\/?[^>]+(>|$)/g, ""); 
            }

            for (let i = this.state.shipment.progress.length - 1; i >= 0; i--) {
                let p = this.state.shipment.progress[i];
                if (p.status === 'active' || p.status === 'current' || p.status === 'completed' || p.status === 'success') {
                    latestStatusLabel = p.value;
                    break;
                }
            }
        }

        return (
            <Main
                active_page="control_tower"
                title="Control Tower"
                subtitle="Enter carrier details to activate live telemetry and predictive delivery windows."
                page="shipment_single"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
                full_width={true}
            >
                <div className=" min-h-screen font-sans antialiased text-[#1E293B]">
                    {this.state.loading ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                <Skeleton variant="rounded" height={140} className="rounded-2xl" />
                                <Skeleton variant="rounded" height={140} className="rounded-2xl" />
                                <Skeleton variant="rounded" height={140} className="rounded-2xl" />
                                <Skeleton variant="rounded" height={140} className="rounded-2xl" />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Skeleton variant="rounded" height={400} className="lg:col-span-1 rounded-2xl" />
                                <Skeleton variant="rounded" height={400} className="lg:col-span-2 rounded-2xl" />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                                
                                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm md:col-span-5 flex flex-col justify-between min-h-[180px]">
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <h2 className="text-xl font-bold text-[#0F172A]">
                                                #{this.state.shipment.shipment_number}
                                            </h2>

                                            <span className="inline-flex items-center gap-2 px-5.5 py-1.5 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#4F46E5]">
                                               
                                                <span className="w-2 h-2  rounded-full bg-[#4F46E5]" />
                                                {latestStatusLabel}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2 text-xs text-[#64748B] font-medium">
                                            <span>Primary Freight Route</span>
                                            <span className="w-1 h-1 rounded-full bg-[#CBD5E1]"></span>
                                            <span>Priority High</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                       <button className="bg-[#001A48] hover:bg-[#1E293B] text-white text-xs font-bold py-3 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm">
                                            <ShareIcon style={{ fontSize: '15px' }} /> Share Tracking
                                        </button>
                                        {/* <button className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-bold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-1.5 border border-[#E2E8F0]">
                                            <FileDownloadOutlinedIcon style={{ fontSize: '16px' }} /> Export CSV
                                        </button> */}
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm md:col-span-2 flex flex-col justify-between min-h-[150px]">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Carrier</span>
                                        <h3 className="text-sm font-bold text-[#0F172A] mt-1.5 leading-snug">
                                            {this.state.shipment.shippment_carrier_label || 'Unassigned'}
                                        </h3>
                                    </div>
                                    <div className="text-[#94A3B8] flex justify-start">
                                        <LocalShippingOutlinedIcon style={{ fontSize: '22px', strokeWidth: '1.5' }} />
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm md:col-span-3 flex flex-col justify-between min-h-[150px]">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">Driver Contact</span>
                                        <h3 className="text-sm font-bold text-[#0F172A] mt-1.5">{matchedDriverName}</h3>
                                        <p className="text-xs text-[#64748B] mt-1.5 font-medium">
                                            ({this.state.shipment.tracking_full_number || 'No Phone Link'})
                                        </p>
                                    </div>
                                    <div className="text-[#94A3B8] flex justify-start">
                                        <PhoneIphoneIcon style={{ fontSize: '22px' }} />
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm md:col-span-2 flex flex-col justify-between min-h-[150px]">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">App Status</span>
                                        {this.state.shipment?.action_center?.app_installed === 'yes' ? (
                                            <div>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <h3 className="text-sm font-bold text-[#0F172A]">App Installed</h3>
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase tracking-wide">Live</span>
                                                </div>
                                                {this.state.shipment.action_center.device && (
                                                    <p className="text-xs text-[#64748B] mt-1.5 font-medium">Platform: <span className="text-[#334155] font-semibold">{this.state.shipment.action_center.device}</span></p>
                                                )}
                                            </div>
                                        ) : (
                                            <h3 className="text-sm font-bold text-[#EF4444] mt-1.5">App Not Installed</h3>
                                        )}
                                    </div>
                                    <div className="text-[#94A3B8] flex justify-start">
                                        <FlagOutlinedIcon style={{ fontSize: '22px' }} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                
                              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm lg:col-span-4 flex flex-col sticky top-6 self-start">
                                    <h3 className="text-base font-bold text-[#0F172A] mb-6 tracking-tight">Progress Tracker</h3>
                                    
                                    <div className="relative pl-8 border-l border-[#E2E8F0] space-y-6 ml-4 my-auto">
                                        {this.state.shipment.progress && this.state.shipment.progress.map((_progress, index) => {
                                           let status = _progress?.status
                                                    ? _progress.status.toString().toLowerCase()
                                                    : 'pending';

                                                let isCompleted =
                                                    status === 'visited' ||
                                                    status === 'completed' ||
                                                    status === 'success';

                                                let isActive =
                                                    status === 'active' ||
                                                    status === 'current';

                                            return (
                                                <div className="relative" key={`progress_${index}`}>
                                                    
                                                    {/* Node Styling Variant Overrides Matching Image Structure */}
                                                    {isCompleted ? (
                                                      <div className="absolute -left-[45px] top-0 w-6 h-6 rounded-full bg-[#001A48] flex items-center justify-center z-10 border border-[#001A48]">
                                                            <CheckIcon style={{ fontSize: '14px', color: '#FFFFFF' }} />
                                                        </div>
                                                    ) : isActive ? (
                                                        <div className="absolute -left-[45px] top-0 w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center z-10 border border-[#6366F1] ring-4 ring-[#EEF2FF]">
                                                            <LocalShippingIcon style={{ fontSize: '12px', color: '#FFFFFF' }} />
                                                        </div>
                                                    ) : (
                                                        <div className="absolute -left-[41px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#CBD5E1] z-10"></div>
                                                    )}

                                                    <div>
                                                        <span className={`text-xs font-bold uppercase tracking-wider block ${isActive ? 'text-[#6366F1]' : 'text-[#0F172A]'}`}>
                                                            {_progress.value}
                                                        </span>
                                                        <RenderHtml
                                                            className={`text-xs mt-0.5 block font-medium ${isActive ? 'text-[#334155]' : 'text-[#94A3B8]'}`}
                                                            html={_progress.label}
                                                        />
                                                        {_progress?.date && (
                                                            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#94A3B8] font-medium">
                                                                <CalendarMonthIcon style={{ fontSize: '13px', color: '#CBD5E1' }} />
                                                                <span>{_progress.date}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Structural Wrapper: Houses both the Map and Management Tabs under it */}
                                <div className="lg:col-span-8 space-y-6">
                                    
                                    {/* Map Component Container */}
                                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden relative h-[440px]">
                                        <MapLoader fallback={<div className="w-full h-full bg-[#F1F5F9] animate-pulse"></div>}>
                                            <GoogleMap
                                                mapContainerStyle={containerStyle}
                                                center={this.state.route[0]}
                                                zoom={14}
                                            >
                                                <Polyline
                                                    path={this.state.route}
                                                    options={options}
                                                />
                                            </GoogleMap>
                                        </MapLoader>
                                    </div>

                                    {/* Management Tabs and Data Blocks - Aligned perfectly underneath the map */}
                                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden w-full">
                                        <div className="border-b border-[#F1F5F9] p-3 bg-[#F8F9FA]">
                                            <Tabs
                                              value={this.state.active_tab}
                                              onChange={(e, value) => this.setState({ active_tab: value })}
                                              variant="scrollable"
                                              scrollButtons={false}
                                              sx={{
                                                background: '#F1F5F9',
                                                borderRadius: '999px',
                                                padding: '4px',
                                                minHeight: '44px',

                                                '& .MuiTabs-indicator': {
                                                  display: 'none'
                                                },

                                                '& .MuiTab-root': {
                                                  minHeight: '36px',
                                                  fontSize: '12px',
                                                  fontWeight: 600,
                                                  textTransform: 'none',
                                                  color: '#475569',
                                                  borderRadius: '999px',
                                                  padding: '6px 16px',
                                                  marginRight: '6px'
                                                },

                                              '& .MuiTab-root.Mui-selected': {
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#013178',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                                    },
                                              }}
                                            >
                                                <Tab label="Tripsheet" icon={<ListAltOutlinedIcon style={{ fontSize: '16px' }} />} iconPosition="start" />
                                                <Tab label="Location History" icon={<ReceiptIcon style={{ fontSize: '16px' }} />} iconPosition="start" />
                                                <Tab label="Load Details" icon={<DnsOutlinedIcon style={{ fontSize: '16px' }} />} iconPosition="start" />
                                                <Tab label="Notes" icon={<RateReviewOutlinedIcon style={{ fontSize: '16px' }} />} iconPosition="start" />
                                                <Tab label="Additional Statuses" icon={<ChecklistOutlinedIcon style={{ fontSize: '16px' }} />} iconPosition="start" />
                                                <Tab label="Documents" icon={<ReceiptLongIcon style={{ fontSize: '16px' }} />} iconPosition="start" />
                                            </Tabs>
                                        </div>

                                        <div className="p-6">
                                            {this.state.active_tab === 0 && (
                                                <ShipmentStops shipment={this.state.shipment} />
                                            )}

                                            {this.state.active_tab === 1 && (
                                                <>
                                                    {this.state.location_history.length > 0 ? (
                                                        <LocationHistory location_history={this.state.location_history} />
                                                    ) : (
                                                        <NoData size="small" message="Data not available." icon={<ReceiptIcon />} />
                                                    )}
                                                </>
                                            )}

                                            {this.state.active_tab === 2 && (
                                                <Box className="p-1">
                                                    <ShipmentDetails shipment={this.state.shipment} />
                                                </Box>
                                            )}

                                            {this.state.active_tab === 3 && (
                                                <Box className="p-1">
                                                    {this.state.shipment.notes ? (
                                                        <p className="text-sm text-[#475569] bg-[#F8F9FA] p-5 rounded-xl border border-[#E2E8F0] leading-relaxed font-medium">
                                                            {this.state.shipment.notes}
                                                        </p>
                                                    ) : (
                                                        <NoData size="small" message="Notes not available." icon={<RateReviewOutlinedIcon />} />
                                                    )}
                                                </Box>
                                            )}

                                            {this.state.active_tab === 4 && (
                                                <NoData size="small" message="Status data not available." icon={<ChecklistOutlinedIcon />} />
                                            )}

                                            {this.state.active_tab === 5 && (
                                                <Box className="p-1">
                                                    {this.state.shipment.documents?.length > 0 ? (
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                                            {this.state.shipment.documents.map((doc, idx) => (
                                                                <a 
                                                                    key={idx} 
                                                                    href={doc.document_url} 
                                                                    target="_blank" 
                                                                    rel="noreferrer" 
                                                                    className="flex flex-col items-center justify-center p-5 bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl hover:bg-[#F1F5F9] transition text-[#94A3B8] hover:text-[#475569]"
                                                                >
                                                                    <AttachFileIcon className="mb-1.5" style={{ fontSize: '20px' }} />
                                                                    <span className="text-[11px] font-bold text-[#64748B]">Document {idx + 1}</span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <NoData size="small" message="Documents not available." icon={<ReceiptLongIcon />} />
                                                    )}
                                                </Box>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>

                        </div>
                    )}
                </div>
            </Main>
        )
    }

    init = (account_token, row_id, initing, last) => {
        const formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('row_id', row_id);

        this.setState({ loading: initing })
        var self = this;

        Api.post('app/shipment/single', formData, function (data) {
            if (data.status) {
                if (data.coords.length) {
                    const numericCoords = data.coords.map(item => ({
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng)
                    }));

                    if (last) {
                        let _route = self.state.route;
                        self.setState({ route: [..._route, ...numericCoords] })
                    } else {
                        self.setState({ route: numericCoords })
                    }

                    const location_history_coords = data.coords.map(item => ({
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lng),
                        date: item.date
                    }));

                    if (last) {
                        let _location_history = self.state.location_history;
                        self.setState({ location_history: [..._location_history, ...location_history_coords] })
                    } else {
                        self.setState({ location_history: location_history_coords })
                    }
                }

                self.setState({ shipment: data.shipment }, () => {
                    if (data.shipment.status == '1' || data.shipment.status == '2') {
                        if (self.loadTimer === null) {
                            self.reloadShipment(account_token, row_id, false)
                        }
                    } else if (data.shipment.status == '3') {
                        if (self.loadTimer) clearInterval(self.loadTimer);
                        self.loadTimer = null;
                        if (self.pulseTimer === null) {
                            self.reloadPulses(account_token, row_id, false)
                        }
                    }
                    self.setState({ loading: false })
                });
            } else {
                self.setState({ loading: false })
            }
        });
    }

    loadPulses = (account_token, row_id, initing) => {
        const formData = new FormData();
        formData.append('account_token', account_token);
        formData.append('row_id', row_id);

        if (this.state.last_pulse !== false) {
            formData.append('last_pulse', this.state.last_pulse);
        }

        this.setState({ loading: initing })
        var self = this;

        Api.post('app/shipment/tracking/pulses', formData, function (data) {
            if (data.status) {
                const numericCoords = data.coords.map(item => ({
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng)
                }));

                self.setState({ route: numericCoords })
                if (self.state.last_pulse !== false) {
                    let _route = self.state.route;
                    self.setState({ route: [..._route, ...numericCoords] })
                } else {
                    self.setState({ route: numericCoords })
                }

                if (data.pulses.length > 0) {
                    self.setState({ last_pulse: data.pulses[data.pulses.length - 1]['id'] });
                }

                const location_history_coords = data.coords.map(item => ({
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lng),
                    date: item.date
                }));

                if (self.state.last_pulse !== false) {
                    let _location_history = self.state.location_history;
                    self.setState({ location_history: [..._location_history, ...location_history_coords] })
                } else {
                    self.setState({ location_history: location_history_coords })
                }

                if (data.shipment.status == '4') {
                    self.init(account_token, row_id, false, true)
                    clearInterval(self.pulseTimer);
                    self.pulseTimer = null;
                }
            } else {
                self.setState({ loading: false })
            }
        });
    }

    reloadShipment = (account_token, row_id, initing) => {
        this.loadTimer = setInterval(() => {
            this.init(account_token, row_id, initing, false)
        }, 10000);
    }

    reloadPulses = (account_token, row_id, initing) => {
        this.pulseTimer = setInterval(() => {
            this.loadPulses(account_token, row_id, initing)
        }, 10000);
    }
}

export default withRouter(ControlTowerShipment);