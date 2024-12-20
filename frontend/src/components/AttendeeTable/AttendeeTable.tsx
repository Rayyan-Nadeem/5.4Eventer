import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Table,
  Group,
  Text,
  ActionIcon,
  Anchor,
  UnstyledButton,
  Center,
  rem,
  Modal,
  Button,
  TextInput,
} from '@mantine/core';
import { IconPencil, IconTrash, IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Attendee as User } from '../../types/User';
import { EditUserModal } from '../EditUserModal/EditUserModal';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
        ? new Date(b[sortBy] as string).getTime() - new Date(a[sortBy] as string).getTime()
        : new Date(a[sortBy] as string).getTime() - new Date(b[sortBy] as string).getTime();
    } else if (sortBy === 'checkedIn') {
      return payload.reversed
        ? Number(b[sortBy]) - Number(a[sortBy])
        : Number(a[sortBy]) - Number(b[sortBy]);
    } else {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return payload.reversed
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      } else {
        return 0;
      }
    }
  });
}

export function AttendeeTable({ refreshData }: { refreshData: boolean }) {
  const [users, setUsers] = useState<User[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/attendees`)
      .then((response) => {
        setUsers(response.data);
        setSortedUsers(response.data);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, [refreshData]);

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
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    setSortedUsers(sortedUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    setIsModalOpen(false);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      axios
        .delete(`${backendUrl}/api/attendees/${userToDelete}`)
        .then(() => {
          setUsers(users.filter((user) => user._id !== userToDelete));
          setSortedUsers(sortedUsers.filter((user) => user._id !== userToDelete));
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        })
        .catch((error) => console.error('Error deleting user:', error));
    }
  };

  const filteredUsers = sortedUsers.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query)
    );
  });

  const rows = filteredUsers.map((user) => (
    <Table.Tr key={user._id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={user.profilePic} radius={30} />
          <Anchor component={Link} to={`/attendee/${user._id}`}>
            <Text fz="sm" fw={500}>
              {user.firstName} {user.lastName}
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
          <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteClick(user._id)}>
            <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TextInput
        placeholder="Search by name, email, or phone"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.currentTarget.value)}
        mb="md"
      />
      <Table.ScrollContainer minWidth={800}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Th sorted={sortBy === 'firstName'} reversed={reverseSortDirection} onSort={() => setSorting('firstName')}>
                Name
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
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <Text>Are you sure you want to delete this attendee?</Text>
        <Group ta="right" mt="md" align="center" justify="flex-end">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
