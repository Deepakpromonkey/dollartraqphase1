import React, { Component, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import DataTable from 'components/wd/data_table/DataTable';
import WdForm from 'components/wd/form/WdForm';

import Btn from 'components/Btn';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CloseIcon from '@mui/icons-material/Close';
import EastIcon from '@mui/icons-material/East';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';

import Api from 'api/Api';

import Main from 'components/Main';

import LayoutHelper from 'helpers/LayoutHelper'

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

const BRAND = '#1e40af';
const BRAND_SOFT = '#eff6ff';
const INK = '#0f172a';
const SUBTLE = '#64748b';
const BORDER = '#e2e8f0';

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#fff',
        transition: 'box-shadow 120ms ease, border-color 120ms ease',
        '& fieldset': {
            borderColor: BORDER,
        },
        '&:hover fieldset': {
            borderColor: '#cbd5e1',
        },
        '&.Mui-focused fieldset': {
            borderColor: BRAND,
            borderWidth: '1.5px',
        },
        '&.Mui-focused': {
            boxShadow: `0 0 0 4px ${BRAND_SOFT}`,
        },
        '&.Mui-error.Mui-focused': {
            boxShadow: '0 0 0 4px #fee2e2',
        },
    },
    '& .MuiInputLabel-root': {
        color: SUBTLE,
        '&.Mui-focused': {
            color: BRAND,
        },
    },
    '& .MuiFormHelperText-root': {
        marginLeft: '2px',
        fontSize: '12px',
    },
};

const adornmentIconSx = { fontSize: '18px', color: SUBTLE };

const RequiredLabel = ({ text }) => (
    <>
        {text}
        <Box component="span" sx={{ color: '#dc2626' }}> *</Box>
    </>
);

const sectionLabelSx = {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: SUBTLE,
    mb: 2.5,
};

function InviteUserForm({ open, onClose, roles, accountToken, usersOf, onSuccess }) {

    const [submitError, setSubmitError] = useState('');
    const [checking, setChecking] = useState({ email: false, contact: false });

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: 'onTouched',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            contact: '',
            roles: [],
        },
    });

    const checkUnique = (field, url, paramName) => (value) => {

        if (!value) {
            return true;
        }

        setChecking((c) => ({ ...c, [field]: true }));

        return new Promise((resolve) => {

            let formData = new FormData();
            formData.append('account_token', accountToken);
            formData.append(paramName, value);

            Api.post(url, formData, (res) => {

                setChecking((c) => ({ ...c, [field]: false }));

                if (res.status) {

                    if (res.code === 'd') {

                        resolve('This is already in use');
                    } else {

                        resolve(true);
                    }

                } else {

                    resolve(res.message || 'This is already in use');
                }
            });
        });
    };

    const handleClose = () => {
        reset();
        setSubmitError('');
        onClose();
    };

    const onSubmit = (data) => {
        return new Promise((resolve) => {

            let formData = new FormData();

            formData.append('account_token', accountToken);
            formData.append('users_of', usersOf);
            formData.append('first_name', data.first_name);
            formData.append('last_name', data.last_name);
            formData.append('email', data.email);
            formData.append('contact', data.contact);

            formData.append('roles', data.roles?.key ?? '');

            Api.post('app/users/invite', formData, (res) => {

                if (res.status) {

                    setSubmitError('');
                    reset();
                    onSuccess();

                } else {

                    setSubmitError(res.message);
                }

                resolve();
            });
        });
    };

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            onClose={handleClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '20px',
                        boxShadow: '0 24px 60px -16px rgba(15, 23, 42, 0.28)',
                        overflow: 'hidden',
                    }
                }
            }}
        >

            <Box
                sx={{
                    position: 'relative',
                    px: 4,
                    pt: 3.5,
                    pb: 3,
                    display: 'flex',
                    alignItems: 'flex-start',  
                    gap: 2,
                    background: `linear-gradient(135deg, ${BRAND_SOFT} 0%, #ffffff 65%)`,
                    borderBottom: `1px solid ${BORDER}`,
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: '#ffffff',
                        color: BRAND,
                        width: 44,
                        height: 44,
                        boxShadow: `0 0 0 1px ${BORDER}`,
                    }}
                >
                    <PersonAddAlt1Icon fontSize="small" />
                </Avatar>

                <Box sx={{ pt: 0.25 }}>

                    <Typography sx={{ fontSize: '18px', fontWeight: 700, color: INK, lineHeight: 1.3 }}>
                        Invite a teammate
                    </Typography>

                    <Typography sx={{ fontSize: '13px', color: SUBTLE, mt: 0.25 }}>
                        They'll get an email with steps to set up their account.
                    </Typography>

                </Box>

                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        color: SUBTLE,
                        '&:hover': { backgroundColor: '#f1f5f9' },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>

                <DialogContent sx={{ px: 4, py: 3.5, backgroundColor: '#fafbfc' }}>

                    <Box sx={{mb: 2.5, p: 2.5, backgroundColor: '#fff', border: `1px solid ${BORDER}`, borderRadius: '14px'}}>

                        <Typography sx={sectionLabelSx}>Personal details</Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>

                            <TextField
                                label={<RequiredLabel text="First name" />}
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                error={!!errors.first_name}
                                helperText={errors.first_name?.message || ' '}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon sx={adornmentIconSx} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                {...register('first_name', { required: 'First name is required' })}
                            />

                            <TextField
                                label={<RequiredLabel text="Last name" />}
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                error={!!errors.last_name}
                                helperText={errors.last_name?.message || ' '}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlineIcon sx={adornmentIconSx} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                                {...register('last_name', { required: 'Last name is required' })}
                            />

                            <TextField
                                label={<RequiredLabel text="Email" />}
                                type="email"
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                error={!!errors.email}
                                helperText={errors.email?.message || (checking.email ? 'Checking availability…' : ' ')}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MailOutlineIcon sx={adornmentIconSx} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: checking.email ? (
                                            <InputAdornment position="end">
                                                <CircularProgress size={14} sx={{ color: SUBTLE }} />
                                            </InputAdornment>
                                        ) : null,
                                    },
                                }}
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Enter a valid email address',
                                    },
                                    validate: checkUnique('email', 'app/users/unique/email', 'email'),
                                })}
                            />

                            <TextField
                                label={<RequiredLabel text="Mobile" />}
                                fullWidth
                                size="small"
                                sx={fieldSx}
                                error={!!errors.contact}
                                helperText={errors.contact?.message || (checking.contact ? 'Checking availability…' : ' ')}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PhoneIphoneIcon sx={adornmentIconSx} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: checking.contact ? (
                                            <InputAdornment position="end">
                                                <CircularProgress size={14} sx={{ color: SUBTLE }} />
                                            </InputAdornment>
                                        ) : null,
                                    },
                                }}
                                {...register('contact', {
                                    required: 'Mobile number is required',
                                    pattern: {
                                        value: /^\d{10,}$/,
                                        message: 'Numbers only, at least 10 digits',
                                    },
                                    validate: checkUnique('contact', 'app/users/unique/mobile', 'contact'),
                                })}
                            />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            p: 2.5,
                            backgroundColor: '#fff',
                            border: `1px solid ${BORDER}`,
                            borderRadius: '14px',
                        }}
                    >
                        <Typography sx={sectionLabelSx}>Access</Typography>

                        <Controller
                            name="roles"
                            control={control}
                            rules={{
                                required: 'Please select a role',
                            }}
                            render={({ field }) => (
                                <Autocomplete
                                    size="small"
                                    options={roles}
                                    value={field.value || null}
                                    onChange={(e, value) => field.onChange(value)}
                                    onBlur={field.onBlur}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option?.value ?? ''
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                        option?.key === value?.key
                                    }
                                    slotProps={{
                                        popper: {
                                            style: { zIndex: 1400 },
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={<RequiredLabel text="Role" />}
                                            placeholder="Select a role"
                                            error={!!errors.roles}
                                            helperText={errors.roles?.message || ' '}
                                            sx={fieldSx}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Box>

                    {submitError && (
                        <Box
                            sx={{
                                mt: 2, display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: '10px', backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                            }}
                        >
                            <ErrorOutlineIcon sx={{ fontSize: '18px', color: '#dc2626' }} />
                            <Typography sx={{ fontSize: '13px', color: '#b91c1c' }}>
                                {submitError}
                            </Typography>
                           
                        </Box>
                    )}

                </DialogContent>

                <DialogActions
                    sx={{
                        px: 4,
                        py: 2.5,
                        borderTop: `1px solid ${BORDER}`,
                        backgroundColor: '#ffffff',
                    }}
                >
                    <Button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        sx={{color: SUBTLE, fontWeight: 600, textTransform: 'none', borderRadius: '10px', px: 2,}}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        endIcon={isSubmitting ? null : <EastIcon sx={{ fontSize: '16px' }} />}
                        startIcon={isSubmitting ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
                        sx={{
                            backgroundColor: BRAND,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '10px',
                            px: 2.5,
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#1c3899',
                                boxShadow: 'none',
                            },
                            '&.Mui-disabled': {
                                backgroundColor: '#94a3b8',
                                color: '#ffffff',
                            },
                        }}
                    >
                        {isSubmitting ? 'Sending…' : 'Send invite'}
                    </Button>
                </DialogActions>

            </form>

        </Dialog>
    );
}

    class UsersList extends Component {

        constructor(props) {
            super();
            this.state = {

                error_message: '',
                success_message: '',

                user: false,

                account_token: false,

                roles: [],

                do_reload: false,

                row_id: false,

                add_new: false,

                invite_user: false,
            }
        }
        componentDidMount = () => {

            let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
            let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

            if (account_token) {

                this.setState({account_token: account_token,user: JSON.parse(user)});

                let formData = new FormData();
                formData.append('account_token', account_token);

                Api.post('app/customer/roles/init', formData, (data) => {

                    console.log('Roles API Response =>', data);

                    if (data.status) {

                        this.setState({roles: data.roles});
                    }
                });
            }
        }

        render(){

            return (

                <Main
                    page="users"
                    active_page="users"
                    title="Users"
                    subtitle="Enter carrier details to activate live telemetry and predictive delivery windows."
                    error_message={this.state.error_message}
                    success_message={this.state.success_message}

                    title_action={[
                        {
                            key: 'users_add',
                            label: 'Add User',
                            onClick: () => {
                                this.setState({ add_new: true });
                            }
                        },
                        {
                            key: 'users_invite',
                            label: 'Invite',
                            backgroundColor: '#ffffff',
                            textColor: '#0f172a',
                            borderColor: '#e2e8f0',
                            icon: 'person_add',
                            onClick: () => {
                                this.setState({ invite_user: true });
                            }
                        }
                        ]}
                >

                    <DataTable
                        index="users"
                        label="Users"

                        active_row={this.state.active_row}

                        do_reload={this.state.do_reload}
                        relaodDone={() => {

                            this.setState({do_reload: false});
                        }}

                        columns={[
                            {name: 'First Name', column: 'first_name', sortable: true, renderer: (row) => <span className="font-bold">{row.first_name}</span>},
                            {name: 'Last Name', column: 'last_name', sortable: true},
                            {name: 'Email', column: 'email', sortable: true},
                            {name: 'Mobile', column: 'contact', sortable: true, renderer: (row) => <span className="font-bold">{row.contact}</span>},
                            {name: 'Roles',column: 'role_names',sortable: true,hide_search: true},
                            {name: 'Created On', column: 'added_on_formatted', sortable: true, hide_search: true}
                        ]}

                        row_actions={(row, row_index) => {

                            return (

                                <div className="hoverable-action">
                                    <div className="align-start">

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
                                            <ArrowForwardIcon
                                            sx={{
                                                fontSize: '12px',
                                                transform: 'scale(0.75, 0.9)',
                                            }}
                                            />
                                        }
                                        onClick={() => {this.setState({row_id: row.row_id,add_new: true,});}}>
                                        View
                                        </Btn>
                                    </div>
                                </div>
                            )
                        }}

                        default_sort_by="added_on"

                        api_url="app/users"

                        account_token={this.state.account_token}
                        
                        row_id="row_id"
                    />

                    <WdForm                        
                        drawer={true}
                        open={this.state.add_new}
                        position="center"
                        size="medium"
                        
                        title='Sub User'
                        back_label="Cancel"
            
                        submit_url='app/users/save'
                        data_url='app/users/single'
            
                        onSubmit={(result) => {
            
                            this.setState({add_new: false, row_id: false, do_reload: true})
                        }}
                        onBack={() => {
            
                            this.setState({add_new: false, row_id: false})
                        }}

                        post_fields={[
                            {key: 'users_of', value: this.state.user.row_id}
                        ]}
                    
                        row_id={this.state.row_id}
                        id="row_id"
                        title_field="first_name"
                        updated_on="updated_on_formatted"
                                                
                        fields={{
                            rows: [
                                {
                                    fields: [
                                        {key: 'first_name', type: 'input', name: 'first_name', label: 'First Name', validations: ['r'], span: 6},
                                        {key: 'last_name', type: 'input', name: 'last_name', label: 'Last Name', validations: ['r'], span: 6},
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'email', type: 'input', name: 'email', label: 'Email', validations: ['r', 'email', 'unique|app/users/unique/email'], span: 6},
                                        {key: 'contact', type: 'input', name: 'contact', label: 'Mobile', validations: ['r', 'number', 'min-10', 'unique|app/users/unique/mobile'], span: 6},
                                    ]
                                },
                                {
                                    fields: [
                                        {key: 'password',type: 'input',name: 'password',label: 'Password',validations: ['r', 'min-6'],span: 6},
                                        {key: 'roles',type: 'dropdown',name: 'roles',label: 'Roles',validations: ['r'],span: 6,options: this.state.roles}
                                    ]
                                },
                            ]
                        }}
                    />

                    <InviteUserForm
                        open={this.state.invite_user}
                        onClose={() => this.setState({ invite_user: false })}
                        roles={this.state.roles}
                        accountToken={this.state.account_token}
                        usersOf={this.state.user.row_id}
                        onSuccess={() => {

                            this.setState({ invite_user: false, success_message: 'Invitation sent successfully.', do_reload: true });

                            setTimeout(() => {
                                this.setState({ success_message: '' });
                            }, 5000);
                        }}
                    />
                </Main>
                
            )
        }
    }

export default UsersList;