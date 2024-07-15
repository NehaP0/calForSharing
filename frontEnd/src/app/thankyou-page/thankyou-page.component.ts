// @ts-nocheck

import { Component } from '@angular/core';

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrl: './thankyou-page.component.css'
})
export class ThankyouPageComponent {
  backGroundcolor:string = localStorage.getItem('backGroundcolor')
  textColor:string = localStorage.getItem("textColor")
  btnAndLinkColor:string = localStorage.getItem("btnAndLinkColor")


}
