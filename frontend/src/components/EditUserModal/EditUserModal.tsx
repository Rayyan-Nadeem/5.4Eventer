import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Group, Checkbox, MultiSelect } from '@mantine/core';

interface User {
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
  checkedIn: boolean;
  registeredAt: string;
  profilePic: string;
}

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export function EditUserModal({ user, isOpen, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<User | null>(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  if (!formData) return null;

  const handleChange = (field: keyof User, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit User">
      <Group grow>
        <TextInput
          label="First Name"
          value={formData.firstName}
          onChange={(event) => handleChange('firstName', event.currentTarget.value)}
          required
        />
        <TextInput
          label="Middle Name"
          value={formData.middleName || ''}
          onChange={(event) => handleChange('middleName', event.currentTarget.value)}
        />
        <TextInput
          label="Last Name"
          value={formData.lastName}
          onChange={(event) => handleChange('lastName', event.currentTarget.value)}
          required
        />
      </Group>
      <TextInput
        label="Email"
        value={formData.email}
        onChange={(event) => handleChange('email', event.currentTarget.value)}
        required
        mt="md"
      />
      <TextInput
        label="Phone"
        value={formData.phone}
        onChange={(event) => handleChange('phone', event.currentTarget.value)}
        required
        mt="md"
      />
      <TextInput
        label="Address"
        value={formData.address}
        onChange={(event) => handleChange('address', event.currentTarget.value)}
        mt="md"
      />
      <Group grow>
        <TextInput
            label="Allergy Info"
            value={formData.allergyInfo}
            onChange={(event) => handleChange('allergyInfo', event.currentTarget.value)}
            mt="md"
        />
        <TextInput
            label="Food Restrictions"
            value={formData.foodRestrictions}
            onChange={(event) => handleChange('foodRestrictions', event.currentTarget.value)}
            mt="md"
        />
    </Group>
      <MultiSelect
        label="Days Attending"
        data={['1', '2', '3']}
        value={formData.daysAttending.map(String)}
        onChange={(value) => handleChange('daysAttending', value.map(Number))}
        mt="md"
      />
      <Checkbox
        label="Checked In"
        checked={formData.checkedIn}
        onChange={(event) => handleChange('checkedIn', event.currentTarget.checked)}
        mt="md"
      />
      <Group position="right" mt="md">
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </Group>
    </Modal>
  );
}
