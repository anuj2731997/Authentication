'use client'
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

export default function ButtonAppBar(params:{name:string}) {
  const router = useRouter();
  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#141414', boxShadow: '0px 2px 10px rgba(229, 9, 20, 0.4)' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff', fontWeight: 'bold' }}>
            {params.name ? `Welcome ${params.name}` : 'Welcome there'}
          </Typography>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
            Finance Tracker
          </Typography>

          <Button 
            onClick={handleLogin} 
            sx={{ bgcolor: '#E50914', '&:hover': { bgcolor: '#b20710' }, color: '#fff', textTransform: 'none', px: 3, borderRadius: '8px', fontWeight: 600 }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
