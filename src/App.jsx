import './assets/styles/theme.css';

import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles'

import {BrowserRouter, Route, Routes as Switch} from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import WdFormRouter from 'pages/app/WdFormRouter';

import NoPage from 'pages/app/NoPage';

import Signin from 'pages/auth/Signin';
import Logout from 'pages/auth/Logout';

import Dashboard from 'pages/app/Dashboard';

import TrackShipmentForm from 'pages/app/shipment/TrackShipmentForm';

import ControlTowerList from 'pages/app/control_tower/ControlTowerList';
import ControlTowerShipment from 'pages/app/control_tower/ControlTowerShipment';

import ShipmentCarriers from 'pages/app/shipment/ShipmentCarriers';

import UsersList from 'pages/app/users/UsersList';

import LoadSearch from 'pages/app/search/LoadSearch';

import ActionCentre from 'pages/app/action/ActionCentre';

import Subscriptions from 'pages/app/subscriptions/Subscriptions';

import ProfileUpdate from 'pages/app/profile/ProfileUpdate';
import ProfilePassword from 'pages/app/profile/ProfilePassword';
import ShortlistedCarriers from 'pages/app/profile/ShortlistedCarriers'

import CarrierSearch from 'pages/app/carriers/CarrierSearch';
import CarrierProfile from 'pages/app/carriers/CarrierProfile';

import PricingPage from 'pages/app/pricing/PricingPage';

import OnboardPage from 'pages/app/connect';
import CarrierNoData from 'pages/app/connect/CarrierNoData';

import CarrierQuestions from 'pages/app/carrier-questions/CarrierQuestion';

import CarrierConnect from 'pages/app/CarrierConnect/CarrierConnect';


function App(){

    const theme = createTheme({

        body: {
            fontSize: 12, fontFamily: 'Inter'
        },
        typography: {
            fontFamily: [
                'Inter'
            ],
        },
        shadows: [
            "none",
            "0px 15px 60px rgba(0, 0, 0, 0.25)",
            "5px 25px 60px rgba(0, 0, 0, 0.25)",
            "10px 35px 60px rgba(0, 0, 0, 0.25)",
            "15px 45px 60px rgba(0, 0, 0, 0.25)",
            ...Array(20).fill('none')
        ],
        components: {
            MuiButton: {
                styleOverrides: {
                    root: ({ ownerState }) => ({
                        
                        fontSize: 13,
                        padding: '10px 50px',
                        transition: '.2s all ease-in-out',
                        borderRadius: 50,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        color: 'rgb(106, 130, 251)',
                        "&:disabled": {
                            color: "rgba(255,255,255,.6)"
                        },
                        background: "#CE0000",
                        "&:hover": {
                            background: "rgba(56, 119, 218, 1)",
                            boxShadow: 'none'
                        },

                        ...(ownerState.size === 'small' && {

                            fontSize: 12,
                            paddingTop: 6,
                            paddingBottom: 6,
                            paddingLeft: 20,
                            paddingRight: 20
                        }),
                        ...(ownerState.size === 'large' && {

                            fontSize: 15,
                            paddingTop: 8,
                            paddingBottom: 8
                        }),

                        ...(ownerState.variant === 'contained' && {

                            ...(ownerState.color === 'primary' && {
                                
                                boxShadow: 'none',
                                borderRadius: '10px',
                                fontWeight: "bold",
                                background: '#31B693',
                                "&:hover": {
                                    background: "#333",
                                    boxShadow: 'none'
                                },
                                color: '#ffffff',
                            }),
                            ...(ownerState.color === 'secondary' && {

                                background: '#3877DA',
                                color: 'rgba(255, 255, 255, 1)',
                                boxShadow: 'none',
                                border: '0 none',
                                "&:hover": {
                                    background: "rgba(56, 119, 218, .8)",
                                    color: '#fff',
                                    boxShadow: 'none'
                                },
                            }),
                            ...(ownerState.color === 'success' && {

                                background: 'rgba(27, 168, 71, 1)',
                                color: '#fff',
                                boxShadow: 'none',
                                borderRadius: 5,
                                border: '0 none',
                                "&:hover": {
                                    background: "rgba(27, 168, 71, .8)",
                                    boxShadow: 'none'
                                },
                            }),
                        }),

                        ...(ownerState.variant === 'outlined' && {

                            ...(ownerState.color === 'secondary' && {

                                background: '#fff',
                                border: '1px solid #ce0000',
                                borderRadius: 50,
                                padding: '10px 30px',
                                color: 'rgba(0,0,0,.7)',
                                boxShadow: '0 5px 5px rgba(0,0,0,.06)',
                                "&:hover": {
                                    background: "rgba(206, 0, 0, .1)",
                                    border: '1px solid #ce0000',
                                },
                            }),

                            ...(ownerState.color === 'primary' && {

                                ...(ownerState.size === 'small' && {

                                    background: 'transparent',
                                    border: '1px solid rgb(106, 130, 251, .9)',
                                    color: 'rgb(106, 130, 251, .9)',
                                    "&:hover": {
                                        background: "rgb(106, 130, 251, 1)",
                                        border: '1px solid rgb(106, 130, 251, .9)',
                                        color: '#fff',
                                    },
                                    paddingTop: 1,
                                    paddingBottom: 1,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                    fontSize: 12,
                                    alignSelf: 'center'
                                })
                            }),
                        }),

                        ...(ownerState.variant === 'text' && {

                            ...(ownerState.color === 'primary' && {

                                background: 'tranparent',
                                color: 'rgba(0, 0, 0, .7)',
                                borderRadius: '100px',
                                "&:hover": {
                                    background: "rgba(56, 119, 218, .2)",
                                },
                            }),

                            ...(ownerState.color === 'secondary' && {

                                background: 'tranparent',
                                color: '#fff',
                                "&:hover": {
                                    background: "rgba(206, 0, 0, .1)",
                                },
                            }),
                        })
                    })
                }
            },
            MuiCircularProgress: {
                styleOverrides: {

                    root: ({ ownerState }) => ({

                        ...(ownerState.color === 'primary' && {

                            color: '#ffffff'
                        }),
                        ...(ownerState.color === 'secondary' && {

                            color: 'rgb(42,35,108)'
                        })
                    })
                }
            },
            MuiPaper: {
                styleOverrides: {

                    root: {
                        backgroundColor: '#ffffff'
                    }
                }
            },
            MuiOutlinedInput: {
                styleOverrides: {

                    notchedOutline: {
                        borderWidth: 1,
                        borderRadius: 0,
                        top: 0
                        // display: 'none'
                    },
                    root: ({ ownerState }) => ({
                        backgroundColor: '#fff',
                        padding: '3px 5px',

                        ...(ownerState.size === 'small' && {

                            padding: '8px 10px',
                            borderRadius: 12,

                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: 12,
                            },
                        }),
                    }),
                    
                }
            },
            MuiInputLabel: {
                styleOverrides: {

                    outlined: ({ ownerState }) => ({

                        ...(ownerState.size === 'small' && {

                            fontSize: 14,
                            transform: 'translate(0px, -18px) scale(1)',
                           color: '#94A3B8'
                        }),

                        ...(ownerState.size === 'medium' && {

                            fontSize: 14,
                            transform: 'translate(0px, -20px) scale(1)',
                            color: '#94A3B8'
                        }),
                    }),
                }
            },

            MuiFormHelperText: {
                styleOverrides: {
                
                    root: {
                        marginLeft: 0
                    }
                }
            },

            MuiInputBase: {
                styleOverrides: {
                    formControl: {
                        'label[data-shrink=false].MuiFormLabel-root ~ & ::placeholder': {
                            opacity: '.6 !important',
                        },
                    }
                }
            },

            // MuiInputBase: {
            //     styleOverrides: {

            //         inputSizeSmall: {
            //             height: '2rem',
            //             fontSize: 15,
            //             borderRadius: 0,
            //         },

            //         multiline: {
            //             borderRadius: 0
            //         }
            //     }
            // },
            // MuiOutlinedInput: {
            //     styleOverrides: {

            //         input: {
            //             borderRadius: 10
            //         }
            //     }
            // },
            MuiToolbar: {
                styleOverrides: {
                    root: {
                        minHeight: '50px'
                    }
                }
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        borderRadius: '20px'
                    }
                }
            },
            MuiChip: {
                styleOverrides: {
                    root: ({ ownerState }) => ({
                        fontSize: '13px',
                        fontWeight: 600,
                        padding: '16px 14px', 
                        borderRadius: '50px',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        textTransform: 'none', 

                        ...(ownerState.color === 'error' && {
                            backgroundColor: '#fff1f1', 
                            borderColor: '#fcdede',    
                            color: '#b82c2c',          
                        }),

                        ...(ownerState.color === 'success' && {
                            backgroundColor: '#f0fbf7', 
                            borderColor: '#d2f3e8',    
                            color: '#117b5d',          
                        }),

                        ...(ownerState.color === 'primary' && {
                            backgroundColor: '#f0f4f9', 
                            borderColor: '#d9e2ec',    
                            color: '#0b3c75',          
                        }),

                        ...(ownerState.color === 'secondary' && {
                            backgroundColor: '#f5f3ff', 
                            borderColor: '#e5e1fa',    
                            color: '#553c9a',          
                        }),
                        
                        ...(ownerState.color === 'warning' && {
                            backgroundColor: '#fff9f2',
                            borderColor: '#ffeacc',
                            color: '#b76200',
                        })
                    })
                }
            }
        }
    })

    function ScrollHandler() {

    const location = useLocation();

    useEffect(() => {

        window.scrollTo(0, 0);

    }, [location.pathname]);

    return null;
}

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter basename={'/'}>

                  <ScrollHandler />

                    <Switch>
                
                        <Route exact={true} path='/' element={<Signin />} />

                        <Route path="/logout" element={<Logout />}>
                                
                            <Route path=':auto_logout' element={<Logout />} />
                        </Route>
                        
                        <Route exact={true} path='/dashboard' element={<Dashboard />} />

                        <Route exact={true} path='/control-tower' element={<ControlTowerList />} />

                        <Route exact={true} path='/shipment' element={<ControlTowerShipment />}>
                            <Route exact={true} path=':row_id' element={<ControlTowerShipment />} />
                        </Route>

                        <Route exact={true} path='/track-shipment' element={<TrackShipmentForm />}>
                            <Route exact={true} path=':step' element={<TrackShipmentForm />}>
                                <Route path=':row_id' element={<TrackShipmentForm />} />
                            </Route>
                        </Route>

                        <Route exact={true} path='/load-search' element={<LoadSearch />} />

                        <Route exact={true} path='/action-centre' element={<ActionCentre />} />

                        <Route exact={true} path='/subscriptions' element={<Subscriptions />} />

                        <Route exact={true} path='/carriers' element={<ShipmentCarriers />} />

                        <Route exact={true} path='/users' element={<UsersList />} />

                        <Route path="/carriers/search" element={<CarrierSearch />} />
                        <Route path="/carriers/:row_id" element={<CarrierProfile />} />

                        <Route exact={true} path='/profile' element={<ProfileUpdate />} />
                        <Route exact={true} path='/profile/password' element={<ProfilePassword />} />
                        <Route exact={true} path='/profile/carriers/shortlisted' element={<ShortlistedCarriers />}/>

                        <Route exact={true} path='/pricing' element={<PricingPage />} />

                        <Route exact={true} path='/carrier/connect' element={<OnboardPage />}>
                            <Route exact={true} path=':row_id' element={<OnboardPage />} />
                        </Route>

                        <Route exact={true} path='/carrier/invalid-access' element={<CarrierNoData />} />

                        <Route exact={true} path='/carrier-questions' element={<CarrierQuestions />} />

                        <Route exact={true} path='/connected' element={<CarrierConnect />} /> 

                        <Route exact={true} path='/edit' element={<WdFormRouter />}>
                            <Route path=':main_route' element={<WdFormRouter />}>
                                <Route path=':module' element={<WdFormRouter />}>
                                    <Route path=':action' element={<WdFormRouter />}>
                                        <Route path=':row_id' element={<WdFormRouter />} />
                                    </Route>
                                </Route>
                            </Route>
                        </Route>

                        <Route exact={true} path='/edit' element={<WdFormRouter />}>
                            <Route path=':main_route' element={<WdFormRouter />}>
                                <Route path=':module' element={<WdFormRouter />}>
                                    <Route path=':action' element={<WdFormRouter />}>
                                        <Route path=':sub_action' element={<WdFormRouter />}>
                                            <Route path=':row_id' element={<WdFormRouter />} />
                                        </Route>
                                    </Route>
                                </Route>
                            </Route>
                        </Route>

                        <Route path="*" element={<NoPage />} />
                    </Switch>
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
