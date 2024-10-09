import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Table, Group, Text, ActionIcon, Anchor, Button, rem } from '@mantine/core';
import { IconPencil, IconTrash, IconArrowUp, IconArrowDown } from '@tabler/icons-react';

const jobColors: Record<string, string> = {
  vegetarian: 'blue',
  vegan: 'green',
  none: 'gray',
};

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
  checkedIn: { [key: number]: boolean };
  registeredAt: string;
  profilePic: string;
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; ascending: boolean } | null>(null);

  useEffect(() => {
    fetch('/test-users.json')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  const handleSort = (key: string) => {
    let ascending = true;
    if (sortConfig && sortConfig.key === key && sortConfig.ascending) {
      ascending = false;
    }

    const sorted = [...filteredUsers].sort((a, b) => {
      if (key === 'registeredAt') {
        return ascending
          ? new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
          : new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
      } else {
        return ascending
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });

    setFilteredUsers(sorted);
    setSortConfig({ key, ascending });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.ascending ? <IconArrowUp size={14} /> : <IconArrowDown size={14} />;
  };

  const rows = filteredUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar size={30} src={user.profilePic} radius={30} />
          <Text fz="sm" fw={500}>
            {user.firstName} {user.middleName} {user.lastName}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge color={jobColors[user.foodRestrictions.toLowerCase()]} variant="light">
          {user.foodRestrictions}
        </Badge>
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
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
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
    <Table.ScrollContainer minWidth={800}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              <Button variant="subtle" compact onClick={() => handleSort('name')} style={{ display: 'flex', alignItems: 'center' }}>
                Employee {getSortIcon('name')}
              </Button>
            </Table.Th>
            <Table.Th>
              <Button variant="subtle" compact onClick={() => handleSort('foodRestrictions')} style={{ display: 'flex', alignItems: 'center' }}>
                Food Restrictions {getSortIcon('foodRestrictions')}
              </Button>
            </Table.Th>
            <Table.Th>
              <Button variant="subtle" compact onClick={() => handleSort('email')} style={{ display: 'flex', alignItems: 'center' }}>
                Email {getSortIcon('email')}
              </Button>
            </Table.Th>
            <Table.Th>
              <Button variant="subtle" compact onClick={() => handleSort('phone')} style={{ display: 'flex', alignItems: 'center' }}>
                Phone {getSortIcon('phone')}
              </Button>
            </Table.Th>
            <Table.Th>
              <Button variant="subtle" compact onClick={() => handleSort('registeredAt')} style={{ display: 'flex', alignItems: 'center' }}>
                Registered At {getSortIcon('registeredAt')}
              </Button>
            </Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
