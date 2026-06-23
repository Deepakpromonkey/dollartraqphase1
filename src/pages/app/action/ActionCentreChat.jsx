import React, { Component } from "react";

import {Box, Paper, Typography, IconButton, TextField, CircularProgress} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import Btn from "components/Btn";

import Api from "api/Api";

class ActionCentreChat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
            account_token: false,
            user: false,

            open: true,
            messages: [],
            message: "",

            sending: false,

            initing: false,

            sender_id: false,
            sender_type: "customer",
            receiver_id: 1,
            receiver_type: "driver"
        };

        this.pollingTimeout = null;
    }

    componentDidMount = () => {

        let account_token = localStorage.getItem(import.meta.env.VITE_ACCOUNT_TOKEN);
        let user = localStorage.getItem(import.meta.env.VITE_ACCOUNT_USER);

        if(account_token && user){

            let _user = JSON.parse(user)
            
            this.setState({account_token: account_token, user: _user}, () => {

                this.fetchMessages(account_token, true)

                // this.interval = setInterval(() => {
                    
                //     this.fetchMessages(this.state.account_token, false)
                // }, 3000);
            })
        }
    }

    componentWillUnmount = () => {
    
        // clearInterval(this.interval);
        clearTimeout(this.pollingTimeout);
    }

    fetchMessages = (account_token, init) => {

        clearTimeout(this.pollingTimeout);
    
        try {

            this.setState({initing: init})
            
            const formData = new FormData();

            formData.append("account_token", account_token);
            formData.append("sender_id", this.state.user.row_id);
            formData.append('sender_type', 'customer');
            formData.append('receiver_id', this.props.row.shipment_driver);
            formData.append('receiver_type', 'driver');
            formData.append('shipment_id', this.props.row.shipment_row_id);

            let self = this;
            Api.post('drivers/messages/fetch', formData, function(data){

                self.setState({initing: false})

                if(data.status){

                    self.setState({
                        messages: data.chats
                    });
                }

                self.startPolling();
            });
    
        }catch (e){
      
            console.error(e);
            this.startPolling();
        }
    }

    startPolling = () => {

        this.pollingTimeout = setTimeout(() => {
            if(this.state.account_token){
            
                this.fetchMessages(this.state.account_token, false);
            }
        }, 3000);
    }

    sendMessage = async () => {
    
        if(!this.state.message.trim()) return;

        let account_token = this.state.account_token;

        const formData = new FormData();
        formData.append("account_token", account_token);
		formData.append("sender_id", this.state.user.row_id);
		formData.append('sender_type', 'customer');
		formData.append('receiver_id', this.props.row.shipment_driver);
        formData.append('receiver_type', 'driver');
        formData.append('shipment_id', this.props.row.shipment_row_id);
        formData.append('message', this.state.message);

        this.setState({sending: true})

        let self = this;
        Api.post('drivers/messages/send', formData, function(data){

            if(data.status){

                self.setState({
                    message: '',
                    sending: false
                });
            }
        });
    };

    render(){
    
        return (
            <Paper
                elevation={6}
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    width: 320,
                    height: 420,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "primary.main",
                        color: "white",
                        p: 1.2,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8
                    }}
                >
                    <Typography variant="subtitle1">Chat</Typography>
                    <IconButton size="small" onClick={() => {

                        this.props.closeChat()
                    }} sx={{ color: "white" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Messages */}
                <Box
                    sx={{
                        flex: 1,
                        p: 1,
                        overflowY: "auto",
                        bgcolor: "#f9f9f9"
                    }}
                >

                    {this.state.initing &&
                    
                        <Stack spacing={1} sx={{padding:1}}>
                            <Skeleton variant="rounded" width={'100%'} height={50} />
                            <Skeleton variant="rounded" width={'100%'} height={50} />
                            <Skeleton variant="rounded" width={'100%'} height={50} />
                            <Skeleton variant="rounded" width={'100%'} height={50} />
                            <Skeleton variant="rounded" width={'100%'} height={50} />
                            <Skeleton variant="rounded" width={'100%'} height={50} />
                        </Stack>
                    }
                    {this.state.messages.map((msg) => {
                        
                        const isMine = msg.sender_id === this.state.user.row_id && msg.sender_type === 'customer';
                        
                        return (
                            <Box
                                key={msg.id}
                                sx={{
                                    display: "flex",
                                    justifyContent: isMine ? "flex-end" : "flex-start",
                                    mb: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        maxWidth: "70%",
                                        bgcolor: isMine ? "primary.main" : "grey.300",
                                        color: isMine ? "white" : "black"
                                    }}
                                >
                                    <Typography variant="body2">{msg.message}</Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                {/* Input */}
                <Box sx={{ display: "flex", p: 1, borderTop: "1px solid #ddd" }}>
                    <TextField
                        size="small"
                        variant="outlined"
                        fullWidth
                        placeholder="Type a message..."
                        value={this.state.message}
                        onChange={(e) => this.setState({ message: e.target.value })}
                    />
                    
                    <Btn
                        onClick={this.sendMessage}
                        variant="contained"
                        icon={true}
                        disabled={this.state.sending}
                    >

                        {this.state.sending
                            ?
                                <CircularProgress size={16} color='secondary' />
                            :
                                <SendIcon style={{fontSize:20}} />
                        }
                    </Btn>
                </Box>
            </Paper>
        );
    }
}

export default ActionCentreChat;
