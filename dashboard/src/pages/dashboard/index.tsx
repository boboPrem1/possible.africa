import {
  useActiveAuthProvider,
  useApiUrl,
  useLink,
  useLogout,
  useRouterContext,
  useRouterType,
} from "@refinedev/core";
import { Card, Col, Row, Spin, Statistic, Button } from "antd";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../custom-data-provider/data-provider";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import CustomIconOrganisation from "../../custom-components/Icons/CustomIconOrganisation";
import CustomIconJob from "../../custom-components/Icons/CustomIconJob";
import CustomIconOpportunity from "../../custom-components/Icons/CustomIconOpportunity";
import CustomIconEvent from "../../custom-components/Icons/CustomIconEvent";
import CustomIconArticle from "../../custom-components/Icons/CustomIconArticle";
import { AdminOrContributorOrUser } from "../../custom-components/AccessControl";
import { useContextSelector } from "use-context-selector";
import { userContext } from "../../UserContext";
import ReactApexChart from "react-apexcharts";
import RadialBarChart from "../../custom-components/RadialBarChart";
import { ImageField } from "@refinedev/antd";
import loader from "../../assets/logos/loader.svg";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function CustomSpiner(props) {
  return <Spin {...props} indicator={antIcon} />;
}

const socialMedias = [
  "https://api.possible.africa/storage/logos/wwwlinkedincom.jpg",
  "https://api.possible.africa/storage/logos/linkedincom.jpg",
  "https://api.possible.africa/storage/logos/wwwtwittercom.jpg",
  "https://api.possible.africa/storage/logos/twittercom.jpg",
  "https://api.possible.africa/storage/logos/wwwfacebookcom.jpg",
  "https://api.possible.africa/storage/logos/facebookcom.jpg",
  "https://api.possible.africa/storage/logos/wwwinstagramcom.jpg",
  "https://api.possible.africa/storage/logos/instagramcom.jpg",
  "http://localhost:4534/storage/logos/wwwlinkedincom.jpg",
  "http://localhost:4534/storage/logos/linkedincom.jpg",
  "http://localhost:4534/storage/logos/wwwtwittercom.jpg",
  "http://localhost:4534/storage/logos/twittercom.jpg",
  "http://localhost:4534/storage/logos/wwwfacebookcom.jpg",
  "http://localhost:4534/storage/logos/facebookcom.jpg",
  "http://localhost:4534/storage/logos/wwwinstagramcom.jpg",
  "http://localhost:4534/storage/logos/instagramcom.jpg",
  "https://logo.clearbit.com/",
];
const logoPlaceholder =
  "https://api.possible.africa/storage/logos/placeholder_org.jpeg";

function rechercheInsensitive(chaineSource, chaineRecherchee) {
  // Créer une expression régulière avec l'indicateur "i" pour insensible à la casse
  const regex = new RegExp(chaineRecherchee, "i");
  return regex.test(chaineSource);
}

export default function CustomDashboard() {
  const apiUrl = useApiUrl();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [synchWithAirtable, setSynchWithAirTable] = useState(false);
  const [synchWithArticleAirtable, setSynchWithArticleAirTable] =
    useState(false);
  const [selectSectors, setSelectSectors] = useState([]);
  const [actualSectorSelected, setActualSectorSelected] = useState("fmcg");
  const routerType = useRouterType();
  const NewLink = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === "legacy" ? LegacyLink : NewLink;
  const [token, setToken] = useState<string>(
    localStorage.getItem("refine-auth")
  );

  const [organisationPeriode, setOrganisationsPeriode] = useState("week");
  const [postsPeriode, setPostsPeriode] = useState("week");
  const [seeAll, setSeeAll] = useState({
    sectors: false,
    subSectors: false,
    sectorsSelectValue: "unique",
    subSectorsSelectValue: "unique",
  });

  const authProvider = useActiveAuthProvider();
  const { mutate: mutateLogout } = useLogout({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const userD = useContextSelector(userContext, (v) => v[0].user);

  const organisationOptions = {
    chart: {
      height: 170,
      type: "radialBar",
    },
    series: [dashboardData?.organisations[organisationPeriode].evolution || 0],
    colors: ["#6cd9cb"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "70%",
        },
        // track: {
        //   dropShadow: {
        //     enabled: true,
        //     top: 0,
        //     left: 0,
        //     blur: 2,
        //     opacity: 0.1,
        //   },
        // },
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "13px",
          },
          value: {
            color: "#111",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    // fill: {
    //   type: "gradient",
    //   gradient: {
    //     shade: "dark",
    //     type: "vertical",
    //     gradientColors: ["#2bb19c"],
    //     stops: [0, 100],
    //   },
    // },
    stroke: {
      lineCap: "round",
    },
    labels: ["Organisations"],
  };

  const postsOptions = {
    chart: {
      height: 170,
      type: "radialBar",
    },
    series: [dashboardData?.posts[postsPeriode].evolution || 0],
    colors: ["#6cd9cb"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "70%",
        },
        // track: {
        //   dropShadow: {
        //     enabled: true,
        //     top: 0,
        //     left: 0,
        //     blur: 2,
        //     opacity: 0.1,
        //   },
        // },
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "13px",
          },
          value: {
            color: "#111",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    // fill: {
    //   type: "gradient",
    //   gradient: {
    //     shade: "dark",
    //     type: "vertical",
    //     gradientColors: ["#2bb19c"],
    //     stops: [0, 100],
    //   },
    // },
    stroke: {
      lineCap: "round",
    },
    labels: ["Articles"],
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    if (dashboardData?.records?.sectors) {
      setSelectSectors((s) => {
        return [...dashboardData?.records?.sectors];
      });
    }
    if (dashboardData === null) {
      setLoading(true);
      axiosInstance
        .get(`${apiUrl}/dashboard`)
        .then((res) => {
          setDashboardData(res.data);
          setLoading(false);
          // console.log(res);
          // console.log(dashboardData);
        })
        .catch((err) => {
          if (err?.response?.data?.message === "jwt expired") {
            mutateLogout();
          }
          console.log(err);
        });
    }
    // console.log(dashboardData);
  }, [dashboardData, dashboardData?.data?.organisations, loading]);

  // if (!Object.keys(userD).length) <div>Chargement ...</div>;

  // if (userD?.role?.slug === "contact") return null;

  if (dashboardData === null) {
    return (
      <div className="h-[400px] w-full m-auto flex justify-center items-center">
        <img
          src={loader}
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
  return (
    <div>
      <div className="grid grid-cols-12 2xl:grid-cols-12 gap-x-5">
        <div className="col-span-12 md:order-3 lg:col-span-6 2xl:col-span-3 rounded-lg shadow-lg p-3 card">
          <div className="card-body">
            <div className="grid grid-cols-12">
              <div className="col-span-7 md:col-span-7">
                <p className="text-slate-900 font-semibold">
                  Total Organisations
                </p>
                <h5 className="mt-3 mb-4">
                  <span
                    className="counter-value text-primary text-5xl"
                    data-target="615"
                  >
                    {dashboardData?.organisations?.all || 0}
                  </span>
                </h5>
                <button
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log(e);
                    setSynchWithAirTable(true);
                    axiosInstance
                      .get(`${apiUrl}/airtable_organisations`)
                      .then((res) => {
                        setSynchWithAirTable(false);
                        setLoading(true);
                        axiosInstance
                          .get(`${apiUrl}/dashboard`)
                          .then((res) => {
                            setDashboardData(res.data);
                            setLoading(false);
                          })
                          .catch((err) => {
                            if (
                              err?.response?.data?.message === "jwt expired"
                            ) {
                              mutateLogout();
                            }
                            console.log(err);
                          });
                      })
                      .catch((err) => {
                        if (err?.response?.data?.message === "jwt expired") {
                          mutateLogout();
                        }
                        console.log(err);
                      });
                  }}
                >
                  {synchWithAirtable ? "Synchronisation" : "Synchroniser"}

                  {synchWithAirtable ? (
                    <CustomSpiner
                      style={{ color: "white", marginLeft: "8px" }}
                    />
                  ) : null}
                </button>
              </div>
              <div className="col-span-5 md:col-span-5 text-slate-900 font-semibold">
                <RadialBarChart className="" options={organisationOptions} />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <p className="text-slate-900 font-semibold grow">
                <span className="font-semibold text-xl text-primary mr-2">
                  {dashboardData?.organisations[organisationPeriode].length ||
                    0}
                </span>
                Nouvelles Organisations
              </p>
              <p className="text-slate-500 dark:text-slate-200">
                <select
                  name="periode"
                  className="bg-transparent border border-primary px-2 py-1 rounded-md text-slate-900 font-semibold"
                  id=""
                  value={organisationPeriode}
                  onChange={(e) => setOrganisationsPeriode(e.target.value)}
                >
                  <option value="year">Cette Année</option>
                  <option value="month">Cet Mois</option>
                  <option value="week">Cette Semaine</option>
                  <option value="day">Aujourd'hui</option>
                </select>
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:order-3 lg:col-span-6 2xl:col-span-3 rounded-lg shadow-lg p-3 card">
          <div className="card-body">
            <div className="grid grid-cols-12">
              <div className="col-span-7 md:col-span-7">
                <p className="text-slate-900 font-semibold">Total Articles</p>
                <h5 className="mt-3 mb-4">
                  <span
                    className="counter-value text-primary text-5xl"
                    data-target="615"
                  >
                    {dashboardData?.posts?.all || 0}
                  </span>
                </h5>
                <button
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log(e);
                    setSynchWithArticleAirTable(true);
                    axiosInstance
                      .get(`${apiUrl}/airtable_posts/all`)
                      .then((res) => {
                        setSynchWithArticleAirTable(false);
                        setLoading(true);
                        axiosInstance
                          .get(`${apiUrl}/dashboard`)
                          .then((res) => {
                            setDashboardData(res.data);
                            setLoading(false);
                          })
                          .catch((err) => {
                            if (
                              err?.response?.data?.message === "jwt expired"
                            ) {
                              mutateLogout();
                            }
                            console.log(err);
                          });
                      })
                      .catch((err) => {
                        if (err?.response?.data?.message === "jwt expired") {
                          mutateLogout();
                        }
                        console.log(err);
                      });
                  }}
                >
                  {synchWithArticleAirtable
                    ? "Synchronisation"
                    : "Synchroniser"}
                  {synchWithArticleAirtable ? (
                    <CustomSpiner
                      style={{ color: "white", marginLeft: "8px" }}
                    />
                  ) : null}
                </button>
              </div>
              <div className="col-span-5 md:col-span-5 text-slate-900 font-semibold">
                <RadialBarChart className="" options={postsOptions} />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 text-slate-900 font-semibold">
              <p className="grow">
                <span className="font-semibold text-xl text-primary">
                  {dashboardData?.posts[postsPeriode].length || 0}
                </span>{" "}
                Nouveaux Articles
              </p>
              <p className="">
                <select
                  name="periode"
                  className="bg-transparent border border-primary px-2 py-1 rounded-md"
                  id=""
                  value={postsPeriode}
                  onChange={(e) => setPostsPeriode(e.target.value)}
                >
                  <option value="year">Cette Année</option>
                  <option value="month">Cet Mois</option>
                  <option value="week">Cette Semaine</option>
                  <option value="day">Aujourd'hui</option>
                </select>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full card p-5 no-scroll">
        <div className="w-full font-semibold text-lg mb-3 flex justify-between">
          <span className="w-full">Les organisations par secteurs</span>
          <select
            value={seeAll.sectorsSelectValue}
            onChange={(e) =>
              setSeeAll((s) => {
                return { ...s, sectorsSelectValue: e.target.value };
              })
            }
            className="inline-block w-full md:w-2/12 p-2 rounded-lg bg-transparent border-light-gray/50 border-2 my-2"
          >
            <option value="unique">Secteur Unique</option>
            <option value="group">Group de secteurs</option>
          </select>
        </div>
        <div className="grid grid-cols-5 items-center justify-center">
          {seeAll.sectorsSelectValue === "unique"
            ? dashboardData?.OrganisationsBySectors?.map((sector) => {
                const tryToGetActualSector = sector._id.split(",");
                let actualSector;
                let actualSectorLength = sector.nb;
                if (tryToGetActualSector.length === 1) {
                  actualSector = tryToGetActualSector;
                  // console.log(actualSector)
                  dashboardData?.OrganisationsBySectors?.map((el) => {
                    if (
                      el._id.split(",").includes(actualSector[0]) &&
                      el._id.split(",").length > 1
                    ) {
                      // console.log(
                      //   el._id.split(","),
                      //   el._id.split(",").includes(actualSector[0])
                      // );
                      actualSectorLength = actualSectorLength + el.nb;
                      // console.log(actualSectorLength);
                    }
                  });
                  return (
                    <div
                      key={actualSector}
                      // className="card min-w-[80%] md:min-w-[250px] md:w-4/12 lg:min-w-[24%] lg:w-3/12 xl:w-2/12"
                      className="card w-[250px]"
                    >
                      <div className="text-center card-body">
                        <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                          <i data-lucide="wallet-2"></i>
                        </div>
                        <h5 className="mt-4 mb-2">
                          <span className="counter-value" data-target="236.18">
                            {actualSectorLength}
                          </span>
                        </h5>
                        <p className="text-slate-500 dark:text-zink-200 capitalize">
                          {actualSector}
                        </p>
                      </div>
                    </div>
                  );
                }
              })
            : dashboardData?.OrganisationsBySectors?.map((sector) => {
                if (sector._id.split(",").length > 1) {
                  return (
                    <div key={sector._id} className="card w-[250px]">
                      <div className="text-center card-body">
                        <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                          <i data-lucide="wallet-2"></i>
                        </div>
                        <h5 className="mt-4 mb-2">
                          <span className="counter-value" data-target="236.18">
                            {sector.nb}
                          </span>
                        </h5>
                        <p className="text-slate-500 dark:text-zink-200 capitalize overflow-scroll">
                          {sector._id}
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
        </div>
      </div>
      <div className="w-full card p-5 no-scroll">
        <div className="min-w-full font-semibold text-lg mb-3 lg:flex lg:justify-between lg: gap-5git ">
          <span className="w-full">Les organisations par sous-secteurs</span>
          <select
            name=""
            id=""
            value={actualSectorSelected}
            onChange={(e) => {
              setActualSectorSelected(e.target.value);
            }}
            className="w-full p-2 rounded-lg bg-transparent border-light-gray/50 border-2 my-2"
          >
            {/* <option value="">Un</option> */}
            {selectSectors?.map((sector) => {
              return <option value={sector ? sector : ""}>{sector}</option>;
            })}
          </select>
          <select
            value={seeAll.subSectorsSelectValue}
            onChange={(e) =>
              setSeeAll((s) => {
                return { ...s, subSectorsSelectValue: e.target.value };
              })
            }
            className="w-full p-2 rounded-lg bg-transparent border-light-gray/50 border-2 my-2"
          >
            <option value="unique">Sous Secteur Unique</option>
            <option value="group">Group de sous secteurs</option>
          </select>
        </div>
        <div className="grid grid-cols-5 items-center justify-center max">
          {/* {console.log(actualSectorSelected.toLowerCase())} */}
          {seeAll.subSectorsSelectValue === "unique"
            ? dashboardData?.records?.subSectors[
                actualSectorSelected.toLowerCase()
              ].map((subSector) => {
                return (
                  <div key={subSector} className="card w-[250px]">
                    <div className="text-center card-body">
                      <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                        <i data-lucide="wallet-2"></i>
                      </div>
                      <h5 className="mt-4 mb-2">
                        <span className="counter-value" data-target="236.18">
                          {/* {subSector} */}
                          {(function alo() {
                            let length = 0;
                            dashboardData?.OrganisationsBySubSectors?.map(
                              (sub) => {
                                const actSubSector = sub._id.split(",");
                                if (actSubSector.includes(subSector))
                                  length = length + sub.nb;
                                // console.log(actSubSector, subSector);
                              }
                            );

                            return `${length}`;
                          })()}
                        </span>
                      </h5>
                      <p className="text-slate-500 dark:text-zink-200 capitalize">
                        {subSector}
                      </p>
                    </div>
                  </div>
                );
              })
            : dashboardData?.records?.subSectors[
                actualSectorSelected.toLowerCase()
              ].map((subSector) => {
                let length = 0;
                return dashboardData?.OrganisationsBySubSectors?.map((sub) => {
                  const actSubSector = sub._id.split(",");
                  if (
                    actSubSector.includes(subSector) &&
                    actSubSector.length > 1
                  ) {
                    return (
                      <div key={sub._id} className="card w-[250px]">
                        <div className="text-center card-body">
                          <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                            <i data-lucide="wallet-2"></i>
                          </div>
                          <h5 className="mt-4 mb-2">
                            <span
                              className="counter-value"
                              data-target="236.18"
                            >
                              {sub.nb}
                            </span>
                          </h5>
                          <p className="text-slate-500 dark:text-zink-200 capitalize">
                            {sub._id}
                          </p>
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                  // console.log(actSubSector, subSector);
                });
              })}
          {/* {dashboardData?.records?.subSectors[
            `${actualSectorSelected.toLowerCase()}`
          ].map((subSector) => {
            return (
              <div
                key={subSector}
                className="card min-w-[80%] md:min-w-[250px] md:w-4/12 lg:min-w-[24%] lg:w-3/12 xl:w-2/12"
              >
                <div className="text-center card-body">
                  <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                    <i data-lucide="wallet-2"></i>
                  </div>
                  <h5 className="mt-4 mb-2">
                    <span className="counter-value" data-target="236.18">
                      {subSector}
                    </span>
                  </h5>
                  <p className="text-slate-500 dark:text-zink-200 capitalize">
                    Secteur {subSector}
                  </p>
                </div>
              </div>
            );
          })} */}
        </div>
      </div>
      <div className="col-span-12 md:order-8 2xl:col-span-9 card mt-10">
        <div className="card-body">
          <div className="grid items-center grid-cols-1 gap-3 mb-5 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <h6 className="text-xl font-semibold">
                Les dernières organisations
              </h6>
            </div>
            {/* <div className="xl:col-span-4 xl:col-start-10">
              <div className="flex gap-3">
                <div className="relative grow">
                  <input
                    type="text"
                    className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Search for ..."
                  />
                  <i
                    data-lucide="search"
                    className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600"
                  ></i>
                </div>
                <button
                  type="button"
                  className="bg-white border-dashed shrink-0 text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"
                >
                  <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-download-2-line"></i>{" "}
                  Export
                </button>
              </div>
            </div> */}
          </div>
          <div className="-mx-5 overflow-x-auto">
            {dashboardData?.organisations?.last.length ? (
              <table className="w-full whitespace-nowrap">
                <thead className="ltr:text-left rtl:text-right bg-primary/5 text-primary dark:text-zink-200 dark:bg-zink-600">
                  <tr>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Logo
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Nom/Source
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Description
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Secteur
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Siège
                    </th>
                    {/* <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500">
                    Action
                  </th> */}
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.organisations?.last?.map((organisation) => {
                    return (
                      <tr key={organisation?._id}>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          <ImageField
                            style={{ maxWidth: "50px" }}
                            value={
                              socialMedias.includes(organisation?.logo) ||
                              !organisation?.logo?.length
                                ? logoPlaceholder
                                : organisation?.logo
                            }
                          />
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          <div className="flex gap-2">
                            <div className="grow">
                              <h6>
                                {organisation?.name?.length > 30
                                  ? organisation?.name?.slice(0, 30) + "..."
                                  : organisation?.name}
                              </h6>
                              <p className="text-primary dark:text-zink-200">
                                {organisation?.source?.length > 30
                                  ? organisation?.source?.slice(0, 30) + "..."
                                  : organisation?.source}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          {organisation?.description?.length > 30
                            ? organisation?.description?.slice(0, 30) + "..."
                            : organisation?.description}
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500 text-green-500">
                          {organisation?.sector?.length > 30
                            ? organisation?.sector?.slice(0, 30) + "..."
                            : organisation?.sector}
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">
                            {organisation?.headquarter?.length > 30
                              ? organisation?.headquarter?.slice(0, 30) + "..."
                              : organisation?.headquarter}
                          </span>
                        </td>
                        {/* <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                    <div className="flex gap-2">
                      <a
                        href="#!"
                        className="flex items-center justify-center transition-all duration-200 ease-linear rounded-md size-8 bg-primary/10 dark:bg-zink-600 dark:text-zink-200 text-primary/50 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-100 dark:hover:bg-custom-500/20"
                      >
                        <i data-lucide="pencil" className="size-4"></i>
                      </a>
                      <a
                        href="#!"
                        className="flex items-center justify-center transition-all duration-200 ease-linear rounded-md size-8 bg-primary/10 dark:bg-zink-600 dark:text-zink-200 text-primary/50 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20"
                      >
                        <i data-lucide="trash-2" className="size-4"></i>
                      </a>
                    </div>
                  </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="px-5">Chargement ...</p>
            )}
          </div>
          <div className="flex flex-col items-center mt-5 md:flex-row">
            <div className="mb-4 grow md:mb-0"></div>
            <ul className="flex flex-wrap items-center gap-2 shrink-0">
              <li>
                <a
                  href="/organisations"
                  className="inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-primary dark:border-zink-500 text-primary dark:text-zink-200 hover:text-dark-primary dark:hover:text-custom-500 hover:bg-primary/5 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-500 dark:[&.active]:text-custom-500 [&.active]:bg-custom-50 dark:[&.active]:bg-custom-500/10 [&.active]:border-custom-50 dark:[&.active]:border-custom-500/10 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 [&.disabled]:text-primary/40 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
                >
                  Voir toutes les organisations
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:order-8 2xl:col-span-9 card mt-10">
        <div className="card-body">
          <div className="grid items-center grid-cols-1 gap-3 mb-5 xl:grid-cols-12">
            <div className="xl:col-span-5">
              <h6 className="text-xl font-semibold">Les dernières articles</h6>
            </div>
            {/* <div className="xl:col-span-4 xl:col-start-10">
              <div className="flex gap-3">
                <div className="relative grow">
                  <input
                    type="text"
                    className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Search for ..."
                  />
                  <i
                    data-lucide="search"
                    className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600"
                  ></i>
                </div>
                <button
                  type="button"
                  className="bg-white border-dashed shrink-0 text-custom-500 btn border-custom-500 hover:text-custom-500 hover:bg-custom-50 hover:border-custom-600 focus:text-custom-600 focus:bg-custom-50 focus:border-custom-600 active:text-custom-600 active:bg-custom-50 active:border-custom-600 dark:bg-zink-700 dark:ring-custom-400/20 dark:hover:bg-custom-800/20 dark:focus:bg-custom-800/20 dark:active:bg-custom-800/20"
                >
                  <i className="align-baseline ltr:pr-1 rtl:pl-1 ri-download-2-line"></i>{" "}
                  Export
                </button>
              </div>
            </div> */}
          </div>
          <div className="-mx-5 overflow-x-auto">
            {dashboardData?.posts?.last?.length ? (
              <table className="w-full whitespace-nowrap">
                <thead className="ltr:text-left rtl:text-right bg-primary/5 text-primary dark:text-zink-200 dark:bg-zink-600">
                  <tr>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Titre
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Etiquettes
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Média
                    </th>
                    <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500 text-left">
                      Langue de publication
                    </th>
                    {/* <th className="px-3.5 py-2.5 first:pl-5 last:pr-5 font-semibold border-y border-primary/20 dark:border-zink-500">
                    Action
                  </th> */}
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.posts?.last?.map((post) => {
                    return (
                      <tr key={post?._id}>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          <div className="flex gap-2">
                            <div className="grow">
                              <h6>
                                {post?.title?.length > 30
                                  ? post?.title?.slice(0, 30) + "..."
                                  : post?.title}
                              </h6>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          {post?.airTags?.length > 30
                            ? post?.airTags?.slice(0, 30) + "..."
                            : post?.airTags}
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500 text-green-500">
                          {post?.airMedia?.length > 30
                            ? post?.airMedia?.slice(0, 30) + "..."
                            : post?.airMedia}
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">
                            {post?.airLanguage === "FR"
                              ? "Français"
                              : "Anglais"}
                          </span>
                        </td>
                        {/* <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                    <div className="flex gap-2">
                      <a
                        href="#!"
                        className="flex items-center justify-center transition-all duration-200 ease-linear rounded-md size-8 bg-primary/10 dark:bg-zink-600 dark:text-zink-200 text-primary/50 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-100 dark:hover:bg-custom-500/20"
                      >
                        <i data-lucide="pencil" className="size-4"></i>
                      </a>
                      <a
                        href="#!"
                        className="flex items-center justify-center transition-all duration-200 ease-linear rounded-md size-8 bg-primary/10 dark:bg-zink-600 dark:text-zink-200 text-primary/50 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20"
                      >
                        <i data-lucide="trash-2" className="size-4"></i>
                      </a>
                    </div>
                  </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="px-5">Chargement ...</p>
            )}
          </div>
          <div className="flex flex-col items-center mt-5 md:flex-row">
            <div className="mb-4 grow md:mb-0"></div>
            <ul className="flex flex-wrap items-center gap-2 shrink-0">
              <li>
                <a
                  href="/posts"
                  className="inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-primary dark:border-zink-500 text-primary dark:text-zink-200 hover:text-dark-primary dark:hover:text-custom-500 hover:bg-primary/5 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-500 dark:[&.active]:text-custom-500 [&.active]:bg-custom-50 dark:[&.active]:bg-custom-500/10 [&.active]:border-custom-50 dark:[&.active]:border-custom-500/10 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 [&.disabled]:text-primary/40 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto"
                >
                  Voir tous les articles
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
