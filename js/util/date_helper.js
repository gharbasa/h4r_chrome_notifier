/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  
  var week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; //Not used yet, TODO: show an hour ago.
  
  /**
   * Humanizes dates
   *
   * @param {String} time Either "YYYY-MM-DD" or "YYYY-MM-DD hh:mm:ss +whatever"
   * @return {String}
   */
  function dateFormat (time) {
    if (!time) {
      return '';
    }

    // if contains timestamps 2011-10-26 20:06:46 +0000
    if (typeof time === 'string' && /[\s]/.test(time)) {
      time = time.split(/[\s]/)[0];
    }
    var num_array = time.split(/[-]/); //YYYY,MM,DD
    // TODO: Refactor using startOf('day')
    var _date = new Date(num_array[0], num_array[1] - 1, num_array[2]);
    var today = new Date();
    
    var todayAtZeroHour = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var datediff = _date.getTime() - todayAtZeroHour.getTime(); //store the getTime diff - or +
    
    var days = (datediff / (24*60*60*1000));
    
    if (days === 0) {
      return Bkg.TODAY;
    } else if (days === 1) {
      return Bkg.TOMORROW;
    } else if (days === -1) {
      return Bkg.YESTERDAY;
    } else if (today.getFullYear() === _date.getFullYear()) {
      return monthNames[_date.getMonth()] + " " + getTwoDigitDate(_date);
    } else {
      return monthNames[_date.getMonth()] + " " + getTwoDigitDate(_date) + ", " + _date.getFullYear();
    }
  };
  
  //Date format input parameter: 2011-10-26 20:06:46 +0000
  function dateFormatUpdatedAt (time) {
    
    if (!time) {
      return '';
    }
    
    if(Bkg.DEBUG) console.log('dateFormatUpdatedAt input time=' + time);
    
    //var _updatedAt = new Date(num_array[0], num_array[1] - 1, num_array[2]);
    //6/29/2011 4:52:48 UTC
    var _updatedAtFullDate = getDateObj(time);
    var today_justnow = new Date();
    
    var datediff = today_justnow.getTime() - _updatedAtFullDate.getTime(); //milliseconds
    
    var hours = _updatedAtFullDate.getHours();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var minutes = _updatedAtFullDate.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    
    var hours_ago = (datediff / (60*60*1000)); //Hours
    var days = (hours_ago / 24); //days
    var hours_minutes = hours + ":" + minutes + " " + ampm; 
    var week_of_day = _updatedAtFullDate.getDay();
    //console.log("days ago=" + days);
    if(Bkg.DEBUG)
      console.log('updated_at=' + _updatedAtFullDate.toString() + ', hours_ago difference=' + hours_ago + ", days ago=" + days
                 + ",today_justnow.getDate()=" + today_justnow.getDate()
                 + ",today_justnow.getDate() - 1=" + (today_justnow.getDate() - 1)
                 + ",_updatedAtFullDate.getDate()=" + _updatedAtFullDate.getDate()
                 );
    
    if(isToday(_updatedAtFullDate, today_justnow)) {
      return hours_minutes; //Just display hh:mm
    } else if (isYesterday(_updatedAtFullDate, today_justnow)) {
      return Bkg.YESTERDAY + ' ' + hours_minutes;
    } else if (isInAWeek(_updatedAtFullDate, today_justnow)) {
      return hours_minutes + " " + week[week_of_day];    
    } else if (isInAnYear(_updatedAtFullDate, today_justnow)) {
      return monthNames[_updatedAtFullDate.getMonth()] + " " + getTwoDigitDate(_updatedAtFullDate) + ' ' + hours_minutes;
    } else {
      return monthNames[_updatedAtFullDate.getMonth()] + " " + getTwoDigitDate(_updatedAtFullDate) + ", " + _updatedAtFullDate.getFullYear() + ' ' + hours_minutes;
    }
  };
  
  function isToday(dateObj, today_justnow) {
  	if(dateObj.getFullYear() === today_justnow.getFullYear()
  	   && dateObj.getMonth() === today_justnow.getMonth()
  	   && dateObj.getDate() === today_justnow.getDate()
  	)
  	 return true;
  	else return false;
  }
  
  function isYesterday(dateObj, today_justnow) {
  	if(dateObj.getFullYear() === today_justnow.getFullYear()
  	   && dateObj.getMonth() === today_justnow.getMonth()
  	   && (dateObj.getDate() === today_justnow.getDate() - 1)
  	)
  	 return true;
  	else return false;
  }
  
  function isInAWeek(dateObj, today_justnow) {
  	if(dateObj.getFullYear() === today_justnow.getFullYear()
  	   && dateObj.getMonth() === today_justnow.getMonth()
  	   && (dateObj.getDate() >= today_justnow.getDate() - 6 
  	        && 
           dateObj.getDate() <= today_justnow.getDate() - 2)
     )
   	 return true;
  	else return false;
  }
  
  function isInAnYear(dateObj, today_justnow) {
  	if(dateObj.getFullYear() === today_justnow.getFullYear())
   	 return true;
  	else return false;
  }
  
  /*Date format input parameter: 2011-10-26 20:06:46 +0000
   * Output: Date Object
   */
  
  function getDateObj(dateStr) {
    
    if (typeof dateStr === 'string' && /[\s]/.test(dateStr)) {
      dateStr = dateStr.split(/[\s]/);
    }
    var num_array = dateStr[0].split(/[-]/); //YYYY,MM,DD
    //var _updatedAt = new Date(num_array[0], num_array[1] - 1, num_array[2]);
    //6/29/2011 4:52:48 UTC
    var _updatedAtFullDate = new Date(num_array[1] + "/" + num_array[2] + "/" + num_array[0] + " " + dateStr[1] + " UTC");
    return _updatedAtFullDate;
  }
  
  /*
   * Input param: 2.2
   * Outoput will be 2h 12m 
   */
  function timeSlice(reportedTime) {
  	if(!reportedTime)
  	  return '0h 0m';
  	
  	reportedTime = reportedTime + "";
  	
  	var formatStr = "";
    if(Bkg.DEBUG) console.log("reportedTime=" + reportedTime);
    
    var reportedTimeArr = [reportedTime]; 	
    if (typeof reportedTime === 'string' && /[\.]/.test(reportedTime)) {
      reportedTimeArr = reportedTime.split(/\./);
    }
    var hour = reportedTimeArr[0];
    formatStr = hour + "h";
    var min = reportedTimeArr[1];
    if(min) {
      min = parseInt(min);
      var no_of_digits = (min + "").length;
      var divident = "10";
      for(var i=1; i<no_of_digits; i++)
        divident += "0";
        
      if(Bkg.DEBUG) console.log("divident=" + divident);
      min = (min * 60)/parseInt(divident);
      
      formatStr += " " + Math.round(min) + "m";
    }
    return formatStr; 
  }
  
  function getTwoDigitDate(dateObj) {
    return ("0" + dateObj.getDate()).slice(-2);
  }
