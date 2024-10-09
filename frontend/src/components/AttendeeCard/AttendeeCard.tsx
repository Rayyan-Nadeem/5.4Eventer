import { Avatar, Text, Button, Paper, ActionIcon, rem } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';

interface AttendeeCardProps {
  avatar: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  address: string;
  allergyInfo: string;
  foodRestrictions: string;
  daysAttending: number[];
  registeredAt: string;
  onEdit: () => void;
}

export function AttendeeCard({
  avatar,
  name,
  email,
  role,
  phone,
  address,
  allergyInfo,
  foodRestrictions,
  daysAttending,
  registeredAt,
  onEdit,
}: AttendeeCardProps) {
  return (
    <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)" style={{ position: 'relative' }}>
      <ActionIcon
        style={{ position: 'absolute', top: rem(10), right: rem(10) }}
        onClick={onEdit}
      >
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      </ActionIcon>
      <Avatar src={avatar} size={120} radius={120} mx="auto" />
      <Text ta="center" fz="lg" fw={500} mt="md">
        {name}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        {email} • {role}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        {phone}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        {address}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        Allergy Info: {allergyInfo}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        Food Restrictions: {foodRestrictions}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        Days Attending: {daysAttending.join(', ')}
      </Text>
      <Text ta="center" c="dimmed" fz="sm">
        Registered At: {new Date(registeredAt).toLocaleString()}
      </Text>
      <Button variant="default" fullWidth mt="md">
        Check-In
      </Button>
    </Paper>
  );
}
