//@ts-nocheck
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { APIService } from '../api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-rescheduling',
  templateUrl: './rescheduling.component.html',
  styleUrl: './rescheduling.component.css'
})
export class ReschedulingComponent implements OnInit {
  currentDate: Date;
  currentformattedDate

  user;
  userName: string = '';
  emailId: string = '';
  loggedInName = localStorage.getItem("userLoggedInName" || "")
  evId = ""
  userId = ""

  evName = ""
  evDurHrs = 0
  evDurMins = 0
  evLocation = localStorage.getItem("eventLocation")
  allowInviteesToAddGuests = true
  evType = ""
  // meetingArray : any[] = [];
  formattedMeetingsHide: object[] = [];
  timeSelected = "";
  eventName = "";
  eventDesc = "";
  evLinkEnd = ""
  loading = false
  selectedUserAvObj = {}
  nameWhoseCalendar = ""
  noOfBookingsAllowedForAParticularTimeInGrpEvent
  displayRemainingSpotsOnBookingPageGrp
  lastNameRequired
  cloduraBrandingReq

  emailIdOfWhoseCalendar = ""
  whoRescheduled = ""

  displayTimeDiv = false;
  dateSelected = ""
  selectedDayName = ""
  selectedMonth = ""
  userAvailaibleArray = []
  Events: any[] = [];
  allTimesArray = []
  showNext = false
  showNextFor = ""

  workingHrStart = ""
  workingHrEnd = ""

  backGroundcolor: string = ""
  textColor: string = ""
  btnAndLinkColor: string = ""

  avatar = ""
  image = ""
  reqEventObj = {}
  API_URL = 'http://localhost:3000';



  // hardcoding--------
  duration = {
    "hrs": 0,
    "minutes": 30
  }
  workingHrsAsPerDays = {
    "1": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "2": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "3": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "4": {
      "start": "09:00:00",
      "end": "17:00:00"
    },
    "5": {
      "start": "09:00:00",
      "end": "17:00:00"
    }
  }
  workingDays = [1, 2, 3, 4, 5]
  nonWorkingDays = [0, 6]

  // hardcoding ends--------

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
  };
  // -------------------------------

  // NEW====

  allowInviteesToScheduleOn
  minTimeReqBeforeScheduling
  noOfMeetingsAllowedPerDay
  timesStartTimeIncrements

  meetingsOfOnlyThisEvent
  eventN = ''
  eventLink = ''
  redirectTo = {}

  // NEW END====

  constructor(private apiService: APIService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) {
    // this.subscription = this.apiService.userName$.subscribe((userName) => {
    //   this.userName = userName;
    //   console.log(userName)
    // });
    // this.subscription = this.apiService.emailId$.subscribe((emailId) => {
    //   this.emailId = emailId;
    //   console.log("emailId in custructor ",emailId)
    // });
  }

  private subscription: Subscription;




  ngOnInit() {
    // -----taking name and email id from query paramaters----
    // http://localhost:4500/rescheduling?whoRescheduled=${whoRescheduled}&whoseCalendar=${whoseCalendar}&eventId=${eventId}&meetId=${meetId}  
       
    this.route.queryParams.subscribe(params => {
      console.log("params ", params);
      
      this.emailIdOfWhoseCalendar = params['whoseCalendar']
      console.log('Create Meeting Component initialized ', this.emailIdOfWhoseCalendar);

      this.whoRescheduled = params['whoRescheduled']
      console.log('whoRescheduled ', this.whoRescheduled);
      
      this.evId = params['eventId']
      console.log('evId ', this.evId);
      
      this.meetId = params['meetId']
      console.log('meetId ', this.meetId);
      

      this.getParticularUserByEmailId(this.emailIdOfWhoseCalendar)
    })

    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        // events: this.Events, //commented so that events are not shown on calendar
        dateClick: this.onDateClick.bind(this),
        dayCellContent: this.theDayCellContent.bind(this),
      }
    }, 3000);



  }

  async getParticularUserByEmailId(emailIdOfWhoseCalendar) {
    console.log("getParticularUserByEmailId is called");

    this.user = await this.apiService.getParticularUser(emailIdOfWhoseCalendar)
    console.log("user ", this.user);

    this.nameWhoseCalendar = this.user['name']
    this.emailId = this.user['emailID']
    localStorage.setItem("userEmailId", this.emailId)
    this.apiService.setUserName(this.nameWhoseCalendar);
    this.apiService.setUserEmailId(this.emailId);

    this.image = this.user['profileImage'];
    console.log('image in ts :', this.image);

    this.avatar = `${this.API_URL}/${this.user['profileImage']}`
    console.log("avatar ", this.avatar);


    this.cloduraBrandingReq = this.user.cloduraBranding;
    console.log("this.cloduraBrandingReq ", this.cloduraBrandingReq);

    for (let i = 0; i < this.user.eventLinks.length; i++) {
      if (this.user.eventLinks[i].linkEnd == this.evLinkEnd) {
        this.evId = this.user.eventLinks[i].evId
        localStorage.setItem("eventId", this.evId)
        break;
      }
    }


    this.apiService.getSelectedEvent(this.evId, this.emailId)
    this.assignValuesToEventDeets()

    // Fetch meetings
    this.apiService.getReqDetails(this.userId, this.evId)


    this.apiService.getMeetingsHide(this.emailId);
    this.apiService.getSelectedUsersAvailaibilityObj()

    this.subscription = this.apiService.formattedMeetingsHide$.subscribe((formattedMeetingsHide) => {
      console.log('Formatted Meetings Hide in ts :', formattedMeetingsHide);
      this.formattedMeetingsHide = formattedMeetingsHide;
      this.Events = formattedMeetingsHide;
      console.log("Events ", this.Events);
    });
    this.subscription = this.apiService.selectedUserAvailabilityObj$.subscribe((avObj) => {
      this.selectedUserAvObj = avObj
      console.log("selectedUserAvObj ", this.selectedUserAvObj);


      this.duration = this.selectedUserAvObj["duration"]
      console.log("duration ", this.selectedUserAvObj["duration"]);

      this.workingHrsAsPerDays = this.selectedUserAvObj["workingHrs"]
      console.log("workingHrsAsPerDays ", this.selectedUserAvObj["workingHrs"]);


      this.workingDays = this.selectedUserAvObj["workingDays"]
      console.log("workingDays ", this.selectedUserAvObj["workingDays"]);

      this.nonWorkingDays = this.selectedUserAvObj["nonWorkingDays"]
      console.log("nonWorkingDays ", this.selectedUserAvObj["nonWorkingDays"]);

      // console.log("duration ",this.duration);  
    })


    this.getAllEventEditings()


  }

  assignValuesToEventDeets() {
    console.log("the selected evId and emailIdis ", this.evId, this.emailId);
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      console.log("reqEventObj ", reqEventObj);
      if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
        console.log("got reqEventObj ", reqEventObj);
        this.evName = reqEventObj["evName"]
        this.evDurHrs = reqEventObj["evDuration"]["hrs"]
        this.evDurMins = reqEventObj["evDuration"]["minutes"]
        this.evLocation = reqEventObj["evLocation"]
        this.allowInviteesToAddGuests = reqEventObj["allowInviteesToAddGuests"]
        this.evType = reqEventObj["evType"]
        this.lastNameRequired = reqEventObj["surnameReq"]
        this.redirectTo = reqEventObj["redirectTo"]

        if (reqEventObj["evType"] == "Group") {
          this.noOfBookingsAllowedForAParticularTimeInGrpEvent = reqEventObj["maxInviteesPerEventForGrpEvent"]
          this.displayRemainingSpotsOnBookingPageGrp = reqEventObj["displayRemainingSpotsOnBookingPageGrp"]
        }
      }
    })
  }




  // this.evId = eventId
  // localStorage.setItem("eventId", this.evId)





  // =======getsAllEventEditedOptions starts==================

  getAllEventEditings() {

    console.log("getAllEventEditings called");

    // this.apiService.getSelectedEvent(this.evId, this.emailId)
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
        console.log("got reqEventObj ", reqEventObj);

        console.log("wanted ", reqEventObj["evDuration"]["minutes"]);


        this.eventN = reqEventObj["evName"]
        this.evDurHrs = reqEventObj["evDuration"]["hrs"]
        this.evDurMins = reqEventObj["evDuration"]["minutes"]
        this.eventLink = this.eventN
        this.backGroundcolor = reqEventObj['bgClr']
        this.textColor = reqEventObj['txtClr']
        this.btnAndLinkColor = reqEventObj['btnAndLnkClr']

        localStorage.setItem("backGroundcolor", this.backGroundcolor)
        localStorage.setItem("textColor", this.textColor)
        localStorage.setItem("btnAndLinkColor", this.btnAndLinkColor)


        // ===========================
      }
    })

    setTimeout(() => {
      this.allowInviteesToScheduleOn = this.reqEventObj["whenCanInviteesSchedule"] //making allowInviteesToScheduleOn object
      console.log("allowInviteesToScheduleOn ", this.allowInviteesToScheduleOn);


      this.minTimeReqBeforeScheduling = this.reqEventObj["minimumNotice"] //making minTimeReqBeforeScheduling object
      console.log("minTimeReqBeforeScheduling ", this.minTimeReqBeforeScheduling);


      this.noOfMeetingsAllowedPerDay = this.reqEventObj["noOfMeetsAllowedPerDay"] //making noOfMeetingsAllowedPerDay object
      console.log("assigned value ", this.noOfMeetingsAllowedPerDay);


      this.timesStartTimeIncrements = this.reqEventObj["startTimIncrements"] //making timesStartTimeIncrements object


      this.meetingsOfOnlyThisEvent = this.reqEventObj["meetings"] //making meetingsOfOnlyThisEvent object

      if (this.timesStartTimeIncrements.status) {
        if (!this.timesStartTimeIncrements.hrs) {
          console.log("duration ", this.duration);

          this.duration.hrs = 0

        }
        else if (this.timesStartTimeIncrements.hrs) {
          this.duration.hrs = this.timesStartTimeIncrements.hrs
        }
        if (!this.timesStartTimeIncrements.mins) {
          this.duration.minutes = 0
        }
        else {
          this.duration.minutes = this.timesStartTimeIncrements.mins
        }
      }
      this.setActiveDaysAsPerUserReq()


    }, 3000)

  }
  // =======getsAllEventEditedOptions ends====================

  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    return date < today;
  }

  // ----------theDayCellContent starts----------
  theDayCellContent(info: any) {

    const dayOfWeek = info.date.getDay();
    const date = info.date.getDate();
    // console.log(dayOfWeek);

    console.log("textColor ", this.textColor);
    console.log("btnAndLinkColor ", this.btnAndLinkColor);



    for (let i = 0; i < this.nonWorkingDays.length; i++) {
      if (dayOfWeek === this.nonWorkingDays[i]) {
        if (this.textColor == 'black' || this.textColor == '#000000') {
          return { html: `<div style="color: grey">` + date + '</div>' };
        }
        else {
          return { html: `<div style="color: ${this.textColor}">` + date + '</div>' };
        }
      }
    }
    if (this.isPastDate(info.date)) {
      if (this.textColor == 'black' || this.textColor == '#000000') {
        return { html: `<div style="color: grey;">` + date + '</div>' };
      }
      else {
        return { html: `<div style="color: ${this.textColor}">` + date + '</div>' };
      }
    }
    else {
      // return { html: `<div style="color: ${this.btnAndLinkColor}; font-weight:bold; background-color: #eff0fe; border-radius: 50px; padding: 10px">` + date + '</div>' };
      return { html: `<div style="color: ${this.btnAndLinkColor}; font-weight: bold;">` + date + '</div>' };

    }



  }


  // ---------------onDateClick new starts---------------

  onDateClick(res: any) {

    this.displayTimeDiv = true
    console.log('Clicked on date : ' + res.dateStr); //2024-02-13


    this.dateSelected = res.dateStr

    let returnOffindHowManyEventsAreAlreadyBookedFnctn;
    console.log("this.noOfMeetingsAllowedPerDay ", this.noOfMeetingsAllowedPerDay);


    console.log("this.noOfMeetingsAllowedPerDay.status ", this.noOfMeetingsAllowedPerDay.status);

    if (this.noOfMeetingsAllowedPerDay.status) {
      returnOffindHowManyEventsAreAlreadyBookedFnctn = this.findHowManyEventsAreAlreadyBookedOnThatDay(res.dateStr)
    }

    console.log("returnOffindHowManyEventsAreAlreadyBookedFnctn ", returnOffindHowManyEventsAreAlreadyBookedFnctn);


    if (returnOffindHowManyEventsAreAlreadyBookedFnctn) {
      this.userAvailaibleArray = []
    }
    else if (!returnOffindHowManyEventsAreAlreadyBookedFnctn) {

      this.currentDate = new Date();
      console.log("currentDate ", this.currentDate); //Mon Feb 19 2024 12:38:05 GMT+0530 (India Standard Time)create-meeting.component.ts:238 
      this.currentformattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'); //2024-02-19
      console.log("currentformattedDate ", this.currentformattedDate);

      //if selected date is earlier than today's date
      if (res.dateStr < this.currentformattedDate) {
        alert('Please select a date on or after today.')
        this.displayTimeDiv = false
      }
      else {//if selected date is on or later than today's date
        console.log("res ", res)
        const selectedDay = res.date.getDay();

        if (selectedDay == 0) {
          this.selectedDayName = "Sunday"
        }
        else if (selectedDay == 1) {
          this.selectedDayName = "Monday"
        }
        else if (selectedDay == 2) {
          this.selectedDayName = "Tuesday"
        }
        else if (selectedDay == 3) {
          this.selectedDayName = "Wednesday"
        }
        else if (selectedDay == 4) {
          this.selectedDayName = "Thursday"
        }
        else if (selectedDay == 5) {
          this.selectedDayName = "Friday"
        }
        else if (selectedDay == 6) {
          this.selectedDayName = "Saturday"
        }

        const selectedDateis = res.dateStr;
        console.log("selectedDate ", selectedDateis);


        console.log(selectedDateis[5]);
        console.log(selectedDateis[6]);

        if (selectedDateis[5] == 0 && selectedDateis[6] == 1) { //i.e like month is 01
          this.selectedMonth = "January"
        }
        else if (selectedDateis[5] == 0 && selectedDateis[6] == 2) {//i.e like month is 02
          this.selectedMonth = "February"
        }
        else if (selectedDateis[6] == 3) {//i.e like month is 03
          this.selectedMonth = "March"
        }
        else if (selectedDateis[6] == 4) {
          this.selectedMonth = "April"
        }
        else if (selectedDateis[6] == 5) {
          this.selectedMonth = "May"
        }
        else if (selectedDateis[6] == 6) {
          this.selectedMonth = "June"
        }
        else if (selectedDateis[6] == 7) {
          this.selectedMonth = "July"
        }
        else if (selectedDateis[6] == 8) {
          this.selectedMonth = "August"
        }
        else if (selectedDateis[6] == 9) {
          this.selectedMonth = "September"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 0) {
          this.selectedMonth = "October"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 1) {
          this.selectedMonth = "November"
        }
        else if (selectedDateis[5] == 1 && selectedDateis[6] == 2) {
          this.selectedMonth = "December"
        }

        console.log(this.selectedDayName, this.selectedMonth, this.dateSelected);

        const selectedDate = res.dateStr;
        this.subscription = this.apiService.userUnavailabelOnArray$.subscribe((userUnavailabelOnArray$) => {
          // this.loggedInName = userLoggedInName;
          // console.log("logged in user name is ",this.loggedInName)
          console.log("array ", userUnavailabelOnArray$);
        });

        let selectedNonWorkingDay = false
        for (let i = 0; i < this.nonWorkingDays.length; i++) {
          if (selectedDay == this.nonWorkingDays[i]) {
            selectedNonWorkingDay = true
            this.displayTimeDiv = false;
            alert('User unavailable on this day!');
            return;
          }
        }


        if (selectedNonWorkingDay == false) {
          this.displayTimeDiv = true;
          this.dateSelected = res.dateTimeStr

          for (let key in this.workingHrsAsPerDays) {
            if (selectedDay == key) {
              this.workingHrStart = this.workingHrsAsPerDays[key].start
              this.workingHrEnd = this.workingHrsAsPerDays[key].end
            }
          }

          let workingHrStart = this.workingHrStart //09:00:00
          let workingHrEnd = this.workingHrEnd //17:00:00

          console.log("workingHrStart ", workingHrStart, "workingHrEnd ", workingHrEnd);


          let workingStartHours = Number(`${workingHrStart[0]}${workingHrStart[1]}`) //9
          let workingStartMinutes = Number(`${workingHrStart[3]}${workingHrStart[4]}`) //0
          console.log("workingStartHours ", workingStartHours, "workingStartMinutes ", workingStartMinutes);

          let workingEndHours = Number(`${workingHrEnd[0]}${workingHrEnd[1]}`) //17
          let workingEndMinutes = Number(`${workingHrEnd[3]}${workingHrEnd[4]}`) //0
          console.log("workingEndHours ", workingEndHours, "workingEndMinutes ", workingEndMinutes);

          let allTimesArray = []

          let timeStr = workingHrStart //09:00:00

          allTimesArray.push(timeStr)


          console.log("workingStartHours ", workingStartHours, typeof workingStartHours);
          console.log("workingEndHours ", workingEndHours, typeof workingEndHours);
          console.log("workingStartMinutes ", workingStartMinutes, typeof workingStartMinutes);
          console.log("workingEndMinutes ", workingEndMinutes, typeof workingEndMinutes);


          console.log(workingStartHours <= workingEndHours);
          console.log(typeof workingEndHours);
          while (workingStartHours < workingEndHours) {
            console.log("inside while ");           
            workingStartHours = workingStartHours + Number(this.duration.hrs)
            workingStartMinutes = workingStartMinutes + Number(this.duration.minutes)
            console.log("workingStartHours 287 ", workingStartHours, typeof workingStartHours);
            console.log("workingStartMinutes 288 ", workingStartMinutes, typeof workingStartMinutes);

            if (workingStartMinutes >= 60) {
              workingStartHours = workingStartHours + Math.floor(workingStartMinutes / 60)
              workingStartMinutes = workingStartMinutes - 60 * (Math.floor(workingStartMinutes / 60))
            }
            if (workingStartHours < 10) {
              if (workingStartMinutes < 10) {
                timeStr = `0${workingStartHours}:0${workingStartMinutes}:00`
              }
              else {
                timeStr = `0${workingStartHours}:${workingStartMinutes}:00`
              }
            }
            else {
              if (workingStartMinutes < 10) {
                timeStr = `${workingStartHours}:0${workingStartMinutes}:00`
              }
              else {
                timeStr = `${workingStartHours}:${workingStartMinutes}:00`
              }
            }

            allTimesArray.push(timeStr)

          }

          console.log("allTimesArray ", allTimesArray);
          this.allTimesArray = allTimesArray



          // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']

          let usersBookedTimes = []
          let usersBookedEndTimes = []
          let usersBookedStartTimesForThisEvent = []
          let usersBookedEndTimesForThisEvent = []

          let eventDate = ""

          console.log("Checking Events after date click ", this.Events);

          console.log("this.Events ", this.Events);


          for (let i = 0; i < this.Events.length; i++) {
            let obj = this.Events[i]
            console.log("obj ", obj);

            eventDate = obj['start'].split('T')[0] //2019-01-18
            console.log("eventDate ", eventDate);

            console.log("eventDate ", eventDate, "this.dateSelected ", this.dateSelected, eventDate == this.dateSelected);

            if (eventDate == this.dateSelected) {

              if (this.evType == "Group") {//for grp events, even if a time slot is booked, i am not pushing it in booked slots so as to maintain count of each time and to accordingly show whether to show that time or not

                if (obj['bookedForWhichEvId']) {
                  if (obj['bookedForWhichEvId'] != this.evId) {
                    let eventStartTime = obj['start'].split('T')[1] //09:00:00
                    let eventEndTime = obj['end'].split('T')[1]
                    // let eventStartTime = time.split('+')[0] //09:00:00
                    console.log("eventStartTime ", eventStartTime);
                    console.log("eventEndTime ", eventEndTime);

                    usersBookedTimes.push({ eventStartTime, bookedForWhichEvId })
                    usersBookedEndTimes.push({ eventEndTime, bookedForWhichEvId })
                  }
                  else {
                    let eventStartTime = obj['start'].split('T')[1] //09:00:00
                    let eventEndTime = obj['end'].split('T')[1]
                    // let eventStartTime = time.split('+')[0] //09:00:00
                    console.log("eventStartTime ", eventStartTime);
                    console.log("eventEndTime ", eventEndTime);

                    usersBookedStartTimesForThisEvent.push({ eventStartTime, bookedForWhichEvId: obj['bookedForWhichEvId'] })
                    usersBookedEndTimesForThisEvent.push({ eventEndTime, bookedForWhichEvId: obj['bookedForWhichEvId'] })
                  }
                }
              }
              else {
                let eventStartTime = obj['start'].split('T')[1] //09:00:00
                let eventEndTime = obj['end'].split('T')[1]
                // let eventStartTime = time.split('+')[0] //09:00:00
                console.log("eventStartTime ", eventStartTime);
                console.log("eventEndTime ", eventEndTime);


                usersBookedTimes.push({ eventStartTime })
                usersBookedEndTimes.push({ eventEndTime })
              }
            }
          }
          console.log("usersBookedTimes ", usersBookedTimes);
          console.log("usersBookedEndTimes ", usersBookedEndTimes);

          // ===function to make userAvailaibleArray array==========================

          console.log("evType is ", this.evType);

          if (this.evType == "One-on-One") {
            function filterBookedTimes(allTimesArray, userBookedStartTimesArray, userBookedEndTimesArray) {
              // Function to convert time string "HH:MM:SS" to seconds since midnight
              function timeToSeconds(time) {
                let [hours, minutes, seconds] = time.split(':').map(Number);
                // return hours * 3600 + minutes * 60 + seconds;
                return hours * 3600 + minutes * 60 + seconds;

              }

              // Convert all times to seconds
              let allTimesInSeconds = allTimesArray.map(timeToSeconds);
              let bookedStartTimesInSeconds = userBookedStartTimesArray.map(item => timeToSeconds(item.eventStartTime));
              let bookedEndTimesInSeconds = userBookedEndTimesArray.map(item => timeToSeconds(item.eventEndTime));

              // Function to check if a time is within any booked interval
              function isBooked(time) {
                for (let i = 0; i < bookedStartTimesInSeconds.length; i++) {
                  if (time >= bookedStartTimesInSeconds[i] && time < bookedEndTimesInSeconds[i]) {
                    return true;
                  }
                }
                return false;
              }

              // Filter out the times that are within the booked intervals
              let filteredTimesInSeconds = allTimesInSeconds.filter(time => !isBooked(time));

              // Convert the filtered times back to "HH:MM:SS" format
              function secondsToTime(seconds) {
                let hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
                let mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                let secs = (seconds % 60).toString().padStart(2, '0');
                return `${hours}:${mins}:${secs}`;
              }

              return filteredTimesInSeconds.map(secondsToTime);
            }

            let usersAvailaibleTimes = filterBookedTimes(allTimesArray, usersBookedTimes, usersBookedEndTimes);
            console.log(usersAvailaibleTimes);
            // ===========================================

            if (this.minTimeReqBeforeScheduling.status == true) {
              this.setTimesAsPerMinNotice(usersAvailaibleTimes, selectedDate)
            }
            else {
              this.userAvailaibleArray = usersAvailaibleTimes
            }

            console.log("this.userAvailaibleArray ", this.userAvailaibleArray);

          }
          else if (this.evType == "Group") {
            function filterBookedTimes(allTimesArray, userBookedStartTimesArray, userBookedEndTimesArray, usersBookedStartTimesForThisEvent, usersBookedEndTimesForThisEvent, maxBookings) {
              // Function to convert time string "HH:MM:SS" to seconds since midnight
              function timeToSeconds(time) {
                let [hours, minutes, seconds] = time.split(':').map(Number);
                return hours * 3600 + minutes * 60 + seconds;
              }

              // Function to convert seconds since midnight back to time string "HH:MM:SS"
              function secondsToTime(seconds) {
                let hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
                let mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                let secs = (seconds % 60).toString().padStart(2, '0');
                return `${hours}:${mins}:${secs}`;
              }

              // Convert all times to seconds
              let allTimesInSeconds = allTimesArray.map(timeToSeconds);
              let bookedStartTimesInSeconds = userBookedStartTimesArray.map(item => timeToSeconds(item.eventStartTime));
              let bookedEndTimesInSeconds = userBookedEndTimesArray.map(item => timeToSeconds(item.eventEndTime));
              let eventStartTimesInSeconds = usersBookedStartTimesForThisEvent.map(item => timeToSeconds(item.eventStartTime));
              let eventEndTimesInSeconds = usersBookedEndTimesForThisEvent.map(item => timeToSeconds(item.eventEndTime));

              // Initialize a dictionary to keep track of bookings
              let bookingCount = {};
              usersBookedStartTimesForThisEvent.forEach(item => {
                if (bookingCount[item.eventStartTime]) {
                  bookingCount[item.eventStartTime]++;
                } else {
                  bookingCount[item.eventStartTime] = 1;
                }
              });

              // Function to check if a time is within any booked interval
              function isBooked(time) {
                for (let i = 0; i < bookedStartTimesInSeconds.length; i++) {
                  if (time >= bookedStartTimesInSeconds[i] && time < bookedEndTimesInSeconds[i]) {
                    return true;
                  }
                }
                return false;
              }

              // Function to check if a time is within any fully booked interval for the event
              function isFullyBookedForEvent(time) {
                for (let i = 0; i < eventStartTimesInSeconds.length; i++) {
                  if (bookingCount[secondsToTime(eventStartTimesInSeconds[i])] >= maxBookings &&
                    time >= eventStartTimesInSeconds[i] && time < eventEndTimesInSeconds[i]) {
                    return true;
                  }
                }
                return false;

              }

              // Filter out the times that are within the booked intervals or fully booked intervals for the event
              let filteredTimesInSeconds = allTimesInSeconds.filter(time => !isBooked(time) && !isFullyBookedForEvent(time));

              // Convert the filtered times back to "HH:MM:SS" format
              return filteredTimesInSeconds.map(timeInSeconds => {
                let time = secondsToTime(timeInSeconds);
                let remainingBookings = maxBookings - (bookingCount[time] || 0);
                console.log("remainingBookings ", remainingBookings);

                return { time, remainingBookings };
              });
            }

            let usersAvailaibleTimes = filterBookedTimes(allTimesArray, usersBookedTimes, usersBookedEndTimes, usersBookedStartTimesForThisEvent, usersBookedEndTimesForThisEvent, this.noOfBookingsAllowedForAParticularTimeInGrpEvent);
            console.log("line 1344", usersAvailaibleTimes);
            console.log(usersBookedStartTimesForThisEvent, usersBookedEndTimesForThisEvent);


            // =============================

            if (this.minTimeReqBeforeScheduling.status == true) {
              this.setTimesAsPerMinNotice(usersAvailaibleTimes, selectedDate)
            }
            else {
              this.userAvailaibleArray = usersAvailaibleTimes
            }

            console.log("this.userAvailaibleArray ", this.userAvailaibleArray);
          }



        }
      }
    }
  }

  // ---------------onDateClick new ends---------------


  // ==========noOfMeetingsAllowedPerDayFUnctn Starts=======

  findHowManyEventsAreAlreadyBookedOnThatDay(selectedDate) {


    console.log("meetingsOfOnlyThisEvent ", this.meetingsOfOnlyThisEvent);
    let count = 0
    for (let i = 0; i < this.meetingsOfOnlyThisEvent.length; i++) {
      let oneMeet = this.meetingsOfOnlyThisEvent[i]
      let meetDate = oneMeet.start.split("T")[0]


      if (meetDate == selectedDate) {
        count++
      }
    }

    console.log("count ", count);
    console.log(count >= this.noOfMeetingsAllowedPerDay.noOfMeetsAllowed);

    if (count >= this.noOfMeetingsAllowedPerDay.noOfMeetsAllowed) {
      // this.userAvailaibleArray = []

      return true
    }
    else {
      return false
    }
  }

  // ==========noOfMeetingsAllowedPerDayFUnctn Ends=======


  // =====================setActiveDaysAsPerUserReq==================================
  setActiveDaysAsPerUserReq() {

    console.log(" ffffff this.allowInviteesToScheduleOn", this.allowInviteesToScheduleOn);


    if (this.allowInviteesToScheduleOn.days.status) {

      // ----------for all days starts:
      if (this.allowInviteesToScheduleOn.days.allDays) {
        const today = new Date();
        const givenDaysLater = new Date(today);
        givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays); // Set the date to given days from today

        let start, end, year, month, day;

        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        start = `${year}-${month}-${day}`;

        year = givenDaysLater.getFullYear();
        month = ('0' + (givenDaysLater.getMonth() + 1)).slice(-2);
        day = ('0' + givenDaysLater.getDate()).slice(-2);
        end = `${year}-${month}-${day}`;

        console.log("start, end ", start, end);

        this.calendarOptions.validRange = {
          start: start,
          end: end
        }
        // this.calendarOptions.dayCellClassNames = this.customizeDayClassNames.bind(this)
        // this.calendarOptions.dayCellDidMount = this.customizeDayMount.bind(this)
      }
      // ----------for all days ends:
      // ----------for only week days starts :  

      else if (this.allowInviteesToScheduleOn.days.onlyWeekDays) {
        let today = new Date();
        console.log("initial today ", today);

        const givenDaysLater = new Date(today);
        givenDaysLater.setDate(today.getDate() + this.allowInviteesToScheduleOn.days.noOfDays - 1); // Set the date to given days from today

        console.log("initial givenDaysLater ", givenDaysLater);

        let p1 = new Date()
        let p2 = givenDaysLater

        console.log("p1, p2 ", p1, p2);

        while (p1 <= p2) {

          let dayOfP1 = p1.getDay()
          if (dayOfP1 != 0 && dayOfP1 != 6) {
            p1.setDate(p1.getDate() + 1);
          }
          else {
            p1.setDate(p1.getDate() + 1);
            p2.setDate(p2.getDate() + 1);
          }
        }

        console.log("p1, p2 ", p1, p2);

        givenDaysLater.setDate(p2.getDate() + 1); // +1 coz calendar excludes the last date
        console.log("new givenDaysLater ", givenDaysLater);


        console.log("today ", today);
        today = new Date();

        console.log("ending ", givenDaysLater);
        let start, end, year, month, day;

        year = today.getFullYear();
        month = ('0' + (today.getMonth() + 1)).slice(-2);
        day = ('0' + today.getDate()).slice(-2);
        start = `${year}-${month}-${day}`;

        year = givenDaysLater.getFullYear();
        month = ('0' + (givenDaysLater.getMonth() + 1)).slice(-2);
        day = ('0' + givenDaysLater.getDate()).slice(-2);
        end = `${year}-${month}-${day}`;

        console.log("start, end ", start, end);

        this.calendarOptions.validRange = {
          start: start,
          end: end
        }
      }
    }

    //======= if user has specified date Range starts===
    else if (this.allowInviteesToScheduleOn.withinDateRange.status) {

      let end = this.allowInviteesToScheduleOn.withinDateRange.end

      console.log("endDate ", end);
      let endDateInDateForm = new Date(end)
      console.log("endDateInDateForm ", endDateInDateForm);

      endDateInDateForm.setDate(endDateInDateForm.getDate() + 1);
      console.log("endDateInDateForm ", endDateInDateForm);

      let endDateAfterAddition, year, month, day;

      year = endDateInDateForm.getFullYear();
      month = ('0' + (endDateInDateForm.getMonth() + 1)).slice(-2);
      day = ('0' + endDateInDateForm.getDate()).slice(-2);
      endDateAfterAddition = `${year}-${month}-${day}`;


      this.calendarOptions.validRange = {
        start: this.allowInviteesToScheduleOn.withinDateRange.start,
        end: endDateAfterAddition
      }

    }
  }
  // ==========setActiveDaysAsPerUserReq ends=====================

  // ===========setTimesAsPerMinNotice starts=====================
  setTimesAsPerMinNotice(userAvailaibleArray, selectedDate) {

    console.log("this.minTimeReqBeforeScheduling ", this.minTimeReqBeforeScheduling);


    if (this.minTimeReqBeforeScheduling.status) {
      console.log("this.minTimeReqBeforeScheduling.status is true ");


      if (this.minTimeReqBeforeScheduling.hrs.status) {
        console.log("this.minTimeReqBeforeScheduling.hrs.status is true ");
        console.log("asked hrs ", this.minTimeReqBeforeScheduling.hrs.noOfHrs);


        // console.log("userAvailaibleArray ", userAvailaibleArray);
        //  ['09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00']
        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          if (differenceInHours >= this.minTimeReqBeforeScheduling.hrs.noOfHrs) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        this.userAvailaibleArray = timesArray
      }
      else if (this.minTimeReqBeforeScheduling.mins.status) {

        console.log("this.minTimeReqBeforeScheduling.mins.status is true");


        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          if (differenceInMinutes >= this.minTimeReqBeforeScheduling.mins.noOfMins) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        this.userAvailaibleArray = timesArray
      }
      else {
        console.log("this.minTimeReqBeforeScheduling.days.status is true");

        let timesArray = []
        for (let i = 0; i < userAvailaibleArray.length; i++) {
          let timeStr = userAvailaibleArray[i]
          let dateTimeStr = `${selectedDate}T${timeStr}`

          let date = new Date(dateTimeStr)
          let todasDate = new Date()
          console.log("dates ", date);
          let differenceInMilliSeconds = date.getTime() - todasDate.getTime();
          console.log("differenceInMilliSeconds ", differenceInMilliSeconds);

          // Convert the time difference to various units
          let differenceInSeconds = differenceInMilliSeconds / 1000;
          let differenceInMinutes = differenceInSeconds / 60;
          let differenceInHours = differenceInMinutes / 60;
          let differenceInDays = differenceInHours / 24;

          if (differenceInDays >= this.minTimeReqBeforeScheduling.days.noOfDays) {
            timesArray.push(timeStr)
          }
        }
        // console.log("timesArray ", timesArray);

        this.userAvailaibleArray = timesArray
      }
    }

  }
  // ===========setTimesAsPerMinNotice ends=======================

  // ---------------changeDisplayTimeDiv starts---------------
  changeDisplayTimeDiv() {
    this.displayTimeDiv = false
  }
  // ---------------changeDisplayTimeDiv ends---------------


  // ---------------createEvent starts---------------
  createEvent(eventName) {
    this.loading = true
    console.log("called createEvent");
    console.log("event deets ", eventName, this.timeSelected, this.dateSelected);
    // df sds 10:00:00 2024-01-05
    // ---hardcoding endTime------
    // let allTimesArray = ['10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00']
    let allTimesArray = this.allTimesArray
    let endTime = ""
    for (let i = 0; i < allTimesArray.length; i++) {
      if (allTimesArray[i] == this.timeSelected) {
        endTime = allTimesArray[i + 1]
        break;
      }

    }
    console.log("user ", this.userName, "userEmail ", this.emailId);
    if (eventName != "" && this.timeSelected != "" && this.dateSelected != "") {
      let event = {
        "title": eventName,
        "start": `${this.dateSelected}T${this.timeSelected}`,
        "end": `${this.dateSelected}T${endTime}`,
        "user": this.userName,
        "userEmail": this.emailId
      }
      this.apiService.scheduleMeetByCalendarLink(event).subscribe((response) => {
        console.log("meeting deets", response);
        console.log("response ", response);
        this.loading = false
        if (response && response['message']) {
          console.log("response ", response);
          alert(response['message']);
          window.location.reload();
        }
        else {
          this.loading = false
          alert(response['message'])
          console.error('Invalid response:', response);
          // Handle the error or show an appropriate message
        }
      })
    }
    else {
      this.loading = false
      alert("PLease fill event Name and select the meeting time.")
    }
  }
  // ------createEvent ends-----------


  // ---------------setEventTime starts---------------

  setEventTime(time) {
    console.log("timeSelected ", this.timeSelected);
    this.timeSelected = time
    console.log("timeSelected ", this.timeSelected);
    this.showNext = true
    this.showNextFor = time
  }
  // ---------------setEventTime ends---------------



  // --------------------------------------------------

  nextButton(evName, evDurHrs, evDurMins, oneTime) {
    localStorage.setItem("nameWhoseCalendar", this.nameWhoseCalendar)
    localStorage.setItem("evName", evName)
    localStorage.setItem("evDurHrs", evDurHrs)//  0
    localStorage.setItem("evDurMins", evDurMins) //30
    localStorage.setItem("oneTime", oneTime) //09:00:00
    localStorage.setItem("day", this.selectedDayName)
    localStorage.setItem("date", this.dateSelected)
    localStorage.setItem("month", this.selectedMonth)
    localStorage.setItem("evType", this.evType)
    localStorage.setItem("allowInviteesToAddGuests", this.allowInviteesToAddGuests)
    localStorage.setItem("lastNameRequired", this.lastNameRequired)
    localStorage.setItem('redirectTo', JSON.stringify(this.redirectTo))

    console.log(oneTime[0], oneTime[1], oneTime[3], oneTime[4]);

    let hrs = Number(oneTime[0] + oneTime[1]) //09
    let mins = Number(oneTime[3] + oneTime[4]) //00

    console.log("hrs, mins", hrs, mins);

    // workingStartHours = workingStartHours + Math.abs(workingStartMinutes/60)
    // workingStartMinutes = workingStartMinutes - 60*(Math.abs(workingStartMinutes/60))

    let endTimeHrs = Number(hrs + Number(evDurHrs))  //9 + 0 = 9 
    let endTimeMins = Number(mins + Number(evDurMins)) //0 + 30 = 30
    console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);

    if (endTimeMins >= 60) {
      endTimeHrs = endTimeHrs + Math.floor(endTimeMins / 60)
      endTimeMins = endTimeMins - 60 * (Math.floor(endTimeMins / 60))
    }

    console.log("endTimeHrs ", endTimeHrs, "endTimeMins ", endTimeMins);

    let endTime;
    if (endTimeMins == 0) {
      if (endTimeHrs == 0) {
        endTime = `00:00:00`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:00:00`
      }
      else {
        endTime = `${endTimeHrs}:00:00`
      }
      // endTime = `${endTimeHrs}:00:00`
    }
    else if (endTimeMins < 10) {
      if (endTimeHrs == 0) {
        endTime = `00:0${endTimeMins}:00`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:0${endTimeMins}:00`
      }
      else {
        endTime = `${endTimeHrs}:0${endTimeMins}:00`
      }
      // endTime = `${endTimeHrs}:0${endTimeMins}:00`
    }
    else {
      if (endTimeHrs == 0) {
        endTime = `00:${endTimeMins}:00`
      }
      else if (endTimeHrs < 10) {
        endTime = `0${endTimeHrs}:${endTimeMins}:00`
      }
      else {
        endTime = `${endTimeHrs}:${endTimeMins}:00`
      }
      // endTime = `${endTimeHrs}:${endTimeMins}:00`
    }



    localStorage.setItem("endTime", endTime)
    this.router.navigate(['/makeMeeting'])

  }

}
