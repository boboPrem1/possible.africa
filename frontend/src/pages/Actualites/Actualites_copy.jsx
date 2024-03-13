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
  const [pageEq, setPageEq] = useState([{ field: "title", value: "" }]);
  // const { data: interviewCategories = [] } = useGetPostCategoriesQuery({
  //   limit: 10,
  //   page: page,
  //   fields: [],
  //   eq: [],
  // });

  // const articleNameRef = useRef();
  // const articleTagRef = useRef();
  // const articleMediaRef = useRef();
  // const articleLanguageRef = useRef();
  // const articleAddedDateRef = useRef();

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
    "https://logo.clearbit.com/",
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
  // const {
  //   data: allNewsLength,
  //   isLoading: allNewsLengthIsLoading,
  //   isFetching: allNewsLengthIsFetching,
  //   refetch: refechAllNewsLength,
  // } = useGetPostsQuery({
  //   fields: [],
  //   eq: [
  //     { field: "categorie", value: `${interviewCategories[0]?._id}` },
  //     { field: "status", value: "published" },
  //   ],
  // });

  // Chargement des données eng qui viennent de la base de données AirTable
  // const {
  //   data: allAirtableAllNews = [],
  //   isLoading: allAirtableAllNewsIsLoading,
  //   isFetching: allAirtableAllNewsIsFetching,
  //   isError: allAirtableAllNewsIsError,
  //   isSuccess: allAirtableAllNewsIsSuccess,
  //   error: allAirtableAllNewsError,
  //   refetch: allAirtableAllNewsRefetch,
  // } = useGetAirtableEngPostsQuery({
  //   limit: 10 * page,
  //   page: page,
  //   fields: [],
  //   eq: [],
  // });
  // const {
  //   data: allAirtableAllNewsLength,
  //   isLoading: allAirtableAllNewsLengthIsLoading,
  //   isFetching: allAirtableAllNewsLengthIsFetching,
  //   refetch: allAirtableAllNewsLengthRefetch,
  // } = useGetAirtableEngPostsQuery({
  //   fields: [],
  //   eq: pageEq,
  // });

  // Chargement de tous les données qui viennent de la ase de données MongoDb
  // const {
  //   data: FrAirtableFrNews = [],
  //   isLoading: FrAirtableFrNewsIsLoading,
  //   isFetching: FrAirtableFrNewsIsFetching,
  //   isError: FrAirtableFrNewsIsError,
  //   isSuccess: FrAirtableFrNewsIsSuccess,
  //   error: FrAirtableFrNewsError,
  //   refetch: FrAirtableFrNewsRefetch,
  // } = useGetAirtableFrPostsQuery({
  //   limit: 10 * page,
  //   page: page,
  //   fields: [],
  //   eq: pageEq,
  // });
  // const {
  //   data: FrAirtableFrNewsLength,
  //   isLoading: FrAirtableFrNewsLengthIsLoading,
  //   isFetching: FrAirtableFrNewsLengthIsFetching,
  //   refetch: FrAirtableFrNewsLengthRefetch,
  // } = useGetAirtableFrPostsQuery({
  //   fields: [],
  //   eq: pageEq,
  // });

  useEffect(() => {
    // const allNewsLengthInterval = setInterval(() => {
    //   refechAllNewsLength();
    //   refetch();
    // }, 30000);
    // if (allNewsLengthIsFetching) {
    //   console.log("Loading...");
    // }
    if (isSuccess) {
      // console.log(allNews)
    }
    // FrAirtableFrNewsLengthRefetch();
    // FrAirtableFrNewsRefetch();
    // allAirtableAllNewsLengthRefetch();
    // if (allAirtableAllNews.length) {
    // console.log(FrAirtableFrNews);
    // }
    // console.log(allNewsLength);
    // return () => {
    //   // return clearInterval(allNewsLengthInterval);
    // };
  }, [
    // allNewsLengthIsFetching,
    // isFetching,
    // allAirtableAllNewsLengthIsFetching,
    // allAirtableAllNewsIsFetching,
    // language,
    // pageEq,
    // allAirtableAllNewsIsFetching,
    // FrAirtableFrNewsIsFetching,
    // allAirtableAllNewsIsLoading,
    // FrAirtableFrNewsIsLoading,
    allNews,
    isLoading,
    isFetching,
    isSuccess,
  ]);

  // function handleLanguageTabClick() {
  //   setLanguage((s) => {
  //     return [[...s[0]], [...s[1]]];
  //   });
  // }

  // Changement de langues
  // function DataTabs({ data }) {
  //   return (
  //     <Tabs>
  //       <TabList>
  //         {data.map((el, index) => {
  //           return (
  //             <Tab key={index} onClick={handleLanguageTabClick}>
  //               {el.label}
  //             </Tab>
  //           );
  //         })}
  //       </TabList>
  //       <TabPanels>
  //         {data.index === 0 && data.status ? (
  //           <CustomContainer content={airtableFrContent} />
  //         ) : (
  //           <CustomContainer content={airtableEngContent} />
  //         )}
  //       </TabPanels>
  //     </Tabs>
  //   );
  // }

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

  // if (allNews.length) {
  //   content = (
  //     <InfiniteScroll
  //       dataLength={allNews.length}
  //       next={() => setPage((prevPage) => prevPage + 1)}
  //       hasMore={allNews.length === allNewsLength?.length ? false : true}
  //       loader={
  //         <Box
  //           styles={{
  //             display: "flex",
  //             justifyContent: "center",
  //           }}
  //         >
  //           <Spinner as="div" mx="45%" mt={10} />
  //           {/* <p>{JSON.stringify(allNewsLength?)}</p> */}
  //         </Box>
  //       }
  //       endMessage={<NoMoreDataToLoad />}
  //     >
  //       {allNews &&
  //         allNews.map((news, index) => {
  //           const createdAt = new Date(news?.createdAt);
  //           // transform date to french format
  //           const date =
  //             createdAt.getDate() +
  //             "/" +
  //             (createdAt.getMonth() + 1) +
  //             "/" +
  //             createdAt.getFullYear();
  //           const instanceCard = (
  //             <CardComponent
  //               postType="Actualités"
  //               key={news?._id}
  //               title={news?.title}
  //               description={news?.content ? ParseSlice(news?.content) : null}
  //               imgUrl={news?.image}
  //               isLoaded={isLoaded}
  //               link={"/actualites/" + news?.slug}
  //               countries={news?.countries?.length > 0 ? news?.countries : []}
  //               authors={news?.authors?.length > 0 ? news?.authors : []}
  //               editors={news?.editors?.length > 0 ? news?.editors : []}
  //               hideMeBellow="md"
  //               organisations={
  //                 news?.organisations?.length > 0 ? news?.organisations : []
  //               }
  //               labels={news?.labels?.length > 0 ? news?.labels : []}
  //               createdAt={date}
  //               source={news?.source}
  //               language={news?.publication_language || "Français"}
  //             />
  //           );

  //           // if (index === allNews.length - 1) {
  //           //   setContinueDataLoading(false);
  //           // }

  //           return (
  //             <>
  //               {instanceCard}
  //               {/* {(index === allNews.length - 1 && infiniteScrollIsFetching) ?? (
  //                 <Box
  //                   as="div"
  //                   display="flex"
  //                   justifyContent="center"
  //                   alignItems="center"
  //                   p={15}
  //                 >
  //                   <Spinner />
  //                 </Box>
  //               )} */}
  //             </>
  //           );
  //         })}
  //     </InfiniteScroll>
  //   );
  // }

  // if (allAirtableAllNews.length) {
  //   airtableEngContent = (
  //     <InfiniteScroll
  //       dataLength={allAirtableAllNews.length}
  //       next={() => setPage((prevPage) => prevPage + 1)}
  //       hasMore={
  //         allAirtableAllNews.length === allAirtableAllNewsLength?.length
  //           ? false
  //           : true
  //       }
  //       loader={
  //         <Box
  //           styles={{
  //             display: "flex",
  //             justifyContent: "center",
  //           }}
  //         >
  //           <Spinner as="div" mx="45%" mt={10} />
  //           {/* <p>{JSON.stringify(allNewsLength?)}</p> */}
  //         </Box>
  //       }
  //       endMessage={<NoMoreDataToLoad />}
  //     >
  //       {allAirtableAllNews &&
  //         allAirtableAllNews.map((news, index) => {
  //           const createdAt = new Date(news?.publication_date);
  //           // transform date to french format
  //           const date =
  //             createdAt.getDate() +
  //             "/" +
  //             (createdAt.getMonth() + 1) +
  //             "/" +
  //             createdAt.getFullYear();
  //           const instanceCard = (
  //             <CardComponent
  //               postType="Actualités"
  //               key={news?.title}
  //               title={news?.title}
  //               imgUrl={news?.logo}
  //               isLoaded={isLoaded}
  //               link={news?.link}
  //               // countries={news?.countries?.length > 0 ? news?.countries : []}
  //               // authors={news?.authors?.length > 0 ? news?.authors : []}
  //               editors={news?.media}
  //               hideMeBellow="md"
  //               // organisations={
  //               //   news?.organisations?.length > 0 ? news?.organisations : []
  //               // }
  //               // labels={news?.labels?.length > 0 ? news?.labels : []}
  //               createdAt={date}
  //               source={news?.link}
  //               language={news?.language == "ENG" ? "English" : "French"}
  //             />
  //           );

  //           // if (index === allNews.length - 1) {
  //           //   setContinueDataLoading(false);
  //           // }

  //           return (
  //             <>
  //               {instanceCard}
  //               {/* {(index === allNews.length - 1 && infiniteScrollIsFetching) ?? (
  //                 <Box
  //                   as="div"
  //                   display="flex"
  //                   justifyContent="center"
  //                   alignItems="center"
  //                   p={15}
  //                 >
  //                   <Spinner />
  //                 </Box>
  //               )} */}
  //             </>
  //           );
  //         })}
  //     </InfiniteScroll>
  //   );
  // }

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
                  // countries={news?.countries?.length > 0 ? news?.countries : []}
                  // authors={news?.authors?.length > 0 ? news?.authors : []}
                  editors={news?.airMedia}
                  hideMeBellow="md"
                  // organisations={
                  //   news?.organisations?.length > 0 ? news?.organisations : []
                  // }
                  // labels={news?.labels?.length > 0 ? news?.labels : []}
                  createdAt={date}
                  source={news?.airLink}
                  language={news?.airLanguage == "ENG" ? "English" : "French"}
                />
              );

              // if (index === allNews.length - 1) {
              //   setContinueDataLoading(false);
              // }

              return (
                <>
                  {instanceCard}
                  {/* {(index === allNews.length - 1 && infiniteScrollIsFetching) ?? (
                  <Box
                    as="div"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={15}
                  >
                    <Spinner />
                  </Box>
                )} */}
                </>
              );
            })}
      </InfiniteScroll>
    );
  }

  // if (allAirtableAllNewsIsError) {
  //   console.log({ allAirtableAllNewsError });
  //   return <Box>{allAirtableAllNewsError.status}</Box>;
  // }

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
            {/* <div className="bg-transparent h-[40px] border-2 border-[#2BB19C]/40 w-[100px] rounded-lg overflow-hidden">
            <input
              className="w-full h-full bg-transparent text-center text-neutral-900 placeholder-shown:text-neutral-900 px-2"
              type="text"
              placeholder="Tag"
              onChange={(e) => {
                setPageEq(
                  pageEq.map((a) => {
                    if (a.field === "Tags from Feedly") {
                      return { field: a.field, value: e.target.value };
                    } else {
                      return a;
                    }
                  })
                );
              }}
            />
          </div> */}

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
          {/*
          <div className="bg-transparent border-2 border-[#2BB19C]/40 w-[100px] rounded-lg overflow-hidden">
            <input
              className="w-full h-full bg-transparent text-center text-neutral-900 placeholder-shown:text-neutral-900 px-2"
              type="text"
              placeholder="Nom media"
              onChange={(e) => {
                console.log(e.target.value)
                setPageEq(
                  pageEq.map((a) => {
                    if (a.field === "Name of Media") {
                      return { field: a.field, value: e.target.value };
                    } else {
                      return a;
                    }
                  })
                );
              }}
            />
          </div>
          <div className="bg-transparent border-2 border-[#2BB19C]/40 w-[100px] rounded-lg overflow-hidden">
            <select
              className="bg-transparent w-full h-full text-center px-2"
              name=""
              id=""
              ref={articleLanguageRef}
            >
              <option className="" value="">
                Language
              </option>
              <option className="" value="fr">
                Fr
              </option>
              <option className="" value="eng">
                Eng
              </option>
            </select>
          </div>
          <div className="bg-transparent border-2 border-[#2BB19C]/40 w-[100px] rounded-lg overflow-hidden">
            <input
              className="w-full h-full bg-transparent text-center text-neutral-900 placeholder-shown:text-neutral-900 px-2"
              type="date"
              placeholder="Nom media"
              ref={articleAddedDateRef}
            />
          </div>
          <button
            onClick={handleClickFilterBtn}
            className="bg-[#2BB19C]/90 text-white w-[100px] rounded-lg overflow-hidden hover:rounded-md hover:bg-[#2BB19C] hover:scale-105 active:rounded-sm active:scale-100"
          >
            Filtrer
          </button> */}
        </div>
        {/* {pageEq.map((e) => {
          return JSON.stringify(e);
        })} */}
        <CustomContainer content={content} />
      </Container>
    </>
  );
}

export default ActualitesCopy;
