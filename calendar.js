/*****************************
Calendar Light V 1.0.0
mit license • by pax agency
*****************************/

var calendar = {
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
  selectedDay: new Date().getDate(),
  lastMonth: new Date().getMonth(),
  lastYear: new Date().getFullYear(),
  thisMonth: new Date().getMonth(),
  thisYear: new Date().getFullYear(),
  thisDay: new Date().getDate(),
  yearNext:0,
  monthNext:0,
  selectedRow: 0,
  numRows: 0,
  todayRow:0,
  mode:'month',
  calendarId: 'calendar',
  events: new Object(),
  init: function() {
  	 var date = new Date();
  	 calendar.selectedMonth = date.getMonth();
  	 calendar.selectedYear = date.getFullYear();
  	 calendar.selectedDay = date.getDate();
  	 calendar.thisMonth = date.getMonth();
  	 calendar.thisYear = date.getFullYear();
  	 calendar.thisDay = date.getDate();
  	 calendar.setPreviousMonth();
       calendar.setNextMonth();
   	 calendar.render();
  },
  loadEvents: function (json) {
  	calendar.events = formatJson(json);
  	calendar.render();
  },
  render: function() {
    var html = '';
    html += '<table cellpadding="0" cellspacing="0" class="calendar-head"><tr>';
    html += '<th colspan="3"><h1>' + getMonthName(calendar.selectedMonth) + ' ' + calendar.selectedYear + '</h1></th>';
    html += '<th colspan="2" ><button onclick="calendar.setMode(\'month\')">Month</button> <button onclick="calendar.setMode(\'week\')">Week</button></th>';
    html += '<th colspan="2" class="links"><button id="lastMonth">&larr;</button> <button id="todayMonth">Today</button> <button id="nextMonth">&rarr;</button></th>';
    html += '</tr></table>';
    html += '<table class="calendar" cellpadding="0" cellspacing="0"><thead><tr>';

    var weekDays = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    for (var j = 0; j < weekDays.length; j++) {
      html += '<th>' + weekDays[j] + '</th>';
    }
	html += '</tr></thead><tbody>';
    
    var daysInMonth = getDaysInMonth(calendar.selectedYear, calendar.selectedMonth);
    var prevDaysInMonth = getDaysInMonth(calendar.lastYear, calendar.lastMonth);
    var startDay = getFirstDayofMonth(calendar.selectedYear, calendar.selectedMonth);
    var numRows = 0;
    var printDate = 1;
    var noPrintDays = 0;
    var printNextDays = 1;
    var today = '';
    var weekend = '';
    
    var startCalc = (startDay==6) ? 0 : startDay + 1;
    
    numRows = Math.ceil(((startCalc) + (daysInMonth)) / 7);
   
    calendar.numRows = numRows;
    noPrintDays = startCalc;
  
    for (var e = 0; e < numRows; e++) {
      html += '<tr>';
      // create calendar days
      for (var f = 0; f < 7; f++) {
      	var formatted = formatDateString(printDate,calendar.selectedMonth,calendar.selectedYear);
      	weekend =(f===0 || f===6) ? ' weekend ' : '';
        if ((printDate == calendar.thisDay)
        && (calendar.selectedYear == calendar.thisYear)
        && (calendar.selectedMonth == calendar.thisMonth)
        && (noPrintDays == 0)) {
          today = ' today ';
          calendar.todayRow = e;
        } else {
          today = '';
        }
    	
        if (noPrintDays == 0) {
          if (printDate <= daysInMonth) {
          	html += '<td class="'+today+weekend+'"><span>';
            html +=  printDate;
      
            if(calendar.events[formatted]) {
            	html+="<ul>";
            		for (var v = 0; v < calendar.events[formatted].length; v++) {
            			var time = (calendar.events[formatted][v].time) ?  '<b>'+calendar.events[formatted][v].time+'</b> ' : "";
            			html+='<li class="'+calendar.events[formatted][v].color+' '+calendar.events[formatted][v].multi+'" data-date="'+calendar.events[formatted][v].date+'" data-time="'+calendar.events[formatted][v].time+'"  data-date-end="'+calendar.events[formatted][v].dateEnd+'" data-time-end="'+calendar.events[formatted][v].timeEnd+'"><a href="#" data-index="'+calendar.events[formatted][v].index+'" onclick="calendar.cl(this)">'+time+calendar.events[formatted][v].title+'</a></li>';
            		}
            	html+="</ul>";
            	if(calendar.events[formatted].length > 4) html+="<b class='extra'>+"+(calendar.events[formatted].length-4)+"</b>";
            }
          } else {
 
          		var formatted = formatDateString(printNextDays,calendar.monthNext,calendar.yearNext);
      			
          		html += '<td class="disable '+weekend+'"><span>';
				html += printNextDays;
           	 	printNextDays++;
				if(calendar.events[formatted]) {
					html+="<ul>";
						for (var v = 0; v < calendar.events[formatted].length; v++) {
							var time = (calendar.events[formatted][v].time) ?  '<b>'+calendar.events[formatted][v].time+'</b> ' : "";
							html+='<li class="'+calendar.events[formatted][v].color+' '+calendar.events[formatted][v].multi+'" data-date="'+calendar.events[formatted][v].date+'" data-time="'+calendar.events[formatted][v].time+'"  data-date-end="'+calendar.events[formatted][v].dateEnd+'" data-time-end="'+calendar.events[formatted][v].timeEnd+'"><a href="#"  data-index="'+calendar.events[formatted][v].index+'" onclick="calendar.cl(this)">'+time+calendar.events[formatted][v].title+'</a></li>';
						}
					html+="</ul>";
					if(calendar.events[formatted].length > 4) html+="<b class='extra'>+"+(calendar.events[formatted].length-4)+"</b>";
				}
			}
          printDate++;
        } else {
        	var formatted = formatDateString(prevDaysInMonth-noPrintDays+1,calendar.lastMonth,calendar.lastYear);
      			
        	 	html += '<td class="disable '+weekend+'"><span>';
        		html += (prevDaysInMonth-noPrintDays+1);
        		if(calendar.events[formatted]) {
					html+="<ul>";
						for (var v = 0; v < calendar.events[formatted].length; v++) {
							var time = (calendar.events[formatted][v].time) ?  '<b>'+calendar.events[formatted][v].time+'</b> ' : "";
							html+='<li class="'+calendar.events[formatted][v].color+' '+calendar.events[formatted][v].multi+'" data-date="'+calendar.events[formatted][v].date+'" data-time="'+calendar.events[formatted][v].time+'"  data-date-end="'+calendar.events[formatted][v].dateEnd+'" data-time-end="'+calendar.events[formatted][v].timeEnd+'"><a href="#" data-index="'+calendar.events[formatted][v].index+'" onclick="calendar.cl(this)">'+time+calendar.events[formatted][v].title+'</a></li>';
						}
					html+="</ul>";
					if(calendar.events[formatted].length > 4) html+="<b class='extra'>+"+(calendar.events[formatted].length-4)+"</b>";
				}
           	 	
        }
        html += '</span><b class="grad"></b></td>';
        if (noPrintDays > 0) noPrintDays--;
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    html += '<!--[if lte IE 6.5]><iframe src="javascript:false;" id="calendar_cover"></iframe><![endif]-->';
	
    // add calendar to element to calendar Div
    var calendarDiv = document.getElementById(calendar.calendarId);
    calendarDiv.innerHTML = html;

    
    // setup links
    if(calendar.mode=='week') {
		document.getElementById('lastMonth').onclick = calendar.prevWeek;
    	document.getElementById('todayMonth').onclick = calendar.todayWeek;
    	document.getElementById('nextMonth').onclick = calendar.nextWeek;
	} else {
		document.getElementById('lastMonth').onclick = calendar.prevMonth;
   		document.getElementById('todayMonth').onclick = calendar.todayMonth;
   		document.getElementById('nextMonth').onclick = calendar.nextMonth;

	}
  },
  cl:function(t) {
  	alert(JSON.stringify(calendar.data[t.getAttribute("data-index")]))
  },
  prevMonth: function() {
      calendar.selectedMonth--;
      if (calendar.selectedMonth < 0) {
        calendar.selectedMonth = 11;
        calendar.selectedYear--;
      }
      calendar.setPreviousMonth();
      calendar.setNextMonth();
      calendar.render();
      
  },
  todayMonth: function() {
      calendar.selectedMonth = calendar.thisMonth;
      calendar.selectedYear = calendar.thisYear;
      calendar.setPreviousMonth();
      calendar.setNextMonth();
      calendar.render();
  },
  nextMonth: function() {
      calendar.selectedMonth++;
      if (calendar.selectedMonth > 11) {
        	calendar.selectedMonth = 0;
        	calendar.selectedYear++;
      }
      calendar.setPreviousMonth();
       calendar.setNextMonth();
      calendar.render();
     
  },
  setPreviousMonth: function() {
  	 calendar.lastMonth = calendar.selectedMonth;
  	 calendar.lastYear = calendar.selectedYear;
  	 calendar.lastMonth--;
     if (calendar.lastMonth < 0) {
        calendar.lastMonth = 11;
        calendar.lastYear--;
     }
  },
  setNextMonth: function() {
  	 calendar.monthNext = calendar.selectedMonth;
  	 calendar.yearNext = calendar.selectedYear;
  	 calendar.monthNext++;
      if (calendar.monthNext > 11) {
        calendar.monthNext = 0;
        calendar.yearNext++;
      }
  },
  setMode: function(s) {
  	if(s==calendar.mode) return false;
  	calendar.mode = s;
  	var calendarDiv = document.getElementById(calendar.calendarId);
  	calendarDiv.className = " "+s;
	if(s=='week') {
		document.getElementById('lastMonth').onclick = calendar.prevWeek;
    	document.getElementById('todayMonth').onclick = calendar.todayWeek;
    	document.getElementById('nextMonth').onclick = calendar.nextWeek;
    	calendar.selectedRow = (calendar.selectedMonth==calendar.thisMonth) ? calendar.todayRow : calendar.selectedRow;
    	calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = 'view';
	} else {
		document.getElementById('lastMonth').onclick = calendar.prevMonth;
   		document.getElementById('todayMonth').onclick = calendar.todayMonth;
   		document.getElementById('nextMonth').onclick = calendar.nextMonth;
   		calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = '';
		calendar.selectedRow=0;
	}
  },
  nextWeek: function() {
  	var calendarDiv = document.getElementById(calendar.calendarId);
  	calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = '';
  	calendar.selectedRow++;
  	if (calendar.selectedRow > calendar.numRows-1) {
        calendar.nextMonth();
        calendar.selectedRow = 0;
    }
  	calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = 'view';
  },
  prevWeek: function() {
  	var calendarDiv = document.getElementById(calendar.calendarId);
  	calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = '';
  	calendar.selectedRow--;
  	if (calendar.selectedRow < 0) {
        calendar.prevMonth();
        calendar.selectedRow = calendar.numRows-1;
    }
  	calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = 'view';
  },
  todayWeek: function() {
  	var calendarDiv = document.getElementById(calendar.calendarId);
  	calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = '';
  	calendar.selectedRow = calendar.todayRow;
  	calendar.todayMonth();
  	calendarDiv.getElementsByTagName('table')[1].rows[calendar.selectedRow+1].className = 'view';
  }
}
// Add calendar event that has wide browser support
if (typeof window.addEventListener != "undefined")
 window.addEventListener("load", calendar.init, false);
else if (typeof window.attachEvent != "undefined")
 window.attachEvent("onload", calendar.init);
else {
  if (window.onload != null) {
    var oldOnload = window.onload;
    window.onload = function(e) {
      oldOnload(e);
      calendar.init();
    };
  }
  else
  window.onload = calendar.init;
}

/* MISC FUNCTIONS */

function formatDate(date,sep) {
  sep = (sep)? sep : "-";
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  m++;
  if (m < 10) m = '0' + m.toString();
  if (d < 10) d = '0' + d.toString();
  return y.toString()+sep+m.toString()+sep+d.toString();
}
function formatDateString(d,m,y,sep) {
  sep = (sep)? sep : "-";
  m++;
  if (m < 10) m = '0' + m.toString();
  if (d < 10) d = '0' + d.toString();
  return y.toString()+sep+m.toString()+sep+d.toString();
}
function formatTime(date,am) {
  var h = date.getHours();
  var m = date.getMinutes();
  var end = (h>11) ? "pm" : "am";
  if(h > 12) h = h-12;
  //if (h < 10) h = '0' + h.toString();
  if (m < 10) m = '0' + m.toString();
  m = (m=="00") ? "" : ":"+m;
  return (am) ? h+m+end : h+m;
}
function getMonthName(month) {
  var monthNames = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
  return monthNames[month];
}

function getDaysInMonth(year, month) {
  return 32 - new Date(year, month, 32).getDate();
}

function getFirstDayofMonth(year, month) {
  var day;
  day = new Date(year, month, 0).getDay();
  return day;
}

function formatJson(jsn) {
	 var events = calendar.data = jsn;
	 var result = new Object;
	 
	 for (var i=0; i < events.length; i++) {
	 	
		if(events[i].end) {
			//.replace(/T.+/, '')
			 var hasTime = events[i].start.indexOf("T")>=0 ? true : false;
			 if(!hasTime) events[i].start+="T08:00:00";
			 var start =  new Date( events[i].start);
			 var hasTime2 = events[i].end.indexOf("T")>=0 ? true : false;
			 if(!hasTime2) events[i].end+="T08:00:00";
   			 var end =  new Date( events[i].end);
   		
			 while(start <= end){
			 	
				var d = formatDate(start,""); 
			   	var event = new Object;
				event.title = events[i].title;
				event.id = events[i].id;
				event.color = events[i].color;
				event.multi= 'multi';
				event.index = i;
				event.stamp = start;
				event.date= formatDate(start,"-"); 
				event.time= (hasTime) ? formatTime(start,1) : 0; 
				event.dateEnd= formatDate(end,"-"); 
				event.timeEnd= (hasTime2) ? formatTime(end,1) : 0; 
				if(!result[d]) result[d] = new Array;
				result[d].push(event);
			   	var newDate = start.setDate(start.getDate() + 1);
			   	start = new Date(newDate);
			}
		} else {
			var hasTime = events[i].start.indexOf("T")>=0 ? true : false;
			 if(!hasTime) events[i].start+="T08:00:00";
			
			var start =  new Date( events[i].start);
   			var d = formatDate(start); 
			var event = new Object;
				event.title = events[i].title;
				event.id = events[i].id;
				event.color = events[i].color;
				event.multi= '';
				event.index = i;
				event.stamp = start;
				event.date= formatDate(start,"-"); 
				event.time= (hasTime) ? formatTime(start,1) : 0; 
				event.dateEnd= 0;
				event.timeEnd=0;
			if(!result[d]) result[d] = new Array;
			result[d].push(event);
		}
	 }
	 for (var k in result) {
	 	 if (result.hasOwnProperty(k)) {
	 	 	result[k] = result[k].sort((a, b) => a.stamp - b.stamp)
	 	 }
	 };
	 return result;
}

