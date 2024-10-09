import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Group, Code } from '@mantine/core';
import {
  IconHome,
  IconUsers,
  IconLogout,
  IconCalendarEvent,
  IconPasswordUser,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Navbar.module.css';

const data = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/manage-attendees', label: 'Manage Attendees', icon: IconUsers },
  { link: '/event-settings', label: 'Event Settings', icon: IconCalendarEvent },
  { link: '/manage-admin', label: 'Manage Admin', icon: IconPasswordUser },

];

export function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname);

  const links = data.map((item) => (
    <Link
      className={classes.link}
      to={item.link}
      key={item.label}
      data-active={item.link === active ? 'true' : undefined}
      onClick={() => setActive(item.link)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <MantineLogo size={28} inverted style={{ color: 'white' }} />
          <Code fw={700} className={classes.version}>
            v3.1.2
          </Code>
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
    </nav>
  );
}
