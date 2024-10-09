import React, { useState, useEffect } from 'react';
import { Button, Modal, Checkbox, Group, Text, Progress, Card, TextInput, Textarea } from '@mantine/core';
import { Calendar } from '@mantine/dates';

interface Address {
  venue: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface EventDetails {
  name: string;
  description: string;
  date: string;
  address: Address;
}

const initialEventDetails: EventDetails = {
  name: '',
  description: '',
  date: '',
  address: {
    venue: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  }
};

export function EventSettings() {
  <p> test</p>
}