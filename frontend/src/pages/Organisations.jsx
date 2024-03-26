// eslint-disable-next-line no-unused-vars
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import CardComponent from "../components/CardComponent.jsx";
import { useGetOrganisationsQuery } from "../features/api/apiSlice.js";
import CustomContainer from "../utils/CustomContainer.jsx";
import { ParseSlice } from "../utils/htmlParser.jsx";
import { useEffect, useReducer, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../utils/NoData.jsx";
import CenteredContainer from "../utils/CenteredContainer.jsx";
import { NoMoreDataToLoad } from "../components/noMoreDataToLoad.jsx";
import Input from "../components/Input.jsx";
import Select from "../components/Select.jsx";
import CustumSelect from "../components/Select.jsx";
import Loader from "../assets/icons/loader.svg";
import tagSolid from "../assets/icons/tag-solid.svg";
import counstrySolid from "../assets/icons/earth-africa-solid.svg";
import sectorSolid from "../assets/icons/sector.svg";
import subSectorSolid from "../assets/icons/subSector.svg";
import tierSolid from "../assets/icons/tier.svg";

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

function pageEqReducer(state, action) {
  switch (action.field) {
    case "name":
      state[0] = { ...state[0], value: action.value };
      break;
    case "region":
      state[2] = { ...state[2], value: action.value };
      break;
    case "headquarter":
      state[3] = { ...state[3], value: action.value };
      break;
    case "operatingCountries":
      state[4] = { ...state[4], value: action.value };
      break;
    case "sector":
      state[5] = { ...state[5], value: action.value };
      break;
    case "subSector":
      state[6] = { ...state[6], value: action.value };
      break;
    case "tier":
      state[10] = { ...state[10], value: action.value };
      break;
    case "reset":
      state = [
        { field: "name", value: "" },
        { field: "source", value: "" },
        { field: "region", value: "" },
        { field: "headquarter", value: "" },
        { field: "operatingCountries", value: "" },
        { field: "sector", value: "" },
        { field: "subSector", value: "" },
        { field: "active", value: "" },
        { field: "fundraising", value: "" },
        { field: "amountFundraised", value: "" },
        { field: "tier", value: "" },
        { field: "website", value: "" },
      ];
      break;
    default:
      console.log("undefined action");
      break;
  }
  return [...state];
}

function Organisations() {
  const initialPageEq = [
    { field: "name", value: "" },
    { field: "source", value: "" },
    { field: "region", value: "" },
    { field: "headquarter", value: "" },
    { field: "operatingCountries", value: "" },
    { field: "sector", value: "" },
    { field: "subSector", value: "" },
    { field: "active", value: "" },
    { field: "fundraising", value: "" },
    { field: "amountFundraised", value: "" },
    { field: "tier", value: "" },
    { field: "website", value: "" },
  ];
  const [page, setPage] = useState(1);
  const [firstLoad, setFirstLoad] = useState(true);
  const [pageS, setPageS] = useState(page + 1);
  const [engPage, setEngPage] = useState(1);
  const [frPage, setFrPage] = useState(1);
  const [languageChanging, setLanguageChanging] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [infiniteScrollIsFetching] = useState(false);
  const [pageEq, dispatch] = useReducer(pageEqReducer, [
    { field: "name", value: "" },
    { field: "source", value: "" },
    { field: "region", value: "" },
    { field: "headquarter", value: "" },
    { field: "operatingCountries", value: "" },
    { field: "sector", value: "" },
    { field: "subSector", value: "" },
    { field: "active", value: "" },
    { field: "fundraising", value: "" },
    { field: "amountFundraised", value: "" },
    { field: "tier", value: "" },
    { field: "website", value: "" },
  ]);
  const [pageEqS, setPageEqS] = useState([
    { field: "name", value: "" },
    { field: "source", value: "" },
    { field: "region", value: "" },
    { field: "headquarter", value: "" },
    { field: "operatingCountries", value: "" },
    { field: "sector", value: "" },
    { field: "subSector", value: "" },
    { field: "active", value: "" },
    { field: "fundraising", value: "" },
    { field: "amountFundraised", value: "" },
    { field: "tier", value: "" },
    { field: "website", value: "" },
  ]);
  const [allTags, setAllTags] = useState([]);

  const {
    data: organisations = [],
    isLoading,
    isFetching,
    isError,
    isSuccess,
    error,
    refetch,
  } = useGetOrganisationsQuery({
    limit: firstLoad ? 10 * page : 10 * (page + 1),
    page: firstLoad ? page : page + 1,
    fields: [],
    eq: pageEqS,
  });

  const {
    data: organisationsLength,
    isLoading: organisationsLengthIsLoading,
    isFetching: organisationsLengthIsFetching,
    refetch: refechOrganisationsLength,
  } = useGetOrganisationsQuery({
    fields: [],
    eq: pageEqS,
  });

  useEffect(() => {
    // console.log(organisations);
    if (page != pageS || pageEq.length) {
      refetch();
      // console.log(page, pageS);
    } else {
      // console.log(page, pageS);
    }
  }, [isLoading, page, pageS]);

  if (isLoading || organisationsLengthIsLoading) {
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

  // return <p>Allo</p>;

  return (
    // <div className="mx-auto max-w-[1280px] bg-green-600 w-full min-h-[400px] grid grid-cols-[1fr_2fr_1fr] gap-x-5">
    <div className="mx-auto bg-transparent w-11/12 mt-10 text-darkGray lg:grid lg:grid-cols-[1fr_2fr_1fr] lg:gap-x-5 max-w-[1280px]">
      <div className="sticky top-2 min-h-[400px] max-h-[100vh] overflow-x-scroll hidden lg:flex lg:justify-start lg:flex-col lg:items-center lg:gap-5 lg:border-[.5px] rounded-[12px] lg:border-primary lg:p-5 ">
        {/* {JSON.stringify(pageEq)} */}
        <Input
          label="Rechercher par nom"
          placeholder="Entrez le nom de l'organisation ."
          type="text"
          value={pageEq[0].value}
          onChange={(e) => {
            dispatch({ field: "name", value: e.target.value });
          }}
        />
        <CustumSelect
          label="Région d'appartenance"
          placeholder="Choisissez une région."
          // value={pageEq[3].value}
          value={pageEq[2].value}
          onChange={(e) => {
            dispatch({ field: "region", value: e.target.value });
          }}
        >
          <option value="">Choisissez une région</option>
          <option value="All">All</option>
          <option value="North Africa">North Africa</option>
          <option value="West Africa">West Africa</option>
          <option value="East Africa">East Africa</option>
          <option value="Southern Africa">Southern Africa</option>
        </CustumSelect>
        <CustumSelect
          label="Siège de l'organisation"
          placeholder="Choisissez un pays."
          // value={pageEq[3].value}
          value={pageEq[3].value}
          onChange={(e) => {
            dispatch({ field: "headquarter", value: e.target.value });
          }}
        >
          <option value="">Choisissez un pays</option>
          <option value="All">All</option>
          <option value="South Africa">South Africa</option>
          <option value="Algeria">Algeria</option>
          <option value="Angola">Angola</option>
          <option value="Benin">Benin</option>
          <option value="Botswana">Botswana</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Burundi">Burundi</option>
          <option value="Cameroon">Cameroon</option>
          <option value="Cape Verde">Cape Verde</option>
          <option value="Comoros">Comoros</option>
          <option value="Ivory Coast">Ivory Coast</option>
          <option value="Djibouti">Djibouti</option>
          <option value="Egypt">Egypt</option>
          <option value="Ethiopia">Ethiopia</option>
          <option value="Gabon">Gabon</option>
          <option value="Gambia">Gambia</option>
          <option value="Ghana">Ghana</option>
          <option value="Guinea">Guinea</option>
          <option value="Guinea-Bissau">Guinea-Bissau</option>
          <option value="Equatorial Guinea">Equatorial Guinea</option>
          <option value="Haiti">Haiti</option>
          <option value="Kenya">Kenya</option>
          <option value="Lesotho">Lesotho</option>
          <option value="Liberia">Liberia</option>
          <option value="Libya">Libya</option>
          <option value="Madagascar">Madagascar</option>
          <option value="Malawi">Malawi</option>
          <option value="Mali">Mali</option>
          <option value="Mauritius">Mauritius</option>
          <option value="Mauritania">Mauritania</option>
          <option value="Mozambique">Mozambique</option>
          <option value="Namibia">Namibia</option>
          <option value="Niger">Niger</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Central African Republic">
            Central African Republic
          </option>
          <option value="Democratic Republic of the Congo">
            Democratic Republic of the Congo
          </option>
          <option value="Republic of the Congo">Republic of the Congo</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Sao Tome and Principe">Sao Tome and Principe</option>
          <option value="Senegal">Senegal</option>
          <option value="Seychelles">Seychelles</option>
          <option value="Sierra Leone">Sierra Leone</option>
          <option value="Somalia">Somalia</option>
          <option value="Sudan">Sudan</option>
          <option value="South Sudan">South Sudan</option>
          <option value="Swaziland">Swaziland</option>
          <option value="Tanzania">Tanzania</option>
          <option value="Chad">Chad</option>
          <option value="Togo">Togo</option>
          <option value="Tunisia">Tunisia</option>
          <option value="Uganda">Uganda</option>
          <option value="Zambia">Zambia</option>
          <option value="Zimbabwe">Zimbabwe</option>
        </CustumSelect>
        <CustumSelect
          label="Pays couverts"
          placeholder="Choisissez un pays."
          // value={pageEq[3].value}
          value={pageEq[4].value}
          onChange={(e) => {
            dispatch({ field: "operatingCountries", value: e.target.value });
          }}
        >
          <option value="">Choisissez un pays</option>
          <option value="All">All</option>
          <option value="South Africa">South Africa</option>
          <option value="Algeria">Algeria</option>
          <option value="Angola">Angola</option>
          <option value="Benin">Benin</option>
          <option value="Botswana">Botswana</option>
          <option value="Burkina Faso">Burkina Faso</option>
          <option value="Burundi">Burundi</option>
          <option value="Cameroon">Cameroon</option>
          <option value="Cape Verde">Cape Verde</option>
          <option value="Comoros">Comoros</option>
          <option value="Ivory Coast">Ivory Coast</option>
          <option value="Djibouti">Djibouti</option>
          <option value="Egypt">Egypt</option>
          <option value="Ethiopia">Ethiopia</option>
          <option value="Gabon">Gabon</option>
          <option value="Gambia">Gambia</option>
          <option value="Ghana">Ghana</option>
          <option value="Guinea">Guinea</option>
          <option value="Guinea-Bissau">Guinea-Bissau</option>
          <option value="Equatorial Guinea">Equatorial Guinea</option>
          <option value="Haiti">Haiti</option>
          <option value="Kenya">Kenya</option>
          <option value="Lesotho">Lesotho</option>
          <option value="Liberia">Liberia</option>
          <option value="Libya">Libya</option>
          <option value="Madagascar">Madagascar</option>
          <option value="Malawi">Malawi</option>
          <option value="Mali">Mali</option>
          <option value="Mauritius">Mauritius</option>
          <option value="Mauritania">Mauritania</option>
          <option value="Mozambique">Mozambique</option>
          <option value="Namibia">Namibia</option>
          <option value="Niger">Niger</option>
          <option value="Nigeria">Nigeria</option>
          <option value="Central African Republic">
            Central African Republic
          </option>
          <option value="Democratic Republic of the Congo">
            Democratic Republic of the Congo
          </option>
          <option value="Republic of the Congo">Republic of the Congo</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Sao Tome and Principe">Sao Tome and Principe</option>
          <option value="Senegal">Senegal</option>
          <option value="Seychelles">Seychelles</option>
          <option value="Sierra Leone">Sierra Leone</option>
          <option value="Somalia">Somalia</option>
          <option value="Sudan">Sudan</option>
          <option value="South Sudan">South Sudan</option>
          <option value="Swaziland">Swaziland</option>
          <option value="Tanzania">Tanzania</option>
          <option value="Chad">Chad</option>
          <option value="Togo">Togo</option>
          <option value="Tunisia">Tunisia</option>
          <option value="Uganda">Uganda</option>
          <option value="Zambia">Zambia</option>
          <option value="Zimbabwe">Zimbabwe</option>
        </CustumSelect>
        <CustumSelect
          label="Filtrer par secteur"
          placeholder="Choisissez un secteur."
          // value={pageEq[3].value}
          value={pageEq[5].value}
          onChange={(e) => {
            dispatch({ field: "sector", value: e.target.value });
          }}
        >
          <option value="">Choisissez un secteur</option>
          <option value="All">All</option>
          <option value="Secteur">Secteur</option>
          <option value="Health">Health</option>
          <option value="Agribusiness">Agribusiness</option>
          <option value="Education">Education</option>
          <option value="Mobility">Mobility</option>
          <option value="Logistic">Logistic</option>
          <option value="telecom">Telecom</option>
          <option value="Energy">Energy</option>
          <option value="Financial services">Financial services</option>
          <option value="FMCG">FMCG</option>
          <option value="Hospitality">Hospitality</option>
          <option value="media">media</option>
          <option value="Retail">Retail</option>
          <option value="Climat">Climat</option>
          <option value="Data">Data</option>
          <option value="VC">VC</option>
          <option value="Hub">Hub</option>
        </CustumSelect>
        <CustumSelect
          label="Filtrer par tier"
          placeholder="Choisissez un tier."
          // value={pageEq[3].value}
          value={pageEq[10].value}
          onChange={(e) => {
            dispatch({ field: "tier", value: e.target.value });
          }}
        >
          <option value="">Choisissez un secteur</option>
          <option value="Global">Global</option>
          <option value="Panafrican">Panafrican</option>
          <option value="Startups">Startups</option>
          <option value="Local SMEs">Local SMEs</option>
        </CustumSelect>
        {/* <CustumSelect
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
        </CustumSelect> */}

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
              { field: "name", value: "" },
              { field: "source", value: "" },
              { field: "region", value: "" },
              { field: "headquarter", value: "" },
              { field: "operatingCountries", value: "" },
              { field: "sector", value: "" },
              { field: "subSector", value: "" },
              { field: "active", value: "" },
              { field: "fundraising", value: "" },
              { field: "amountFundraised", value: "" },
              { field: "tier", value: "" },
              { field: "website", value: "" },
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
                if (a.field === "dateAdded") {
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
          {(isFetching || organisationsLengthIsFetching) && (
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
        <div className="w-full min-h-40 bg-white relative flex flex-col justify-start items-center pb-[20px]">
          {/* <span className="text-[16px] border-[.5px] border-primary bg-lightPrimary text-primary h-[30px] w-[130px] font-medium rounded-full flex justify-center items-start absolute -top-[14px] left-5">
            <span className="font-semibold">les plus récents</span>
          </span> */}
          {/* One card in recents part */}
          {organisations.map((organisation, index) => {
            const createdAt = new Date(organisation?.dateAdded);
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
                        socialMedias.includes(organisation?.logo)
                          ? logoPlaceholder
                          : organisation?.logo
                      }
                      height={40}
                      width={40}
                      alt="logo"
                    />
                  </div>
                  <div className="flex flex-col justify-start min-h-[46px]">
                    <div>
                      <span className="font-semibold md:text-lg">
                        {organisation.name}
                      </span>
                    </div>
                    <div className="text-xs italic md:text-sm">
                      En ligne depuis le {date}
                    </div>
                  </div>
                </div>
                <div className="h-[90px] w-full text-primary hover:text-darkPrimary active:text-darkPrimary visited:text-darkPrimary font-bold flex items-center md:text-xl">
                  <a
                    href={organisation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {organisation.description.length > 110
                      ? organisation.description.slice(0, 110) + " . . ."
                      : organisation.description}
                  </a>
                </div>
                <div className="h-[40px] w-full flex justify-start items-center gap-x-[12px] overflow-x-scroll">
                  {organisation.operatingCountries ? (
                    <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                      <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                        <img
                          src={counstrySolid}
                          height={20}
                          width={18}
                          alt="Tier"
                        />
                      </div>
                      <span className="capitalize md:text-lg md:font-semibold">
                        {/* {organisation.operatingCountries} */}
                        {organisation.operatingCountries.length > 20
                          ? organisation.operatingCountries.slice(0, 14) +
                            " . . ."
                          : organisation.operatingCountries}
                      </span>
                    </div>
                  ) : null}

                  {organisation.tier ? (
                    <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                      <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                        <img
                          src={tierSolid}
                          height={20}
                          width={18}
                          alt="Tier"
                        />
                      </div>
                      <span className="capitalize md:text-lg md:font-semibold">
                        {/* {organisation.tier} */}
                        {organisation.tier.length > 20
                          ? organisation.tier.slice(0, 14) + " . . ."
                          : organisation.tier}
                      </span>
                    </div>
                  ) : null}

                  {organisation.sector ? (
                    <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                      <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                        <img
                          src={sectorSolid}
                          height={20}
                          width={18}
                          alt="Tier"
                        />
                      </div>
                      <span className="capitalize md:text-lg md:font-semibold">
                        {/* {organisation.sector} */}
                        {organisation.sector.length > 20
                          ? organisation.sector.slice(0, 14) + " . . ."
                          : organisation.sector}
                      </span>
                    </div>
                  ) : null}

                  {organisation.subSector ? (
                    <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                      <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                        <img
                          src={subSectorSolid}
                          height={20}
                          width={18}
                          alt="Tier"
                        />
                      </div>
                      <span className="capitalize md:text-lg md:font-semibold">
                        {/* {organisation.subSector} */}
                        {organisation.subSector.length > 20
                          ? organisation.subSector.slice(0, 14) + " . . ."
                          : organisation.subSector}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={
            isFetching || organisationsLengthIsFetching
              ? "w-full md:flex md:justify-between"
              : "w-full md:flex md:justify-end"
          }
        >
          {(isFetching || organisationsLengthIsFetching) && (
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
      <div className="invisible h-[400px] bg-purple-600 hidden lg:inline-grid"></div>
    </div>
  );
}

export default Organisations;
