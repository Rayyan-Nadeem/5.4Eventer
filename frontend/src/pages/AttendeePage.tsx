// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Nav } from '../components/Nav/Nav';
import { AttendeeCard } from '../components/AttendeeCard/AttendeeCard';
import { EditUserModal } from '../components/EditUserModal/EditUserModal';
import { Text } from '@mantine/core';
import { Attendee } from '../components/types/User';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function AttendeePage() {
  const { id } = useParams<{ id: string }>();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${backendUrl}/api/attendees/${id}`)
      .then((response) => response.json())
      .then((data) => setAttendee(data))
      .catch((error) => console.error('Error fetching attendee data:', error));
  }, [id]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedAttendee: Attendee) => {
    setAttendee(updatedAttendee);
    setIsModalOpen(false);
  };

  const handleCheckIn = () => {
    if (attendee) {
      fetch(`${backendUrl}/api/attendees/${attendee._id}/checkin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((updatedAttendee) => setAttendee(updatedAttendee))
        .catch((error) => console.error('Error updating check-in status:', error));
    }
  };

  if (!attendee) {
    return <Text>Loading...</Text>;
  }

  const fullName = `${attendee.firstName} ${attendee.lastName}`.trim();

  return (
    <div className="app-container">
      <Nav />
      <div className="content-container">
        <AttendeeCard
          avatar={attendee.profilePic || 'default-avatar.png'}
          name={fullName}
          email={attendee.email}
          phone={attendee.phone}
          registeredAt={attendee.registeredAt}
          checkedIn={attendee.checkedIn}
          ticketType={attendee.ticketType}
          consent={attendee.consent}
          onCheckIn={handleCheckIn}
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
