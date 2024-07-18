import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMeetingComponentComponent } from './create-meeting-component/create-meeting-component.component';
import { MakeMeetingComponent } from './make-meeting/make-meeting.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
import { CancellationPageComponent } from './cancellation-page/cancellation-page.component';
import { CancelConfirmedComponent } from './cancel-confirmed/cancel-confirmed.component';
import { OopsComponent } from './oops/oops.component';
import { ReschedulingComponent } from './rescheduling/rescheduling.component';

const routes: Routes = [
  { path: 'create', component: CreateMeetingComponentComponent },
  { path: 'makeMeeting', component: MakeMeetingComponent },
  {path : 'thankyou', component : ThankyouPageComponent},
  {path : 'cancelMeet', component : CancellationPageComponent},
  {path : 'cancelConfirmed', component : CancelConfirmedComponent},
  {path : 'oops', component : OopsComponent},
  {path: 'rescheduling', component : ReschedulingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
