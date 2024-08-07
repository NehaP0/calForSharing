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
  // selectedTimeZone = localStorage.getItem('selectedTimeZone')
  selectedTimeZone = 'Indian Standard Time'
  startTime = localStorage.getItem('oneTime');
  startTimeWdTimeZoneOffset = localStorage.getItem('startTimeWdTimeZoneOffset')
  endTime = localStorage.getItem('endTime');
  endTimeWdTimeZoneOffset = localStorage.getItem('endTimeWdTimeZoneOffset')
  day = localStorage.getItem('day');
  month = localStorage.getItem('month');
  date = localStorage.getItem('date');
  contactsArr = JSON.parse(localStorage.getItem('contactsArr'))
  cloduraBrandingReq = JSON.parse(localStorage.getItem('cloduraBrandingReq'))

  backGroundcolor: string = localStorage.getItem('backGroundcolor')
  textColor: string = localStorage.getItem("textColor")
  btnAndLinkColor: string = localStorage.getItem("btnAndLinkColor")

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
  pasEvntDeetsToRedirectPg

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
        this.pasEvntDeetsToRedirectPg = reqEventObj.pasEvntDeetsToRedirectPg
        this.questionsWdAnswers.forEach((obj) => {
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

    for (let i = 0; i < this.questionsWdAnswers.length; i++) {
      let obj = this.questionsWdAnswers[i]
      if (obj.answerRequiredOrNot && !obj.answer) {
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
    if (this.lastNameRequired) {
      if (userForm.value.LastName == '') {
        this.lastNameBlank = true
        console.log("lastname empty");

      }
    }
    if (reqQuestionFieldsNotFilled == true) {
      this.showWarning = true
      console.log("questions not filled");

    }
    else if (userForm.value.Name && userForm.value.Email) {
      console.log("in else if");

      // if(this.lastNameRequired  && userForm.value.LastName){
      // console.log("in if of else if");

      if (!reqQuestionFieldsNotFilled) {
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
          start: this.startTimeWdTimeZoneOffset,
          end: this.endTimeWdTimeZoneOffset,
          user: userForm.value.Name,
          userEmail: userForm.value.Email,
          otherEmails: otherEmails,
          additionalInfo: userForm.value.additional,
          evType: this.evType,
          questionsWdAnswers: this.questionsWdAnswers,
          emailOfCalendarOwner: this.emailId,
          evId: this.evId,
          userSurname: userForm.value.LastName
        };

        console.log("meet ", meet);

        this.wait = true
        console.log("wait after validation ", this.wait);

        let foundUserInContactsArr = false
        let idOfInvitee = ""
        for (let i = 0; i < this.contactsArr.length; i++) {
          if (this.contactsArr[i].emailID == userForm.value.Email) {
            foundUserInContactsArr = true
            idOfInvitee = this.contactsArr[i]._id
            break;
          }
        }
        console.log("foundUserInContactsArr ", foundUserInContactsArr, "idOfInvitee ", idOfInvitee);

        if (foundUserInContactsArr == false) {
          idOfInvitee = (Math.floor(Math.random() * 10000000000000001).toString())
        }

        console.log("idOfInvitee ", idOfInvitee);

        let usersFullName = ""
        if (userForm.value.LastName) {
          usersFullName = `${meet.user} ${meet.userSurname}`
        }
        else {
          usersFullName = meet.user
        }

        // alert('Please wait...')

        // uncomment below

        this.apiService.scheduleMeetBymakeMeetingPage(meet)
          .subscribe((response) => {

            console.log(response);
            console.log("wait after result ", this.wait);

            if (response['message'] == 'Meeting scheduled successfully. A calendar invitation will be mailed to the attendees.') {

              if (this.redirectTo.confirmationPage.status == true) {
                this.wait = false
                this.router.navigate(['/thankyou']);
              }
              else {
                if (this.pasEvntDeetsToRedirectPg) {
                  let query
                  if (meet.otherEmails.length == 0) {

                    if (meet.userSurname) {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_last_name=${meet.userSurname}&invitee_email=${meet.userEmail}`
                    }
                    else {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_email=${meet.userEmail}`
                    }
                  }
                  else {
                    console.log('inside else, since there are guests');
                    let guestsStr = ""
                    for (let i = 0; i < meet.otherEmails.length; i++) {
                      if (meet.otherEmails[i] != "" && meet.otherEmails[i] != " ") {
                        guestsStr += `&guests=${meet.otherEmails[i]}`
                      }
                    }
                    console.log("guestsStr ", guestsStr);

                    if (meet.userSurname) {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_last_name=${meet.userSurname}&invitee_email=${meet.userEmail}${guestsStr}`
                    }
                    else {
                      query = `assigned_to=${this.nameWhoseCalendar}&event_type_uuid=${this.evId}&event_type_name=${this.evName}&event_start_time=${this.date}T${this.startTime}&event_end_time=${this.date}T${this.endTime}&invitee_uuid=${idOfInvitee}&invitee_first_name=${meet.user}&invitee_email=${meet.userEmail}${guestsStr}`
                    }
                  }
                  // assigned_to=Clodura.AI&event_type_uuid=103dba2d-2879-4693-98bf-229f6a5b77b8&event_type_name=test&event_start_time=2024-07-11T12%3A00%3A00%2B05%3A30&event_end_time=2024-07-11T12%3A30%3A00%2B05%3A30&invitee_uuid=4a4af215-7b7e-4f37-a566-47a9ff84e377&invitee_first_name=Neha&invitee_last_name=Phadtare&invitee_email=nehaphadtare334%40gmail.com
                  // ?assigned_to=Clodura.AI&event_type_uuid=103dba2d-2879-4693-98bf-229f6a5b77b8&event_type_name=test&event_start_time=2024-07-17T10%3A00%3A00%2B05%3A30&event_end_time=2024-07-17T10%3A30%3A00%2B05%3A30&invitee_uuid=0a2eebaa-c910-4caf-a1aa-7b17f48f5356&invitee_first_name=Neha&invitee_last_name=p&invitee_email=nehaphadtare334%40gmail.com&guests%5B%5D=nehaphadtare443%40gmail.com&guests%5B%5D=neha.phadtare%40clodura.ai
                  // ?assigned_to=Clodura.AI&event_type_uuid=103dba2d-2879-4693-98bf-229f6a5b77b8&event_type_name=test&event_start_time=2024-07-17T10%3A00%3A00%2B05%3A30&event_end_time=2024-07-17T10%3A30%3A00%2B05%3A30&invitee_uuid=00c08667-5324-4ab8-bbf9-c17b620313b9&invitee_first_name=Neha&invitee_last_name=Phadtare&invitee_email=nehaphadtare334%40gmail.com                
                  console.log('query ', query);
                  this.wait = false
                  let link = `${this.redirectTo.externalUrl.link}?${query}`
                  window.location.href = link
                  console.log('link ', link);
                }
                else {
                  this.wait = false
                  let link = this.redirectTo.externalUrl.link
                  window.location.href = link
                }
              }
            }
            else {
              alert(response['message']);
            }
          });


        if (foundUserInContactsArr == false) {
          let contactObj = { name: usersFullName, emailID: meet.userEmail, _id: idOfInvitee }
          this.apiService.patchContactsArr(this.emailId, contactObj)
        }


        // uncomment above
        // this.apiService.scheduleMeetBymakeMeetingPage(meet)



      }
      // }

    }
  }
  // backBtn(){
  //   console.log("clicked");

  //   this.router.navigate(['/create'])
  // }
}
