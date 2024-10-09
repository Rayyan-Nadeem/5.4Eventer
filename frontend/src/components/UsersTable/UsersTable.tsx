import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, UnstyledButton, Center, rem } from '@mantine/core';
import { IconPencil, IconTrash, IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { EditUserModal } from '../EditUserModal/EditUserModal';

interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  allergyInfo: string;
  foodRestrictions: string;
  daysAttending: number[];
  checkedIn: boolean;
  registeredAt: string;
  profilePic: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function sortData(data: User[], payload: { sortBy: keyof User | null; reversed: boolean }) {
  const { sortBy } = payload;

  if (!sortBy) {
    return data;
  }

  return [...data].sort((a, b) => {
    if (sortBy === 'registeredAt') {
      return payload.reversed
        ? new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime()
        : new Date(a[sortBy]).getTime() - new Date(b[sortBy]).getTime();
    } else if (sortBy === 'checkedIn') {
      return payload.reversed
        ? Number(b[sortBy]) - Number(a[sortBy])
        : Number(a[sortBy]) - Number(b[sortBy]);
    } else {
      return payload.reversed
        ? b[sortBy].localeCompare(a[sortBy])
        : a[sortBy].localeCompare(b[sortBy]);
    }
  });
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/test-users.json')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setSortedUsers(data);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  const setSorting = (field: keyof User) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedUsers(sortData(users, { sortBy: field, reversed }));
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setSortedUsers(sortedUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    setIsModalOpen(false);
  };

  const rows = sortedUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={user.profilePic} radius={30} />
          <Anchor component={Link} to={`/attendee/${user.id}`}>
            <Text fz="sm" fw={500}>
              {user.firstName} {user.middleName} {user.lastName}
            </Text>
          </Anchor>
        </Group>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {user.email}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{user.phone}</Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{new Date(user.registeredAt).toLocaleString()}</Text>
      </Table.Td>
      <Table.Td>
        <Badge color={user.checkedIn ? 'green' : 'red'} variant="light">
          {user.checkedIn ? 'Checked In' : 'Not Checked In'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray" onClick={() => handleEditClick(user)}>
            <IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Th sorted={sortBy === 'firstName'} reversed={reverseSortDirection} onSort={() => setSorting('firstName')}>
                Employee
              </Th>
              <Th sorted={sortBy === 'email'} reversed={reverseSortDirection} onSort={() => setSorting('email')}>
                Email
              </Th>
              <Th sorted={sortBy === 'phone'} reversed={reverseSortDirection} onSort={() => setSorting('phone')}>
                Phone
              </Th>
              <Th sorted={sortBy === 'registeredAt'} reversed={reverseSortDirection} onSort={() => setSorting('registeredAt')}>
                Registered At
              </Th>
              <Th sorted={sortBy === 'checkedIn'} reversed={reverseSortDirection} onSort={() => setSorting('checkedIn')}>
                Checked In
              </Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}
    </>
  );
}
