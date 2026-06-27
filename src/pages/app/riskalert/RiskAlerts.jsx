import React, { Component } from 'react';

import Main from 'components/Main';
import DataTable from 'components/wd/data_table/DataTable';
import Btn from 'components/Btn';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

const SeverityBadge = ({ label }) => {

    const map = {
        High:   { bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
        Medium: { bg: '#FEF3C7', color: '#92400E', dot: '#D97706' },
        Low:    { bg: '#F0FDF4', color: '#166534', dot: '#22C55E' },
    };

    const s = map[label] || map['Low'];

    return (
        <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            px: '10px',
            py: '3px',
            borderRadius: '999px',
            background: s.bg,
            fontSize: '12px',
            fontWeight: 600,
            color: s.color,
            whiteSpace: 'nowrap',
        }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
            {label}
        </Box>
    );
};

const SUMMARY_CARDS = [
    {
        key: 'authority_revoked',
        icon: <WarningAmberIcon sx={{ fontSize: 18 }} />,
        count: 1,
        label: 'authority revoked',
        sub: 'Vega Hauling — auto-blocked from booking',
        bg: '#FEF2F2',
        border: '#FECACA',
        iconColor: '#EF4444',
        textColor: '#B91C1C',
    },
    {
        key: 'coi_expirations',
        icon: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />,
        count: 4,
        label: 'COI expirations',
        sub: 'Within 7 days · renewals in progress',
        bg: '#FFFBEB',
        border: '#FDE68A',
        iconColor: '#D97706',
        textColor: '#92400E',
    },
    {
        key: 'double_broker',
        icon: <DeviceHubIcon sx={{ fontSize: 18 }} />,
        count: 1,
        label: 'double-broker pattern',
        sub: 'MC 998812 · pending review',
        bg: '#FFFBEB',
        border: '#FDE68A',
        iconColor: '#D97706',
        textColor: '#92400E',
    },
];

const DUMMY_ALERTS = [
    {
        row_id: '1',
        severity: 'High',
        type: 'Authority revoked',
        carrier_load: 'Vega Hauling Inc',
        detected_by: 'Sentinel · FMCSA',
        added_on_formatted: '8 min ago',
    },
    {
        row_id: '2',
        severity: 'High',
        type: 'Off-route & silent',
        carrier_load: 'SH000025',
        detected_by: 'Tracker · Samsara',
        added_on_formatted: '22 min ago',
    },
    {
        row_id: '3',
        severity: 'Medium',
        type: 'Double-broker pattern',
        carrier_load: 'MC 998812',
        detected_by: 'Graph',
        added_on_formatted: '31 min ago',
    },
    {
        row_id: '4',
        severity: 'Medium',
        type: 'COI expiring',
        carrier_load: 'Anza Freight',
        detected_by: 'Insurer',
        added_on_formatted: '1 hr ago',
    },
    {
        row_id: '5',
        severity: 'Low',
        type: 'License mismatch',
        carrier_load: 'BlueStar Transport',
        detected_by: 'Sentinel · FMCSA',
        added_on_formatted: '2 hr ago',
    },
    {
        row_id: '6',
        severity: 'Low',
        type: 'COI expiring',
        carrier_load: 'Ridgeline Freight',
        detected_by: 'Insurer',
        added_on_formatted: '3 hr ago',
    },
];

class RiskAlerts extends Component {

    constructor(props) {
        super();
        this.state = {
            error_message: '',
            success_message: '',

            account_token: false,
            user: false,

            do_reload: false,
        };
    }

    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

        if (account_token) {

            this.setState({
                account_token: account_token,
                user: JSON.parse(user),
            });
        }
    }

    render() {

        return (

            <Main
                page="risk-alerts"
                active_page="risk_alerts"
                title="Risk & Alerts"
                subtitle="Continuous monitoring across authority, insurance, fraud patterns & in-transit anomalies."
                error_message={this.state.error_message}
                success_message={this.state.success_message}
            >

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                    gap: 2,
                    mb: 3,
                }}>
                    {SUMMARY_CARDS.map(card => (
                        <Box key={card.key} sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            px: 2.5,
                            py: 2,
                            borderRadius: '14px',
                            background: card.bg,
                            border: `1px solid ${card.border}`,
                        }}>
                            <Box sx={{ color: card.iconColor, mt: '2px', display: 'flex' }}>
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: 14, fontWeight: 700, color: card.textColor }}>
                                    {card.count} {card.label}
                                </Typography>
                                <Typography sx={{ fontSize: 12, color: card.textColor, opacity: 0.8, mt: 0.25 }}>
                                    {card.sub}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* ── Alert queue DataTable ── */}
                <DataTable
                    index="risk_alerts"
                    label="Alert queue"

                    do_reload={this.state.do_reload}
                    relaodDone={() => {
                        this.setState({ do_reload: false });
                    }}

                    data={DUMMY_ALERTS}
                    total={DUMMY_ALERTS.length}

                    columns={[
                        {
                            name: 'Severity',
                            column: 'severity',
                            sortable: true,
                            hide_search: true,
                            renderer: (row) => <SeverityBadge label={row.severity} />,
                        },
                        {
                            name: 'Type',
                            column: 'type',
                            sortable: true,
                            renderer: (row) => (
                                <span style={{ fontWeight: 600, fontSize: 14 }}>{row.type}</span>
                            ),
                        },
                        {
                            name: 'Carrier / Load',
                            column: 'carrier_load',
                            sortable: true,
                        },
                        {
                            name: 'Detected By',
                            column: 'detected_by',
                            sortable: true,
                            renderer: (row) => (
                                <span style={{ color: '#6B7280' }}>{row.detected_by}</span>
                            ),
                        },
                        {
                            name: 'When',
                            column: 'added_on_formatted',
                            sortable: true,
                            hide_search: true,
                            renderer: (row) => (
                                <span style={{ color: '#6B7280' }}>{row.added_on_formatted}</span>
                            ),
                        },
                    ]}

                    row_actions={(row, row_index) => {

                        return (
                            <div className="hoverable-action">
                                <div className="align-start">
                                    <Btn
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#E5E7EB',
                                            color: '#374151',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            px: 2,
                                            '&:hover': {
                                                borderColor: '#9CA3AF',
                                                background: '#F9FAFB',
                                            },
                                        }}
                                        onClick={() => {
                                            // wire resolve API call here
                                        }}
                                    >
                                        Resolve
                                    </Btn>
                                </div>
                            </div>
                        );
                    }}

                    default_sort_by="added_on"

                    // api_url="app/risk_alerts"    
                    // account_token={this.state.account_token} 

                    row_id="row_id"
                />

            </Main>
        );
    }
}

export default RiskAlerts;