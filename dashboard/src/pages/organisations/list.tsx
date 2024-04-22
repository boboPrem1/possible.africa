import React, { useEffect, useRef, useState } from "react";
import {
  BaseRecord,
  CrudFilters,
  HttpError,
  IResourceComponentsProps,
  useApiUrl,
  useInvalidate,
  useMany,
} from "@refinedev/core";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  EmailField,
  ImageField,
  List,
  TagField,
  useTable,
} from "@refinedev/antd";
import {
  Button,
  Checkbox,
  Input,
  message,
  Form,
  Row,
  Col,
  DatePicker,
  Modal,
  Space,
  Table,
} from "antd";
import papa from "papaparse";
import { axiosInstance } from "../../custom-data-provider/data-provider";
import Link from "antd/es/typography/Link";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { imageUploadHandler } from "../posts/create";
import { ShowButton } from "../../components/buttons/show";
import {
  Admin,
  AdminOrContributor,
} from "../../custom-components/AccessControl";
import { Dayjs } from "dayjs";
import { current } from "@reduxjs/toolkit";

const { RangePicker } = DatePicker;
const ENV = import.meta.env.VITE_NODE_ENV;
const API_URL =
  ENV === "developement"
    ? import.meta.env.VITE_BACKEND_DEV
    : import.meta.env.VITE_BACKEND_PROD;

interface IOrganisation {
  name: string;
  logo: string;
  couverture: string;
  types: any;
  contributeur: any;
  country: any;
  covered_countries: any;
  slug: any;
  description: any;
  email: any;
  telephone: {
    indicatif: string;
    number: string;
  };
  site_web: string;
  linkedin_url: string;
  facebook_url: string;
  twitter_url: string;
  adresse: string;
  activity_areas: any;
  contacts: any;
  creation_year: any;
  createdAt: string;
}

export async function downloadMedia(mediaUrl) {
  try {
    const response = await axiosInstance.post(
      API_URL + "/organisations/getBuff",
      { url: mediaUrl },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const OrganisationList: React.FC<IResourceComponentsProps> = () => {
  const [importLoading, setImportLoading] = useState(false);
  // const [pageSize, setPageSize] = useState(10);
  const [importationDatas, setImportationDatas] = useState({
    total: 0,
    action: "Initialisation de l'import ...",
  });
  const fileImportInput = useRef(null);
  const {
    tableProps,
    searchFormProps,
    setPageSize,
    pageSize,
    tableQueryResult: { refetch },
  } = useTable<
    IOrganisation,
    HttpError,
    { name: string; createdAt: [Dayjs, Dayjs] }
  >({
    syncWithLocation: true,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { name, createdAt } = params;

      filters.push(
        {
          field: "name",
          operator: "eq",
          value: name,
        },
        {
          field: "createdAt",
          operator: "gte",
          value: createdAt ? createdAt[0].toISOString() : undefined,
        },
        {
          field: "createdAt",
          operator: "lte",
          value: createdAt ? createdAt[1].toISOString() : undefined,
        }
      );

      return filters;
    },
    pagination: {
      pageSize: 10,
    },
  });
  const apiUrl = useApiUrl();
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
    "https://logo.clearbit.com/","https://api.possible.africa/storage/logos/wwwredditcom.jpg"
  ];
  const logoPlaceholder =
    "https://api.possible.africa/storage/logos/placeholder_org.jpeg";
  const [checkedArray, setCheckedArray] = useState([]);
  const [allCheckedOnPage, setAllCheckedOnPage] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [pageCheckboxes, setPageCheckboxes] = useState([]);
  const [visibleCheckAll, setVisibleCheckAll] = useState(false);
  const invalidate = useInvalidate();
  let checkboxRefs = useRef([]);

  // const { data: coveredCountriesData, isLoading: coveredCountriesIsLoading } =
  //   useMany({
  //     resource: "countries",
  //     ids: tableProps?.dataSource?.map((item) => item?.covered_countries) ?? [],
  //   });

  // const { data: organisationTypesData, isLoading: organisationTypesIsLoading } =
  //   useMany({
  //     resource: "organisation_types",
  //     ids: tableProps?.dataSource?.map((item) => item?.types) ?? [],
  //   });
  // const { data: contactsData, isLoading: contactsIsLoading } = useMany({
  //   resource: "users",
  //   ids: tableProps?.dataSource?.map((item) => item?.contacts) ?? [],
  // });
  // const { data: activityAreasData, isLoading: activityAreasIsLoading } =
  //   useMany({
  //     resource: "activity_areas",
  //     ids: tableProps?.dataSource?.map((item) => item?.activity_areas) ?? [],
  //   });

  async function handleImport(e: any) {
    const file = e.target.files[0];
    let headers: any[] = [];
    let body: any[] = [];
    setImportLoading(true);
    papa.parse(file, {
      complete: async function (results) {
        setImportationDatas((s) => {
          return {
            ...s,
            total: results.data.length - 1,
            action: "Test d'existence...",
          };
        });
        results.data.map(async (el: any, i) => {
          if (i === 0) {
            headers.push(...el);
          } else {
            let organisationType = null;
            let imageUrl = null;
            let urlDomain = "";
            if (el[0]) {
              const organisationName = await axiosInstance.get(
                apiUrl + `/organisations?name=${el[0]}`,
                {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              );
              const organisationSiteWeb = await axiosInstance.get(
                apiUrl + `/organisations?site_web=${el[10]}`,
                {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              );

              if (
                !organisationName?.data?.length &&
                !organisationSiteWeb?.data?.length
              ) {
                if (el[10]) {
                  const regex = /https?:\/\/([^/]+)\//;
                  const match = el[10].match(regex);

                  if (match) {
                    urlDomain = match[1];
                    // console.log(domain);

                    if (
                      !urlDomain.includes("linkedin") &&
                      !urlDomain.includes("google") &&
                      !urlDomain.includes("facebook") &&
                      !urlDomain.includes("fb")
                    ) {
                      const blobImage = await downloadMedia(
                        "https://logo.clearbit.com/" + urlDomain
                      );
                      imageUrl = await imageUploadHandler(
                        blobImage.data.dataUrl
                      );
                    }
                  }
                }

                // try to get the organisation type
                setImportationDatas((s) => {
                  return {
                    ...s,
                    action: "Recherche des types de l'organisation...",
                  };
                });
                let organisationTypes = [];
                organisationTypes = el[4].split(";").map(async (item) => {
                  setImportationDatas((s) => {
                    return {
                      ...s,
                      action: "Recherche des types d'organisations ...",
                    };
                  });
                  const result = await axiosInstance.get(
                    apiUrl + `/organisation_types?name=${item}`,
                    {
                      headers: {
                        "Access-Control-Allow-Origin": "*",
                      },
                    }
                  );
                  // console.log(result, "activity area");
                  if (!result?.data?.length) {
                    // create the activity area
                    setImportationDatas((s) => {
                      return {
                        ...s,
                        action:
                          "types d'organisations non trouvés, Création en cours...",
                      };
                    });
                    const result = await axiosInstance.post(
                      apiUrl + "/organisation_types",
                      {
                        name: item,
                      },
                      {
                        headers: {
                          "Access-Control-Allow-Origin": "*",
                        },
                      }
                    );
                    return result?.data?.id;
                  } else {
                    return result?.data[0]?.id;
                  }
                });

                let coveredCountriesArray = [];

                const coveredCountries = el[3].split(";");
                // console.log(countriesToBeImported, "To be imported");
                setImportationDatas((s) => {
                  return {
                    ...s,
                    action: "Recherche et ajout des pays couverts...",
                  };
                });
                coveredCountriesArray = await coveredCountries.map(
                  async (item: any) => {
                    const result = await axiosInstance.get(
                      apiUrl + `/countries?translations.fra.common=${item}`,
                      {
                        headers: {
                          "Access-Control-Allow-Origin": "*",
                        },
                      }
                    );
                    return result?.data[0]?.id;
                    // return result?.data[0].id;
                  }
                );

                setImportationDatas((s) => {
                  return {
                    ...s,
                    action: "Recherche et ajout du pays d'origine...",
                  };
                });
                const origineCountry = await axiosInstance
                  .get(apiUrl + `/countries?translations.fra.common=${el[1]}`)
                  .then((result) => {
                    // console.log(result);
                    return result?.data[0]?.id;
                  });

                let contacts = [];
                // try to get the contacts
                if (el[5]) {
                  contacts = el[5].split(";").map(async (item) => {
                    setImportationDatas((s) => {
                      return {
                        ...s,
                        action: "Recherche des contacts associés ...",
                      };
                    });
                    const result = await axiosInstance.get(
                      apiUrl + `/users?email=${item}`,
                      {
                        headers: {
                          "Access-Control-Allow-Origin": "*",
                        },
                      }
                    );
                    // console.log(result, "contacts");
                    if (!result?.data?.length) {
                      // create the contact
                      setImportationDatas((s) => {
                        return {
                          ...s,
                          action: "Contacts non trouvés, Creation en cours...",
                        };
                      });
                      const result = await axiosInstance.post(
                        apiUrl + "/users",
                        {
                          email: item,
                          firstname: item.split("@")[0],
                          role: "contact",
                        },
                        {
                          headers: {
                            "Access-Control-Allow-Origin": "*",
                          },
                        }
                      );
                      return result?.data?.id;
                    } else {
                      return result?.data[0]?.id;
                    }
                  });
                }

                let description = "";

                const page = await axiosInstance
                  .get(
                    apiUrl +
                      `/organisations/getMetaDesc?url=${"https://" + urlDomain}`
                  )
                  .then((html) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html?.data, "text/html");
                    const metaDescription = doc.querySelector(
                      'meta[name="description"]'
                    );
                    if (metaDescription) {
                      description = metaDescription.getAttribute("content");
                    } else {
                      description = "";
                    }
                  });

                Promise.all(organisationTypes).then((values) => {
                  organisationTypes = values;
                  Promise.all(coveredCountriesArray).then((values) => {
                    coveredCountriesArray = values;
                    Promise.all(contacts).then((values) => {
                      contacts = values;

                      const ob: any = {
                        name: el[0],
                        country: origineCountry,
                        description: description,
                        site_web: el[10],
                        linkedin_url: el[11],
                        facebook_url: el[12],
                        twitter_url: el[13],
                        adresse: el[14],
                        types: organisationTypes,
                        logo: imageUrl ? imageUrl : "",
                        contacts: contacts,
                        covered_countries: coveredCountriesArray,
                        // type: el[7] === "Entreprise" ? "64511bd16054c5412224616b" : "",
                      };
                      setImportationDatas((s) => {
                        return {
                          ...s,
                          action: `Combinaison, Création de l'organisation 0${i} en cours ...`,
                        };
                      });
                      body.push({ ...ob });
                      axiosInstance
                        .post(
                          apiUrl + "/organisations",
                          {
                            ...ob,
                          },
                          {
                            headers: {
                              "Content-Type": "application/json",
                            },
                          }
                        )
                        .then((response) => {
                          // console.log(response);
                          setImportLoading(false);
                        })
                        .catch(function (error) {
                          console.log(error);
                          // Show an error notification using ant design api of refine

                          message.error("Echec de l'importation des données !");
                          setImportLoading(false);
                        });
                    });
                  });
                });
              } else {
                message.destroy();
                // setImportLoading(false);
                message.error(`L'organisation "${el[0]}" existe déjà !`);
                setImportLoading(false);
              }
            }
          }
        });
      },
    });
  }

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (importLoading) {
      messageApi.open({
        type: "loading",
        content: (
          <p
            style={{
              textAlign: "start",
            }}
          >
            Veuillez patienter pendant que nous importons les données : 0
            {importationDatas.total} élements à être importer <br /> Action en
            cours: {importationDatas.action}
          </p>
        ),
        duration: 10000000,
      });
    }
    if (!importLoading) {
      invalidate({
        resource: "organisations",
        invalidates: ["list"],
      });
      messageApi.destroy();
    }
    if (checkedArray.length >= pageCheckboxes.length) {
      setAllCheckedOnPage(true);
    } else {
      setAllCheckedOnPage(false);
    }

    return () => {
      if (fileImportInput.current) {
        fileImportInput.current!.value! = "";
      }
    };
  }, [
    importLoading,
    checkedArray,
    deleteLoading,
    allCheckedOnPage,
    importationDatas,
  ]);

  function handleCheckBoxAll(e: any) {
    const checked = e.target.checked;
    if (checked) {
      tableProps?.dataSource?.map((el: any) => {
        if (checkboxRefs?.current[el.id]) {
          setCheckedArray((s) => {
            return [...s, el.id];
          });
        }
      });
      setAllCheckedOnPage(true);
    } else {
      setCheckedArray([]);
      setAllCheckedOnPage(false);
    }
  }

  function handleCheckBox(e: any, id: any) {
    //@ts-ignore
    setPageCheckboxes(document.querySelectorAll(".ant-table-row-checkbox"));
    const checked = e.target.checked;
    if (checked) {
      setCheckedArray((s) => {
        return [...s, id];
      });
      setVisibleCheckAll(true);
    } else {
      const checkedArrayCopy = [...checkedArray];
      checkedArrayCopy.filter((el, index) => {
        if (el === id) {
          checkedArrayCopy.splice(index, 1);
        }
      });
      setCheckedArray(checkedArrayCopy);
    }
  }

  const confirmDelete = () => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Êtes vous sur de vouloir supprimer les élements sélèctionnés ?",
      okText: "Supprimer",
      cancelText: "Annuler",
      async onOk(...args) {
        if (checkedArray.length) {
          const results = checkedArray.map(async (ob) => {
            return axiosInstance.delete(apiUrl + `/organisations/${ob}`, {
              headers: {
                "Content-Type": "application/json",
              },
            });
          });

          await Promise.all(results);
          // console.log(results);
          invalidate({
            resource: "organisations",
            invalidates: ["list"],
          });
          setCheckedArray([]);
        }
      },
    });
  };

  return (
    <>
      {contextHolder}
      {modalContextHolder}
      <Row gutter={[16, 16]}>
        <Col lg={24} xs={24}>
          <Form layout="horizontal" {...searchFormProps}>
            <Space>
              <Form.Item name="name">
                <Input
                  placeholder="Recherche avec le nom ..."
                  prefix={<SearchOutlined />}
                />
              </Form.Item>
              {/* <Form.Item label="Date de création" name="createdAt">
                <RangePicker placeholder={["Date de début", "Date de fin"]} />
              </Form.Item> */}
              <Form.Item>
                <Button
                  className="btn-primary"
                  style={{
                    backgroundColor: "#6cd9cb",
                    color: "white",
                  }}
                  htmlType="submit"
                >
                  Filtrer
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Col>

        <Col lg={24} xs={24}>
          <List
            headerProps={{
              extra: (
                <AdminOrContributor>
                  <Space>
                    {checkedArray.length ? (
                      <button
                        className="btn-primary"
                        onClick={confirmDelete}
                        style={{ backgroundColor: "#ff4d4f", color: "white" }}
                      >
                        {`${checkedArray.length}`} Effacer Selection
                      </button>
                    ) : null}
                    <Input
                      type="file"
                      ref={fileImportInput}
                      onChange={handleImport}
                    />
                    <button
                      className="btn-primary"
                      onClick={() => {
                        // log datas
                        if (tableProps?.dataSource) {
                          const data = tableProps?.dataSource.map((el: any) => {
                            return {
                              name: el.name,
                              country: el.country,
                              description: el.description,
                              site_web: el.site_web,
                              linkedin_url: el.linkedin_url,
                              facebook_url: el.facebook_url,
                              twitter_url: el.twitter_url,
                              logo: el.logo,
                            };
                          });
                          if (data) {
                            const csv = papa.unparse(data);
                            const blob = new Blob([csv], { type: "text/csv" });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.setAttribute("hidden", "");
                            a.setAttribute("href", url);
                            a.setAttribute(
                              "download",
                              `organisations-${new Date()}-${Math.round(
                                Math.random() * 99999999
                              )}.csv`
                            );
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }
                        }
                      }}
                    >
                      Exporter les données
                    </button>
                    <CreateButton
                      className="btn-primary"
                      style={{
                        backgroundColor: "#6cd9cb",
                      }}
                    />
                  </Space>
                </AdminOrContributor>
              ),
            }}
          >
            <Table
              {...tableProps}
              rowKey="id"
              pagination={false}
              scroll={{ x: 2500, y: "auto" }}
            >
              <Table.Column
                width="2%"
                fixed="left"
                // width={68}
                dataIndex=""
                title={
                  visibleCheckAll ? (
                    <Checkbox
                      checked={allCheckedOnPage}
                      defaultChecked={false}
                      onChange={handleCheckBoxAll}
                    />
                  ) : (
                    "#"
                  )
                }
                render={(_, record: BaseRecord) => {
                  return (
                    <Checkbox
                      key={record.id}
                      checked={checkedArray.includes(record.id)}
                      ref={(input) =>
                        (checkboxRefs.current[record.id] = record.id)
                      }
                      className="ant-table-row-checkbox"
                      onChange={() => handleCheckBox(event, record.id)}
                    />
                  );
                }}
              />
              <Table.Column
                fixed="left"
                width="3%"
                dataIndex="logo"
                title="Logo"
                render={(value: any) => {
                  if (value && !(value.split(".").pop() === "html")) {
                    return (
                      <ImageField
                        style={{ maxWidth: "50px" }}
                        value={
                          socialMedias.includes(value) ? logoPlaceholder : value
                        }
                      />
                    );
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                ellipsis={true}
                fixed="left"
                width="5%"
                dataIndex="name"
                title="Nom"
              />
              <Table.Column
                ellipsis={true}
                width="8%"
                dataIndex="description"
                title="Description"
              />
              <Table.Column
                ellipsis={true}
                width="8%"
                dataIndex="sector"
                title="Secteur"
              />
              <Table.Column
                ellipsis={true}
                width="8%"
                dataIndex="source"
                title="Source"
              />
              <Table.Column
                ellipsis={true}
                width="8%"
                dataIndex="region"
                title="Pays"
              />
              <Table.Column
                ellipsis={true}
                width="8%"
                dataIndex="headquarter"
                title="Siège"
              />
              <Table.Column
                ellipsis={true}
                width="8%"
                dataIndex="operatingCountries"
                title="Pays Couverts"
              />
              <Table.Column
                ellipsis={true}
                width="8%"
                render={(value: any) => {
                  if (value) {
                    return (
                      <Link href={value} target="_blank">
                        {value}
                      </Link>
                    );
                  } else {
                    return "-";
                  }
                }}
                dataIndex="website"
                title="Site Web"
              />
              {/* <Table.Column
                width="7%"
                dataIndex="country"
                title="Pays d'origine"
                render={(value: any) => {
                  if (value) {
                    return `${value?.translations?.fra.common}`;
                    // return "-";
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                dataIndex="covered_countries"
                title="Pays couverts"
                render={(value: any[]) =>
                  coveredCountriesIsLoading ? (
                    <>Loading ...</>
                  ) : (
                    <>
                      {value?.map((item, index) => (
                        <TagField
                          key={index}
                          value={item?.translations?.fra?.common}
                        />
                      ))}
                    </>
                  )
                }
              /> */}
              {/* <Table.Column
            width="10%"
            dataIndex="couverture"
            title="Couverture de l'organisation"
            render={(value: any) => {
              if (value) {
                return (
                  <ImageField style={{ maxWidth: "100px" }} value={value} />
                );
              } else {
                return "-";
              }
            }}
          /> */}
              {/* <Table.Column
                dataIndex="types"
                title="Types"
                render={(value: any[]) =>
                  organisationTypesIsLoading ? (
                    <>Loading ...</>
                  ) : (
                    <>
                      {value?.map((item, index) => (
                        <TagField key={index} value={item?.name} />
                      ))}
                    </>
                  )
                }
              />

              <Table.Column
                dataIndex="contacts"
                title="Contacts"
                render={(value: any[]) =>
                  contactsIsLoading ? (
                    <>Loading ...</>
                  ) : (
                    <>
                      {value?.map((item, index) => (
                        <TagField key={index} value={item?.complete_name} />
                      ))}
                    </>
                  )
                }
              />
              <Table.Column
                dataIndex={["activity_areas"]}
                title="Secteur d'activité"
                render={(value: any[]) =>
                  activityAreasIsLoading ? (
                    <>Chargement...</>
                  ) : (
                    <>
                      {value?.map((item, index) => (
                        <TagField key={index} value={item?.name} />
                      ))}
                    </>
                  )
                }
              />
              <Table.Column
                dataIndex={["contributeur", "complete_name"]}
                title="Contributeur"
              /> */}
              {/* <Table.Column
            dataIndex="description"
            title="Description"
            render={(value: any) => {
              if (value && value.length > 60) {
                return value.substring(0, 60) + "...";
              } else if (value) {
                return value;
              } else {
                return "-";
              }
            }}
          /> */}
              {/* <Table.Column
                ellipsis={true}
                dataIndex={["email"]}
                title="Email"
                render={(value: any) => {
                  if (value) {
                    return <EmailField value={value} />;
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                ellipsis={true}
                dataIndex="telephone"
                title="Telephone"
                render={(value: any) => {
                  if (value) {
                    return (
                      <Link
                        href={
                          "https://www.google.com/search?q=" +
                          value.indicatif +
                          " " +
                          value.number
                        }
                        target="_blank"
                      >
                        {value.indicatif} {value.number}
                      </Link>
                    );
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                ellipsis={true}
                dataIndex="site_web"
                title="Site Web"
                render={(value: any) => {
                  if (value) {
                    return (
                      <Link href={value} target="_blank">
                        {value}
                      </Link>
                    );
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                ellipsis={true}
                dataIndex="linkedin_url"
                title="Url Linkedin "
                render={(value: any) => {
                  if (value) {
                    return (
                      <Link href={value} target="_blank">
                        {value}
                      </Link>
                    );
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                ellipsis={true}
                dataIndex="facebook_url"
                title="Url Facebook"
                render={(value: any) => {
                  if (value) {
                    return (
                      <Link href={value} target="_blank">
                        {value}
                      </Link>
                    );
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                ellipsis={true}
                dataIndex="twitter_url"
                title="Url Twitter"
                render={(value: any) => {
                  if (value) {
                    return (
                      <Link href={value} target="_blank">
                        {value}
                      </Link>
                    );
                  } else {
                    return "-";
                  }
                }}
              />
              <Table.Column
                ellipsis={true}
                dataIndex="adresse"
                title="Adresse"
                render={(value: any) => {
                  if (value) {
                    return (
                      <Link
                        // href={"https://www.google.com/search?q=" + value}
                        href={"https://www.google.com/maps/search/" + value}
                        target="_blank"
                      >
                        {value}
                      </Link>
                    );
                  } else {
                    return "-";
                  }
                }}
              /> */}
              <Table.Column
                width="8%"
                fixed="right"
                title="Actions"
                dataIndex="actions"
                render={(_, record: BaseRecord) => (
                  <Space>
                    <AdminOrContributor>
                      <EditButton
                        hideText
                        size="small"
                        recordItemId={record.id}
                      />
                    </AdminOrContributor>
                    <ShowButton
                      hideText
                      size="small"
                      recordItemId={record.id}
                    />
                    <Admin>
                      <DeleteButton
                        hideText
                        size="small"
                        recordItemId={record.id}
                      />
                    </Admin>
                  </Space>
                )}
              />
            </Table>
            <Space
              style={{
                width: "full",
                display: "flex",
                justifyContent: "end",
                marginTop: "1rem",
              }}
            >
              <button
                className="btn-primary"
                onClick={() => {
                  setPageSize((s) => {
                    return s + 10;
                  });
                  refetch();
                }}
                style={{
                  textTransform: "capitalize",
                }}
              >
                {`${pageSize} élements affichés`} Charger plus
              </button>
            </Space>
            <AdminOrContributor>
              <Space>
                {checkedArray.length ? (
                  <button
                    className="btn-primary"
                    onClick={confirmDelete}
                    style={{ backgroundColor: "#ff4d4f", color: "white" }}
                  >
                    {`${checkedArray.length}`} Effacer Selection
                  </button>
                ) : null}
              </Space>
            </AdminOrContributor>
          </List>
        </Col>
      </Row>
    </>
  );
};
