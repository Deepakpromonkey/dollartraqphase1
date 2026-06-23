import React, { Component } from 'react';

import { TableRow, TableCell, FormControl, FormControlLabel, Select, Switch, Button, IconButton, InputLabel, MenuItem } from '@material-ui/core';

import { Clear } from '@material-ui/icons';

class WeekDay extends Component { 
    constructor(props) {
        super();

        this.state = {
            
            add_slot: false,

            has_error: false,

            session: '',
            start_time: '',
            end_time: ''
        }
    }

    renderHours = (slots, day) => {

        var html = [];

        if(slots.slots && slots.slots.length > 0){

            slots.slots.forEach((_slot, index) => {

                html.push(
                    <div key={day + "_" + index} className="space-between has-hoverable-action" style={{borderBottom:'1px solid rgba(0,0,0,.1)', padding:2}}>
                        <label style={{width:90}}>{this.renderTime(_slot.session)}</label>
                        <label>{this.renderTime(_slot.start)}</label>
                        <label>{this.renderTime(_slot.end)}</label>
                        <IconButton onClick={() => {
                            this.props.removeSlot(day, index)
                        }} className="hoverable-action" size="small" color="secondary">
                            <Clear style={{fontSize:18}} />
                        </IconButton>
                    </div>
                )
            });
        }

        return html;
    }

    render () {

        const day = this.props.day;

        if(day){
            return (

                <TableRow>

                    <TableCell component="th" width="20%" style={{verticalAlign:'top'}}>{this.props.day.toUpperCase()}</TableCell>
                    <TableCell width="20%" style={{verticalAlign:'top'}}>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.props.working_days.hasOwnProperty(day) ? true : false}
                                    onChange={(e) => {
                                        this.props.updateSwitch(day)
                                    }}
                                    color="primary"
                                />
                            }
                            label={this.props.working_days.hasOwnProperty(day) ? 'Open' : 'Closed'}
                        />

                    </TableCell>
                    <TableCell width="60%">
                        <div>

                            {this.props.working_days.hasOwnProperty(day)
                                ?

                                    <>

                                        <div style={{width:300}}>
                                            {this.renderHours(this.props.working_days[day], day)}
                                        </div>

                                        {this.state.add_slot
                                            ?
                                                this.hoursDropdowns(day)
                                            :
                                                <Button onClick={() => {

                                                    this.setState({add_slot: true})
                                                    
                                                }} size="small" color="primary">Add Slots</Button>
                                        }
                                    </>
                                :
                                    null
                            }

                            {this.state.has_error &&
                                <p style={{color:'#EB5733'}}>Required entry</p>
                            }
                        </div>
                    </TableCell>
                </TableRow>
            )
        }else{

            return null
        }
    }

    hoursDropdowns = (name) => {

        var _working_days = this.state.working_days;

        var day_data = false;
        if(_working_days){
            day_data = _working_days[name];
        }

        return (
            <div key={name} className="space-between hours-block">

                <div style={{flex:1, marginBottom:10}}>

                    <FormControl
                        style={{width:'20%', marginRight:10}}
                        error={this.state.has_error}
                    >
                        <InputLabel id={"start_day_select_session_" + name} style={{fontSize:13}}>Session</InputLabel>
                        <Select
                            name={name+"_session"}
                            labelId={"start_day_select_session_" + name}
                            id={name + "_session"}
                            value={this.state.session}
                            onChange={(value) => {

                                this.setState({session: value.target.value})
                            }}
                        >

                            <MenuItem value="breakfast">Breakfast</MenuItem>
                            <MenuItem value="lunch">Lunch</MenuItem>
                            <MenuItem value="dinner">Dinner</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl
                        style={{width:'35%'}}
                        error={this.state.has_error}
                    >
                        <InputLabel id={"start_day_select_label_" + name} style={{fontSize:13}}>Start Time</InputLabel>
                        <Select
                            name={name+"_starting"}
                            labelId={"start_day_select_label_" + name}
                            id={name + "_starting"}
                            value={this.state.start_time}
                            onChange={(value) => {

                                this.setState({start_time: value.target.value})
                            }}
                        >

                            {this.startingHours(name, day_data)}
                        </Select>
                    </FormControl>

                    <FormControl
                        style={{width:'35%', marginLeft:'5%'}}
                        error={this.state.has_error}
                    >
                        <InputLabel id={"end_day_select_label_" + name} style={{fontSize:13}}>End Time</InputLabel>
                        <Select
                            name={name+"_ending"}
                            labelId={"end_day_select_label_" + name}
                            id={name + "_ending"}
                            value={this.state.end_time}
                            onChange={(value) => {
                                
                                this.setState({end_time: value.target.value})
                            }}
                        >

                            {this.endingHours(name, day_data)}
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <Button size="small" color="primary" variant="contained" onClick={() => {

                        if(this.state.start_time != '' && this.state.end_time != ''){

                            this.props.addSlotTime(name, {session: this.state.session, start: this.state.start_time, end: this.state.end_time});
                            this.setState({add_slot: false})
                        }else{

                            this.setState({has_error: true});
                        }
                    }}>Add</Button>
                    <Button size="small" color="secondary" onClick={() => {
                        
                        this.setState({add_slot: false});
                    }}>Cancel</Button>
                </div>
            </div>
        );
    }

    startingHours = (name, day_data) => {
        
        let dates = [];

        for(var i = 1; i <= 23; i++){

            var n = (i > 12) ? i - 12 : i;
            
            var _value = (i <= 11) ? i + ':00 AM' : n + ':00 PM' ;
 
            dates.push(<MenuItem key={i + '_starting_' + name} value={i}>{_value}</MenuItem>);
        }

        return dates;
    }

    endingHours = (name, day_data) => {
        
        var _choosen_start = 1;
        var start_time = this.state.start_time;

        let dates = [];

        for(var i = start_time; i <= 23; i++){

            var n = (i > 12) ? i - 12 : i;
            
            var _value = (i <= 11) ? i + ':00 AM' : n + ':00 PM' ;
 
            dates.push(<MenuItem key={i + '_ending_' + name} value={i}>{_value}</MenuItem>);
        }

        return dates;
    }

    renderTime = (time) => {

        if(time && time != ''){
        
            if(time == 'breakfast'){

                return 'Breakfast';
            }
            if(time == 'lunch'){

                return 'Lunch';
            }
            if(time == 'dinner'){

                return 'Dinner';
            }

            var n = (time > 12) ? time - 12 : time;
            var _value = (time <= 11) ? time + ':00 AM' : n + ':00 PM' ;

            return _value;
        }
    }
}

export default WeekDay;