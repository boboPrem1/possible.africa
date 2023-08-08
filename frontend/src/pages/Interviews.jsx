import { Box, Spinner, VStack } from "@chakra-ui/react";
import CardComponent from "../components/CardComponent.jsx";
import {
  useGetPostCategoriesQuery,
  useGetPostsQuery,
} from "../features/api/apiSlice.js";
import CustomContainer from "../utils/CustomContainer.jsx";
import { ParseSlice } from "../utils/htmlParser.jsx";
import NoData from "../utils/NoData.jsx";
import CenteredContainer from "../utils/CenteredContainer.jsx";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function Interviews() {
  const [page, setPage] = useState(1);
  const [infiniteScrollIsFetching, setinfiniteScrollIsFetching] =
    useState(false);
  const { data: interviewCategories = [] } = useGetPostCategoriesQuery({
    limit: 10,
    page: 1,
    fields: [],
    eq: [{ field: "slug", value: "/podcast" }],
  });
  const {
    data: interviews = [],
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
  } = useGetPostsQuery({
    limit: 10,
    page: 1,
    fields: [],
    eq: [
      { field: "categorie", value: `${interviewCategories[0]?._id}` },
      { field: "status", value: "published" },
    ],
  });
  let content;

  let isLoaded = true;

  //     const [isLoaded, setIsLoaded] = useState(false);

  // setInterval(() => {
  //   setIsLoaded(true)
  // }, 1000);

  if (interviews?.length === 0) {
    if (isLoading || isFetching) {
      return (
        <Box
          as="div"
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={15}
        >
          <Spinner />
        </Box>
      );
    }
    return <NoData />;
  }

  if (isLoading || isFetching) {
    return (
      <Box
        as="div"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={15}
      >
        <Spinner />
      </Box>
    );
  }

  if (isSuccess) {
    content = (
      <InfiniteScroll
        dataLength={interviews.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={true}
        loader={
          // eslint-disable-next-line react/no-unknown-property
          <Box
            styles={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Spinner as="div" mx="45%" mt={10} />
          </Box>
        }
        endMessage={<Text>Yay! You have seen it all</Text>}
      >
        {interviews.map((interview) => {
          const createdAt = new Date(interview?.createdAt);
          // transform date to french format
          const date =
            createdAt.getDate() +
            "/" +
            (createdAt.getMonth() + 1) +
            "/" +
            createdAt.getFullYear();
          const instanceCard = (
            <CardComponent
              postType="Interview"
              key={interview?._id}
              title={interview?.title}
              description={
                interview?.content ? ParseSlice(interview?.content) : ""
              }
              imgUrl={interview?.image}
              isLoaded={isLoaded}
              link={"/interviews/" + interview?.slug}
              countries={
                interview?.countries?.length > 0 ? interview?.countries : []
              }
              authors={interview?.authors?.length > 0 ? interview?.authors : []}
              editors={interview?.editors?.length > 0 ? interview?.editors : []}
              hideMeBellow="md"
              organisations={
                interview?.organisations?.length > 0
                  ? interview?.organisations
                  : []
              }
              labels={interview?.labels?.length > 0 ? interview?.labels : []}
              createdAt={date}
              source={interview?.source}
            />
          );
          return <>{instanceCard}</>;
        })}
      </InfiniteScroll>
    );
  } else if (isError) {
    console.log({ error });
    return <div>{error.status}</div>;
  }

  return <CustomContainer content={content ?? ""} />;
}

export default Interviews;
