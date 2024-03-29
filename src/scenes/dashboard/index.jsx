import { Box,Typography,useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import Pop from "../../components/Pop"

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const cypher = `MATCH (Owner)<-[:Owned_By]-(Entity {pin_no: "P000601432C"})<-[:Belongs_to]-(FalseImport)
                 WITH DISTINCT Owner, Entity, FalseImport
                 MATCH path1 = (Owner)-[ownedBy]-(Entity)
                 MATCH path2 = (Entity)-[belongsTo]-(FalseImport)
                 RETURN Owner, ownedBy, Entity, belongsTo, FalseImport
                 ORDER BY keys(Owner), keys(Entity), keys(FalseImport)`;
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        
      </Box>
      <Box>
      <Pop cypher={cypher} />
      </Box>
      {/* FOOTER */}
      <Box textAlign="center" py={2}   >
      <Typography variant="h5" color={colors.grey[100]}>
      @2023KRA Copyrights.All rights reserved.
      </Typography>
        
      </Box>
    </Box>
  );
};

export default Dashboard;
