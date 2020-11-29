import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';
import { Contact } from '../models/Contact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  contacts: Contact[] = [];

  selectContact: Contact | undefined = undefined;

  constructor(private readonly contactsService: ContactsService) { }

  ngOnInit(): void {
    this.loadContacts()
  }

  async loadContacts(): Promise<void> {
    try {
      this.contacts = await this.contactsService.getAllContacts();
    } catch (error) {
      const message = error?.error || 'Something failed in the backend!! :('
      alert(`${message} - Status: ${error.status}`);
    }
  }

  onSelect(contact: Contact): void {
    this.selectContact = contact;
  }

  async onSubmit(): Promise<void> {
    try {
      if (this.selectContact) {
        await this.contactsService.saveContact(this.selectContact);
        alert('Contact saved');
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
