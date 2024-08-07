// @ts-nocheck 

import { Component } from '@angular/core';
import { APIService } from '../api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-cancellation-page',
  templateUrl: './cancellation-page.component.html',
  styleUrl: './cancellation-page.component.css'
})
export class CancellationPageComponent {

  constructor(private apiService: APIService, private route: ActivatedRoute, private router: Router) { }

  private subscription: Subscription;

  API_URL = 'http://localhost:3000'

  emailIdOfWhoCancelled
  emailIdOfWhoseCalendar
  evId
  meetId

  reqEventObj
  evName
  evDurHrs
  evDurMins
  evLocation
  start
  end
  user
  userName
  userAvatar
  image
  avatar

  cancelationReason = ""
  showWarning = false
  startTime
  endTime

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params.whoCanceled, params.whoseCalendar, params.eventId, params.meetId);

      this.emailIdOfWhoCancelled = params.whoCanceled
      this.emailIdOfWhoseCalendar = params.whoseCalendar
      this.evId = params.eventId
      this.meetId = params.meetId
    })

    this.getParticularEvent()
    this.getParticularUser()

  }


  async getParticularEvent() {
    await this.apiService.getSelectedEvent(this.evId, this.emailIdOfWhoseCalendar)
    console.log("this.evId, this.emailIdOfWhoseCalendar ", this.evId, this.emailIdOfWhoseCalendar);

    let foundreqEventObj = false
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      if (reqEventObj) {
        foundreqEventObj = true
        console.log("reqEventObj ", reqEventObj);
        if (Object.keys(reqEventObj).length > 0) { // i.e. object is not empty
          console.log("got reqEventObj ", reqEventObj);
          this.evName = reqEventObj["evName"]
          this.evDurHrs = reqEventObj["evDuration"]["hrs"]
          this.evDurMins = reqEventObj["evDuration"]["minutes"]
          this.evLocation = reqEventObj["evLocation"]


          let reqMeet
          let foundMeet = false
          for (let i = 0; i < reqEventObj['meetings'].length; i++) {
            if (reqEventObj['meetings'][i]._id == this.meetId) {
              foundMeet = true
              reqMeet = reqEventObj['meetings'][i]
              break;
            }
          }
          console.log("found", foundMeet);

          if (foundMeet == false) {
            this.router.navigate(['/oops'])
          }
          this.start = reqMeet["start"]
          this.end = reqMeet["end"]

          let startstr = this.start.split('T')[1]
          startstr = startstr.split('+')[0]
          console.log("startstr ", startstr);
          this.startTime = `${startstr[0]}${startstr[1]}${startstr[2]}${startstr[3]}${startstr[4]}`

          let endstr = this.end.split('T')[1]
          endstr = endstr.split('+')[0]
          console.log("endstr ", endstr);
          this.endTime = `${endstr[0]}${endstr[1]}${endstr[2]}${endstr[3]}${endstr[4]}`
        }
      }
    })

    console.log("foundreqEventObj ", foundreqEventObj);
    if(!foundreqEventObj){
      let foundMeetInMeetWtOthers = await this.getParticularMeetFromMeetWithOthers()
      if(!foundMeetInMeetWtOthers){
        this.router.navigate(['/oops'])
      }
    }
    
  }

  async getParticularUser() {
    this.user = await this.apiService.getParticularUser(this.emailIdOfWhoseCalendar)
    this.userName = this.user.name

    this.image = this.user['profileImage'];
    console.log('image in ts :', this.image);

    this.avatar = `${this.API_URL}/${this.user['profileImage']}`
    console.log("avatar ", this.avatar);

  }

  async getParticularMeetFromMeetWithOthers() {
    console.log("getParticularMeetFromMeetWithOthers called");
    
    this.user = await this.apiService.getParticularUser(this.emailIdOfWhoseCalendar)
    let meetingsWtOthers = this.user.meetingsWtOthers
    let found = false
    for(let i=0; i<meetingsWtOthers.length; i++){
      if(meetingsWtOthers[i]._id == this.meetId){
        found = true
        this.start = meetingsWtOthers[i]["start"]
        this.end = meetingsWtOthers[i]["end"]
        

        
        
        break;
      }
    }
    console.log("found meet in meetwtothers ", found);
    
    return found
  }

  cancelEvent() {
    if (!this.cancelationReason) {
      this.showWarning = true
    }
    else {
      this.showWarning = false

      this.apiService.deleteParticularMeet(this.emailIdOfWhoCancelled, this.emailIdOfWhoseCalendar, this.evId, this.meetId, this.cancelationReason)
    }
  }
}
