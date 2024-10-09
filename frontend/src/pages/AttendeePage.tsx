import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Nav } from '../components/Nav/Nav';
import { AttendeeCard } from '../components/AttendeeCard/AttendeeCard';
import { EditUserModal } from '../components/EditUserModal/EditUserModal';
import { Text } from '@mantine/core';

interface Attendee {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  allergyInfo: string;
  foodRestrictions: string;
  daysAttending: number[];
  checkedIn: { [key: number]: boolean };
  registeredAt: string;
  profilePic: string;
}

export function AttendeePage() {
  const { id } = useParams<{ id: string }>();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/test-users.json')
      .then((response) => response.json())
      .then((data) => {
        const foundAttendee = data.find((attendee: Attendee) => attendee.id === id);
        setAttendee(foundAttendee);
      })
      .catch((error) => console.error('Error fetching attendee data:', error));
  }, [id]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedUser: Attendee) => {
    setAttendee(updatedUser);
    setIsModalOpen(false);
  };

  if (!attendee) {
    return <Text>Loading...</Text>;
  }

  const fullName = `${attendee.firstName} ${attendee.middleName || ''} ${attendee.lastName}`.trim();

  return (
    <div className="app-container">
      <Nav />
      <div className="content-container">
        <AttendeeCard
          avatar={attendee.profilePic}
          name={fullName}
          email={attendee.email}
          role="Convention Attendee"
          phone={attendee.phone}
          address={attendee.address}
          allergyInfo={attendee.allergyInfo}
          foodRestrictions={attendee.foodRestrictions}
          daysAttending={attendee.daysAttending}
          registeredAt={attendee.registeredAt}
          onEdit={handleEditClick}
        />
        <EditUserModal
          user={attendee}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      </div>
    </div>
  );
}
