import { Contact } from "./Contact";
import { ContactId } from "./valueobject/ContactId";
import { UserId } from "./valueobject/UserId";

export interface ContactRepository {
  delete(contactId: ContactId, userId: UserId): Promise<void>;
  getContactsBy(userId: UserId): Promise<Contact[]>;
  save(contact: Contact): Promise<void>
  exists(contactId: ContactId, userId: UserId): Promise<boolean>
}
