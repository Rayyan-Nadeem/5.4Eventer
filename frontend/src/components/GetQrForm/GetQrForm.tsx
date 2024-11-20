import { useState, useEffect } from 'react';
import { TextInput, Text, Group, Title, Button, Alert, Loader } from '@mantine/core';
import { useForm, type UseFormReturnType } from '@mantine/form';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface FormValues {
  name: string;
  email: string;
}

export function GetQRForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
    },
    validate: {
      name: (value) => value.trim().length < 2 ? 'Name must be at least 2 characters long' : null,
      email: (value) => !/^\S+@\S+$/.test(value) ? 'Invalid email address' : null,
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setErrorMessage(''); // Reset error message
      setSuccessMessage(''); // Reset success message
      setLoading(true); // Start loading

      const response = await fetch(`${backendUrl}/api/attendees/get-qrcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setErrorMessage('Attendee not found with the provided email');
        } else {
          setErrorMessage('Failed to retrieve QR code');
        }
        setLoading(false); // Stop loading on error
        return;
      }

      const data = await response.json();
      setSuccessMessage(data.message);

      // Clear the form after successful submission
      form.reset();
      setLoading(false); // Stop loading on success
    } catch (error) {
      console.error('Error retrieving QR code:', error);
      setErrorMessage('Failed to retrieve QR code');
      setLoading(false); // Stop loading on error
    }
  };

  // Effect to hide the error/success message after 6 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
        setSuccessMessage('');
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Title
        order={2}
        size="h1"
        style={{ fontFamily: 'Greycliff CF, var(--mantine-font-family)' }}
        fw={900}
        ta="center"
      >
       Beast-Con Convention QR Retrieval Request Form
      </Title>
      <Text my= "lg" size="sm">
        <strong>For QR Code Retrieval:</strong> Enter your exact registration information to retrieve your QR code. An email will be sent to you with your QR code embedded in the email. If you have not received your retrieval email, please check your spam folder.
      </Text>
      <TextInput
        label="Name"
        placeholder="Your name"
        name="name"
        variant="filled"
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Email"
        placeholder="Your email"
        mt="md"
        name="email"
        variant="filled"
        {...form.getInputProps('email')}
      />
      {errorMessage && (
        <Alert 
          mt="md" 
          fw={600}
          style={{ 
            backgroundColor: "light-dark(var(--mantine-color-red-3), var(--mantine-color-red-9))",
            color: "white",
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {successMessage && (
        <Alert
          mt="md"
          fw={600}
          style={{
            backgroundColor: "light-dark(var(--mantine-color-green-3), var(--mantine-color-green-9))",
            color: "white",
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Group justify="center" mt="xl">
        <Button type="submit" size="md"disabled={loading}>
          {loading ? <Loader size="sm" color="var(--mantine-color-blue-9)"  /> : 'Submit'}
        </Button>
      </Group>
    </form>
  );
}
