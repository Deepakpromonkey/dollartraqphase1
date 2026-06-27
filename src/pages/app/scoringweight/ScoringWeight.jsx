import React, { Component } from 'react';

import Main from 'components/Main';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// ---------- dummy data — swap with API response later ----------
const DUMMY_WEIGHTS = [
    { key: 'authority',        label: 'Authority',        value: 20 },
    { key: 'insurance_coi',    label: 'Insurance / COI',  value: 20 },
    { key: 'safety_csa',       label: 'Safety / CSA',     value: 20 },
    { key: 'inspection_vin',   label: 'Inspection / VIN', value: 15 },
    { key: 'fraud_signals',    label: 'Fraud signals',    value: 10 },
    { key: 'payment_history',  label: 'Payment history',  value: 15 },
];

// ---------- single progress row ----------
const WeightRow = ({ label, value, isLast }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.75,
        borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
    }}>
        <Typography sx={{
            minWidth: 160,
            fontSize: 14,
            fontWeight: 700,
            color: '#0F172A',
            flexShrink: 0,
        }}>
            {label}
        </Typography>

        <Box sx={{
            flex: 1,
            height: 8,
            borderRadius: '999px',
            background: '#E2E8F0',
            overflow: 'hidden',
        }}>
            <Box sx={{
                width: `${value}%`,
                height: '100%',
                borderRadius: '999px',
                background: '#2563EB',
                transition: 'width 0.6s ease',
            }} />
        </Box>

        <Typography sx={{
            minWidth: 36,
            textAlign: 'right',
            fontSize: 14,
            fontWeight: 700,
            color: '#0F172A',
            flexShrink: 0,
        }}>
            {value}%
        </Typography>
    </Box>
);

class ScoringWeights extends Component {

    constructor(props) {
        super();
        this.state = {
            error_message: '',
            success_message: '',

            account_token: false,
            user: false,

            weights: DUMMY_WEIGHTS,
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

            // when backend ready — uncomment and remove DUMMY_WEIGHTS:
            // const formData = new FormData();
            // formData.append('account_token', account_token);
            // Api.post('app/profile/scoring_weights', formData, (data) => {
            //     if (data.status) {
            //         this.setState({ weights: data.weights });
            //     }
            // });
        }
    }

    render() {
        return (
            <Main
                page="scoring_weights"
                active_page="scoring_weights"
                title="Scoring Weights"
                subtitle="Configure how each factor contributes to the overall carrier risk score."
                error_message={this.state.error_message}
                success_message={this.state.success_message}
            >

                {/* ── Outer Wrapper to Center the Card Perfectly ── */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',  // Center horizontally
                    alignItems: 'center',      // Center vertically
                    minHeight: '65vh',         // Sets a baseline dynamic height inside your Main layout
                    width: '100%',
                    py: 4,                     // Safe vertical padding for shorter viewports
                }}>

                    {/* ── Card ── */}
                    <Box sx={{
                        width: '100%',         // Makes it responsive on mobile screen sizes
                        maxWidth: 700,         // Caps the card size on desktop layout
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                    }}>

                        {/* card header */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 3,
                            py: 2.5,
                            borderBottom: '1px solid #F1F5F9',
                        }}>
                            <Box sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                border: '1.5px solid #CBD5E1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <SettingsOutlinedIcon sx={{ fontSize: 24, color: '#1E3A8A' }} />
                            </Box>

                            <Typography sx={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: '#0F172A',
                                lineHeight: 1.25,
                            }}>
                                Scoring<br />weights
                            </Typography>
                        </Box>

                        {/* weight rows */}
                        <Box sx={{ px: 3, pt: 0.5, pb: 1 }}>
                            {this.state.weights.map((w, i) => (
                                <WeightRow
                                    key={w.key}
                                    label={w.label}
                                    value={w.value}
                                    isLast={i === this.state.weights.length - 1}
                                />
                            ))}
                        </Box>

                    </Box>
                </Box>

            </Main>
        );
    }
}

export default ScoringWeights;