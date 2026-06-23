import React, { Component } from 'react';

import Main from 'components/Main';
import DataTable from 'components/wd/data_table/DataTable';
import Api from 'api/Api';

import Chip from '@mui/material/Chip';

import { Link } from 'react-router-dom';

class CarrierConnect extends Component {

    constructor(props) {
        super(props);

        this.state = {
            
            account_token: false,

            error_message: '',
            success_message: '',

            do_reload: false,
        };
    }

    componentDidMount = () => {

        const account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);

        if (account_token) {

            this.setState({account_token,},() => {this.loadData();});
            
        }
    };

    loadData = () => {

        const formData = new FormData();

        formData.append('account_token', this.state.account_token);

        Api.post('broker/carrier/connect/list', formData, () => {});

    };

    exportCsv = () => {

        const formData = new FormData();

        formData.append('account_token', this.state.account_token);

        Api.post('broker/carrier/connect/exportCsv',formData,(data) => {

                let url = data
                    .replace(/\\/g, '')
                    .replace(/"/g, '');

                window.open(url, '_blank');

            }
        );
    };

    exportPdf = () => {

        const formData = new FormData();

        formData.append('account_token', this.state.account_token);

        Api.post('broker/carrier/connect/exportPDF', formData, (data) => {

                let url = data
                    .replace(/\\/g, '')
                    .replace(/"/g, '');

                window.open(url, '_blank');

            }
        );
    };

    render() {

        return (

            <Main
                page="connected"
                active_page="connected"
                title="Carriers"
                subtitle="342 carriers · continuously re-vetted on every FMCSA daily sync."
                error_message={this.state.error_message}
                success_message={this.state.success_message}
                title_action={[
                {
                    key: 'carrier_export_csv',
                    label: 'Export CSV',
                    backgroundColor: '#ffffff',
                    textColor: '#0f172a',
                    borderColor: '#e2e8f0',
                    icon: 'download',
                    onClick: () => {
                        this.exportCsv();
                    }
                },
                {
                    key: 'carrier_export_pdf',
                    label: 'Export PDF',
                    backgroundColor: '#ffffff',
                    textColor: '#0f172a',
                    borderColor: '#e2e8f0',
                    icon: 'download',
                    onClick: () => {
                        this.exportPdf();
                    }
                },
                {key: 'carrier_add', label: 'Add New Carrier'},
                
                ]}
            >
                <DataTable
                    index="carrier_connect"
                    label="Carrier Connect"
                    api_url="broker/carrier/connect/list"
                    account_token={this.state.account_token}
                    row_id="row_id"
                    columns={[
                        {
                            name: 'Carrier', column: 'carrier.dba_name', sortable: true,
                            renderer: (row) => {

                                return (
                                     <Link
                                        to={`/carriers/${row.receiver_id}`}
                                        className="flex items-center gap-3"
                                    >

                                        <div className="w-[42px] h-[42px] rounded-full border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-center text-[16px] font-bold text-[#64748b]">
                                            {(row.carrier?.dba_name || '-').charAt(0)}
                                        </div>

                                        <div>
                                            <div className="font-[700] text-[#0f172a] hover:text-[#2563eb]">
                                                {row.carrier?.dba_name || '-'} 
                                            </div>
                                        </div>

                                    </Link>
                                );
                            }
                        },
                        {
                            name: 'Contact', column: 'carrier.legal_name', sortable: true,
                            renderer: (row) => {
                                return (
                                    <span className="text-[#475569]">
                                        {row.carrier?.legal_name || '-'}
                                    </span>
                                );
                            }
                        },
                        {
                            name: 'DOT / MC', column: 'carrier.dot_number', sortable: true,
                            renderer: (row) => {
                                return (
                                    <span className="font-[600] text-[#0f172a]">
                                        {row.carrier?.dot_number || '-'} / -
                                    </span>
                                );
                            }
                        },
                        {
                            name: 'Authority', column: 'didit_status', sortable: true,
                            renderer: (row) => {
                                if (row.didit_status == 'Approved') {

                                    return (
                                        <Chip label={row.didit_status} size="small" color="success"/>
                                    )
                                } else {
                                    return (
                                        <Chip label={row.didit_status || '-'} size="small" color="warning"/>
                                    )
                                }
                            }
                        },
                        {
                            name: 'COI', column: 'coi', sortable: false,
                            renderer: () => {

                                return (
                                    <span className="text-[#64748b]">-</span>
                                );
                            }
                        },
                        {
                            name: 'ELD', column: 'eld', sortable: false,
                            renderer: () => {

                                return (
                                    <span className="text-[#64748b]">-</span>
                                );
                            }
                        },
                        {
                            name: 'Score', column: 'score', sortable: false,
                            renderer: () => {

                                return (
                                    <span className="text-[#64748b]">-</span>
                                );
                            }
                        },
                        {
                            name: 'DT Pay', column: 'dt_pay', sortable: false,
                            renderer: () => {

                                return (
                                    <span className="text-[#64748b]">-</span>
                                );
                            }
                        }
                    ]}
                />

            </Main>
        );
    }
}

export default CarrierConnect;