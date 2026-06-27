import React, { Component } from 'react';
import { Link } from 'react-router-dom'; // Imported Link for navigation
import DataTable from 'components/wd/data_table/DataTable';
import Btn from 'components/Btn';
import Edit from '@mui/icons-material/Edit';
import Chat from '@mui/icons-material/Chat';
import Chip from '@mui/material/Chip';
import Api from 'api/Api';
import Main from 'components/Main';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add'; // Added for the '+' icon
import ActionCentreChat from './ActionCentreChat';
import LayoutHelper from 'helpers/LayoutHelper'

class ActionCentre extends Component {

    constructor(props) {
        super(props); // Fixed missing props passing to super
        this.state = {
            error_message: '',
            success_message: '',
            shipments_carriers: [],
            tracking_methods: [],
            account_token: false,
            sending_request: false,
            do_reload: false,
            init_chat: false,
            status: [],
            status_colors: []
        }
    }

    componentDidMount = () => {
        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        
        if(account_token){
            this.init(account_token)
            this.setState({account_token: account_token})
        }
    }

    render(){
        return (
            <Main
                page="control-tower"
                active_page="control_tower"
                title="Control Tower"
                subtitle="Enter carrier details to activate live telemetry and predictive delivery windows."
                error_message={this.state.error_message}
                success_message={this.state.success_message}
            >
  <div className="flex justify-end mb-4 -mt-[72px]">
    <Link 
        to="/track-shipment" 
        className="inline-flex items-center justify-center gap-1.5 min-w-[150px] min-h-[46px] bg-white border border-[#edf0f2] text-[#0f172a] text-sm font-bold rounded-2xl px-5 shadow-sm hover:bg-gray-50 no-underline transition-all cursor-pointer"
    >
        <AddIcon sx={{ fontSize: 18 }} />
        New tracking
    </Link>
</div>

                <DataTable
                    index="track_shipment"
                    label="Track Shipment"
                    active_row={this.state.active_row}
                    do_reload={this.state.do_reload}
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

                {this.state.init_chat !== false &&
                    <ActionCentreChat
                        row={this.state.init_chat}
                        closeChat={() => {
                            this.setState({init_chat: false})
                        }}
                    />
                }
            </Main>
        )
    }

    init = (account_token) => {
        const formData = new FormData();
        formData.append('account_token', account_token);

        let self = this;
        Api.post('app/action_centre/init', formData, function(data){
            if(data.status){
                self.setState({
                    shipments_carriers: data.shipments_carriers,
                    tracking_methods: data.tracking_methods,
                    status: data.status,
                    status_colors: data.status_colors
                });
            }
        });
    }

    updateActionCentre = (row) => {
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);
        formData.append('shipment_row_id', row.shipment_row_id);

        this.setState({sending_request: row.shipment_row_id})

        let self = this;
        Api.post('drivers/request/send', formData, function(data){
            if(data.status){
                self.setState({do_reload: true, sending_request: false})
                LayoutHelper.addSuccessMessage(self, data.message)
            }else{
                self.setState({do_reload: true, sending_request: false})
                LayoutHelper.addErrorMessage(self, data.message)
            }
        });   
    }
}

export default ActionCentre;