import '@flaut-travel/react-md3e/avatar/styles.css';
import '@flaut-travel/react-md3e/button/styles.css';
import '@flaut-travel/react-md3e/icon-button/styles.css';
import '@flaut-travel/react-md3e/list/styles.css';
import '@flaut-travel/react-md3e/search/styles.css';

import { useState } from 'react';
import { Avatar, Button, IconButton, List, ListItem, Search } from '@flaut-travel/react-md3e';
import type { SearchProps } from '@flaut-travel/react-md3e';

const cities = ['Paris', 'Porto', 'Prague', 'Rome', 'Tokyo'];

export function DestinationSearchDemo(props: Partial<SearchProps>) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState('');
  const results = cities.filter((city) => city.toLowerCase().includes(value.toLowerCase()));

  return (
    <>
      <Search
        label="Search destinations"
        {...props}
        value={value}
        open={open}
        onChange={(_event, next) => setValue(next)}
        onOpenChange={(next) => setOpen(next)}
        onSearch={(_event, next) => setSubmitted(next)}
        trailing={
          <IconButton variant="standard" aria-label="Your profile">
            <Avatar size="small" alt="Alex">
              A
            </Avatar>
          </IconButton>
        }
        statusText={`${results.length} destinations`}
      >
        {results.length ? (
          <List aria-label="Destinations">
            {results.map((city) => (
              <ListItem
                key={city}
                primary={
                  <Button
                    variant="text"
                    onClick={() => {
                      setValue(city);
                      setOpen(false);
                    }}
                  >
                    {city}
                  </Button>
                }
                secondary="Destination"
              />
            ))}
          </List>
        ) : (
          <p>No destinations found</p>
        )}
      </Search>
      {submitted && <p>Searching for: {submitted}</p>}
    </>
  );
}
