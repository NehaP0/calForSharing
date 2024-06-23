// @ts-nocheck
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-make-meeting',
  templateUrl: './make-meeting.component.html',
  styleUrl: './make-meeting.component.css',
})
export class MakeMeetingComponent implements OnInit {
  constructor(private apiService: APIService, private router: Router) {}



  nameWhoseCalendar = localStorage.getItem('nameWhoseCalendar');
  evName = localStorage.getItem('evName');
  evType = localStorage.getItem('evType');
  evDurHrs = localStorage.getItem('evDurHrs');
  evDurMins = localStorage.getItem('evDurMins');
  startTime = localStorage.getItem('oneTime');
  endTime = localStorage.getItem('endTime');
  day = localStorage.getItem('day');
  month = localStorage.getItem('month');
  date = localStorage.getItem('date');
  allowInviteesToAddGuestsStr = localStorage.getItem('allowInviteesToAddGuests')
  allowInviteesToAddGuests;
  nameBlank = false;
  emailBlank = false;
  addGuests = false;

  oneOnOne = false;
  wait = false
  
  ngOnInit() {
    if (this.evType == 'One-on-One') {
      this.oneOnOne = true;
    }
    
    if(this.allowInviteesToAddGuestsStr=="true"){
      this.allowInviteesToAddGuests = true
    }
    else if(this.allowInviteesToAddGuestsStr=="false"){
      this.allowInviteesToAddGuests = false
    }
    
  }


  addguests() {
    this.addGuests = true;
  }

  formSubmit(userForm: NgForm) {
    console.log('from submitted');
    console.log("wait before validation ", this.wait );
    

    console.log(
      'userForm ',
      userForm.value.Name,
      userForm.value.Email,
      userForm.value.additional
    );
    if (userForm.value.Name == '') {
      this.nameBlank = true;
    }
    if (userForm.value.Email == '') {
      this.emailBlank = true;
    } else {
      let otherEmails = [];
      console.log('Guests ', userForm.value.Guests);
      if (userForm.value.Guests) {
        let otherEmailsString = userForm.value.Guests;
        otherEmails = otherEmailsString.split(/,| /); //splits wherever there is comma or space
        // console.log("should include space and comma",otherEmails);
        // console.log(otherEmails[1]);
      }

      let meet = {
        title: this.evName,
        start: `${this.date}T${this.startTime}`,
        end: `${this.date}T${this.endTime}`,
        user: userForm.value.Name,
        userEmail: userForm.value.Email,
        otherEmails: otherEmails,
        additionalInfo: userForm.value.additional,
        evType: this.evType,
      };
      this.wait = true
      console.log("wait after validation ", this.wait );

      // alert('Please wait...')
      this.apiService
        .scheduleMeetBymakeMeetingPage(meet)
        .subscribe((response) => {
          console.log(response);
          console.log("wait after result ", this.wait );
          
          this.wait = false
          alert(response['message']);
          this.router.navigate(['/thankyou']);
          
          // if(response['message'] == "You are scheduled. A calendar invitation has been sent to your email address."){
          // }
          // else{
          //   this.wait = false
          //   alert("Meeting scheduling failed. Please try after some time.")
          // }

        });
      // this.apiService.scheduleMeetBymakeMeetingPage(meet)
    }
  }
  // goBack(){
  //   this.router.navigate(['/createMeeting'])
  // }
}
