import React from 'react';
import { TextField, Button } from '@mui/material';

type SearchBarProps = {
    onSearch: (search: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = React.useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div>
            <TextField
                label="Search Venues"
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch} variant="contained">Search</Button>
        </div>
    );
};

export default SearchBar;