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

export default function CustomDashboard() {
  const apiUrl = useApiUrl();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [synchWithAirtable, setSynchWithAirTable] = useState(false);
  const [synchWithArticleAirtable, setSynchWithArticleAirTable] =
    useState(false);

  const routerType = useRouterType();
  const NewLink = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const Link = routerType === "legacy" ? LegacyLink : NewLink;
  const [token, setToken] = useState<string>(
    localStorage.getItem("refine-auth")
  );

  const [organisationPeriode, setOrganisationsPeriode] = useState("week");
  const [postsPeriode, setPostsPeriode] = useState("week");

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
        track: {
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 2,
            opacity: 0.1,
          },
        },
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
        track: {
          dropShadow: {
            enabled: true,
            top: 0,
            left: 0,
            blur: 2,
            opacity: 0.1,
          },
        },
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
    if (dashboardData === null) {
      setLoading(true);
      axiosInstance
        .get(`${apiUrl}/dashboard`)
        .then((res) => {
          setDashboardData(res.data);
          setLoading(false);
          console.log(res);
          // console.log(dashboardData);
        })
        .catch((err) => {
          if (err?.response?.data?.message === "jwt expired") {
            mutateLogout();
          }
          console.log(err);
        });
    }
    // console.log(userD);
  }, [dashboardData, dashboardData?.data?.organisations, loading]);

  // if (!Object.keys(userD).length) <div>Chargement ...</div>;

  // if (userD?.role?.slug === "contact") return null;

  return (
    <div>
      {/* <Row gutter={[16, 16]}>
        <Col span={6}>
          <Link to="organisations">
            <Card>
              {loading ? (
                <CustomSpiner />
              ) : (
                <>
                  <Statistic
                    style={{ color: "red" }}
                    title={
                      <h3>
                        <CustomIconOrganisation />
                        Total Organisations
                      </h3>
                    }
                    value={dashboardData?.organisations}
                  />
                  <div
                    style={{
                      display: "flex",
                      marginTop: "1rem",
                    }}
                  >
                    <button className="btn-primary"
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
                            if (
                              err?.response?.data?.message === "jwt expired"
                            ) {
                              mutateLogout();
                            }
                            console.log(err);
                          });
                      }}
                      
                    >
                      Synchroniser avec Airtable{" "}
                      {synchWithAirtable ? (
                        <CustomSpiner
                          style={{ color: "white", marginLeft: "8px" }}
                        />
                      ) : null}
                    </button>
                  </div>
                </>
              )}
            </Card>
          </Link>
        </Col>
        <Col span={6}>
          <Link to="jobs">
            <Card>
              {loading ? (
                <CustomSpiner />
              ) : (
                <Statistic
                  title={
                    <h3>
                      <CustomIconJob />
                      Total Emplois
                    </h3>
                  }
                  value={dashboardData?.jobs}
                />
              )}
            </Card>
          </Link>
        </Col>
        <Col span={6}>
          <Link to="opportunities">
            <Card>
              {loading ? (
                <CustomSpiner />
              ) : (
                <Statistic
                  title={
                    <h3>
                      <CustomIconOpportunity />
                      Total Opportunités
                    </h3>
                  }
                  value={dashboardData?.opportunities}
                />
              )}
            </Card>
          </Link>
        </Col>
        <Col span={6}>
          <Link to="events">
            <Card>
              {loading ? (
                <CustomSpiner />
              ) : (
                <Statistic
                  title={
                    <h3>
                      <CustomIconEvent />
                      Total Evènements
                    </h3>
                  }
                  value={dashboardData?.events}
                />
              )}
            </Card>
          </Link>
        </Col>
        <Col span={6}>
          <Link to="posts">
            <Card>
              {loading ? (
                <CustomSpiner />
              ) : (
                <>
                  <Statistic
                    title={
                      <h3>
                        <CustomIconArticle />
                        Total Articles
                      </h3>
                    }
                    value={dashboardData?.posts}
                  />

                  <div
                    style={{
                      display: "flex",
                      marginTop: "1rem",
                    }}
                  >
                    <button className="btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log(e);
                            setSynchWithArticleAirTable(false);
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
                            if (
                              err?.response?.data?.message === "jwt expired"
                            ) {
                              mutateLogout();
                            }
                            console.log(err);
                          });
                      }}
                      
                    >
                      Synchroniser avec Airtable{" "}
                      {synchWithArticleAirtable ? (
                        <CustomSpiner
                          style={{ color: "white", marginLeft: "8px" }}
                        />
                      ) : null}
                    </button>
                  </div>
                </>
              )}
            </Card>
          </Link>
        </Col>
        <AdminOrContributorOrUser>
          <Col span={6}>
            <Link to="users">
              <Card>
                {loading ? (
                  <CustomSpiner />
                ) : (
                  <Statistic
                    title={
                      <h3>
                        <UserOutlined
                          style={{
                            display: "inline-block",
                            marginRight: "8px",
                          }}
                        />
                        Total Utilisateurs
                      </h3>
                    }
                    value={dashboardData?.users}
                  />
                )}
              </Card>
            </Link>
          </Col>
        </AdminOrContributorOrUser>
      </Row> */}
      {/* Add more cards and statistics as needed */}
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
                      <tr>
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
                                {organisation?.airSource?.length > 30
                                  ? organisation?.airSource?.slice(0, 30) +
                                    "..."
                                  : organisation?.airSource}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          {organisation?.airDescription?.length > 30
                            ? organisation?.airDescription?.slice(0, 30) + "..."
                            : organisation?.airDescription}
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500 text-green-500">
                          {organisation?.airSector?.length > 30
                            ? organisation?.airSector?.slice(0, 30) + "..."
                            : organisation?.airSector}
                        </td>
                        <td className="px-3.5 py-2.5 first:pl-5 last:pr-5 border-y border-primary/20 dark:border-zink-500">
                          <span className="px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">
                            {organisation?.airHeadquarter?.length > 30
                              ? organisation?.airHeadquarter?.slice(0, 30) +
                                "..."
                              : organisation?.airHeadquarter}
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
                      <tr>
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
