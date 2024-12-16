import React from 'react';
import { Box, Typography } from '@mui/material';

function MessageLeft({ message }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 2 }}>
            <Box sx={{ backgroundColor: '#f1f1f1', padding: 2, borderRadius: '10px', maxWidth: '70%' }}>
                <Typography>{message}</Typography>
            </Box>
        </Box>
    );
}

export default MessageLeft;
