"use client"

import * as React from "react"
import Box from "@mui/material/Box"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

// Icons
import MenuIcon from "@mui/icons-material/Menu"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import DangerousIcon from "@mui/icons-material/Dangerous"
import ReceiptIcon from "@mui/icons-material/Receipt"
import DashboardIcon from "@mui/icons-material/Dashboard"
import CategoryIcon from "@mui/icons-material/Category"
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee"

const drawerWidth = 250

export default function ButtonAppBar(params: { name: string }) {
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Transactions", icon: <ReceiptIcon /> },
    { text: "Budgets", icon: <CurrencyRupeeIcon /> },
    { text: "Categories", icon: <CategoryIcon /> },
    { text: "Wallets", icon: <AccountBalanceWalletIcon /> },
  ]

  const DrawerList = (
    <Box
      sx={{
        width: drawerWidth,
        height: "100%",
        bgcolor: "#141414",
        color: "#fff",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Typography
        variant="h6"
        sx={{
          p: 2,
          fontWeight: "bold",
          color: "#E50914",
          textAlign: "center",
        }}
      >
        Finance Tracker
      </Typography>
      <Divider sx={{ bgcolor: "#333" }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              sx={{
                "&:hover": {
                  bgcolor: "#E50914",
                  color: "#fff",
                  transition: "0.3s",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: "#333", mt: "auto" }} />

      {/* <ListItem
        disablePadding
        sx={{
          mt: "auto",
          "&:hover": { bgcolor: "#E50914", transition: "0.3s" },
        }}
      >
        <ListItemButton>
          <ListItemIcon sx={{ color: "#fff" }}>
            <DangerousIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem> */}
    </Box>
  )

  return (
    <Box sx={{ display: "flex", bgcolor: "#0b0b0b", minHeight: "100vh" }}>
      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#141414",
            color: "#fff",
          },
        }}
      >
        {DrawerList}
      </Drawer>

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : "100%",
          ml: open ? `${drawerWidth}px` : 0,
          bgcolor: "#141414",
          transition: "width 0.3s, margin 0.3s",
          boxShadow: "0px 2px 10px rgba(229, 9, 20, 0.4)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
            Welcome, {params.name}
          </Typography>

          <Button
            color="inherit"
            sx={{
              bgcolor: "#E50914",
              "&:hover": { bgcolor: "#b20710" },
              px: 3,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: open ? `${drawerWidth}px` : 0,
          mt: 8,
          transition: "margin 0.3s",
          color: "#fff",
        }}
      >
        {/* <Typography variant="h4" sx={{ mb: 2, color: "#E50914" }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: "#ccc" }}>
          Welcome to your Netflix-style finance tracker dashboard.  
          Use the sidebar to navigate between Transactions, Budgets, and more.
        </Typography> */}
      </Box>
    </Box>
  )
}
