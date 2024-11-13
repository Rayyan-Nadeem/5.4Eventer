export interface Attendee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketType: string;  // Ticket Type
  company?: string;
  category?: string;
  letipChapter?: string;  // LeTip Chapter
  foodRestrictions?: string;  // Matches the Food Allergies/Restrictions field
  historicalFigureLunch?: string;  // If you could have lunch with any historical figure
  consent?: boolean;  // Consent to be photographed and filmed
  registerer?: string;  // Name of the person who registered the attendee
  profilePic?: string; 
  checkedIn: boolean;
  registeredAt: string;
}
