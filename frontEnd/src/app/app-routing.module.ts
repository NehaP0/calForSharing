import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMeetingComponentComponent } from './create-meeting-component/create-meeting-component.component';
import { MakeMeetingComponent } from './make-meeting/make-meeting.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';


const routes: Routes = [
  { path: 'create', component: CreateMeetingComponentComponent },
  { path: 'makeMeeting', component: MakeMeetingComponent },
  {path : 'thankyou', component : ThankyouPageComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
