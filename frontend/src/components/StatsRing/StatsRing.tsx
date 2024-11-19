import { useEffect, useState } from 'react';
import { RingProgress, Text, SimpleGrid, Paper, Group } from '@mantine/core';
import axios from 'axios';

interface TicketData {
  label: string;
  stats: string;
  progress: number;
  color: string;
}

export function StatsRing() {
  const [ticketStats, setTicketStats] = useState<TicketData[]>([]);

  useEffect(() => {
    // Fetch ticket type counts from the API
    const fetchTicketStats = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/attendees/get-ticket-types`);
        
        // Updated statsData for new ticket types
        const statsData: TicketData[] = [
          { 
            label: 'Platinum', 
            stats: `${data.platinum || 0} / 6`, 
            progress: ((data.platinum || 0) / 6) * 100, 
            color: 'cyan', 
          },
          { 
            label: 'Gold', 
            stats: `${data.gold || 0} / 25`, 
            progress: ((data.gold || 0) / 25) * 100, 
            color: 'gold', 
          },
          { 
            label: 'Silver', 
            stats: `${data.silver || 0} / 40`, 
            progress: ((data.silver || 0) / 40) * 100, 
            color: 'gray', 
          },
          { 
            label: 'Bronze', 
            stats: `${data.bronze || 0} / 60`, 
            progress: ((data.bronze || 0) / 60) * 100, 
            color: '#cd7f32', 
          },
          { 
            label: 'General', 
            stats: `${data.general || 0} / 100`, 
            progress: ((data.general || 0) / 100) * 100, 
            color: '#696969', 
          },
        ];
             
        setTicketStats(statsData);
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      }
    };

    fetchTicketStats();
  }, []);

  // Rendering each stat ring
  const stats = ticketStats.map((stat) => (
    <Paper withBorder radius="md" p="xs" key={stat.label}>
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: stat.progress, color: stat.color }]}
        />
        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {stat.label}
          </Text>
          <Text fw={700} size="xl">
            {stat.stats}
          </Text>
        </div>
      </Group>
    </Paper>
  ));

  return <SimpleGrid cols={{ base: 1, sm: 3 }}>{stats}</SimpleGrid>;
}
