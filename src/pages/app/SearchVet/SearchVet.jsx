import React, { Component } from 'react';
import { Navigate } from "react-router-dom";
import Chip from '@mui/material/Chip';

import DataTable from 'components/wd/data_table/DataTable';
import Main from 'components/Main';



class SearchVet extends Component {

    constructor(props) {
        super();
        this.state = {
            account_token: false,
            user: false,
            redirect: false,
            logged_in: false,
            error_message: '',
            success_message: '',
            search_query: '',
            active_search: '',      // ← committed search sent to table
            table_key: 0,           // ← bumping this forces DataTable to reload
        }
    }

    componentDidMount = () => {
        var account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        if (account_token) {
            this.setState({ account_token: account_token });
        }
    }

    // Run Vet now hands the query off to the CarrierSearch page (the
    // card-list + pagination experience) instead of loading it here, since
    // that page already knows how to read ?q= on mount and run the search.
    handleRunVet = () => {
        const { search_query } = this.state;
        if (!search_query.trim()) return;

        this.setState({
            redirect: `/carriers/search?q=${encodeURIComponent(search_query.trim())}`,
        });
    }

    render() {

        if (this.state.redirect !== false) {
            return <Navigate to={this.state.redirect} />
        }

        return (
          <Main
    active_page="searched-carriers"
    page="searched-carriers"
                error_message={this.state.error_message}
                success_message={this.state.success_message}
                title="Search & Instant Vet"
                subtitle="One lookup → FMCSA authority, insurance, safety, VIN, associations & a live Trust Score."
            >
                <>
                    {/* ── Search Card ── */}
                    <div className="bg-white rounded-xl p-7 mb-5 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Look up any carrier</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Search by DOT #, MC/MX/FF #, legal/DBA name, phone, or VIN.
                        </p>

                        <div className="flex items-center gap-3">
                            <div className="flex flex-1 items-center bg-gray-100 rounded-lg px-4 h-12">
                                <svg className="w-4 h-4 text-gray-400 mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                                    placeholder="MC  1234567"
                                    value={this.state.search_query}
                                    onChange={(e) => this.setState({ search_query: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && this.handleRunVet()}
                                />
                            </div>

                            <button
                                onClick={this.handleRunVet}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 h-12 rounded-lg whitespace-nowrap transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                Run Vet
                            </button>
                        </div>

                        <div className="flex gap-6 mt-3">
                            {[
                                '2.34M carriers · FMCSA synced daily',
                                'Carrier411 + GenLogs physical layer',
                                'Sub-200ms pass/fail at load tender',
                            ].map((text) => (
                                <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>

<DataTable
    page="searched-carriers"
    active_page="searched-carriers"
    key={this.state.table_key}
    index="searched_carrier"
    label="Search Vet"
    active_row={this.state.active_row}
    hide_actions={true}
    post_params={
        this.state.active_search
            ? [{ key: 'keyword', value: this.state.active_search }]
            : []
    }
                        columns={[
                            {
                                name: 'Carrier',
                                column: 'carrier_name',
                                sortable: true,
                                renderer: (row) => (
                                    <span className="text-[#003178] font-bold">{row.company_name || '-'}</span>
                                )
                            },
                            {
                                name: 'MC / DOT',
                                column: 'mc_number',
                                sortable: true,
                                renderer: (row) => (
                                    <span>{row.mc_number || '-'} / {row.dot_number || '-'}</span>
                                )
                            },
                            {
                                name: 'Authority',
                                column: 'carrier_operation',
                                sortable: true,
                                renderer: (row) => row.carrier_operation === 'A'
                                    ? <Chip label="Active" size="small" color="success" />
                                    : <Chip label="Inactive" size="small" color="warning" />
                            },
                            {
                                name: 'Insurance',
                                column: 'insurance_status',
                                sortable: true,
                                renderer: (row) => <span>{row.insurance_status || '-'}</span>
                            },
                            {
                                name: 'Trust Score',
                                column: 'trust_score',
                                sortable: true,
                                renderer: (row) => <span className="font-bold">{row.trust_score || '-'}</span>
                            },
                            {
                                name: 'Vetted',
                                column: 'added_on',
                                sortable: true,
                                renderer: (row) => <span>{row.added_on || '-'}</span>
                            },
                        ]}
                        default_sort_by="created_at"
                        api_url="app/profile/carriers/searched/list"
                        // account_token={this.state.account_token}
                        row_id="row_id"
                    />
                </>
            </Main>
        )
    }
}

export default SearchVet;