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
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
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
        if(foundMeet==false){
          this.router.navigate(['/oops'])
        }
        this.start = reqMeet["start"]
        this.end = reqMeet["end"]


      }
    })
  }

  async getParticularUser() {
    this.user = await this.apiService.getParticularUser(this.emailIdOfWhoseCalendar)
    this.userName = this.user.name

    this.image = this.user['profileImage'];
    console.log('image in ts :', this.image);

    this.avatar = `${this.API_URL}/${this.user['profileImage']}`
    console.log("avatar ", this.avatar);

  }

  cancelEvent(){
    if(!this.cancelationReason){
      this.showWarning = true
    }
    else{
      this.showWarning = false

      this.apiService.deleteParticularMeet( this.emailIdOfWhoCancelled, this.emailIdOfWhoseCalendar, this.evId,this.meetId,this.cancelationReason)
    }
  }
}