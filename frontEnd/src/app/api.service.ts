// @ts-nocheck

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, take, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private userNameSubject = new BehaviorSubject<string>('');
  private emailIdSubject = new BehaviorSubject<string>('');
  private eventDateSubject = new BehaviorSubject<string>('');
  private eventTimeSubject = new BehaviorSubject<string>('');
  private meetingArraySubject = new BehaviorSubject<any[]>([]);
  private usersSubject = new BehaviorSubject<object[]>([]);
  private formattedMeetingsSubject = new BehaviorSubject<any[]>([]);
  private formattedMeetingsHideSubject = new BehaviorSubject<any[]>([]);
  private formattedMeetingsOfLoggedInUserSubject = new BehaviorSubject<any[]>(
    []
  );
  private userLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userLoggedInEmailIdSubject = new BehaviorSubject<string>('');
  private userLoggedInNameSubject = new BehaviorSubject<string>('');
  // private userAvailableOnWeekendsSubject = new BehaviorSubject<boolean>(true);
  private initiallyUserUnavailabelOnArraySubject = new BehaviorSubject<
    number[]
  >([]);
  private userUnavailabelOnArraySubject = new BehaviorSubject<number[]>([0, 6]);
  private userAvailabelOnArraySubject = new BehaviorSubject<number[]>([
    1, 2, 3, 4, 5,
  ]);
  private durationSubject = new BehaviorSubject<object>({
    hrs: 0,
    minutes: 30,
  });
  private workingHrsSubject = new BehaviorSubject<object>({
    1: { start: '09:00:00', end: '17:00:00' },
    2: { start: '09:00:00', end: '17:00:00' },
    3: { start: '09:00:00', end: '17:00:00' },
    4: { start: '09:00:00', end: '17:00:00' },
    5: { start: '09:00:00', end: '17:00:00' },
  });
  private selectedUserAvailabilityObjSubject = new BehaviorSubject<object>({});
  private eventsArraySubject = new BehaviorSubject<object[]>([]);
  private eventTypeSubject = new BehaviorSubject<string>('');
  private getMeetingsforUserToSeeSubject = new BehaviorSubject<any[]>([]);
  private getEventsforUserToSeeSubject = new BehaviorSubject<any[]>([]);
  private getMeetingsOfParticularEventAdminSubject = new BehaviorSubject<any[]>(
    []
  );
  private timesForVotingSubject = new BehaviorSubject<any[]>([]);
  private meetingPollDetailsSubject = new BehaviorSubject<object>({});
  private votingLinkSubject = new BehaviorSubject<string>('');
  private votingArrSubject = new BehaviorSubject<any[]>([]);


  // for create meeting page -----------------------------------------

  private nameSubject = new BehaviorSubject<string>('');
  // const name = params['name'];
  // this.nameWhoseCalendar = name
  private emailIdSubject = new BehaviorSubject<string>('');
  // const id = params['id'];
  // console.log("ng oninit called");
  // this.apiService.setUserName(name);
  // this.apiService.setUserEmailId(id);
  // console.log('Name:', name);
  // console.log('ID:', id);
  private evNameSubject = new BehaviorSubject<string>('');
  // this.evName = params['evName']

  private evDurHrsSubject = new BehaviorSubject<number>(0);
  // this.evDurHrs = Number(params['evDurHrs'])

  private evDurMinsSubject = new BehaviorSubject<number>(0);
  // this.evDurMins = Number(params['evDurMins'])

  private evTypeSubject = new BehaviorSubject<string>('');
  // this.evType = params['evType']

  private imageSubject = new BehaviorSubject<string>('');
  // this.image = params['image']

  private avatarSubject = new BehaviorSubject<string>('');
  // this.avatar = `${this.API_URL}/${params['image']}`

  private allowInviteesToAddGuestsSubject = new BehaviorSubject<boolean>(true)
  private reqEventSubject = new BehaviorSubject<object>({});
  private cloduraBrandingReqSubject = new BehaviorSubject<boolean>


  public name$ = this.nameSubject.asObservable();;
  // const name = params['name'];
  // this.nameWhoseCalendar = name
  public emailId$ = this.emailIdSubject.asObservable();;
  // const id = params['id'];
  // console.log("ng oninit called");
  // this.apiService.setUserName(name);
  // this.apiService.setUserEmailId(id);
  // console.log('Name:', name);
  // console.log('ID:', id);
  public evName$ = this.evNameSubject.asObservable();;
  // this.evName = params['evName']

  public evDurHrs$ = this.evDurHrsSubject.asObservable();;
  // this.evDurHrs = Number(params['evDurHrs'])

  public evDurMins$ = this.evDurMinsSubject.asObservable();;
  // this.evDurMins = Number(params['evDurMins'])

  public evType$ = this.evTypeSubject.asObservable();;
  // this.evType = params['evType']

  public image$ = this.imageSubject.asObservable();;
  // this.image = params['image']

  public avatar$ = this.avatarSubject.asObservable();;

  // for create meeting page ends-----------------------------------



  public userName$ = this.userNameSubject.asObservable();
  public emailId$ = this.emailIdSubject.asObservable();
  public eventDate$ = this.eventDateSubject.asObservable();
  public eventTime$ = this.eventTimeSubject.asObservable();
  public meetingArray$ = this.meetingArraySubject.asObservable();
  public users$ = this.usersSubject.asObservable();
  public formattedMeetings$ = this.formattedMeetingsSubject.asObservable();
  public formattedMeetingsHide$ =
    this.formattedMeetingsHideSubject.asObservable();
  public userLoggedIn$ = this.userLoggedInSubject.asObservable();
  public userLoggedInEmailId$ = this.userLoggedInEmailIdSubject.asObservable();
  public formattedMeetingsOfLoggedInUser$ =
    this.formattedMeetingsOfLoggedInUserSubject.asObservable();
  public userLoggedInName$ = this.userLoggedInNameSubject.asObservable();
  // public userAvailableOnWeekends$ = this.userAvailableOnWeekendsSubject.asObservable();
  public userUnavailabelOnArray$ =
    this.userUnavailabelOnArraySubject.asObservable();
  public initiallyUserUnavailabelOnArray$ =
    this.initiallyUserUnavailabelOnArraySubject.asObservable();
  public userAvailabelOnArray$ =
    this.userAvailabelOnArraySubject.asObservable();
  public duration$ = this.durationSubject.asObservable();
  public workingHrs$ = this.workingHrsSubject.asObservable();
  public selectedUserAvailabilityObj$ =
    this.selectedUserAvailabilityObjSubject.asObservable();
  public eventsArray$ = this.eventsArraySubject.asObservable();
  public eventType$ = this.eventTypeSubject.asObservable();
  public getMeetingsforUserToSee$ =
    this.getMeetingsforUserToSeeSubject.asObservable();
  public getEventsforUserToSee$ =
    this.getEventsforUserToSeeSubject.asObservable();
  public getMeetingsOfParticularEventAdmin$ =
    this.getMeetingsOfParticularEventAdminSubject.asObservable();
  public timesForVoting$ = this.timesForVotingSubject.asObservable();
  public meetingPollDetails$ = this.meetingPollDetailsSubject.asObservable();
  public votingLink$ = this.votingLinkSubject.asObservable();
  public votingArr$ = this.votingArrSubject.asObservable();
  public allowInviteesToAddGuests$ = this.allowInviteesToAddGuestsSubject.asObservable();
  public reqEvent$ = this.reqEventSubject.asObservable()
  public cloduraBrandingReq$ = this.cloduraBrandingReqSubject.asObservable()




  API_URL = 'http://localhost:3000';

  private headers: HttpHeaders = new HttpHeaders();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getallusers() {
    return this.httpClient.get(`${this.API_URL}/allUsersRoute/`, {
      headers: {
        // Authorization: `Bearer ${token}`
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  }



  async findLoggedInName(email) {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const user = (users as any[]).find((u) => u.emailID === email);
    const name = user.name;
    localStorage.setItem('userLoggedInName', name);
    this.userLoggedInNameSubject.next(name);
  }

  loginUser(user) {
    console.log('user ', user);
    this.userLoggedInSubject.next(true);
    this.userLoggedInEmailIdSubject.next(user.emailID);
    // this.userLoggedInNameSubject.next(user.name);
    console.log('id value after login ', this.userLoggedInEmailIdSubject);

    this.findLoggedInName(user.emailID);

    console.log('userLoggedIn api service ts', this.userLoggedIn$);
    return this.httpClient.post(`${this.API_URL}/user/login`, user);
  }

  async getParticularUserByUid(uid) {
    const response = await this.httpClient.get(`${this.API_URL}/user/getParticularUserBuUid?uid=${uid}`, {
      headers: {
        // Authorization: `Bearer ${token}`
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).toPromise();;

    console.log("got user ", response['user']);
    let user = response['user']
    return response['user']
  }

  async getParticularUser(emailId) {
    const response = await this.httpClient.get(`${this.API_URL}/user/getParticularUser?userEmailId=${emailId}`, {
      headers: {
        // Authorization: `Bearer ${token}`
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).toPromise();;

    console.log("got user ", response['user']);
    let user = response['user']
    this.cloduraBrandingReqSubject.next(user['cloduraBranding'])
    return response['user']
  }




  //to set Authorization header
  setAuthorizationHeader(token: string) {
    this.headers = new HttpHeaders().set('Authorization', token);
  }

  scheduleMeet(meet) {
    console.log('scheduleMeet functn called and meet details', meet);
    // console.log(meet);
    return this.httpClient.post(
      `${this.API_URL}/meeting/createMeeting`,
      {
        headers: {
          // Authorization: `Bearer ${token}`
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
      meet
    );
  }

  scheduleMeetByCalendarLink(meet) {
    console.log(
      'scheduleMeetByCalendarLink functn called and meet details',
      meet
    );
    // console.log(meet);
    return this.httpClient.post(`${this.API_URL}/calendarLink/`, meet);
  }

  scheduleMeetBymakeMeetingPage(meet) {
    console.log(
      'scheduleMeetByCalendarLink functn called and meet details',
      meet
    );
    console.log('meet from apiservice ', meet);
    // return meet
    return this.httpClient.post(
      `${this.API_URL}/calendarLink/postMeetFromMeetPage`,
      meet
    );
  }

  setUserName(userName: string) {
    console.log('username set by link ', userName);
    this.userNameSubject.next(userName);
  }

  setUserEmailId(emailId: string) {
    console.log('id set by link ', emailId);
    this.emailIdSubject.next(emailId);
  }

  // -------------------------------------------------------------------------------------

  async getMeetings() {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const userName = this.userNameSubject.getValue();
    console.log('userName', userName);

    const user = (users as any[]).find((u) => u.name === userName);

    if (user && user.meetings) {
      const formattedMeetings = user.meetings.map((meeting) => ({
        Id: meeting._id,
        Subject: meeting.Subject,
        StartTime: new Date(meeting.StartTime),
        EndTime: new Date(meeting.EndTime),
      }));

      this.formattedMeetingsSubject.next(formattedMeetings);
    }
  }

  // --------------------------------------------------------
  async getMeetingsHide(id) {
    // const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();

    // const users =  usersObj["users"]
    // console.log("users", users);

    // const userName = name

    // const user = (users as any[]).find((u) => u.name === userName);

    // if (user && user.meetings) {
    //   const formattedMeetingsHide = user.meetings.map(meeting => ({
    //     Id: meeting._id,
    //     title: "Unavailable",
    //     // title: meeting.title,
    //     start: meeting.start,
    //     end: meeting.end,
    //   }));

    //   this.formattedMeetingsHideSubject.next(formattedMeetingsHide);
    // }
    console.log("id ", id);

    const usersObj = await this.httpClient.get(`${this.API_URL}/allUsersRoute/`).toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const userId = id;

    console.log('userId ', userId);

    const user = (users as any[]).find((u) => u.emailID === userId);
    console.log('found user', user);

    const userEventsArray = user.events;

    console.log('userEventsArray ', userEventsArray);

    // let formattedMeetingsHide = []
    // for(let i=0; i<userEventsArray.length; i++){
    //   let userMeetings = userEventsArray[i]
    //   for(let j=0; j<userMeetings.length; j++){
    //     formattedMeetingsHide.push(userMeetings[j])
    //   }
    // }

    // console.log(formattedMeetingsHide);

    // if (user && user.meetings) {
    // }

    //----------- commented now-----
    // const formattedMeetingsHide = user.events[0].meetings.map(meeting => ({
    //   Id: meeting._id,
    //   // title: "Unavailable",
    //   title: meeting.title,
    //   start: meeting.start,
    //   end: meeting.end,
    // }));

    // this.formattedMeetingsHideSubject.next(formattedMeetingsHide);
    //----------  commented now

    console.log('user events ', user.events);

    let meetings = [];
    for (let i = 0; i < user.events.length; i++) {
      console.log(
        'event ',
        user.events[i],
        'particular event meetings ',
        user.events[i].meetings
      );
      let meetingsArr = user.events[i].meetings;
      // const formattedMeetingsHide = user.events[i].meetings.map(meeting => ({
      //   Id: meeting._id,
      //   // title: "Unavailable",
      //   // title: "",
      //   start: meeting.start,
      //   end: meeting.end,
      // }));



      if (user.events[i].evType == "Group") {
        for (let j = 0; j < meetingsArr.length; j++) {
          let oneMeetObj = {
            Id: meetingsArr[j]._id,
            // title: "Unavailable",
            // title: "",
            start: meetingsArr[j].start,
            end: meetingsArr[j].end,
            bookedForWhichEvId: meetingsArr[j].bookedForWhichEvId
          };
          meetings.push(oneMeetObj);
        }
      }
      else {
        for (let j = 0; j < meetingsArr.length; j++) {
          let oneMeetObj = {
            Id: meetingsArr[j]._id,
            // title: "Unavailable",
            // title: "",
            start: meetingsArr[j].start,
            end: meetingsArr[j].end,
          };
          meetings.push(oneMeetObj);
        }
      }

      // meetings = [...meetings, formattedMeetingsHide]
    }
    for (let i = 0; i < user.meetingsWtOthers.length; i++) {
      let oneMeetObj = {
        Id: user.meetingsWtOthers[i]._id,
        // title: "Unavailable",
        // title: "",
        start: user.meetingsWtOthers[i].start,
        end: user.meetingsWtOthers[i].end,
      };
      meetings.push(oneMeetObj);
    }

    console.log('meetings ', meetings);

    this.formattedMeetingsHideSubject.next(meetings);
  }

  async getMeetingsforUserToSee(id) {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    const userId = id;

    console.log('userId ', userId);

    const user = (users as any[]).find((u) => u.emailID === userId);
    console.log('found user', user);

    const userEventsArray = user.events;

    console.log('userEventsArray ', userEventsArray);

    this.getEventsforUserToSeeSubject.next(userEventsArray);

    console.log('userEventsArray ', userEventsArray);

    console.log('user events ', user.events);

    let allMeetings = [];
    for (let i = 0; i < user.events.length; i++) {
      console.log(
        'event ',
        user.events[i],
        'particular event meetings ',
        user.events[i].meetings
      );
      let event = user.events[i];
      let meetingsArr = user.events[i].meetings;

      // let meetInOneEvent = []
      for (let j = 0; j < meetingsArr.length; j++) {
        let oneMeetObj = {
          Id: meetingsArr[j]._id,
          name: meetingsArr[j].user,
          emailId: meetingsArr[j].userEmail,
          evName: event.evName,
          evType: event.evType,
          // currentDate: meetingsArr[j].currentDate,
          start: meetingsArr[j].start,
          end: meetingsArr[j].end,
        };
        // meetInOneEvent.push(oneMeetObj)
        // allMeetings.push(user.events[i])
        console.log('his own meet oneMeetObj ', oneMeetObj);

        allMeetings.push(oneMeetObj);
      }
      // meetings = [...meetings, formattedMeetingsHide]
    }
    for (let i = 0; i < user.meetingsWtOthers.length; i++) {
      let oneMeetObj = {
        Id: user.meetingsWtOthers[i]._id,
        name: user.meetingsWtOthers[i].user,
        emailId: user.meetingsWtOthers[i].userEmail,
        evName: user.meetingsWtOthers[i].evName,
        evType: user.meetingsWtOthers[i].evType,
        // currentDate: user.meetingsWtOthers[i].currentDate,
        // title: "Unavailable",
        // title: "",
        start: user.meetingsWtOthers[i].start,
        end: user.meetingsWtOthers[i].end,
      };

      console.log('his meet with others oneMeetObj ', oneMeetObj);

      allMeetings.push(oneMeetObj);
    }

    console.log('allMeetings ', allMeetings);

    this.getMeetingsforUserToSeeSubject.next(allMeetings);
  }

  async getMeetingOfLoggedInUser() {
    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    // const userEmail = this.userLoggedInEmailIdSubject.getValue();
    const userEmail = localStorage.getItem('emailID' || '');
    console.log('Email of loggedIn user', userEmail);

    const user = (users as any[]).find((u) => u.emailID === userEmail);

    this.userLoggedInNameSubject.next(user.name);
    localStorage.setItem(
      'userLoggedInName',
      this.userLoggedInNameSubject.getValue()
    );

    if (user && user.meetings) {
      const formattedMeetings = user.meetings.map((meeting) => ({
        Id: meeting._id,
        title: meeting.title,
        start: meeting.start,
        end: meeting.end,
      }));

      this.formattedMeetingsOfLoggedInUserSubject.next(formattedMeetings);
      console.log(
        'this.formattedMeetingsOfLoggedInUser$ ',
        this.formattedMeetingsOfLoggedInUser$
      );
      // console.log( this.formattedMeetingsSubject);
    }
  }

  //-----------------------------------------------------------------------------------

  async initiallyUserUnavailbeOn(userId) {
    console.log('initiallyUserUnavailbeOn called ');
    const response = await this.httpClient
      .get(`${this.API_URL}/user/initialUserUnavailibility?userId=${userId}`)
      .toPromise();
    console.log('response ', response);
  }

  userUnavOn(dayNumberArray) {
    // this.userUnavailabelOnArraySubject = dayNumberArray
    this.userUnavailabelOnArraySubject.next(dayNumberArray);
    console.log('unavailable ', this.userUnavailabelOnArraySubject);
  }

  userAvOnDay(dayNumberArray) {
    // this.userAvailabelOnArraySubject = dayNumberArray
    // console.log("Available ", this.userAvailabelOnArraySubject);

    this.userAvailabelOnArraySubject.next(dayNumberArray);
    console.log('Available ', dayNumberArray);

    // this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
    //     console.log("available value ", userAvailabelOnArrayValue);
    // });
  }

  userAvOnTime(durationObj) {
    // if(durationObj.hrs==""){
    //   durationObj.hrs = 0
    // }
    this.duration$ = durationObj;
    console.log('duration ', this.duration$);
  }

  userWorkingHrs(wrkngHrsObj) {
    this.workingHrs$ = wrkngHrsObj;
    console.log('workingHrs ', this.workingHrs$);
    this.patchUserAvailability();
  }

  patchUserAvailability() {
    console.log('pathUserAvailability called');

    //     this.userLoggedInEmailIdSubject.next(user.emailID);
    let emailID = localStorage.getItem('emailID');
    // let userAvailability = {};
    let userAvailability = {
      duration: {},
      workingHrs: {},
      workingDays: [],
      nonWorkingDays: [],
    };

    // this.userLoggedInEmailId$.subscribe((userLoggedInEmailIdValue) => {
    //   emailID = userLoggedInEmailIdValue;
    // });
    // console.log("log in id ",this.userLoggedInEmailId$);

    console.log(this.duration$, this.workingHrs$);

    userAvailability.duration = this.duration$;
    userAvailability.workingHrs = this.workingHrs$;

    this.userAvailabelOnArray$.subscribe((userAvailabelOnArrayValue) => {
      console.log('available value ', userAvailabelOnArrayValue);

      userAvailability.workingDays = userAvailabelOnArrayValue;
      console.log('available on ', userAvailabelOnArrayValue);
    });

    this.userUnavailabelOnArray$.subscribe((userUnavailabelOnArrayValue) => {
      userAvailability.nonWorkingDays = userUnavailabelOnArrayValue;
      console.log('unavailable on ', userUnavailabelOnArrayValue);
    });

    console.log(userAvailability);

    return this.httpClient
      .patch(
        `${this.API_URL}/user/patchuser`,
        { emailID, userAvailability },
        {
          headers: {
            // Authorization: `Bearer ${token}`
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .subscribe(
        (response) => {
          console.log(response);
          alert(response['message']);
        },
        (error) => {
          console.error(error);
        }
      );
  }


  patchContactsArr(emailOfCalendarOwner, contactObj) {
    console.log('patchUserAvailability called');
    console.log("emailOfCalendarOwner ", emailOfCalendarOwner, "contactObj ", contactObj);
    

    return this.httpClient
      .patch(
        `${this.API_URL}/user/updateContactsArr`,
        { emailOfCalendarOwner, contactObj }
      )
      .subscribe(
        (response) => {
          console.log(response);
          console.log(response['message']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  async getSelectedUsersAvailaibilityObj() {
    console.log('called for Av Obj');

    const usersObj = await this.httpClient
      .get(`${this.API_URL}/allUsersRoute/`)
      .toPromise();

    const users = usersObj['users'];
    console.log('users', users);

    let emailIDofSelectedUser = '';

    this.emailId$.subscribe((emailIdValue) => {
      emailIDofSelectedUser = emailIdValue;
    });

    console.log('email ', emailIDofSelectedUser);

    for (let i = 0; i < users.length; i++) {
      if (users[i]['emailID'] == emailIDofSelectedUser) {
        // this.selectedUserAvailabilityObj$ = users[i]["userAvailability"]
        this.selectedUserAvailabilityObjSubject.next(
          users[i]['userAvailability']
        );
        // console.log("selectedUserAvailabilityObj ",this.selectedUserAvailabilityObj$);
        break;
      }
    }
  }

  async getEvents() {
    console.log('get events called');

    const response = await this.httpClient
      .get(`${this.API_URL}/event/getEvents`)
      .toPromise();
    console.log('events ', response['message']);
    const events = response['message'];
    this.eventsArraySubject.next(events);
  }

  updateEventType(evType) {
    //tells the type of event, like one-on-one
    console.log('called updateEventType');
    console.log('evType ', evType);
    this.eventTypeSubject.next(evType);
    this.eventType$.subscribe((eventTypeValue) => {
      console.log('eventTypeValue in updateEventType is ', eventTypeValue);
    });
  }



  async fetchImageURL() {
    console.log('fetchImageURL called');
    try {
      const emailId = localStorage.getItem('emailID');
      const response = await this.httpClient
        .get(`${this.API_URL}/user/getImage/${emailId}`)
        .toPromise();
      console.log('Response:', response['message']);
      return response['message'];
    } catch (err) {
      console.error('Error fetching image URL:', err);
      return err;
    }
    // let url = `${this.API_URL}/user/getImage/${localStorage.getItem('emailID')}`
    // const response = await this.httpClient.get(url)
    // console.log("response message ", response['message']);
  }


  async getReqDetails(reqUserId, eventId) {
    console.log("getReqDetails called in api.service.ts ", reqUserId, eventId);

    try {
      const response = await this.httpClient
        .get(`${this.API_URL}/allUsersRoute/getAUser`, { params: { reqUserId, eventId } })
        .toPromise();

      console.log("response ", response)

      let user = response.reqUser

      console.log("user in my new app ", user);
      this.nameSubject.next(user.name)
      this.emailIdSubject.next(user.emailID)
      this.imageSubject.next(user.profileImage)

      let reqEvent = user.events.find((oneEvent) => oneEvent._id == eventId)

      console.log("reqEvent ", reqEvent);


      this.evTypeSubject.next(reqEvent.evType)
      this.evNameSubject.next(reqEvent.evName)
      this.evDurMinsSubject.next(Number(reqEvent.evDuration.minutes))
      this.evDurHrsSubject.next(Number(reqEvent.evDuration.hrs))
      this.allowInviteesToAddGuestsSubject.next(reqEvent.allowInviteesToAddGuests)

      // emailID:"nehaphadtare334@gmail.com"
      // events: [{…}]
      // meetingsWtOthers: [{…}]
      // name: "Neha"
      // password: "$2b$05$gE7PUbkOry2m058uFU.AkeMnTj/WbOZQsRPN4ce5doNl8pCv8FQ8y"
      // phoneNumber: "9359412215"
      // profileImage: "uploads/667501779730dae2badb93e950636954"
      // userAvailability: {duration: {…}, workingHrs: {…}, workingDays: Array(5), nonWorkingDays: Array(2), _id: '665d9c43bcf62662eda44a03'}
      // voting: []
      // _id: "665d9c43bcf62662eda44a00"

    } catch (error) {
      console.log("err ", error);

    }
  }

  async getSelectedEvent(evId, loggedInEmailId) {
    console.log("getSelectedEvent called in api ", evId, loggedInEmailId);

    let reqEvent = {}
    let response = await this.httpClient
      .get(`${this.API_URL}/event/getParticularEvent/${loggedInEmailId}/${evId}`)
      .toPromise();
    console.log("sending response ", response);


    if (response['message'] == "Found") {
      reqEvent = response['reqEvent']
      console.log("reqEvent ", reqEvent);
      this.reqEventSubject.next(reqEvent)
    }
    else {
      console.log(response['message']);

    }
  }


  deleteParticularMeet(emailIdOfWhoCancelled, emailIdOfWhoseCalendar, evId, meetId, cancelationReason) {

    return this.httpClient
      .patch(
        `${this.API_URL}/event/deleteMeet`,
        { emailIdOfWhoCancelled, emailIdOfWhoseCalendar, evId, meetId, cancelationReason }
      )
      .subscribe(
        (response) => {
          console.log(response);
          if (response['message'] == "Deleted") {
            this.router.navigate(['/cancelConfirmed'])
          }
          else{
            alert(response['message']);
          }
        },
        (error) => {
          console.error(error);
        }
      );

  }


}