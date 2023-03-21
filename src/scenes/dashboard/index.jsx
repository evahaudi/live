import { Box,Typography,useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
      {/* FOOTER */}
      <Box textAlign="center" py={2}   mt="550px">
      <Typography variant="h5" color={colors.grey[100]}>
      @2023KRA Copyrights.All rights reserved.
      </Typography>
        
      </Box>
    </Box>
  );
};

export default Dashboard;
