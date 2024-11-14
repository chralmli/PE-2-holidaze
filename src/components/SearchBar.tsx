import React from 'react';
import { TextField, Button, Box } from '@mui/material';

type SearchBarProps = {
    onSearch: (search: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = React.useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 2
          }}
        >
            <TextField
                label="Search Venues"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
                sx={{ flex: 1 }}
            />
            <Button
                onClick={handleSearch} 
                variant="contained"
                sx={{
                    height: '56px'
                }}
            >
                Search
            </Button>
        </Box>
    );
};

export default SearchBar;