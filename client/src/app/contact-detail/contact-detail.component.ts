import { Component, Input, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { Contact } from '../models/Contact.models';


@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: Contact;

  newContact: boolean = true;

  phonePattern: string = '^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$'

  constructor(
    private readonly contactsService: ContactsService,
    private router: Router) {  }

  ngOnInit(): void {
    this.newContact = this.contact == undefined;
    if (this.newContact) {
      this.contact = {
        contactId: uuidv4(),
        name: undefined,
        phone: undefined
      }
    }
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.contact) {
        await this.contactsService.saveContact(this.contact, this.newContact);
        alert('Contact saved');
        if (this.newContact) {
          this.router.navigate(['/dashboard'])
        }
      }
    } catch (error) {
      const message = error?.error || 'Something failed in the backend!! :('
      alert(`${message} - Status: ${error.status}`);
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard'])
  }
}
