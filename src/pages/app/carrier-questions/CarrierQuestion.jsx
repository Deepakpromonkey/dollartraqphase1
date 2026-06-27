import React, { useState, useEffect } from 'react';

import Main from 'components/Main';
import Btn from 'components/Btn';

import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import Api from 'api/Api';

const TYPE_META = {
    yes_no: { label: 'Yes/No', color: '#1e40af' },
    text:   { label: 'Text',   color: '#065f46' },
    radio:  { label: 'Choice', color: '#92400e' },
    image:  { label: 'File',   color: '#6b21a8' },
};

const EMPTY_QUESTION = {
    row_id: null,
    question: '',
    type: '',
    required: true,
    options: [],
    sort_order: null,
};

function previewPillStyle(color) {
    return {
        fontSize: 12,
        fontWeight: 600,
        color,
        background: color + '14',
        borderRadius: 4,
        padding: '3px 10px',
    };
}

export default function CarrierQuestions() {

    const [errorMessage, setErrorMessage]     = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [accountToken, setAccountToken]     = useState(false);
    const [questions, setQuestions]           = useState([]);
    const [answerTypes, setAnswerTypes]       = useState([]);
    const [drawerOpen, setDrawerOpen]         = useState(false);
    const [editing, setEditing]               = useState(null);
    const [newOptionText, setNewOptionText]   = useState('');
    const [saving, setSaving]                 = useState(false);
    const [loading, setLoading]               = useState(true);

    const showError = (msg) => { setErrorMessage(msg); setTimeout(() => setErrorMessage(''), 4000);};

    const showSuccess = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(''), 3000);};

    useEffect(() => {

        const token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);

        if (!token) {
            setLoading(false);
            return;
        }

        setAccountToken(token);

        const typesFormData = new FormData();
        typesFormData.append('account_token', token);

        Api.post('app/customer/answer_types/init', typesFormData, (data) => {
            if (data.status) {
                setAnswerTypes(data.answer_types);
            }
        });

        const listFormData = new FormData();
        listFormData.append('account_token', token);
        listFormData.append('type', 'Carrier Questions');

        Api.post('app/customer/question/list', listFormData, (data) => {
            if (data.status) {
                const normalized = (data.records || []).map(q => ({
                    ...q,
                    type: q.answer_type || '',
                    options: Array.isArray(q.options) ? q.options : [],
                    required: q.is_required == 1,
                }));
                setQuestions(normalized);
            }
            setLoading(false);
        });
        
    }, []);

    const openAdd = () => {
        setEditing({ ...EMPTY_QUESTION, row_id: null });
        setNewOptionText('');
        setDrawerOpen(true);
    };

    const openEdit = (q) => {
        setEditing({ ...q, options: Array.isArray(q.options) ? [...q.options] : [] });
        setNewOptionText('');
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditing(null);
        setNewOptionText('');
    };

    const setField = (key, value) => {
        setEditing(prev => ({ ...prev, [key]: value }));
    };

    const addOption = () => {
        const text = newOptionText.trim();
        if (!text) return;
        setEditing(prev => ({ ...prev, options: [...prev.options, text] }));
        setNewOptionText('');
    };

    const removeOption = (index) => {
        setEditing(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }));
    };

    const saveQuestion = () => {

        if (!editing.question.trim()) {
            showError('Question text is required.');
            return;
        }
        if (editing.type === 'radio' && editing.options.length < 2) {
            showError('Multiple choice questions need at least 2 options.');
            return;
        }

        setSaving(true);
        setErrorMessage('');

        const sort_order = editing.row_id ? editing.sort_order : questions.length + 1;

        const formData = new FormData();
        formData.append('account_token', accountToken);
        formData.append('type', 'Carrier Questions');
        formData.append('question', editing.question);
        formData.append('answer_type', editing.type);
        formData.append('is_required', editing.required ? 1 : 0);
        formData.append('sort_order', sort_order);
        if (editing.row_id) {
            formData.append('row_id', editing.row_id);
        }

        Api.post('app/customer/question/save', formData, (data) => {
            setSaving(false);
            if (data.status) {
                if (editing.row_id) {
                    setQuestions(prev =>
                        prev.map(q => q.row_id === editing.row_id ? { ...editing, sort_order } : q)
                    );
                    showSuccess('Question updated.');
                } else {
                    const newQ = { ...editing, row_id: data.row_id || Date.now(), sort_order };
                    setQuestions(prev => [...prev, newQ]);
                    showSuccess('Question added.');
                }
                closeDrawer();
            } else {
                showError(data.message);
            }
        });
    };

    const deleteQuestion = (row_id) => {
        const formData = new FormData();
        formData.append('account_token', accountToken);
        formData.append('row_id', row_id);

        Api.post('app/customer/question/remove', formData, (data) => {
            if (data.status) {
                setQuestions(prev => prev.filter(q => q.row_id !== row_id));
                showSuccess('Question deleted.');
            } else {
                showError(data.message);
            }
        });
    };

    const renderTypeBadge = (type) => {
        const meta = TYPE_META[type] || { label: type, color: '#374151' };
        return (
            <span style={{fontSize: 11,fontWeight: 600,color: meta.color,background: meta.color + '14',borderRadius: 4,padding: '2px 7px',letterSpacing: '0.03em',textTransform: 'uppercase',}}>
                {meta.label}
            </span>
        );
    };

    const renderQuestionPreview = (q) => {
        if (q.type === 'yes_no') {
            return (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <span style={previewPillStyle('#1e40af')}>Yes</span>
                    <span style={previewPillStyle('#6b7280')}>No</span>
                </div>
            );
        }
        if (q.type === 'text') {
            return (
                <div style={{ marginTop: 4, height: 28, background: '#f3f4f6', borderRadius: 6, border: '1px solid #e5e7eb' }} />
            );
        }
        if (q.type === 'radio' && (q.options || []).length > 0) {
            return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4, width: '100%' }}>
                    {(q.options || []).map((opt, i) => (
                        <span key={i} style={previewPillStyle('#6b7280')}>{opt}</span>
                    ))}
                </div>
            );
        }
        if (q.type === 'image') {
            return (
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: 12 }}>
                    <span><AttachFileIcon fontSize="xsmall" /></span>
                    <span>File / image upload</span>
                </div>
            );
        }
        return null;
    };

    const renderSkeleton = () => {
        const skeletonPulse = {
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            background: '#e5e7eb',
            borderRadius: 4
        };

        return (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: .4; }
                    }
                `}</style>
                {[1, 2, 3].map((item, index) => (
                    <div
                        key={item}
                        style={{
                            display: 'flex', alignItems: 'center', padding: '18px 24px',
                            borderTop: index === 0 ? 'none' : '1px solid #f0f0f0', gap: 16, background: '#fff'
                        }}
                    >
                        <div style={{ ...skeletonPulse, width: 14, height: 16, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ ...skeletonPulse, width: '60%', height: 16, marginBottom: 10 }} />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <div style={{ ...skeletonPulse, width: 50, height: 16 }} />
                                <div style={{ ...skeletonPulse, width: 65, height: 16 }} />
                            </div>
                        </div>
                        <div style={{ ...skeletonPulse, width: 68, height: 30, borderRadius: 6, flexShrink: 0 }} />
                    </div>
                ))}
            </div>
        );
    };

    const renderDrawer = () => {
        if (!editing) return null;
        const isEdit = !!editing.row_id;

        return (
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={closeDrawer}
                PaperProps={{ sx: { width: { xs: '100vw', sm: 480 }, p: 0 } }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ padding: '20px 24px 18px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                                {isEdit ? 'Edit question' : 'Add question'}
                            </div>
                            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                                {isEdit ? 'Update the question details below.' : 'Fill in the details for the new question.'}
                            </div>
                        </div>
                        <IconButton onClick={closeDrawer} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '24px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
                        <TextField
                            label="Question"
                            fullWidth
                            multiline
                            rows={3}
                            size="small"
                            value={editing.question}
                            onChange={e => setField('question', e.target.value)}
                            placeholder="e.g. Do you have a valid motor carrier authority?"
                            sx={{ mb: 3 }}
                        />

                        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                            <InputLabel>Answer type</InputLabel>
                            <Select
                                value={editing.type}
                                label="Answer type"
                                onChange={e => setField('type', e.target.value)}
                                displayEmpty
                                renderValue={(value) => {
                                    if (!value) {
                                        return <span style={{ color: '#9ca3af' }}>Select how the carrier should respond</span>;
                                    }
                                    const match = answerTypes.find(t => t.key === value);
                                    return match ? match.value : value;
                                }}
                            >
                                {answerTypes.map(t => (
                                    <MenuItem key={t.key} value={t.key}>{t.value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={editing.required}
                                    onChange={e => setField('required', e.target.checked)}
                                    size="small"
                                    color="primary"
                                />
                            }
                            label={<span style={{ fontSize: 14, color: '#374151' }}>Required</span>}
                            sx={{ mb: 3, ml: 0 }}
                        />

                        {editing.type === 'radio' && (
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>
                                    Answer options
                                </div>

                                {editing.options.length === 0 && (
                                    <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 10 }}>
                                        No options yet. Add at least 2.
                                    </div>
                                )}

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                                    {editing.options.map((opt, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f9fafb', borderRadius: 6, padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                                            <DragIndicatorIcon sx={{ fontSize: 16, color: '#9ca3af' }} />
                                            <span style={{ flex: 1, fontSize: 14, color: '#111827' }}>{opt}</span>
                                            <IconButton size="small" onClick={() => removeOption(i)}>
                                                <CloseIcon sx={{ fontSize: 14 }} />
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        placeholder="Add option..."
                                        value={newOptionText}
                                        onChange={e => setNewOptionText(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addOption(); } }}
                                    />
                                    <Btn
                                        size="small"
                                        variant="outlined"
                                        onClick={addOption}
                                        startIcon={<AddIcon />}
                                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                                    >
                                        Add
                                    </Btn>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 28, padding: '16px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', width: '100%', boxSizing: 'border-box' }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
                                {editing.question || <span style={{ color: '#9ca3af' }}>Your question will appear here</span>}
                            </div>

                            {renderQuestionPreview(editing)}

                            <div style={{ marginTop: 8 }}>
                                {renderTypeBadge(editing.type)}
                                {editing.required && (
                                    <span style={{ marginLeft: 6, fontSize: 11, color: '#6b7280' }}>· required</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                        {isEdit && (
                            <Btn
                                size="small"
                                variant="text"
                                startIcon={<DeleteOutlineIcon />}
                                style={{ color: '#ef4444', fontSize: 13 }}
                                confirm
                                confirm_message="Delete this question? This cannot be undone."
                                onClick={() => {
                                    deleteQuestion(editing.row_id);
                                    closeDrawer();
                                }}
                            >
                                Delete
                            </Btn>
                        )}

                        <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
                            <Btn
                                variant="outlined"
                                size="small"
                                onClick={closeDrawer}
                                style={{ borderRadius: 50, padding: '8px 22px', fontSize: 13, border: '1px solid rgba(0,0,0,.2)', color: 'rgba(0,0,0,.7)', background: '#fff' }}
                            >
                                Cancel
                            </Btn>
                            <Btn
                                variant="contained"
                                size="small"
                                loading={saving}
                                endIcon={<ArrowForwardIcon style={{ fontSize: 16 }} />}
                                onClick={saveQuestion}
                                style={{ borderRadius: 50, padding: '8px 22px', fontSize: 13, background: '#3877DA', color: '#fff', boxShadow: 'none' }}
                            >
                                {isEdit ? 'Update' : 'Save'}
                            </Btn>
                        </div>
                    </div>
                </div>
            </Drawer>
        );
    };

    return (
        <Main
            page="carrier-questions"
            active_page="carrier-questions"
            title="Carrier Questions"
            subtitle="Custom questionnaire every carrier answers during onboarding."
            error_message={errorMessage}
            success_message={successMessage}
            title_action={[{key: 'add_question',label: 'Add question',onClick: openAdd,}]}
        >
            <div>
                {loading ? (
                    renderSkeleton()
                ) : questions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>No questions yet</div>
                        <div style={{ fontSize: 13 }}>Click <strong>Add question</strong> to get started.</div>
                    </div>
                ) : (
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
                        {questions.map((q, index) => (
                            <div
                                key={q.row_id}
                                style={{
                                    display: 'flex',alignItems: 'center',padding: '18px 24px',borderTop: index === 0 ? 'none' : '1px solid #f0f0f0',gap: 16, background: '#fff',
                                }}
                            >
                                <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600, minWidth: 24, flexShrink: 0 }}>
                                    {index + 1}.
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                                        {q.question}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {renderTypeBadge(q.type)}

                                        <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                            · {q.required ? 'required' : 'optional'}
                                        </span>

                                        {q.type === 'radio' && (q.options || []).length > 0 && (
                                            <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                                · {q.options.length} options
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <Btn
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon sx={{ fontSize: 14 }} />}
                                    onClick={() => openEdit(q)}
                                    style={{fontSize: 12,fontWeight: 600,borderRadius: 6,padding: '5px 14px',border: '1px solid #e5e7eb',color: '#374151',background: '#fff',boxShadow: 'none',flexShrink: 0,}}
                                >
                                    Edit
                                </Btn>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {renderDrawer()}
        </Main>
    );
}