import React, { Component } from 'react';

import Main from 'components/Main';
import DataTable from 'components/wd/data_table/DataTable';
import Api from 'api/Api';

import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { Link } from 'react-router-dom';

// Config for the 5 summary cards
// hoverBg / hoverBorder are used when the card is clickable (has a link)
const STAT_CARDS = [
    { key: 'cleared',          label: 'Cleared (A / B)',    color: '#16a34a', hoverBorder: '#16a34a', hoverBg: '#f0fdf4', link: '/connected' },
    { key: 'watch',            label: 'Watch (C)',           color: '#d97706', hoverBorder: '#d97706', hoverBg: '#fffbeb', link: '/profile/carriers/shortlisted' },
    { key: 'restricted',       label: 'Restricted (D / F)', color: '#dc2626', hoverBorder: '#dc2626', hoverBg: '#fef2f2' },
    { key: 'coi_expiring',     label: 'COI ≤30d',           color: '#0f172a', hoverBorder: '#94a3b8', hoverBg: '#f8fafc' },
    { key: 'dt_pay_connected', label: 'DT Pay connected',   color: '#0f172a', hoverBorder: '#94a3b8', hoverBg: '#f8fafc' },
];

// Hex color → rgba with opacity helper
const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

class StatCard extends Component {

    constructor(props) {
        super();
        this.state = { hovered: false };
    }

    render() {

        const { value, label, color, link, hoverBorder, hoverBg } = this.props;
        const { hovered } = this.state;

        const baseStyle = {
            cursor: link ? 'pointer' : 'default',
            transition: 'border-color 160ms ease, background 160ms ease, box-shadow 160ms ease',
            border: `1px solid ${hovered && link ? hoverBorder : '#edf2f7'}`,
            background: hovered && link ? hoverBg : '#ffffff',
            boxShadow: hovered && link ? `0 2px 8px ${hexToRgba(hoverBorder || '#000', 0.12)}` : 'none',
            borderRadius: '16px',
            padding: '16px 20px',
            flex: 1,
            minWidth: 150,
            display: 'block',
            textDecoration: 'none',
        };

        const inner = (
            <>
                <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color }}>
                    {value ?? 0}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 8 }}>
                    {label}
                </div>
 
            </>
        );

        if (link) {
            return (
                <Link
                    to={link}
                    style={baseStyle}
                    onMouseEnter={() => this.setState({ hovered: true })}
                    onMouseLeave={() => this.setState({ hovered: false })}
                >
                    {inner}
                </Link>
            );
        }

        return (
            <div style={baseStyle}>
                {inner}
            </div>
        );
    }
}

class CarrierConnect extends Component {

    constructor(props) {
        super(props);

        this.state = {
            account_token: false,
            error_message: '',
            success_message: '',
            do_reload: false,
            has_data: false,
            exportDialogOpen: false,

            stats: {
                cleared: 0,
                watch: 0,
                restricted: 0,
                coi_expiring: 0,
                dt_pay_connected: 0,
            },
        };
    }

    componentDidMount = () => {
        const account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);

        if (account_token) {
            this.setState({ account_token }, () => {
                this.loadStats();
                this.loadWatchTotal();
            });
        }
    };

    loadStats = () => {
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);

        Api.post('broker/carrier/connect/total', formData, (data) => {

            // API returns a plain number — update cleared with it
            if (typeof data === 'number' || (typeof data === 'string' && data.trim() !== '' && !isNaN(Number(data)))) {
                this.setState(prev => ({
                    stats: { ...prev.stats, cleared: Number(data) }
                }));
                return;
            }

            // API returns a JSON object with named keys
            if (data && data.status) {
                this.setState({
                    stats: {
                        cleared:          data.cleared          ?? 0,
                        watch:            data.watch            ?? 0,
                        restricted:       data.restricted       ?? 0,
                        coi_expiring:     data.coi_expiring     ?? 0,
                        dt_pay_connected: data.dt_pay_connected ?? 0,
                    },
                });
            }
        });
    };

    loadWatchTotal = () => {
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);

        Api.post('app/profile/carriers/shortlisted/total', formData, (data) => {

            // plain number response
            if (typeof data === 'number' || (typeof data === 'string' && data.trim() !== '' && !isNaN(Number(data)))) {
                this.setState(prev => ({
                    stats: { ...prev.stats, watch: Number(data) }
                }));
                return;
            }

            // JSON object response
            if (data && data.status) {
                this.setState(prev => ({
                    stats: { ...prev.stats, watch: data.total ?? data.count ?? data.watch ?? 0 }
                }));
            }
        });
    };

    toggleExportDialog = (isOpen) => {
        this.setState({ exportDialogOpen: isOpen });
    };

    exportCsv = () => {
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);

        Api.post('broker/carrier/connect/exportCsv', formData, (data) => {
            let url = data.replace(/\\/g, '').replace(/"/g, '');
            window.open(url, '_blank');
            this.toggleExportDialog(false);
        });
    };

    exportPdf = () => {
        const formData = new FormData();
        formData.append('account_token', this.state.account_token);

        Api.post('broker/carrier/connect/exportPDF', formData, (data) => {
            let url = data.replace(/\\/g, '').replace(/"/g, '');
            window.open(url, '_blank');
            this.toggleExportDialog(false);
        });
    };

    render() {
        const { has_data, stats, exportDialogOpen } = this.state;

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
                        key: 'carrier_export_combined',
                        label: 'Export Data',
                        backgroundColor: '#ffffff',
                        textColor: '#0f172a',
                        borderColor: '#e2e8f0',
                        icon: 'download',
                        disabled: !has_data,
                        onClick: () => {
                            if (has_data) this.toggleExportDialog(true);
                        }
                    },
                    {
                        key: 'carrier_add',
                        label: 'Add New Carrier',
                        link: '/searched-carriers'
                    },
                ]}
            >
                {/* ── Stat cards ── */}
                <div className="flex gap-4 mb-6">
                    {STAT_CARDS.map((card) => (
                        <StatCard
                            key={card.key}
                            value={stats[card.key]}
                            label={card.label}
                            color={card.color}
                            link={card.link}
                            hoverBorder={card.hoverBorder}
                            hoverBg={card.hoverBg}
                        />
                    ))}
                </div>

                <DataTable
                    index="carrier_connect"
                    label="Carrier Connect"
                    api_url="broker/carrier/connect/list"
                    account_token={this.state.account_token}
                    row_id="row_id"
                    onDataLoad={(rows) => {
                        this.setState({ has_data: rows && rows.length > 0 });
                    }}
                    columns={[
                        {
                            name: 'Carrier', column: 'carrier.dba_name', sortable: true,
                            renderer: (row) => (
                                <Link to={`/carriers/${row.receiver_id}`} className="flex items-center gap-3">
                                    <div className="w-[42px] h-[42px] rounded-full border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-center text-[16px] font-bold text-[#64748b]">
                                        {(row.carrier?.dba_name || '-').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-[700] text-[#0f172a] hover:text-[#2563eb]">
                                            {row.carrier?.dba_name || '-'}
                                        </div>
                                    </div>
                                </Link>
                            )
                        },
                        {
                            name: 'Contact', column: 'carrier.legal_name', sortable: true,
                            renderer: (row) => (
                                <span className="text-[#475569]">
                                    {row.carrier?.legal_name || '-'}
                                </span>
                            )
                        },
                        {
                            name: 'DOT / MC', column: 'carrier.dot_number', sortable: true,
                            renderer: (row) => (
                                <span className="font-[600] text-[#0f172a]">
                                    {row.carrier?.dot_number || '-'} / -
                                </span>
                            )
                        },
                        {
                            name: 'Authority', column: 'didit_status', sortable: true,
                            renderer: (row) => {
                                if (row.didit_status == 'Approved') {
                                    return <Chip label={row.didit_status} size="small" color="success" />
                                } else {
                                    return <Chip label={row.didit_status || '-'} size="small" color="warning" />
                                }
                            }
                        },
                        {
                            name: 'COI',   column: 'coi',   sortable: false, renderer: () => <span className="text-[#64748b]">-</span>
                        },
                        {
                            name: 'ELD',   column: 'eld',   sortable: false, renderer: () => <span className="text-[#64748b]">-</span>
                        },
                        {
                            name: 'Score', column: 'score', sortable: false, renderer: () => <span className="text-[#64748b]">-</span>
                        },
                        {
                            name: 'DT Pay', column: 'dt_pay', sortable: false, renderer: () => <span className="text-[#64748b]">-</span>
                        }
                    ]}
                />

                {/* Export Dialog */}
                <Dialog
                    open={exportDialogOpen}
                    onClose={() => this.toggleExportDialog(false)}
                    maxWidth="xs"
                    fullWidth
                >
                    <DialogTitle className="font-bold text-[#0f172a]">Export Options</DialogTitle>
                    <DialogContent>
                        <p className="text-[#64748b] text-[14px]">
                            Please select your preferred download format for the carrier records list.
                        </p>
                        <div className="flex flex-col gap-3 mt-4">
                            <button
                                onClick={this.exportCsv}
                                className="w-full py-3 px-4 rounded-xl border border-[#e2e8f0] text-[#0f172a] font-semibold hover:bg-[#f8fafc] text-left flex justify-between items-center transition-colors"
                            >
                                <span>Spreadsheet (CSV)</span>
                                <span className="text-[12px] bg-[#f1f5f9] px-2 py-0.5 rounded text-[#475569]">.csv</span>
                            </button>
                            <button
                                onClick={this.exportPdf}
                                className="w-full py-3 px-4 rounded-xl border border-[#e2e8f0] text-[#0f172a] font-semibold hover:bg-[#f8fafc] text-left flex justify-between items-center transition-colors"
                            >
                                <span>Document Report (PDF)</span>
                                <span className="text-[12px] bg-[#f1f5f9] px-2 py-0.5 rounded text-[#475569]">.pdf</span>
                            </button>
                        </div>
                    </DialogContent>
                    <DialogActions className="p-4 border-t border-[#f1f5f9]">
                        <Button
                            onClick={() => this.toggleExportDialog(false)}
                            className="text-[#64748b] font-semibold"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Main>
        );
    }
}

export default CarrierConnect;