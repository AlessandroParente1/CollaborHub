import React from 'react';
import { Box, Typography } from '@mui/material';

function MessageRight({ message }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
            <Box sx={{ backgroundColor: '#a5d6a7', padding: 2, borderRadius: '10px', maxWidth: '70%' }}>
                <Typography>{message}</Typography>
            </Box>
        </Box>
    );
}

export default MessageRight;
