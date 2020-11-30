import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactsService, SignedUrl } from '../contacts.service';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  @Input() contactId: string;

  constructor(
    readonly contactsService: ContactsService,
    readonly uploadService: UploadService,
    private router: Router) { }

  ngOnInit(): void {
  }

  async onPicked(input: HTMLInputElement) {
    const file = input.files[0];
    if (file) {
      try {
        const signedUrl = await this.contactsService.getSignedUrl(this.contactId);
        const result = await this.uploadService.upload(file, signedUrl.uploadUrl);
        console.info(result);
        alert('Contact`s photo uploaded');
        this.router.navigate(['/dashboard']);
      } catch (error) {
        const message = error?.error || 'Something failed in the backend!! :('
        alert(`${message} - Status: ${error.status}`);
      }
    }
  }
}
