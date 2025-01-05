// eslint-disable-next-line no-unused-vars
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import CardComponent from "../../components/CardComponent.jsx";
import {
  useGetPostCategoriesQuery,
  useGetPostsQuery,
} from "../../features/api/apiSlice.js";
import CustomContainer from "../../utils/CustomContainer.jsx";
import { ParseSlice } from "../../utils/htmlParser.jsx";
import { useEffect, useReducer, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../../utils/NoData.jsx";
import CenteredContainer from "../../utils/CenteredContainer.jsx";
import { NoMoreDataToLoad } from "../../components/noMoreDataToLoad.jsx";
import Input from "../../components/Input.jsx";
import Select from "../../components/Select.jsx";
import CustumSelect from "../../components/Select.jsx";
import Loader from "../../assets/icons/loader.svg";
import tagSolid from "../../assets/icons/tag-solid.svg";
import filterSolid from "../../assets/icons/filter-solid.svg";
import xmarkSolid from "../../assets/icons/xmark-solid.svg";

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
  "https://api.possible.africa/storage/logos/wwwredditcom.jpg",
];
const logoPlaceholder =
  "https://api.possible.africa/storage/logos/placeholder_org.jpeg";

function getPageEqValue(key, state) {
  if (state.length) {
    state.forEach(s => {
      if (s.field === key) {
        return s.value;
      }
    });
  } else {
    return false;
  }
}

function pageEqReducer(state, action) {
  let modifieState = [
    { field: "possible", value: true },
    { field: "title", value: "" },
    { field: "airTags", value: "" },
    { field: "airLanguage", value: "" },
  ];
  let titleValue = "";
  let airLanguageValue = "";
  let airTagsValue = "";
  switch (action.field) {
    case "title":
      state[1] = { ...state[1], value: action.value };
      break;
    case "airTags":
      state[2] = { ...state[2], value: action.value };
      break;
    case "airLanguage":
      state[3] = { ...state[3], value: action.value };
      break;
    case "reset":
      state = [
        { field: "possible", value: true },
        { field: "title", value: "" },
        { field: "airTags", value: "" },
        { field: "airLanguage", value: "" },
      ];
      break;
    default:
      console.log("undefined action");
      break;
  }
  // console.log(state);
  // return [
  //   { field: "possible", value: true },
  //   { field: "title", value: titleValue },
  //   { field: "airTags", value: airTagsValue },
  //   { field: "airLanguage", value: airLanguageValue },
  // ];
  return [...state];
}

function Actualites() {
  const initialPageEq = [
    { field: "possible", value: true },
    { field: "title", value: "" },
    { field: "airTags", value: "" },
    { field: "airLanguage", value: "" },
  ];
  const [page, setPage] = useState(1);
  const [mobileFilterIsVisible, setMobileFilterIsVisible] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [filterIn, setFilterIn] = useState(true);
  const [pageS, setPageS] = useState(page + 1);
  const [engPage, setEngPage] = useState(1);
  const [frPage, setFrPage] = useState(1);
  const [languageChanging, setLanguageChanging] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [infiniteScrollIsFetching] = useState(false);
  const [pageEq, dispatch] = useReducer(pageEqReducer, [
    { field: "possible", value: true },
    { field: "title", value: "" },
    { field: "airTags", value: "" },
    { field: "airLanguage", value: "" },
  ]);
  const [pageEqS, setPageEqS] = useState([
    { field: "possible", value: true },
    { field: "title", value: "" },
    { field: "airTags", value: "" },
    { field: "airLanguage", value: "" },
  ]);
  const [allTags, setAllTags] = useState([]);

  const {
    data: allNews = [],
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch,
  } = useGetPostsQuery({
    limit: firstLoad ? 10 * page : 10 * (page + 1),
    page: firstLoad ? page : page + 1,
    fields: [],
    eq: pageEqS,
  });

  const {
    data: allNewsLength,
    isLoading: allNewsLengthIsLoading,
    isFetching: allNewsLengthIsFetching,
    refetch: refechAllNewsLength,
  } = useGetPostsQuery({
    fields: [],
    eq: pageEqS[0].value ? pageEqS : [],
  });

  useEffect(() => {
    if (page != pageS || pageEq.length) {
      refetch();
      // console.log(page, pageS);
    } else {
      // console.log(page, pageS);
    }
  }, [isLoading, page, pageS]);

  if (isLoading || allNewsLengthIsLoading) {
    return (
      <div className="h-[400px] w-full m-auto flex justify-center items-center">
        <img
          src={Loader}
          style={{
            transformOrigin: "bottom center",
            translate: "-100px 0",
          }}
          alt="Loader possible"
          className="w-16 animate-[loading_1s_ease-in-out_infinite_alternate]"
        />
      </div>
    );
  }
  if (isError || error) {
    return <NoData />;
  }

  return (
    <>
      <div
        onClick={() => setMobileFilterIsVisible(!mobileFilterIsVisible)}
        className={`cursor-pointer md:hidden text-2xl p-2 bg-white text-primary border-l-0 border-2 ${
          mobileFilterIsVisible ? "border-danger" : "border-primary"
        } sticky top-2.5 z-[110] rounded-r-full flex justify-center items-center w-[44px] gap-2 active:scale-110`}
      >
        <span className="hidden">Filtres</span>
        <img
          className="w-[24px] text-primary"
          src={mobileFilterIsVisible ? xmarkSolid : filterSolid}
          alt=""
        />
      </div>
      {/* <div className="mx-auto max-w-[1280px] bg-green-600 w-full min-h-[400px] grid grid-cols-[1fr_2fr_1fr] gap-x-5"> */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 right-0 bg-white w-[100vw] h-[100vh] z-[100] flex justify-center items-center ${
          mobileFilterIsVisible ? "" : "hidden"
        }`}
      >
        <div className="absolute min-h-[400px] max-h-[100vh] flex justify-start flex-col items-center gap-5 border-[.5px] rounded-[12px] border-primary p-5 ">
          {/* {JSON.stringify(pageEq)} */}
          <div className="w-[248px] h-10 flex justify-center text-center rounded-lg shadow-sm drop-shadow-xl overflow-hidden">
            <div
              className={
                language === "fr"
                  ? "w-[124px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                  : "w-[124px] h-10 flex justify-center flex-col cursor-pointer"
              }
              onClick={() => {
                setLanguageChanging(true);
                setLanguage("fr");
                setTimeout(() => {
                  setLanguageChanging(false);
                }, 3000);
                setTimeout(() => {
                  setMobileFilterIsVisible(false);
                }, 2000);
              }}
            >
              <span>Français</span>
            </div>
            <div
              className={
                language === "eng"
                  ? "w-[124px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                  : "w-[124px] h-10 flex justify-center flex-col cursor-pointer"
              }
              onClick={() => {
                setLanguageChanging(true);
                setLanguage("eng");
                setTimeout(() => {
                  setLanguageChanging(false);
                }, 3000);
                setTimeout(() => {
                  setMobileFilterIsVisible(false);
                }, 2000);
              }}
            >
              <span>Anglais</span>
            </div>
          </div>
          <Input
            label="Rechercher par titre"
            placeholder="Entrez le titre de l'article ."
            type="text"
            // value={pageEq[1].value}
            value={getPageEqValue("title", pageEq)}
            onChange={(e) => {
              dispatch({ field: "title", value: e.target.value });
            }}
          />
          <Input
            label="Rechercher par tag"
            placeholder="Entrez un tag de l'article ."
            type="text"
            value={getPageEqValue("airTags", pageEq)}
            onChange={(e) => {
              dispatch({ field: "airTags", value: e.target.value });
            }}
          />
          {/* <CustumSelect
          label="Pays du siège social"
          multi
          placeholder="Choisissez un pays ."
        /> */}
          {/* <CustumSelect
          label="Filtrer par Tag"
          options={[]}
          multi
          placeholder="Choisissez un tag ."
        /> */}
          <CustumSelect
            label="Langue d'écriture de l'article"
            placeholder="Choisissez une langue."
            // value={pageEq[3].value}
            value={getPageEqValue("airLanguage", pageEq)}
            onChange={(e) => {
              dispatch({ field: "airLanguage", value: e.target.value });
            }}
          >
            <option value="">Choisissez une langue</option>
            <option value="ENG">Anglais</option>
            <option value="FR">Français</option>
          </CustumSelect>

          <button
            className="w-full h-[45px] bg-primary rounded-full text-lg font-bold text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
            onClick={() => {
              setPageEqS([...pageEq]);
              setTimeout(() => {
                setMobileFilterIsVisible(false);
              }, 1000);
            }}
          >
            Filtrer
          </button>
          <button
            className="w-full h-[45px] bg-transparent rounded-full text-lg text-primary border-2 border-primary hover:text-white font-bold hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
            onClick={() => {
              setPageEqS([
                { field: "possible", value: true },
                { field: "title", value: "" },
                { field: "airTags", value: "" },
                { field: "airLanguage", value: "" },
              ]);
              dispatch({ field: "reset", value: "" });
              setTimeout(() => {
                setMobileFilterIsVisible(false);
              }, 1000);
            }}
          >
            Réinitialiser les filtres
          </button>
          {/* <div>
          <div className="font-semibold">Langue de publication</div>
          <Input label="Anglais" type="checkbox" />
          <Input label="Français" type="checkbox" />
        </div> */}
          {/* <Input
          label="Date de publication"
          placeholder="Choisissez la date ."
          type="date"
          onChange={(e) => {
            setPageEq(
              pageEq.map((a) => {
                if (a.field === "airDateAdded") {
                  return { field: a.field, value: e.target.value };
                } else {
                  return a;
                }
              })
            );
          }}
        /> */}
          {/* <button
          onClick={() => {
            setPageEqS((s) => {
              return [...pageEq];
            });
          }}
          className="w-full h-[45px] bg-primary rounded-full text-lg font-bold text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
        >
          Filtrer
        </button> */}
          {/* <button
          onClick={() => {
            setPageEq([
              { field: "possible", value: true },
              { field: "title", value: "" },
              { field: "airTags", value: "" },
              { field: "airLanguage", value: "" },
            ]);
            // refetch();
          }}
          className="w-full h-[45px] bg-transparent border-2 border-primary text-primary rounded-full text-lg font-bold hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
        >
          Réinitialiser les filtres
        </button> */}
          <div className="flex justify-center items-center w-full">
            {(isFetching || allNewsLengthIsFetching) && (
              <img
                src={Loader}
                style={{
                  transformOrigin: "bottom center",
                  translate: "-35px 0",
                }}
                alt="Loader possible"
                className="mx-auto w-8 animate-[loading_1s_ease-in-out_infinite_alternate]"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto bg-transparent w-11/12 mt-10 text-darkGray lg:grid lg:grid-cols-[1fr_2fr_1fr] lg:gap-x-5 max-w-[1280px]">
        <div className="absolute md:sticky top-10 min-h-[400px] max-h-[100vh] overflow-x-scroll hidden lg:flex lg:justify-start lg:flex-col lg:items-center lg:gap-5 lg:border-[.5px] rounded-[12px] lg:border-primary lg:p-5 ">
          {/* {JSON.stringify(pageEq)} */}
          <div className="w-[248px] h-10 flex justify-center text-center rounded-lg shadow-sm drop-shadow-xl overflow-hidden">
            <div
              className={
                language === "fr"
                  ? "w-[124px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                  : "w-[124px] h-10 flex justify-center flex-col cursor-pointer"
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
            </div>
            <div
              className={
                language === "eng"
                  ? "w-[124px] h-10 flex justify-center flex-col cursor-pointer bg-[#2BB19C] text-white font-semibold"
                  : "w-[124px] h-10 flex justify-center flex-col cursor-pointer"
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
            </div>
          </div>
          <Input
            label="Rechercher par titre"
            placeholder="Entrez le titre de l'article ."
            type="text"
            value={pageEq[1].value}
            onChange={(e) => {
              dispatch({ field: "title", value: e.target.value });
            }}
          />
          <Input
            label="Rechercher par tag"
            placeholder="Entrez un tag de l'article ."
            type="text"
            value={pageEq[2].value}
            onChange={(e) => {
              dispatch({ field: "airTags", value: e.target.value });
            }}
          />
          {/* <CustumSelect
          label="Pays du siège social"
          multi
          placeholder="Choisissez un pays ."
        /> */}
          {/* <CustumSelect
          label="Filtrer par Tag"
          options={[]}
          multi
          placeholder="Choisissez un tag ."
        /> */}
          <CustumSelect
            label="Langue d'écriture de l'article"
            placeholder="Choisissez une langue."
            // value={pageEq[3].value}
            value={pageEq[3].value}
            onChange={(e) => {
              dispatch({ field: "airLanguage", value: e.target.value });
            }}
          >
            <option value="">Choisissez une langue</option>
            <option value="ENG">Anglais</option>
            <option value="FR">Français</option>
          </CustumSelect>

          <button
            className="w-full h-[45px] bg-primary rounded-full text-lg font-bold text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
            onClick={() => setPageEqS([...pageEq])}
          >
            Filtrer
          </button>
          <button
            className="w-full h-[45px] bg-transparent rounded-full text-lg text-primary border-2 border-primary hover:text-white font-bold hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
            onClick={() => {
              setPageEqS([
                { field: "possible", value: true },
                { field: "title", value: "" },
                { field: "airTags", value: "" },
                { field: "airLanguage", value: "" },
              ]);
              dispatch({ field: "reset", value: "" });
            }}
          >
            Réinitialiser les filtres
          </button>
          {/* <div>
          <div className="font-semibold">Langue de publication</div>
          <Input label="Anglais" type="checkbox" />
          <Input label="Français" type="checkbox" />
        </div> */}
          {/* <Input
          label="Date de publication"
          placeholder="Choisissez la date ."
          type="date"
          onChange={(e) => {
            setPageEq(
              pageEq.map((a) => {
                if (a.field === "airDateAdded") {
                  return { field: a.field, value: e.target.value };
                } else {
                  return a;
                }
              })
            );
          }}
        /> */}
          {/* <button
          onClick={() => {
            setPageEqS((s) => {
              return [...pageEq];
            });
          }}
          className="w-full h-[45px] bg-primary rounded-full text-lg font-bold text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
        >
          Filtrer
        </button> */}
          {/* <button
          onClick={() => {
            setPageEq([
              { field: "possible", value: true },
              { field: "title", value: "" },
              { field: "airTags", value: "" },
              { field: "airLanguage", value: "" },
            ]);
            // refetch();
          }}
          className="w-full h-[45px] bg-transparent border-2 border-primary text-primary rounded-full text-lg font-bold hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 transition-all duration-300"
        >
          Réinitialiser les filtres
        </button> */}
          <div className="flex justify-center items-center w-full">
            {(isFetching || allNewsLengthIsFetching) && (
              <img
                src={Loader}
                style={{
                  transformOrigin: "bottom center",
                  translate: "-35px 0",
                }}
                alt="Loader possible"
                className="mx-auto w-8 animate-[loading_1s_ease-in-out_infinite_alternate]"
              />
            )}
          </div>
        </div>
        {/* <div></div> */}
        <div className="min-h-[400px] rounded-[12px] flex flex-col gap-y-[30px] md:max-w-[600px] mx-auto">
          <div className="w-full min-h-40 bg-white border-t-[.5px] border-primary relative flex flex-col justify-start items-center pb-[20px]">
            <span className="text-[16px] border-[.5px] border-primary bg-lightPrimary text-primary h-[30px] w-[130px] font-medium rounded-full flex justify-center items-start absolute -top-[14px] left-5">
              <span className="font-semibold">les plus récents</span>
            </span>
            {/* One card in recents part */}
            {language === "fr"
              ? allNews
                  .filter((el) => el.airTrans === "fr")
                  .slice(0, 10)
                  .map((post, index) => {
                    const createdAt = new Date(post?.airDateAdded);
                    // transform date to french format
                    const date =
                      createdAt.getDate() +
                      "/" +
                      (createdAt.getMonth() + 1) +
                      "/" +
                      createdAt.getFullYear();
                    return (
                      <div
                        key={index}
                        className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden"
                      >
                        <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
                          <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-transparent">
                            <img
                              src={
                                socialMedias.includes(post?.airLogo)
                                  ? logoPlaceholder
                                  : post?.airLogo
                              }
                              height={40}
                              width={40}
                              alt="logo"
                            />
                          </div>
                          <div className="flex flex-col justify-start min-h-[46px]">
                            <div>
                              <span className="font-semibold md:text-lg">
                                {post.airMedia}
                              </span>
                            </div>
                            <div className="text-xs italic md:text-sm">
                              Publié le {date}, language d' origine :{" "}
                              <span className="text-primary">
                                {post.airLanguage === "ENG"
                                  ? "Anglais"
                                  : "Français"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="h-[90px] w-full text-primary hover:text-darkPrimary active:text-darkPrimary visited:text-darkPrimary font-bold flex items-center md:text-xl">
                          <a
                            href={post.airLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {post.title.length > 110
                              ? post.title.slice(0, 110) + " . . ."
                              : post.title}
                          </a>
                        </div>
                        <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
                          {post?.airTags?.split(", ")?.map((tag) => {
                            return (
                              <div
                                key={tag}
                                className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray"
                              >
                                <div className="max-h-[35px] h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                                  <img
                                    src={tagSolid}
                                    height={20}
                                    width={18}
                                    alt="Tag"
                                  />
                                </div>
                                <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                                  {tag}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
              : allNews
                  .filter((el) => el.airTrans === "eng")
                  .slice(0, 10)
                  .map((post, index) => {
                    const createdAt = new Date(post?.airDateAdded);
                    // transform date to french format
                    const date =
                      createdAt.getDate() +
                      "/" +
                      (createdAt.getMonth() + 1) +
                      "/" +
                      createdAt.getFullYear();
                    return (
                      <div
                        key={index}
                        className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden"
                      >
                        <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
                          <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200">
                            <img
                              src={
                                socialMedias.includes(post?.airLogo)
                                  ? logoPlaceholder
                                  : post?.airLogo
                              }
                              height={40}
                              width={40}
                              alt="logo"
                            />
                          </div>
                          <div className="flex flex-col justify-start min-h-[46px]">
                            <div>
                              <span className="font-semibold md:text-lg">
                                {post.airMedia}{" "}
                              </span>
                            </div>
                            <div className="text-xs italic md:text-sm">
                              Publié le {date}, language d' origine :{" "}
                              <span className="text-primary">
                                {post.airLanguage === "ENG"
                                  ? "Anglais"
                                  : "Français"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="h-[90px] w-full text-primary hover:text-darkPrimary active:text-darkPrimary visited:text-darkPrimary font-bold flex items-center md:text-xl">
                          <a
                            href={post.airLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {post.title.length > 110
                              ? post.title.slice(0, 110) + " . . ."
                              : post.title}
                          </a>
                        </div>
                        <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
                          {post?.airTags?.split(", ")?.map((tag) => {
                            return (
                              <div
                                key={tag}
                                className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray"
                              >
                                <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                                  <img
                                    src={tagSolid}
                                    height={20}
                                    width={18}
                                    alt="Tag"
                                  />
                                </div>
                                <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                                  {tag}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
          </div>
          <div
            className={
              allNews.filter((el) => el.airTrans === "fr").slice(10).length ===
              0
                ? "hidden"
                : "w-full min-h-40 bg-white border-t-[.5px] border-primary relative flex flex-col justify-start items-center pb-[20px]"
            }
          >
            <span className="text-[16px] border-[.5px] border-primary bg-lightPrimary text-primary h-[30px] w-[150px] font-medium rounded-full flex justify-center items-start absolute -top-[14px] left-5">
              <span className="font-semibold">Les moins récents</span>
            </span>
            {/* One card in others parts */}
            {language === "fr"
              ? allNews
                  .filter((el) => el.airTrans === "fr")
                  .slice(10)
                  .map((post, index) => {
                    const createdAt = new Date(post?.airDateAdded);
                    // transform date to french format
                    const date =
                      createdAt.getDate() +
                      "/" +
                      (createdAt.getMonth() + 1) +
                      "/" +
                      createdAt.getFullYear();
                    return (
                      <div
                        key={index}
                        className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden"
                      >
                        <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
                          <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200">
                            <img
                              src={
                                socialMedias.includes(post?.airLogo)
                                  ? logoPlaceholder
                                  : post?.airLogo
                              }
                              height={40}
                              width={40}
                              alt="logo"
                            />
                          </div>
                          <div className="flex flex-col justify-start min-h-[46px]">
                            <div>
                              <span className="font-semibold md:text-lg">
                                {post.airMedia}
                              </span>
                            </div>
                            <div className="text-xs italic md:text-sm">
                              Publié le {date}, language d' origine :{" "}
                              <span className="text-primary">
                                {post.airLanguage === "ENG"
                                  ? "Anglais"
                                  : "Français"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="h-[90px] w-full text-primary hover:text-darkPrimary active:text-darkPrimary visited:text-darkPrimary font-bold flex items-center md:text-xl">
                          <a
                            href={post.airLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {post.title.length > 110
                              ? post.title.slice(0, 110) + " . . ."
                              : post.title}
                          </a>
                        </div>
                        <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
                          {post?.airTags?.split(", ")?.map((tag) => {
                            return (
                              <div
                                key={tag}
                                className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray"
                              >
                                <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                                  <img
                                    src={tagSolid}
                                    height={20}
                                    width={18}
                                    alt="Tag"
                                  />
                                </div>
                                <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                                  {tag}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
              : allNews
                  .filter((el) => el.airTrans === "eng")
                  .slice(10)
                  .map((post, index) => {
                    const createdAt = new Date(post?.airDateAdded);
                    // transform date to french format
                    const date =
                      createdAt.getDate() +
                      "/" +
                      (createdAt.getMonth() + 1) +
                      "/" +
                      createdAt.getFullYear();
                    return (
                      <div
                        key={index}
                        className="w-full h-[200px] bg-white shadow-lg mt-[20px] rounded-[12px] p-[12px] overflow-hidden"
                      >
                        <div className="h-[46px] w-full flex justify-start items-center gap-x-[8px]">
                          <div className="h-[40px] w-[40px] rounded-full overflow-hidden bg-slate-200">
                            <img
                              src={
                                socialMedias.includes(post?.airLogo)
                                  ? logoPlaceholder
                                  : post?.airLogo
                              }
                              height={40}
                              width={40}
                              alt="logo"
                            />
                          </div>
                          <div className="flex flex-col justify-start min-h-[46px]">
                            <div>
                              <span className="font-semibold md:text-lg">
                                {post.airMedia}
                              </span>
                            </div>
                            <div className="text-xs italic md:text-sm">
                              Publié le {date}, language d' origine :{" "}
                              <span className="text-primary">
                                {post.airLanguage === "ENG"
                                  ? "Anglais"
                                  : "Français"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="h-[90px] w-full text-primary hover:text-darkPrimary active:text-darkPrimary visited:text-darkPrimary font-bold flex items-center md:text-xl">
                          <a
                            href={post.airLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {post.title.length > 110
                              ? post.title.slice(0, 110) + " . . ."
                              : post.title}
                          </a>
                        </div>
                        <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
                          {post?.airTags?.split(", ")?.map((tag) => {
                            return (
                              <div
                                key={tag}
                                className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray"
                              >
                                <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                                  <img
                                    src={tagSolid}
                                    height={20}
                                    width={18}
                                    alt="Tag"
                                  />
                                </div>
                                <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                                  {tag}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
          </div>

          <div
            className={
              isFetching || allNewsLengthIsFetching
                ? "w-full md:flex md:justify-between"
                : "w-full md:flex md:justify-end"
            }
          >
            {(isFetching || allNewsLengthIsFetching) && (
              <img
                src={Loader}
                style={{
                  transformOrigin: "bottom center",
                  translate: "-35px 0",
                }}
                alt="Loader possible"
                className="ml-24 w-8 animate-[loading_1s_ease-in-out_infinite_alternate]"
              />
            )}
            <button
              className="w-full h-[45px] bg-primary rounded-full text-lg font-bold text-white hover:bg-gradient-to-r hover:from-primary hover:to-darkPrimary hover:border-none active:scale-95 md:w-6/12 lg:w-5/12 transition-all duration-300"
              onClick={() => {
                setPageS((s) => s + 1);
                setPage((s) => s + 1);
              }}
            >
              Charger plus de résultats
            </button>
          </div>
        </div>
        <div className="sticky top-10 min-h-[400px] max-h-[100vh] overflow-x-scroll hidden lg:flex lg:justify-start lg:flex-col lg:items-center lg:gap-5 lg:border-[.5px] rounded-[12px] lg:border-primary lg:p-5">
          {(pageEqS[1].value || pageEqS[2].value || pageEqS[3].value) &&
          (pageEq[1].value || pageEq[2].value || pageEq[3].value) &&
          !isFetching ? (
            <div className="w-full">
              <div className="font-bold text-2xl mb-4">
                Résultats des filtres
              </div>
              <div className="font-semibold italic text-mediumGray">
                Nous avons trouvé{" "}
                <strong>
                  {allNewsLength.length} résultats (dont{" "}
                  {allNews.filter((el) => el.airTrans === language).length}{" "}
                  affichés)
                </strong>{" "}
                correspondant à vos filtres.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Actualites;
