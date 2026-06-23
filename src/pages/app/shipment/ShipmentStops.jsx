import React, { Component } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

class ShipmentStops extends Component {
    render() {
        const { shipment } = this.props;

        return (
            <TableContainer className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
                <Table>
                    {/* ===== TABLE HEADER ===== */}
                    <TableHead>
                        <TableRow className="bg-[#F8FAFC]">
                            <TableCell className="text-[11px] font-bold uppercase tracking-wide text-[#64748B] border-b border-[#F1F5F9]">
                                Stop
                            </TableCell>
                            <TableCell className="text-[11px] font-bold uppercase tracking-wide text-[#64748B] border-b border-[#F1F5F9]">
                                Location
                            </TableCell>
                            <TableCell className="text-[11px] font-bold uppercase tracking-wide text-[#64748B] border-b border-[#F1F5F9]">
                                Schedule
                            </TableCell>
                            <TableCell className="text-[11px] font-bold uppercase tracking-wide text-[#64748B] border-b border-[#F1F5F9]">
                                Activity
                            </TableCell>
                            <TableCell className="text-[11px] font-bold uppercase tracking-wide text-[#64748B] border-b border-[#F1F5F9]">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* ===== TABLE BODY ===== */}
                    <TableBody>
                        {shipment.stops.map((_stop, index) => (
                            <TableRow
                                key={`row_${index}`}
                                className={index % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'}
                            >
                                {/* STOP NUMBER */}
                                <TableCell className="py-4 font-extrabold text-[#0F172A]">
                                    {String(index + 1).padStart(2, '0')}
                                </TableCell>

                                {/* LOCATION */}
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-[#0F172A]">
                                            {_stop.stop_name}
                                        </span>
                                        {_stop.stop_description && (
                                            <span className="text-xs text-[#64748B]">
                                                {_stop.stop_description}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>

                                {/* SCHEDULE */}
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-[#0F172A]">
                                            {_stop.stop_starting_at_date}
                                        </span>
                                        <span className="text-xs text-[#64748B]">
                                            {_stop.stop_starting_at_time}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* ACTIVITY (API DRIVEN – EMPTY IF NOT PRESENT) */}
                                <TableCell className="py-4 text-sm text-[#64748B]">
                                    {_stop.activity || '—'}
                                </TableCell>

                                {/* STATUS (API DRIVEN – EMPTY IF NOT PRESENT) */}
                                <TableCell className="py-4">
                                    {_stop.status ? (
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EEF2FF] text-[#3730A3]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#3730A3]" />
                                            {_stop.status}
                                        </span>
                                    ) : (
                                        '—'
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}

export default ShipmentStops;