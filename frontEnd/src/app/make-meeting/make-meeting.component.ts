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
  constructor(private apiService: APIService, private router: Router) { }



  nameWhoseCalendar = localStorage.getItem('nameWhoseCalendar');
  emailId = localStorage.getItem("userEmailId")
  evId = localStorage.getItem("eventId")
  evName = localStorage.getItem('evName');
  evType = localStorage.getItem('evType');
  evDurHrs = localStorage.getItem('evDurHrs');
  evDurMins = localStorage.getItem('evDurMins');
  startTime = localStorage.getItem('oneTime');
  endTime = localStorage.getItem('endTime');
  day = localStorage.getItem('day');
  month = localStorage.getItem('month');
  date = localStorage.getItem('date');
  lastNameRequired = JSON.parse(localStorage.getItem('lastNameRequired'))
  allowInviteesToAddGuestsStr = localStorage.getItem('allowInviteesToAddGuests')
  allowInviteesToAddGuests;
  redirectTo = JSON.parse(localStorage.getItem("redirectTo"))
  nameBlank = false;
  emailBlank = false;
  addGuests = false;
  questionsToBeAsked = []
  questionsWdAnswers = []
  lastNameBlank = false

  oneOnOne = false;
  wait = false
  showWarning = false

  ngOnInit() {
    if (this.evType == 'One-on-One') {
      this.oneOnOne = true;
    }



    this.apiService.getSelectedEvent(this.evId, this.emailId)
    this.subscription = this.apiService.reqEvent$.subscribe((reqEventObj) => {
      this.reqEventObj = reqEventObj
      console.log("reqEventObj ", reqEventObj);

      if (Object.keys(reqEventObj).length > 0) {
        this.questionsToBeAsked = reqEventObj.questionsToBeAsked
        this.allowInviteesToAddGuests = reqEventObj.allowInviteesToAddGuests
        console.log("this.questionsToBeAsked ", this.questionsToBeAsked);        
        this.questionsWdAnswers = reqEventObj.questionsToBeAsked
        this.questionsWdAnswers.forEach((obj)=>{
          return obj["answer"] = ""
        })
        console.log("this.questionsWdAnswers ", this.questionsWdAnswers);
        
      }
    })
  }




  addguests() {
    this.addGuests = true;
  }

  formSubmit(userForm: NgForm) {
    console.log('from submitted');
    console.log("wait before validation ", this.wait);
    let reqQuestionFieldsNotFilled = false

    for(let i=0; i<this.questionsWdAnswers.length; i++){
      let obj = this.questionsWdAnswers[i]
      if(obj.answerRequiredOrNot && !obj.answer){
        reqQuestionFieldsNotFilled = true
      }
    }

    console.log("reqQuestionFieldsNotFilled ", reqQuestionFieldsNotFilled);
    


    // console.log(
    //   'userForm ',
    //   userForm.value.Name,
    //   userForm.value.Email,
    //   userForm.value.additional,
    //   userForm.value.LastName
    // );



    if (userForm.value.Name == '') {
      this.nameBlank = true;
      console.log("Name empty");
      
    }
    if (userForm.value.Email == '') {
      this.emailBlank = true;
      console.log("Email empty");
      
    }
    if(this.lastNameRequired ){
      if(userForm.value.LastName == ''){
        this.lastNameBlank = true
        console.log("lastname empty");
        
      }
    }
    if(reqQuestionFieldsNotFilled == true){
      this.showWarning = true
      console.log("questions not filled");
      
    } 
    else if(userForm.value.Name && userForm.value.Email) {
      console.log("in else if");
      
      // if(this.lastNameRequired  && userForm.value.LastName){
        // console.log("in if of else if");
        
        if(!reqQuestionFieldsNotFilled){
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
            questionsWdAnswers : this.questionsWdAnswers,
            emailOfCalendarOwner: this.emailId,
            evId : this.evId,
            userSurname : userForm.value.LastName
          };
          this.wait = true
          console.log("wait after validation ", this.wait);
    
          // alert('Please wait...')
    
          // uncomment below
          this.apiService
            .scheduleMeetBymakeMeetingPage(meet)
            .subscribe((response) => {
              this.wait = false
              console.log(response);
              console.log("wait after result ", this.wait);
    
              alert(response['message']);
              if(this.redirectTo.confirmationPage.status == true){
                this.router.navigate(['/thankyou']);
              }
              else{
                let link = this.redirectTo.externalUrl.link
                window.location.href = link
                // this.router.navigate(link);
              }
    
              // if(response['message'] == "You are scheduled. A calendar invitation has been sent to your email address."){
              // }
              // else{
              //   this.wait = false
              //   alert("Meeting scheduling failed. Please try after some time.")
              // }
    
            });
    
          // uncomment above
          // this.apiService.scheduleMeetBymakeMeetingPage(meet)
        }
      // }

  }
  }
  // goBack(){
  //   this.router.navigate(['/createMeeting'])
  // }
}
