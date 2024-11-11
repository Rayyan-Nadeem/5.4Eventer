import React, { useState } from 'react';
import { Container, Grid, Button, Text, Card, Center } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconBookDownload } from '@tabler/icons-react';
import { Nav } from '../components/Nav/Nav';
import { ProgressCardColored } from '../components/ProgressCardColored/ProgressCardColored';
import { GenerateReport } from '../components/GenerateReport/GenerateReport';
import { StatsRing } from '../components/StatsRing/StatsRing';
import '../App.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export function EventSettings() {
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportModalOpened, setReportModalOpened] = useState(false);
  const colorScheme = useColorScheme();
  

  const CheckoutAll = async () => {
    setLoadingCheckout(true);
    try {
      const response = await fetch(`${backendUrl}/api/attendees/checkout-all`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to reset checkout status');
      }

      alert('All attendees have been successfully checked out.');
    } catch (error) {
      console.error('Error resetting checkout status:', error);
    } finally {
      setLoadingCheckout(false);
    }
  };

  const handleGenerateReportClick = () => {
    setLoadingReport(true);
    setReportModalOpened(true);
    setLoadingReport(false);
  };

  return (
    <div className="app-container">
      <Nav />
      <div className="content-container">
        <Container my="md">
          <Grid visibleFrom='sm'>
            <Grid.Col span={6}>
            <Card shadow="sm" padding="lg">
              <Text size="xl" ta="center" fw={700}>
                Welcome to the event settings page!
              </Text>
              <Text size="md" mt="md">
                <strong>Event Date</strong>: May 1 – 3, 2025
              </Text>
              <Text size="md" mt="sm">
                <strong>Venue:</strong> Tuscany Suites & Casino
              </Text>
              <Text size="md" mt="sm">
                <strong>Address:</strong> 123 Main St, Raleigh, NC 27601
              </Text>
              <Text size="md" mt="sm">
                <strong>Time:</strong> Full Day Event
              </Text>
              <Text size="md" mt="sm">
                <strong>Registration Deadline:</strong> TBA
              </Text>
            </Card>
            <Button mt="md" size='xl' fullWidth onClick={CheckoutAll} loading={loadingCheckout}>
              <p>CheckOut All</p>
            </Button>
          </Grid.Col>
            <Grid.Col span={6}>
              <ProgressCardColored />
              <Text size="xl" ta="center" fw={700} mt="lg">
                Ticket Stats
              </Text>
              <StatsRing />
              <Button
                mt="md" 
                size='xl' 
                fullWidth 
                loading={loadingReport} 
                onClick={handleGenerateReportClick} 
                h='100px'
                rightSection={<IconBookDownload size={30} stroke={2} />}
              >
                <Text fw='bold' size="xl">Generate Report</Text>
              </Button>
            </Grid.Col>
          </Grid>



          <Grid hiddenFrom='sm'>
            {/* Full width for small screens (span 12), half-width for medium and larger screens (span 6) */}
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <Card shadow="sm" padding="lg">
                <Text size="xl" ta="center" fw={700}>
                  Welcome to the event settings page!
                </Text>
                <Text size="md" mt="md">
                  <strong>Event Date</strong>: May 1 – 3, 2025
                </Text>
                <Text size="md" mt="sm">
                  <strong>Venue:</strong> Tuscany Suites & Casino
                </Text>
                <Text size="md" mt="sm">
                  <strong>Address:</strong> 255 E Flamingo Rd, Las Vegas, NV 89119
                </Text>
                <Text size="md" mt="sm">
                  <strong>Time:</strong> Full Day Event
                </Text>
                <Text size="md" mt="sm">
                  <strong>Registration Deadline:</strong> TBA
                </Text>
              </Card>
                <Button
                  mt="md"
                  size="xl"
                  fullWidth
                  loading={loadingReport}
                  onClick={handleGenerateReportClick}
                  h="100px"
                  rightSection={<IconBookDownload size={30} stroke={2} />}
                >
                  <Text fw="bold" size="xl">
                    Generate Report
                  </Text>
                </Button>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <ProgressCardColored />
              <Text size="xl" ta="center" fw={700} mt="lg">
                Ticket Stats
              </Text>
              <StatsRing />
              <Button mt="md" size="xl" fullWidth onClick={CheckoutAll} loading={loadingCheckout}>
                CheckOut All
              </Button>
            </Grid.Col>
          </Grid>
          <GenerateReport opened={reportModalOpened} onClose={() => setReportModalOpened(false)} />
        </Container>
      </div>
    </div>
  );
}
