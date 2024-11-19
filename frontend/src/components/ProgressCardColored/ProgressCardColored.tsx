import React, { useEffect, useState } from 'react';
import { Text, Progress, Card } from '@mantine/core';
import axios from 'axios';
import classes from './ProgressCardColored.module.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


// Define the Attendee type
interface Attendee {
  checkedIn: boolean;
}

export function ProgressCardColored() {
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [totalAttendees, setTotalAttendees] = useState(0);

  useEffect(() => {
    axios.get<Attendee[]>(`${backendUrl}/api/attendees`)
      .then((response) => {
        const attendees = response.data;
        const checkedIn = attendees.filter((attendee) => attendee.checkedIn).length;
        setCheckedInCount(checkedIn);
        setTotalAttendees(attendees.length);
      })
      .catch((error) => console.error('Error fetching attendees:', error));
  }, []);

  const progressValue = totalAttendees > 0 ? (checkedInCount / totalAttendees) * 100 : 0;

  return (
    <Card withBorder radius="md" p="xl" className={classes.card}>
      <Text fz="xs" tt="uppercase" fw={700} className={classes.title}>
        Check-Ins
      </Text>
      <Text fz="lg" fw={500} className={classes.stats}>
        {checkedInCount} / {totalAttendees} Attendees Checked In
      </Text>
      <Progress
        value={progressValue}
        mt="md"
        size="lg"
        radius="xl"
        classNames={{
          root: classes.progressTrack,
          section: classes.progressSection,
        }}
      />
    </Card>
  );
}
