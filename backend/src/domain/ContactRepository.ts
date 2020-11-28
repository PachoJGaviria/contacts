import { Contact } from "./Contact";
import { ContactId } from "./valueobject/ContactId";
import { UserId } from "./valueobject/UserId";

export interface ContactRepository {
  save(contact: Contact): Promise<void>
  exists(contactId: ContactId, userId: UserId): Promise<boolean>
}
