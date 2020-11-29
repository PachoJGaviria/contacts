import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/Contact';
import { ContactsService } from '../contacts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contact: Contact = {
    contactId: 'aec729c4-57c2-4788-809e-d1b36f0173fb',
    name: 'Mochi',
    phone: '3007118899'
  };

  constructor(private readonly contactsService: ContactsService) { }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    try {
      const response = await this.contactsService.saveContact(this.contact);
      console.info(response);
      alert('Contact saved');
    } catch (error) {
      console.error(error);
      const message = error?.error || 'Something failed in the backend!! :('
      alert(`${message} - Status: ${error.status}`);
    }
  }

  back(): void {
    console.log("back...")
  }

}
