import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, ActionIcon, UnstyledButton, Center, rem } from '@mantine/core';
import { IconPencil, IconTrash, IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';
import { EditUserModal } from '../EditUserModal/EditUserModal';

interface User {
  username: string;
  password: string;
  role: string;
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

const roleColors: Record<string, string> = {
  admin: 'red',
  'Event Coordinator': 'blue',
  Faculty: 'green'
};

function sortData(data: User[], payload: { sortBy: keyof User | null; reversed: boolean }) {
  const { sortBy } = payload;

  if (!sortBy) {
    return data;
  }

  return [...data].sort((a, b) => {
    return payload.reversed
      ? b[sortBy].localeCompare(a[sortBy])
      : a[sortBy].localeCompare(b[sortBy]);
  });
}

export function AdminTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/test-admin.json')
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
    setUsers(users.map((user) => (user.username === updatedUser.username ? updatedUser : user)));
    setSortedUsers(sortedUsers.map((user) => (user.username === updatedUser.username ? updatedUser : user)));
    setIsModalOpen(false);
  };

  const rows = sortedUsers.map((user) => (
    <Table.Tr key={user.username}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={user.profilePic} radius={30} />
          <Text fz="sm" fw={500}>
            {user.username}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={roleColors[user.role]} variant="light">
          {user.role}
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
              <Th sorted={sortBy === 'username'} reversed={reverseSortDirection} onSort={() => setSorting('username')}>
                Username
              </Th>
              <Th sorted={sortBy === 'role'} reversed={reverseSortDirection} onSort={() => setSorting('role')}>
                Role
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