import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../models/Contact';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: Contact;

  private newContact: boolean = false;

  constructor() {  }

  ngOnInit(): void {
    this.newContact = this.contact != undefined
  }

}
