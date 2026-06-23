
const date = {

    getMonths: function(text){

        var months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'};

        text = text || false;

        if(!text){
            return months;
        }
        return months[text];
    },
    
    formattedDate: function(date, short_year, with_time){

        short_year = short_year || false;
        with_time = with_time || false;

        if(typeof date === 'string'){
            var _date = date.split('-');
            var month = this.getMonths(parseInt(_date[1]));

            var year = _date[0];
            if(short_year){
                year = year.substring(2, 4);
            }
            return _date[2] + ' ' + month + ', ' + year;
        
        }else if(typeof date === 'object'){

            var _date = date.getDate();
            var _month = date.getMonth();

            var final_date = _date + ' ' + this.getMonths(parseInt(_month) + 1) + ', ' + date.getFullYear();

            if(!with_time){

                return final_date;
            }
            return final_date + ' ' + this.formatTime(date);
        }

        var _date = date.day + ' ' + this.getMonths(date.month) + ', ' + date.year;
        return _date;
    },

    formatTime: function(date){

        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    },

    formatData: function(date, with_time){

        with_time = with_time || false;

        if(typeof date === 'string'){
            var _date = date.split('-');

            let month = _date[1];

            return _date[0] + '-' + month + '-' + _date[2];
        
        }else if(typeof date === 'object'){

            var _date = date.getDate();
            var _month = date.getMonth();

            _month = parseInt(_month) + 1;

            if(_month <= 9){
                
                _month = '0' + _month;
            }

            var final_date = date.getFullYear() + '-' + (_month) + '-' + _date;

            if(!with_time){

                return final_date;
            }
            return final_date + ' ' + date.getHours() + ':' + date.getMinutes() + ':00';
        }

        let month = this.getMonths(date.month);

        if(month.length === 1){
                
            month += '0' + month;
        }

        var _date = date.day + ' ' + (month) + ', ' + date.year;
        return _date;
    },

    dateToYMD: function(date){

        if(typeof date === 'object'){

            var _date = date.getDate();
            var _month = date.getMonth();

            var month = parseInt(_month) + 1;

            return date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (_date < 10 ? '0' + _date : _date);
        }
    },

    dateToTime: function(date){

        if(typeof date === 'object'){

            var _hours = date.getHours();
            var _minutes = date.getMinutes();

            return _hours + ' ' + _minutes;
        }
    }
}

export default date;