import React, { useState } from 'react';
import { Card, Text, ActionIcon, Modal, rem } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';

interface EventDateCardProps {
  date: string; // Pass the date as a string
  onDateChange: (newDate: string) => void; // Callback for date change
}

export function EventDateCard({ date, onDateChange }: EventDateCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(date));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      onDateChange(newDate.toISOString());
      setIsModalOpen(false); // Close the modal after selecting a date
    }
  };

  return (
    <Card shadow="sm" padding="lg" style={{ marginTop: '20px', position: 'relative' }}>
      <Text fw={500} size="lg" mb="md">
        Event Date
      </Text>
      <Text size="sm" mb="md">
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </Text>
      <ActionIcon
        style={{ position: 'absolute', top: rem(10), right: rem(10) }}
        onClick={() => setIsModalOpen(true)}
      >
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      </ActionIcon>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Event Date"
        // overlayColor="var(--mantine-color-dark-9)"
        // overlayOpacity={0.55}
        // overlayBlur={3}
      >
      </Modal>
    </Card>
  );
}
