// eslint-disable-next-line no-unused-vars
import {
  Box,
  Spinner,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Container,
} from "@chakra-ui/react";
import CardComponent from "../../components/CardComponent.jsx";
import {
  useGetAirtableAllPostsQuery,
  useGetAirtableEngPostsQuery,
  useGetAirtableFrPostsQuery,
  useGetPostCategoriesQuery,
  useGetPostsQuery,
} from "../../features/api/apiSlice.js";
import CustomContainer from "../../utils/CustomContainer.jsx";
import { ParseSlice } from "../../utils/htmlParser.jsx";
import { forwardRef, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../../utils/NoData.jsx";
import CenteredContainer from "../../utils/CenteredContainer.jsx";
import { NoMoreDataToLoad } from "../../components/noMoreDataToLoad.jsx";

function ActualitesCopy() {
  const [page, setPage] = useState(1);
  const [engPage, setEngPage] = useState(1);
  const [frPage, setFrPage] = useState(1);
  const [languageChanging, setLanguageChanging] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [infiniteScrollIsFetching] = useState(false);
  const [pageEq, setPageEq] = useState([{ field: "possible", value: true, },{ field: "title", value: "" }]);
  // Chargement de tous les données qui viennent de la ase de données MongoDb
  const socialMedias = [
    "https://api.possible.africa/storage/logos/wwwlinkedincom.jpg",
    "https://api.possible.africa/storage/logos/linkedincom.jpg",
    "https://api.possible.africa/storage/logos/wwwtwittercom.jpg",
    "https://api.possible.africa/storage/logos/twittercom.jpg",
    "https://api.possible.africa/storage/logos/wwwfacebookcom.jpg",
    "https://api.possible.africa/storage/logos/facebookcom.jpg",
    "https://api.possible.africa/storage/logos/wwwinstagramcom.jpg",
    "https://api.possible.africa/storage/logos/instagramcom.jpg",
    "https://logo.clearbit.com/","https://api.possible.africa/storage/logos/wwwredditcom.jpg"
  ];
  const logoPlaceholder =
    "https://api.possible.africa/storage/logos/placeholder_org.jpeg";
  const {
    data: allNews = [],
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch,
  } = useGetPostsQuery({
    limit: 10 * page,
    page: page,
    fields: [],
    eq: pageEq[0].value ? pageEq : [],
  });
  const {
    data: allNewsLength,
    isLoading: allNewsLengthIsLoading,
    isFetching: allNewsLengthIsFetching,
    refetch: refechAllNewsLength,
  } = useGetPostsQuery({
    fields: [],
    eq: pageEq[0].value ? pageEq : [],
  });

  useEffect(() => {
    if (isSuccess) {
      // console.log(allNews)
    }
  }, [
    allNews,
    isLoading,
    isFetching,
    isSuccess,
  ]);


  let content;
  // let airtableEngContent;
  // let airtableFrContent;

  let isLoaded = true;

  if (allNews?.length === 0) {
    if (isLoading || isFetching || languageChanging) {
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

  if (allNews.length) {
    content = (
      <InfiniteScroll
        dataLength={allNews.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={allNews.length === allNewsLength?.length ? false : true}
        loader={
          <Box
            styles={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Spinner as="div" mx="45%" mt={10} />
            {/* <p>{JSON.stringify(allNewsLength?)}</p> */}
          </Box>
        }
        endMessage={<NoMoreDataToLoad />}
      >
        {allNews &&
          allNews
            .filter((n) => n.airTrans === language)
            .map((news, index) => {
              const createdAt = new Date(news?.airDateAdded);
              // transform date to french format
              const date =
                createdAt.getDate() +
                "/" +
                (createdAt.getMonth() + 1) +
                "/" +
                createdAt.getFullYear();
              const instanceCard = (
                <CardComponent
                  postType="Actualités"
                  key={news?.title}
                  title={news?.title}
                  imgUrl={
                    socialMedias.includes(news?.airLogo)
                      ? logoPlaceholder
                      : news?.airLogo
                  }
                  isLoaded={isLoaded}
                  link={news?.airLink}
                  editors={news?.airMedia}
                  hideMeBellow="md"
                  createdAt={date}
                  source={news?.airLink}
                  language={news?.airLanguage == "ENG" ? "English" : "French"}
                />
              );
              return (
                <>
                  {instanceCard}
                </>
              );
            })}
      </InfiniteScroll>
    );
  }

  return (
    <>
      <Container maxW="container.lg" pt={8}>
        {/* <DataTabs data={language} /> */}
        <div className="w-full flex flex-col justify-center md:justify-start gap-5 text-center lg:flex-row">
          <Box className="ml-10 w-[200px] h-10 flex justify-center text-center rounded-lg shadow-sm drop-shadow-xl overflow-hidden">
            <Box
              className={
                language === "fr"
                  ? "w-[100px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                  : "w-[100px] h-10 flex justify-center flex-col cursor-pointer"
              }
              onClick={() => {
                setLanguageChanging(true);
                setLanguage("fr");
                setTimeout(() => {
                  setLanguageChanging(false);
                }, 3000);
              }}
            >
              <span>Français</span>
            </Box>
            <Box
              className={
                language === "eng"
                  ? "w-[100px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                  : "w-[100px] h-10 flex justify-center flex-col cursor-pointer"
              }
              onClick={() => {
                setLanguageChanging(true);
                setLanguage("eng");
                setTimeout(() => {
                  setLanguageChanging(false);
                }, 3000);
              }}
            >
              <span>Anglais</span>
            </Box>
          </Box>
          <div className="w-full flex flex-col items-center gap-2 justify-center lg:flex-row">
            <div className="bg-transparent h-[40px] border-2 border-[#2BB19C]/40 w-10/12 rounded-lg overflow-hidden">
              <input
                className="w-full h-full bg-transparent text-center text-neutral-900 placeholder-shown:text-neutral-900 px-2"
                type="text"
                placeholder="Entrer le nom d'un article pour commencer à filtrer ..."
                onChange={(e) => {
                  setPageEq(
                    pageEq.map((a) => {
                      if (a.field === "title") {
                        return { field: a.field, value: e.target.value };
                      } else {
                        return a;
                      }
                    })
                  );
                }}
              />
            </div>

            {(isLoading || isFetching || isFetching) && (
              <Box
                as="div"
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={15}
              >
                <Spinner />
              </Box>
            )}
          </div>
        </div>
        <CustomContainer content={content} />
      </Container>
    </>
  );
}

export default ActualitesCopy;
