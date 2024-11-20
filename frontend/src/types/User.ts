export interface Attendee {
  _id: string; // Ensure this field is defined
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePic?: string; // Optional field
  registeredAt: string; // Ensure this field is defined
  checkedIn: boolean; // Ensure this field is defined
}
