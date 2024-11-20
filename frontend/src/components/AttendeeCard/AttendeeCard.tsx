import { Avatar, Text, Button, Paper, ActionIcon, rem, useMantineTheme, useMantineColorScheme, Badge } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';

interface AttendeeCardProps {
  avatar: string;
  name: string;
  email: string;
  phone: string;
  ticketType?: string;
  checkedIn: boolean;
  registeredAt: string;
  consent?: boolean;
  sex?: string;
  dob?: string;
  profilePic?: string;
  onCheckIn: () => void;
  onEdit: () => void;
}

export function AttendeeCard({
  avatar,
  name,
  email,
  phone,
  registeredAt,
  checkedIn,
  ticketType,
  consent,
  sex,
  dob,
  profilePic,
  onCheckIn,
  onEdit,
}: AttendeeCardProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const textColorPrimary = colorScheme === 'dark' ? theme.colors.blue[7] : theme.colors.blue[9];
  const textColorSecondary = colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[8];

  const getGradient = (ticketType: string) => {
    return ticketType === 'Gold'
      ? { from: '#FFD700', to: '#FFA500', deg: 90 }  // Gold to Orange gradient
      : ticketType === 'Platinum'
      ? { from: 'blue', to: 'cyan', deg: 90 } // Blue to Cyan gradient
      : ticketType === 'Silver'
      ? { from: '#A9A9A9', to: '#696969', deg: 90 }  // Silver to Dark Silver gradient
      : ticketType === 'Bronze'
      ? { from: '#CD7F32', to: '#8C7853', deg: 90 }  // Bronze to Dark Bronze gradient
      : { from: '#000000', to: '#000000', deg: 90 }; // Solid Black for General
    };

  const getTicketTypeText = (ticketType: string) => {
    return ticketType === 'Gold'
      ? 'Gold Sponsorship'
      : ticketType === 'Platinum'
      ? 'Platinum Sponsorship'
      : ticketType === 'Silver'
      ? 'Silver Sponsorship'
      : ticketType === 'Bronze'
      ? 'Bronze Sponsorship'
      : 'General Admission';
  };

  return (
    <Paper radius="md" withBorder p="lg" style={{ position: 'relative' }}>
      <ActionIcon
        style={{ position: 'absolute', top: rem(10), right: rem(10) }}
        onClick={onEdit}
      >
        <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      </ActionIcon>
      <Avatar src={avatar || 'default-avatar-url'} size={120} radius={120} mx="auto" />
      <Text ta="center" style={{ color: textColorPrimary }} fz="h2" fw={500} mt="md">
        {name || 'N/A'}
      </Text>
      <Text ta="center" fz="h5" fw={500}>
        {email || 'N/A'} • {phone || 'N/A'}
      </Text>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Badge
          size="lg"
          my="xs"
          variant="gradient"
          gradient={getGradient(ticketType || '')}
        >
          <strong>Ticket Type: </strong>{getTicketTypeText(ticketType || 'N/A')}
        </Badge>
      </div>
      <Text ta="center" fz="sm">
        <strong>Registered At:</strong> {registeredAt ? new Date(registeredAt).toLocaleString() : 'N/A'}
      </Text>
      <Text ta="center" fz="sm">
        <strong>Sex:</strong> {sex || 'N/A'}
      </Text>
      <Text ta="center" fz="sm">
        <strong>Date of Birth:</strong> {dob || 'N/A'}
      </Text>
      {consent !== undefined && (
        <Text ta="center" fz="sm">
          <strong>Consent to Photography:</strong> {consent ? 'Yes' : 'No'}
        </Text>
      )}
      <Text ta="center" fz="sm" style={{ color: checkedIn ? 'var(--mantine-color-blue-7)' : '#cc0000' }}>
        <strong>Checked In:</strong> {checkedIn ? 'Yes' : 'No'}
      </Text>
      <Button mt="md" fullWidth onClick={onCheckIn}>
        {checkedIn ? 'Mark as Checked Out' : 'Mark as Checked In'}
      </Button>
    </Paper>
  );
}
