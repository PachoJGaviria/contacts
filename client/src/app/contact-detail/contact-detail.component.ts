import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '../models/Contact';
import { ContactsService } from '../contacts.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: Contact;

  newContact: boolean = false;

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

  back(): void {
    console.log("back...")
  }

}
