import React, { useState } from 'react';
import { Modal, Button, TextInput, Group, Checkbox, Select } from '@mantine/core';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AddAttendeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAttendeeModal({ isOpen, onClose }: AddAttendeeModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkedIn: false,
    ticketType: '',
    profilePic: '',
    sex: '',
    dob: '',
    consent: false,
  });
  const [emailError, setEmailError] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    if (field === 'email') {
      validateEmail(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (validateForm()) {
      fetch(`${backendUrl}/api/attendees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Attendee added:', data);
          onClose();
        })
        .catch((error) => {
          console.error('Error adding attendee:', error);
        });
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Add Attendee">
      <Group grow>
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChange={(event) => handleChange('firstName', event.currentTarget.value)}
          required
          error={errors.firstName}
        />
        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChange={(event) => handleChange('lastName', event.currentTarget.value)}
          required
          error={errors.lastName}
        />
      </Group>
      <TextInput
        label="Email"
        type="email"
        value={formData.email}
        onChange={(event) => handleChange('email', event.currentTarget.value)}
        required
        mt="md"
        error={emailError || errors.email}
      />
      <TextInput
        label="Phone"
        value={formData.phone}
        onChange={(event) => handleChange('phone', event.currentTarget.value)}
        required
        mt="md"
        error={errors.phone}
      />
      <Select
        label="Ticket Type"
        data={['Platinum', 'Gold', 'Silver', 'Bronze', 'General']}
        value={formData.ticketType}
        onChange={(value) => handleChange('ticketType', value)}
        error={errors.ticketType}
        mt="md"
      />
      <TextInput
        label="Profile Picture URL"
        value={formData.profilePic}
        onChange={(event) => handleChange('profilePic', event.currentTarget.value)}
        mt="md"
      />
      <Select
        label="Sex"
        data={['Male', 'Female', 'Other']}
        value={formData.sex}
        onChange={(value) => handleChange('sex', value)}
        mt="md"
      />
      <TextInput
        label="Date of Birth"
        value={formData.dob}
        onChange={(event) => handleChange('dob', event.currentTarget.value)}
        mt="md"
      />
      <Checkbox
        label="Consent to Photography"
        checked={formData.consent}
        onChange={(event) => handleChange('consent', event.currentTarget.checked)}
        mt="md"
      />
      <Group justify="flex-end" mt="md">
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!!emailError || Object.keys(errors).length > 0}>
          Save
        </Button>
      </Group>
    </Modal>
  );
}
