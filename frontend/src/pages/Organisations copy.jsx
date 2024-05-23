// import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
// import CardComponent from "../components/CardComponent";
// import {
//   useGetAirtableOrganisationsQuery,
//   useGetOrganisationsQuery,
// } from "../features/api/apiSlice";
// import CustomContainer from "../utils/CustomContainer";
// import { ParseSlice } from "../utils/htmlParser";
// import { useState, useEffect } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import NoData from "../utils/NoData";
// import CenteredContainer from "../utils/CenteredContainer";

// function Organisations() {
//   const [page, setPage] = useState(1);
//   const [firstChargement, setFirstChargement] = useState(true);
//   const [infiniteScrollIsFetching, setinfiniteScrollIsFetching] =
//     useState(false);
//   const [pageEq, setPageEq] = useState([
//     { field: "name", value: "" },
//     // { field: "Description", value: "" },
//     // { field: "Region", value: "" },
//     // { field: "Sector", value: "" },
//     // { field: "Operating Countries", value: "" },
//   ]);
//   const socialMedias = [
//     "https://api.possible.africa/storage/logos/wwwlinkedincom.jpg",
//     "https://api.possible.africa/storage/logos/linkedincom.jpg",
//     "https://api.possible.africa/storage/logos/wwwtwittercom.jpg",
//     "https://api.possible.africa/storage/logos/twittercom.jpg",
//     "https://api.possible.africa/storage/logos/wwwfacebookcom.jpg",
//     "https://api.possible.africa/storage/logos/facebookcom.jpg",
//     "https://api.possible.africa/storage/logos/wwwinstagramcom.jpg",
//     "https://api.possible.africa/storage/logos/instagramcom.jpg",
//     "https://logo.clearbit.com/","https://api.possible.africa/storage/logos/wwwredditcom.jpg"
//   ];
//   const logoPlaceholder =
//     "https://api.possible.africa/storage/logos/placeholder_org.jpeg";
//   const {
//     data: organisations = [],
//     isLoading,
//     isFetching,
//     isError,
//     isSuccess,
//     refetch,
//     error,
//   } = useGetOrganisationsQuery({
//     limit: 10 * page,
//     page: page,
//     fields: [],
//     eq: pageEq[0].value ? pageEq : [],
//   });
//   // const {
//   //   data: organisations = [],
//   //   isLoading,
//   //   isFetching,
//   //   isError,
//   //   refetch,
//   //   isSuccess,
//   //   error,
//   // } = useGetOrganisationsQuery({
//   //   limit: 10 * page,
//   //   page: page,
//   //   fields: [],
//   //   eq: pageEq,
//   // });
//   let content;

//   useEffect(() => {
//     // console.log(organisations);
//     // console.log(pageEq);
//     refetch;
//   }, [isLoading, pageEq]);

//   let isLoaded = true;

//   if (organisations?.length === 0) {
//     if (isLoading || isFetching) {
//       return (
//         <Box
//           as="div"
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           p={15}
//         >
//           <Spinner />
//         </Box>
//       );
//     }
//     if (organisations?.length === 0 && firstChargement) {
//       return <NoData />;
//     }
//   }
//   if (organisations.length) {
//     content = (
//       <InfiniteScroll
//         dataLength={organisations.length}
//         next={() => setPage((prevPage) => prevPage + 1)}
//         hasMore={true}
//         loader={
//           // eslint-disable-next-line react/no-unknown-property
//           <Box
//             styles={{
//               display: "flex",
//               justifyContent: "center",
//             }}
//           >
//             <Spinner as="div" mx="45%" mt={10} />
//           </Box>
//         }
//         endMessage={<Text>Yay! You have seen it all</Text>}
//       >
//         {organisations.map((organisation, index) => {
//           const createdAt = new Date(organisation?.dateAdded);
//           // transform date to french format
//           const date =
//             createdAt.getDate() +
//             "/" +
//             (createdAt.getMonth() + 1) +
//             "/" +
//             createdAt.getFullYear();
//           // console.log(organisation.description);
//           const instanceCard = (
//             <CardComponent
//               postType="Organisation"
//               key={date}
//               title={organisation?.name}
//               description={organisation?.description}
//               imgUrl={
//                 socialMedias.includes(organisation?.logo)
//                   ? logoPlaceholder
//                   : organisation?.logo
//               }
//               // isLoaded={isLoaded}
//               // link={"/organisations/" + organisation?.id}
//               link={organisation?.website}
//               // type={organisation?.type?.name}
//               // organisation_types={
//               //   organisation?.types?.length > 0 ? organisation?.types : []
//               // }
//               // countries={
//               //   organisation?.operationnal_countries?.length > 0
//               //     ? organisation?.operationnal_countries.split(", ")
//               //     : []
//               // }
//               // activity_areas={
//               //   organisation?.activity_areas?.length > 0
//               //     ? organisation?.activity_areas
//               //     : []
//               // }
//               createdAt={date}
//               country={organisation?.region}
//               sitWebLink={organisation?.website || ""}
//               airtableRegion={organisation?.region}
//               airtableHeadquarter={organisation?.headquarter}
//               airtableOperationnalCountries={organisation?.operatingCountries}
//               airtableSector={organisation?.sector}
//               airtableRelaredArticles={organisation?.airRelatedArticles}
//             />
//           );
//           return <>{instanceCard}</>;
//         })}
//       </InfiniteScroll>
//     );
//   }
//   if (isError) {
//     console.log({ error });
//     return <div></div>;
//   }
//   return (
//     <>
//       <div className="w-8/12 pt-5 h-[60px] mx-auto flex justify-start gap-3 text-center">
//         <div className="bg-transparent border-2 border-[#2BB19C]/40 w-[500px] rounded-lg overflow-hidden">
//           <input
//             className="w-full h-full bg-transparent text-center text-neutral-900 placeholder-shown:text-neutral-900 px-2"
//             type="text"
//             placeholder="Entrer le nom d'une organisation pour commencer à filtrer ..."
//             onChange={(e) => {
//               setPageEq(
//                 pageEq.map((a) => {
//                   if (a.field === "name") {
//                     return { field: a.field, value: e.target.value };
//                   } else {
//                     return a;
//                   }
//                 })
//               );
//               setFirstChargement(false);
//             }}
//           />
//         </div>
//         {isFetching && (
//           <Box
//             as="div"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             p={15}
//           >
//             <Spinner />
//           </Box>
//         )}
//       </div>
//       <CustomContainer content={content || "Pas de contenu"} />
//     </>
//   );
// }

// export default Organisations;

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
import filterSolid from "../assets/icons/filter-solid.svg";
import xmarkSolid from "../assets/icons/xmark-solid.svg";
import headquarterSolid from "../assets/icons/building-flag-solid.svg";

const countries = {
  all: [
    "Algeria",
    "Egypt",
    "Libya",
    "Tunisia",
    "Benin",
    "Burkina Faso",
    "Cape Verde",
    "Ivory Coast",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Liberia",
    "Mali",
    "Mauritania",
    "Niger",
    "Nigeria",
    "Senegal",
    "Sierra Leone",
    "Togo",
    "Cameroun",
    "Central African Republic",
    "Republic of the Congo",
    "Democratic Republic of the Congo",
    "Gabon",
    "Equatorial Guinea",
    "Sao Tome and Principe",
    "Chad",
    "Burundi",
    "Comoros",
    "Djibouti",
    "Ethiopia",
    "Kenya",
    "Madagascar",
    "Malawi",
    "Mauritius",
    "Mozambique",
    "Rwanda",
    "Seychelles",
    "Somalia",
    "South Sudan",
    "Tanzania",
    "Uganda",
    "Angola",
    "Botswana",
    "Lesotho",
    "Namibia",
    "South Africa",
    "Swaziland",
    "Zambia",
    "Zimbabwe",
  ],
  north: ["Algeria", "Egypt", "Libya", "Tunisia"],
  west: [
    "Benin",
    "Burkina Faso",
    "Cape Verde",
    "Ivory Coast",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Liberia",
    "Mali",
    "Mauritania",
    "Niger",
    "Nigeria",
    "Senegal",
    "Sierra Leone",
    "Togo",
  ],
  central: [
    "Cameroun",
    "Central African Republic",
    "Republic of the Congo",
    "Democratic Republic of the Congo",
    "Gabon",
    "Equatorial Guinea",
    "Sao Tome and Principe",
    "Chad",
  ],
  east: [
    "Burundi",
    "Comoros",
    "Djibouti",
    "Ethiopia",
    "Kenya",
    "Madagascar",
    "Malawi",
    "Mauritius",
    "Mozambique",
    "Rwanda",
    "Seychelles",
    "Somalia",
    "South Sudan",
    "Tanzania",
    "Uganda",
  ],
  southern: [
    "Angola",
    "Botswana",
    "Lesotho",
    "Namibia",
    "South Africa",
    "Swaziland",
    "Zambia",
    "Zimbabwe",
  ],
};

const subSectors = {
  health: [
    "Pharma/Biotech",
    "Health Tech",
    "Medical Device",
    "Provider",
    "Health Payer",
    "Health Consulting",
    "Health Finance",
    "Health Care Innovation & Entrepreneurship",
  ],
  education: [
    "Early Childhood Education",
    "Primary and Secondary Education",
    "Higher Education",
    "Vocational Training and Technical Education",
    "Online Education and E-Learning",
    "Educational Materials and Publishing",
    "Educational Technology and Software",
    "Tutoring and Test Preparation Services",
    "International Education and Study Abroad Programs",
    "Special Education Services",
    "Educational Consulting",
    "Continuing Education and Professional Development",
    "Language Schools and Services",
    "Educational Nonprofits and NGOs",
  ],
  mobility: [
    "Automotive Manufacturing",
    "Electric Vehicles and Charging Infrastructure",
    "Public Transportation Systems",
    "Ride-Sharing and Carpooling Services",
    "Bicycle and Scooter Sharing Systems",
    "Aerial Mobility",
    "Rail Transport Manufacturing and Services",
    "Maritime and Shipping Industries",
    "Logistics and Supply Chain Solutions",
    "Mobility as a Service - MAAS",
    "Autonomous Vehicles and Technologies",
    "Mobility Infrastructure",
    "Vehicle Rental and Leasing Services",
    "Mobility Data Analytics and Software Solutions",
  ],
  logistic: [
    "Freight Transportation",
    "Warehousing and Storage",
    "Courier and Express Delivery Services",
    "Third-Party Logistics (3PL)",
    "Supply Chain Management",
    "Maritime Logistics",
    "Air Freight and Logistics",
    "Rail Logistics",
    "Road Transportation and Trucking",
    "Customs Brokerage and Freight Forwarding",
    "Inventory Management and Control",
    "E-commerce Logistics",
    "Cold Chain Logistics",
    "Reverse Logistics",
  ],
  telecom: [
    "Mobile Network Operators",
    "Fixed-Line Telephony Services",
    "Internet Service Providers",
    "Satellite Communications",
    "Cable TV Providers",
    "Broadband and High-Speed Internet Services",
    "Voice Over Internet Protocol (VoIP) Services",
    "Wireless Communications",
    "Telecommunications Equipment Manufacturing",
    "Telecommunications Infrastructure",
    "Cloud Communications and Services",
    "Data Center Services",
    "Value-Added Services",
    "Telecommunications Consulting and Management Services",
  ],
  energy: [
    "Oil and Gas Exploration and Production",
    "Renewable Energy",
    "Nuclear Energy",
    "Electric Power Generation",
    "Electric Transmission and Distribution",
    "Natural Gas Distribution",
    "Energy Trading and Marketing",
    "Energy Efficiency Solutions",
    "Biofuels and Biomass Energy",
    "Energy Storage Solutions",
    "Coal Mining and Production",
    "Utility Services",
    "Energy Equipment and Services",
    "Environmental and Clean Tech Energy",
  ],
  financialServices: [
    "Banking Services",
    "Investment Banking",
    "Asset Management",
    "Wealth Management",
    "Insurance Services",
    "Retirement and Pension Planning",
    "Consumer Finance",
    "Mortgage Lending",
    "Credit Card Services",
    "Payment Processing Services",
    "Financial Advisory Services",
    "Foreign Exchange Services",
    "Fintech and Digital Finance",
    "Private Equity and Venture Capital",
  ],
  fmcg: [
    "Food and Beverages",
    "Personal Care and Beauty Products",
    "Household Cleaning Products",
    "Packaged Foods and Snacks",
    "Dairy Products",
    "Baked Goods",
    "Confectionery and Chocolates",
    "Beverages (Alcoholic and Non-Alcoholic)",
    "Tobacco Products",
    "Pet Foods and Pet Care Products",
    "Baby Products",
    "Health and Wellness Products",
    "Textiles and Apparel",
    "Consumer Electronics",
  ],
  hospitality: [
    "Hotels and Resorts",
    "Restaurants and Food Service",
    "Travel and Tourism",
    "Event Planning and Management",
    "Bars and Nightclubs",
    "Cruise Lines",
    "Casinos and Gaming",
    "Theme Parks and Attractions",
    "Vacation Rentals",
    "Spa and Wellness Centers",
    "Catering Services",
    "Conference and Convention Centers",
    "Leisure and Recreation Services",
    "Hospitality Technology and Services",
  ],
  media: [
    "Broadcasting (Television and Radio)",
    "Film and Movie Production",
    "Music Production and Distribution",
    "Publishing (Books, Magazines, Newspapers)",
    "Digital Media and Streaming Services",
    "Advertising and Marketing Services",
    "Social Media Platforms",
    "Video Games and Interactive Entertainment",
    "Animation and Special Effects",
    "Media Equipment and Technology",
    "Media Research and Analytics",
    "Event Promotion and Management",
    "Content Creation and Distribution",
    "Media Consulting and Management Services",
  ],
  retail: [
    "Apparel and Footwear Retail",
    "Grocery Stores and Supermarkets",
    "Department Stores",
    "Consumer Electronics Retail",
    "Home Improvement and Hardware Stores",
    "Furniture and Home Decor Stores",
    "Health and Beauty Stores",
    "Specialty Stores",
    "Sporting Goods Stores",
    "Auto Parts and Accessories Retail",
    "Jewelry and Luxury Goods Stores",
    "Online Retail and E-commerce",
    "Pet Stores and Pet Supplies",
    "Bookstores and Music Stores",
  ],
  climate: [
    "Renewable Energy",
    "Carbon Capture and Storage",
    "Climate Research and Consulting",
    "Sustainable Agriculture",
    "Environmental Nonprofits and NGOs",
    "Green Building and Sustainable Design",
    "Climate Finance and Investment",
    "Emissions Trading and Offset",
    "Climate Policy and Advocacy",
    "Environmental Education and Training",
    "Climate Technology and Innovation",
    "Sustainable Transportation",
    "Waste Management and Recycling",
    "Water Conservation and Management",
  ],
  vc: [
    "Early Stage Financing",
    "Seed Funding",
    "Series A Funding",
    "Series B Funding",
    "Series C Funding and Beyond",
    "Growth Equity",
    "Corporate Venture Capital",
    "Venture Debt",
    "Angel Investing",
    "Incubators and Accelerators",
    "Cross-Border Venture Capital",
    "Vertical-Specific Investing (e.g., Tech, Healthcare)",
    "Impact Investing",
    "Exit Strategies (e.g., Acquisitions, IPOs)",
  ],
  hub: [
    "Incubators",
    "Accelerators",
    "Co-working Spaces",
    "Competitions and Challenges",
    "Grant Programs",
    "Fellowship Programs",
    "Mentorship Programs",
    "Angel Networks",
    "Corporate Sponsorship Programs",
    "University-Linked Programs",
    "Government-Backed Initiatives",
    "Bootcamps and Workshops",
    "Crowdfunding Platforms",
  ],
  data: [
    "Data Analytics",
    "Data Management",
    "Data Integration",
    "Data Visualization",
    "Data Governance",
    "Data Security",
    "Data Engineering",
    "Data Science",
    "Data Monetization",
    "Data Privacy",
    "Data Infrastructure",
    "Data Quality",
    "Data Cataloging and Metadata Management",
    "Data Warehousing",
  ],
  agriculture: [
    "Agricultural Finance and Insurance",
    "Agricultural Real Estate",
    "Farm Management and Consulting",
    "Agricultural Equipment Manufacturing",
    "Agricultural Supply Retail",
    "Agricultural Marketing and Trading",
    "Food Processing and Packaging",
    "Agricultural Research and Development",
    "Agri-Tech (Agricultural Technology)",
    "Feed and Nutrition",
    "Crop Protection and Fertilizers",
  ],
};

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
    state.forEach((s) => {
      if (s.field === key) {
        return s.value;
      }
    });
  } else {
    return false;
  }
}

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
      state[7] = { ...state[10], value: action.value };
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
    { field: "tier", value: "" },
    { field: "website", value: "" },
  ];
  const [page, setPage] = useState(1);
  const [mobileFilterIsVisible, setMobileFilterIsVisible] = useState(false);
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
    <>
      <div
        onClick={() => setMobileFilterIsVisible(!mobileFilterIsVisible)}
        className={`cursor-pointer md:hidden text-2xl p-2 bg-white text-primary border-l-0 border-2 ${
          mobileFilterIsVisible ? "border-danger" : "border-primary"
        } sticky mt-5 top-2.5 z-[110] rounded-r-full flex justify-center items-center w-[44px] gap-2 active:scale-110`}
      >
        <span className="hidden">Filtres</span>
        <img
          className="w-[24px] text-primary"
          src={mobileFilterIsVisible ? xmarkSolid : filterSolid}
          alt=""
        />
      </div>
      {/* // <div className="mx-auto max-w-[1280px] bg-green-600 w-full min-h-[400px] grid grid-cols-[1fr_2fr_1fr] gap-x-5"> */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 right-0 bg-white w-[100vw] h-[100vh] z-[100] flex justify-center items-center ${
          mobileFilterIsVisible ? "" : "hidden"
        }`}
      >
        <div className="absolute min-h-[400px] max-h-[100vh] overflow-x-scroll flex justify-start flex-col items-center gap-5 border-[.5px] rounded-[12px] border-primary p-5 ">
          {/* {JSON.stringify(pageEq)} */}
          <Input
            label="Rechercher par nom"
            placeholder="Entrez le nom de l'organisation ."
            type="text"
            value={getPageEqValue("name", pageEq)}
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
            <option value="Central Africa">Central Africa</option>
            <option value="East Africa">East Africa</option>
            <option value="Southern Africa">Southern Africa</option>
          </CustumSelect>
          <CustumSelect
            label="Siège de l'organisation"
            placeholder="Choisissez un pays."
            // value={pageEq[3].value}
            value={getPageEqValue("headquarter", pageEq)}
            onChange={(e) => {
              dispatch({ field: "headquarter", value: e.target.value });
            }}
          >
            <option value="">Choisissez un pays</option>
            {/* <option value="All">All</option> */}
            {pageEq[2].value === "All"
              ? countries.all.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "North Africa"
              ? countries.north.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "West Africa"
              ? countries.west.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "Central Africa"
              ? countries.central.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "East Africa"
              ? countries.east.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "Southern Africa"
              ? countries.southern.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : null}
          </CustumSelect>
          <CustumSelect
            label="Pays couverts"
            placeholder="Choisissez un pays."
            // value={pageEq[3].value}
            value={getPageEqValue("operatingCountries", pageEq)}
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
            value={getPageEqValue("sector", pageEq)}
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
            label="Filtrer par sous secteur"
            placeholder="Choisissez un sous secteur."
            // value={pageEq[3].value}
            value={getPageEqValue("subSector", pageEq)}
            onChange={(e) => {
              dispatch({ field: "subSector", value: e.target.value });
            }}
          >
            <option value="">Choisissez un sous secteur</option>
            {getPageEqValue("sector", pageEq) === "Health"
              ? subSectors.health.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Education"
              ? subSectors.education.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Mobility"
              ? subSectors.mobility.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Logistic"
              ? subSectors.logistic.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Telecom"
              ? subSectors.telecom.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Energy"
              ? subSectors.energy.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Financial services"
              ? subSectors.financialServices.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "FMCG"
              ? subSectors.fmcg.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Hospitality"
              ? subSectors.hospitality.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "media"
              ? subSectors.media.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Retail"
              ? subSectors.retail.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Climat"
              ? subSectors.climate.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Data"
              ? subSectors.data.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "VC"
              ? subSectors.vc.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Hub"
              ? subSectors.hub.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : null}
          </CustumSelect>
          <CustumSelect
            label="Filtrer par tier"
            placeholder="Choisissez un tier."
            // value={pageEq[3].value}
            value={getPageEqValue("tier", pageEq)}
            onChange={(e) => {
              dispatch({ field: "tier", value: e.target.value });
            }}
          >
            <option value="">Choisissez un tier</option>
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
            disabled={isFetching || organisationsLengthIsFetching}
            onClick={() => {
              if (!(isFetching || organisationsLengthIsFetching)) {
                setPageEqS([...pageEq]);
                setTimeout(() => {
                  setMobileFilterIsVisible(false);
                }, 2000);
              }
            }}
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
                // { field: "active", value: "" },
                // { field: "fundraising", value: "" },
                // { field: "amountFundraised", value: "" },
                { field: "tier", value: "" },
                { field: "website", value: "" },
              ]);
              dispatch({ field: "reset", value: "" });
              setTimeout(() => {
                setMobileFilterIsVisible(false);
              }, 2000);
            }}
          >
            Réinitialiser les filtres
          </button>
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
      </div>
      <div className="mx-auto bg-transparent w-11/12 mt-10 text-darkGray lg:grid lg:grid-cols-[1fr_2fr_1fr] lg:gap-x-5 max-w-[1280px]">
        <div className="sticky top-2 min-h-[400px] max-h-[100vh] overflow-x-scroll hidden lg:flex lg:justify-start lg:flex-col lg:items-center lg:gap-5 lg:border-[.5px] rounded-[12px] lg:border-primary lg:p-5 ">
          {/* {JSON.stringify(pageEq)} */}
          <Input
            label="Rechercher par nom"
            placeholder="Entrez le nom de l'organisation ."
            type="text"
            value={getPageEqValue("name", pageEq)}
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
            <option value="Central Africa">Central Africa</option>
            <option value="East Africa">East Africa</option>
            <option value="Southern Africa">Southern Africa</option>
          </CustumSelect>
          <CustumSelect
            label="Siège de l'organisation"
            placeholder="Choisissez un pays."
            // value={pageEq[3].value}
            value={getPageEqValue("headquarter", pageEq)}
            onChange={(e) => {
              dispatch({ field: "headquarter", value: e.target.value });
            }}
          >
            <option value="">Choisissez un pays</option>
            {/* <option value="All">All</option> */}
            {pageEq[2].value === "All"
              ? countries.all.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "North Africa"
              ? countries.north.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "West Africa"
              ? countries.west.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "Central Africa"
              ? countries.central.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "East Africa"
              ? countries.east.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : pageEq[2].value === "Southern Africa"
              ? countries.southern.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : null}
          </CustumSelect>
          <CustumSelect
            label="Pays couverts"
            placeholder="Choisissez un pays."
            // value={pageEq[3].value}
            value={getPageEqValue("operatingCountries", pageEq)}
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
            value={getPageEqValue("sector", pageEq)}
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
            label="Filtrer par sous secteur"
            placeholder="Choisissez un sous secteur."
            // value={pageEq[3].value}
            value={getPageEqValue("subSector", pageEq)}
            onChange={(e) => {
              dispatch({ field: "subSector", value: e.target.value });
            }}
          >
            <option value="">Choisissez un sous secteur</option>
            {getPageEqValue("sector", pageEq) === "Health"
              ? subSectors.health.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Education"
              ? subSectors.education.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Mobility"
              ? subSectors.mobility.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Logistic"
              ? subSectors.logistic.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Telecom"
              ? subSectors.telecom.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Energy"
              ? subSectors.energy.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Financial services"
              ? subSectors.financialServices.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "FMCG"
              ? subSectors.fmcg.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Hospitality"
              ? subSectors.hospitality.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "media"
              ? subSectors.media.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Retail"
              ? subSectors.retail.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Climat"
              ? subSectors.climate.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Data"
              ? subSectors.data.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "VC"
              ? subSectors.vc.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : getPageEqValue("sector", pageEq) === "Hub"
              ? subSectors.hub.map((c) => {
                  return (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  );
                })
              : null}
          </CustumSelect>
          <CustumSelect
            label="Filtrer par tier"
            placeholder="Choisissez un tier."
            // value={pageEq[3].value}
            value={getPageEqValue("tier", pageEq)}
            onChange={(e) => {
              dispatch({ field: "tier", value: e.target.value });
            }}
          >
            <option value="">Choisissez un tier</option>
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
            onClick={() => {
              setPageEqS([...pageEq]);
            }}
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
                // { field: "active", value: "" },
                // { field: "fundraising", value: "" },
                // { field: "amountFundraised", value: "" },
                { field: "tier", value: "" },
                { field: "website", value: "" },
              ]);
              dispatch({ field: "reset", value: "" });
              setTimeout(() => {
                setMobileFilterIsVisible(false);
              }, 2000);
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
                        <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                          {/* {organisation.operatingCountries} */}
                          {organisation.operatingCountries.length > 20
                            ? organisation.operatingCountries.slice(0, 20) +
                              " . . ."
                            : organisation.operatingCountries}
                        </span>
                      </div>
                    ) : null}

                    {organisation.headquarter ? (
                      <div className="inline-flex justify-start items-center gap-x-2 rounded-full border-2 pe-3 text-mediumGray">
                        <div className="h-[35px] w-[35px] rounded-full border-2 scale-105 bg-transparent flex justify-center">
                          <img
                            src={headquarterSolid}
                            height={20}
                            width={18}
                            alt="Tier"
                          />
                        </div>
                        <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                          {/* {organisation.headquarter} */}
                          {organisation.headquarter.length > 20
                            ? organisation.headquarter.slice(0, 20) + " . . ."
                            : organisation.headquarter}
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
                        <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                          {/* {organisation.tier} */}
                          {organisation.tier.length > 20
                            ? organisation.tier.slice(0, 20) + " . . ."
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
                        <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                          {/* {organisation.sector} */}
                          {organisation.sector.length > 20
                            ? organisation.sector.slice(0, 20) + " . . ."
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
                        <span className="capitalize md:text-lg md:font-semibold text-nowrap">
                          {/* {organisation.subSector} */}
                          {organisation.subSector.length > 20
                            ? organisation.subSector.slice(0, 20) + " . . ."
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
        <div className="sticky top-2 min-h-[400px] max-h-[100vh] overflow-x-scroll hidden lg:flex lg:justify-start lg:flex-col lg:items-center lg:gap-5 lg:border-[.5px] rounded-[12px] lg:border-primary lg:p-5">
          {(getPageEqValue("name", pageEqS) ||
            getPageEqValue("source", pageEqS) ||
            getPageEqValue("region", pageEqS) ||
            getPageEqValue("headquarter", pageEqS) ||
            getPageEqValue("operatingCountries", pageEqS) ||
            getPageEqValue("sector", pageEqS) ||
            getPageEqValue("subSector", pageEqS) ||
            getPageEqValue("tier", pageEqS) ||
            getPageEqValue("website", pageEqS)) &&
          (getPageEqValue("name", pageEq) ||
            getPageEqValue("source", pageEq) ||
            pageEq[2].value ||
            getPageEqValue("headquarter", pageEq) ||
            getPageEqValue("operatingCountries", pageEq) ||
            getPageEqValue("sector", pageEq) ||
            getPageEqValue("subSector", pageEq) ||
            getPageEqValue("tier", pageEq) ||
            getPageEqValue("website", pageEq)) &&
          !isFetching ? (
            <div className="w-full">
              <div className="font-bold text-2xl mb-4">
                Résultats des filtres
              </div>
              <div className="font-semibold italic text-mediumGray">
                Nous avons trouvé{" "}
                <strong>
                  {organisationsLength.length} résultats (dont{" "}
                  {organisations.length} affichés)
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

export default Organisations;
