import React, { useState, useEffect, useCallback } from 'react';
import { Nav } from '../components/Nav/Nav';
import { AttendeeTable } from '../components/AttendeeTable/AttendeeTable';
import { AddAttendeeModal } from '../components/AddAttendeeModal/AddAttendeeModal';
import { Button, Group } from '@mantine/core';
import axios from 'axios';
import '../App.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export function ManageAttendees() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [totalAttendees, setTotalAttendees] = useState(0);

  const handleAddButtonClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = useCallback(() => {
    setIsAddModalOpen(false);
    setRefreshData((prev) => !prev); // Toggle refreshData to trigger table data update
  }, []);

  useEffect(() => {
    axios.get(`${backendUrl}/api/attendees`)
    .then((response) => {
        const attendees = response.data;
        setTotalAttendees(attendees.length);
      })
      .catch((error) => console.error('Error fetching attendees:', error));
  }, [refreshData]);

  return (
    <div className="app-container">
      <Nav />
      <div className="content-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Manage Attendees</h1>
            <h2>Total Attendees: {totalAttendees}</h2>
          </div>
          <Button onClick={handleAddButtonClick}>Add Attendee</Button>
        </div>
        <AttendeeTable refreshData={refreshData} />
      </div>
      <AddAttendeeModal isOpen={isAddModalOpen} onClose={handleAddModalClose} />
    </div>
  );
}