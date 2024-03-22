
import { Container } from "@chakra-ui/react";

import { HomeHeader } from "../components/HomeHeader";
import Actualites from "./Actualites/Actualites";
import ActualitesCopy from "./Actualites/Actualites_copy";

// import PodcastsIcon from "@mui/icons-material/Podcasts";
// import NewspaperIcon from "@mui/icons-material/Newspaper";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import WorkIcon from "@mui/icons-material/Work";
// import Interviews from "./Interviews";

function Home() {
  return (
    <>
      <Container maxW="100vw" p={0}>
        <Actualites />
      </Container>
    </>
  );
}

export default Home;
