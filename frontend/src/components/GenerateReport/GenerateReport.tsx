import { useState } from 'react';
import { Modal, MultiSelect, Button } from '@mantine/core';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface GenerateReportProps {
  opened: boolean;
  onClose: () => void;
}

const attendeeFields = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'ticketType', label: 'Ticket Type' },
  { value: 'checkedIn', label: 'Checked In' },
  { value: 'registeredAt', label: 'Registered At' },
  { value: 'profilePic', label: 'Profile Picture URL' },
  { value: 'sex', label: 'Sex' },
  { value: 'dob', label: 'Date of Birth' },
  { value: 'consent', label: 'Consent to Photography' },
];

export function GenerateReport({ opened, onClose }: GenerateReportProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const handleDownload = () => {
    fetch(`${backendUrl}/api/attendees/generate-csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: selectedFields }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'report.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error generating report:', error));
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Generate Report">
      <MultiSelect
        label="Select attendee data to export"
        placeholder="Select fields to export"
        data={attendeeFields}
        value={selectedFields}
        onChange={setSelectedFields}
      />
      <Button mt="md" fullWidth onClick={handleDownload}>
        Download Report
      </Button>
    </Modal>
  );
}
