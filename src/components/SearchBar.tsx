import React, { useState, useCallback } from 'react';
import { TextField, Button, Box, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Search as SearchIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import debounce from 'lodash/debounce';

interface SearchBarProps {
    onSearch: (search: string) => void;
    placeholder?: string;
    initialValue?: string;
    isLoading?: boolean;
    autoSearch?: boolean;
    debounceMs?: number;
};

const SearchContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    width: '100%',
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        gap: theme.spacing(1),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    flex: 1,
    '& .MuiOutlinedInput-root': {
        borderRadius: theme.shape.borderRadius * 2,
        transition: 'all 0.3s ease',
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
        '&.Mui-focused': {
            backgroundColor: '#f5f5f5',
            '& fieldset': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
        },
    },
}));

const SearchButton = styled(Button)(({ theme }) => ({
    height: '56px',
    minWidth: '120px',
    borderRadius: theme.shape.borderRadius * 2,
    background: 'linear-gradient(135deg, #34e89e, #0f3443)',
    '&: hover': {
        background: 'linear-gradient(135deg, #0f3443, #34e89e)',
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
    },
}));

const SearchBar: React.FC<SearchBarProps> = ({ 
    onSearch,
    placeholder = 'Search venues...',
    initialValue = '',
    isLoading = false,
    autoSearch = true,
    debounceMs = 300,
 }) => {
    const [query, setQuery] = useState<string>(initialValue);

    // Debounced search function for auto-search
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            onSearch(searchQuery);
        }, debounceMs),
        [onSearch, debounceMs]
    );

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value;
        setQuery(newQuery);

        if (autoSearch) {
            debouncedSearch(newQuery);
        }
    };

    const handleSearch = () => {
        if (!autoSearch) {
            onSearch(query);
        }
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !autoSearch) {
            handleSearch();
        }
    };

    return (
        <SearchContainer>
            <StyledTextField
                fullWidth
                placeholder={placeholder}
                value={query}
                onChange={handleQueryChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            {isLoading ? (
                                <CircularProgress size={20} />
                            ) : query ? (
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    aria-label="clear search"
                                >
                                    <ClearIcon />
                                </IconButton>
                            ) : null}
                        </InputAdornment>
                    ),
                }}
            />

            {!autoSearch && (
                <SearchButton
                    variant="contained"
                    onClick={handleSearch}
                    disabled={isLoading}
                    startIcon={!isLoading && <SearchIcon />}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </SearchButton>
            )}
        </SearchContainer>
    );
};

export default SearchBar;