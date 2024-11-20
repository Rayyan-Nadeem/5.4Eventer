import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Group, Burger, Box, NavLink, Menu } from '@mantine/core';
import {
  IconHome,
  IconUsers,
  IconLogout,
  IconCalendarEvent,
  IconPasswordUser,
} from '@tabler/icons-react';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import classes from './Navbar.module.css';
import eventerLogo from '../Logo/eventerLogo.png';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/manage-attendees', label: 'Manage Attendees', icon: IconUsers },
  { link: '/event-settings', label: 'Event Settings', icon: IconCalendarEvent },
];

export function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname);
  const [opened, { toggle, close }] = useDisclosure(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)'); // Adjust the breakpoint as needed

  useEffect(() => {
    if (!isSmallScreen) {
      close(); // Close the menu when the screen size changes to larger screens
    }
  }, [isSmallScreen, close]);

  const links = data.map((item) => (
    <NavLink
      label={item.label}
      component={Link}
      className={classes.link}
      to={item.link}
      key={item.label}
      active={item.link === active}
      leftSection={<item.icon />}
    />
  ));

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <>
      {/* Sidebar for larger screens */}
      <Box visibleFrom="sm" className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            <img src={eventerLogo} alt="Beast Logo" style={{ width: 240, height: 40 }} />
          </Group>
          {links}
        </div>
        <div className={classes.footer}>
          <Link
            to="#"
            className={classes.link}
            onClick={(event) => {
              event.preventDefault();
              handleLogout();
            }}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </Link>
        </div>
      </Box>

      {/* Menu for smaller screens */}
      <Box hiddenFrom="sm">
        <Group justify="space-between" className={classes.header}>
          <img src={eventerLogo} alt="Beast Logo" style={{ width: 200, height: 50 }} />
          <Menu shadow="md" width={200} opened={opened} onClose={close}>
            <Menu.Target>
              <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Navigation</Menu.Label>
              {data.map((item) => (
                <Menu.Item
                  key={item.label}
                  leftSection={<item.icon />}
                  component={Link}
                  to={item.link}
                >
                  {item.label}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                color="red"
                leftSection={<IconLogout />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>
    </>
  );
}
