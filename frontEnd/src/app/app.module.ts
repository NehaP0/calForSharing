import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
// import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin

import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxSearchFilterModule } from 'ngx-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateMeetingComponentComponent } from './create-meeting-component/create-meeting-component.component';
import {RecurrenceEditorModule, ScheduleModule, DayService, WeekService, WorkWeekService, MonthService, MonthAgendaService} from '@syncfusion/ej2-angular-schedule'

import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';


import { NgIconsModule } from '@ng-icons/core';
import { heroUsers, heroVideoCamera, heroGlobeAsiaAustralia } from '@ng-icons/heroicons/outline';
import {ionSettingsOutline, ionCopyOutline, ionSearchOutline, ionLogInOutline, ionMailOpenOutline} from '@ng-icons/ionicons'
import {bootstrapStars, bootstrapCaretDownFill, bootstrapChevronDown, bootstrapCCircleFill, bootstrapPlusCircleFill, bootstrapClock, bootstrapQuestionCircle, bootstrapArrowLeft, bootstrapPencil, bootstrapPeople, bootstrapCameraVideo} from '@ng-icons/bootstrap-icons'
import {remixUserAddLine, remixCalendar2Line, remixStackshareLine, remixArrowRightSLine, remixDeleteBin6Line} from '@ng-icons/remixicon'
import {typAttachmentOutline, typTick} from '@ng-icons/typicons'
import {circumRoute} from '@ng-icons/circum-icons'
import {octApps, octLocation} from '@ng-icons/octicons'
import {iconoirCrown} from '@ng-icons/iconoir';
import {tablerEdit} from '@ng-icons/tabler-icons'
import {radixCross2} from '@ng-icons/radix-icons'
import { DatePipe } from '@angular/common';
import { MakeMeetingComponent } from './make-meeting/make-meeting.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
import { CancellationPageComponent } from './cancellation-page/cancellation-page.component';
import { CancelConfirmedComponent } from './cancel-confirmed/cancel-confirmed.component';
import { OopsComponent } from './oops/oops.component';


@NgModule({
  declarations: [
    AppComponent,
    CreateMeetingComponentComponent,
    MakeMeetingComponent,
    ThankyouPageComponent,
    CancellationPageComponent,
    CancelConfirmedComponent,
    OopsComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    FullCalendarModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClipboardModule,
    NgxSearchFilterModule,
    RecurrenceEditorModule,
    ScheduleModule,
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    NgIconsModule.withIcons({ heroUsers, ionSettingsOutline, bootstrapStars, remixUserAddLine, ionSearchOutline, bootstrapCaretDownFill, ionCopyOutline, bootstrapChevronDown,
      bootstrapCCircleFill, bootstrapPlusCircleFill, typAttachmentOutline, remixCalendar2Line, remixStackshareLine, circumRoute , bootstrapClock, octApps, iconoirCrown,
      bootstrapQuestionCircle, remixArrowRightSLine, heroVideoCamera, octLocation, heroGlobeAsiaAustralia, bootstrapArrowLeft, typTick, tablerEdit, remixDeleteBin6Line, radixCross2,
      ionLogInOutline, ionMailOpenOutline, bootstrapPencil, bootstrapPeople, bootstrapCameraVideo
   }),
  ],
  
  providers: [
    // provideClientHydration()
    DayService, WeekService, MonthAgendaService, WorkWeekService, MonthService,DatePipe

  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
