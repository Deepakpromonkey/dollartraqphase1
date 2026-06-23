import React, { Component } from 'react';

import { Button, Table, TableBody, TableRow, TableCell, Switch, FormControlLabel, CircularProgress, Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@material-ui/core';

import Api from '../../../api/Api';

import WeekDay from './WeekDay';

class WeekDaysBlock extends Component { 
    constructor(props) {
        super();
        this.state = {

            working_days: {},

            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        }
    }

    componentDidMount = () => {

        if(this.props.restaurant && this.props.restaurant.working_days){

            this.setState({working_days: this.props.restaurant.working_days});
        }
    }

    updateWorkingDays = () => {

        var data = this.props.data;
        var selected_start_time = this.state.selected_start_time;
        var selected_end_time = this.state.selected_end_time;

        var active_days = {};

        if(typeof data == 'object'){

            for(var i in data){

                var day = data[i];
                active_days[day.day] = day.status == 1 ? true : false;

                if(day.starting != 0){
                    selected_start_time[day.day] = day.starting;
                }

                if(day.ending != 0){
                    selected_end_time[day.day] = day.ending;
                }
            }
        }

        if(Object.keys(active_days).length > 0){
            this.setState(active_days);
        }
        if(Object.keys(selected_start_time).length > 0){
            this.setState(selected_start_time);
        }
        if(Object.keys(selected_end_time).length > 0){
            this.setState(selected_end_time);
        }
    }

    submitForm = (event) => {

        event.preventDefault();
        const formData = new FormData(event.target);

        if(this.state.loading){
            return false;
        }

        this.setState({loading: true});
        var that = this;

        formData.append('working_days', JSON.stringify(this.state.working_days));

        formData.append('account_token', this.props.user_token);
        formData.append('restaurant_id', this.props.restaurant.restaurant_unq_id);

        Api.post('restaurants/working_days', formData, function(data){

            that.setState({loading: false});
            
            if(data.status == true){

                that.props.onSuccess(data.message)

            }else{
                that.props.onError(data.message)
            }
        });
    }

    render () {
        
        return (

            <>

                <form onSubmit={this.submitForm.bind(this)}>
                    <Table size="small">

                        <TableBody>

                            {this.renderDays()}
                        </TableBody>
                    </Table>
                    <div className="actions-right mt-15">
                        <Button variant="contained" color="primary" type="submit">Update {this.state.loading && <CircularProgress color="secondary" style={{color:'#fff', marginLeft:5}} size={24} />}</Button>
                    </div>
                </form>
            </>
        )
    }

    renderDays = () => {
        var days = this.state.days;

        return days.map((day) => {

            return (

                <WeekDay
                    day={day}
                    key={day + '_day'}

                    working_days={this.state.working_days}
                    updateSwitch={(_day) => {
                        var working_days = this.state.working_days;
                        if(working_days.hasOwnProperty(_day)){
                            
                            delete working_days[_day];
                        }else{
                            
                            working_days[_day] = {};
                            working_days[_day]['slots'] = [];
                        }
                        this.setState({working_days: working_days});
                    }}

                    addSlotTime={(_day, timings) => {

                        var working_days = this.state.working_days;
                        
                        if(!working_days.hasOwnProperty(_day)){

                            working_days[_day] = {}
                            working_days[_day]['slots'] = [];
                        }
                        
                        working_days[_day]['slots'].push(timings);

                        this.setState({working_days: working_days});
                    }}

                    removeSlot={(day, index) => {

                        var working_days = this.state.working_days;

                        if(working_days.hasOwnProperty(day) && working_days[day].hasOwnProperty('slots')){

                            if(working_days[day]['slots'].hasOwnProperty(index)){

                                delete working_days[day]['slots'][index];
                                working_days[day]['slots'] = working_days[day]['slots'].filter(_slot => _slot != null);
                            }
                        }

                        this.setState({working_days: working_days});
                    }}
                />
            );
        });
    }
}

export default WeekDaysBlock;