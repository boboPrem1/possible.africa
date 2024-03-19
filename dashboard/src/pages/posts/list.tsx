import React, { useEffect, useRef, useState } from "react";
import {
  BaseRecord,
  IResourceComponentsProps,
  useApiUrl,
  useInvalidate,
  useLink,
  useMany,
  useRouterContext,
  useRouterType,
} from "@refinedev/core";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ImageField,
  List,
  ShowButton,
  TagField,
  useTable,
} from "@refinedev/antd";
import {
  Button,
  Checkbox,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Spin,
} from "antd";
import papa from "papaparse";
import { downloadMedia } from "../organisations/list";
import { imageUploadHandler } from "./create";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  Admin,
  AdminOrContributor,
  AdminOrContributorOrUser,
} from "../../custom-components/AccessControl";
import { TOKEN_KEY } from "../../authProvider";
import axios from "axios";
const token = localStorage.getItem(TOKEN_KEY);
const axiosInstance = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

async function processContent(content: string) {
  let imgTags = content.match(/<img[^>]+src="([^">]+)"/g);
  if (imgTags && imgTags.length > 0) {
    let imgs = imgTags.map((imgTag) => {
      const imgUrl = imgTag
        .match(/src="([^">]+)"/g)[0]
        .replace('src="', "")
        .replace('"', "");

      return imgUrl;
    });
    let contentProcessed = "";
    const result = imgs.map(async (img) => {
      const imgBase64 = await downloadMedia(img);
      const imgUrlS3 = await imageUploadHandler(imgBase64.data.dataUrl);
      // console.log(img.url);
      contentProcessed = content.replace(`${img}`, `${imgUrlS3}`);
      return contentProcessed;
    });

    const finalContent = await Promise.all(result).then((values: string[]) => {
      //return the last element of values array
      contentProcessed = values[values.length - 1];
      return contentProcessed;
    });
    return finalContent;
  }
}

export const PostList: React.FC<IResourceComponentsProps> = () => {
  const {
    tableProps,
    setPageSize,
    pageSize,
    tableQueryResult: { refetch },
  } = useTable({
    syncWithLocation: true,
    filters: {
      initial: [
        {
          field: 'possible',
          operator: 'eq',
          value: true
        },
      ]
    }
  });

  const { data: organisationsData, isLoading: organisationsIsLoading } =
    useMany({
      resource: "organisations",
      ids: tableProps?.dataSource?.map((item) => item?.organisations) ?? [],
    });

  const { data: editorsData, isLoading: editorsIsLoading } = useMany({
    resource: "organisations",
    ids: tableProps?.dataSource?.map((item) => item?.editors) ?? [],
  });

  const { data: labelsData, isLoading: labelsIsLoading } = useMany({
    resource: "post_labels",
    ids: tableProps?.dataSource?.map((item) => item?.labels) ?? [],
  });

  const { data: countriesData, isLoading: countriesIsLoading } = useMany({
    resource: "countries",
    ids: tableProps?.dataSource?.map((item) => item?.countries) ?? [],
  });

  const { data: authorsData, isLoading: authorsIsLoading } = useMany({
    resource: "users",
    ids: tableProps?.dataSource?.map((item) => item?.authors) ?? [],
  });

  const [importLoading, setImportLoading] = useState(false);
  let fileImportInput = useRef(null);
  const apiUrl = useApiUrl();
  const [checkedArray, setCheckedArray] = useState([]);
  const [allCheckedOnPage, setAllCheckedOnPage] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [pageCheckboxes, setPageCheckboxes] = useState([]);
  const [visibleCheckAll, setVisibleCheckAll] = useState(false);
  const [postStatus, setPostStatus] = useState("");
  const [importationDatas, setImportationDatas] = useState({
    total: 0,
    action: "Initialisation de l'import ...",
  });
  const [StatusInChange, setStatusInChange] = useState<{
    id: string | number;
    state: boolean;
  }>();
  const invalidate = useInvalidate();
  let checkboxRefs = useRef([]);

  const routerType = useRouterType();
  const NewLink = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const CustomLink = routerType === "legacy" ? LegacyLink : NewLink;

  async function handleImport(e: any) {
    let file = e.target.files[0];
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
            if (el[0]) {
              const postTitle = await axiosInstance.get(
                apiUrl + `/posts?title=${el[0]}`,
                {
                  headers: {
                    "Access-Control-Allow-Origin": "*",
                  },
                }
              );
              if (!postTitle?.data?.length) {
                const imageBase64 = await downloadMedia(el[5]);
                const image = await imageUploadHandler(
                  imageBase64.data.dataUrl
                );

                setImportationDatas((s) => {
                  return {
                    ...s,
                    action: "Recherche de la catégorie du post...",
                  };
                });
                let postCategorie = await axiosInstance.get(
                  apiUrl + `/post_categories?name=${el[1]}`,
                  {
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                    },
                  }
                );

                if (!postCategorie?.data?.length) {
                  setImportationDatas((s) => {
                    return {
                      ...s,
                      action: "Catégories non trouvé, Creation en cours ...",
                    };
                  });
                  // create the event type
                  const result = await axiosInstance.post(
                    apiUrl + "/post_categories",
                    {
                      name: el[1],
                    },
                    {
                      headers: {
                        "Access-Control-Allow-Origin": "*",
                      },
                    }
                  );
                  postCategorie = result?.data?.id;
                } else {
                  postCategorie = postCategorie?.data[0]?.id;
                }

                setImportationDatas((s) => {
                  return { ...s, action: "Recherche et ajout des pays..." };
                });
                const countriesToBeImported = el[3].split(";");
                let countriesArray = await countriesToBeImported.map(
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

                let postEditors = [];

                postEditors = el[6].split(";").map(async (item) => {
                  setImportationDatas((s) => {
                    return {
                      ...s,
                      action: "Recherche des éditeurs liés au post ...",
                    };
                  });
                  const result = await axiosInstance.get(
                    apiUrl + `/organisations?name=${item}`,
                    {
                      headers: {
                        "Access-Control-Allow-Origin": "*",
                      },
                    }
                  );
                  // console.log(result, "organisations");
                  if (!result?.data?.length) {
                    setImportationDatas((s) => {
                      return {
                        ...s,
                        action: "Editeurs non trouvés, Creation en cours ...",
                      };
                    });
                    // create the organisation
                    const result = await axiosInstance.post(
                      apiUrl + "/organisations",
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

                let organisations = [];

                // try to get the organisations
                organisations = el[7].split(";").map(async (item) => {
                  setImportationDatas((s) => {
                    return { ...s, action: "Recherche des organisations ..." };
                  });
                  const result = await axiosInstance.get(
                    apiUrl + `/organisations?name=${item}`,
                    {
                      headers: {
                        "Access-Control-Allow-Origin": "*",
                      },
                    }
                  );
                  // console.log(result, "organisations");
                  if (!result?.data?.length) {
                    setImportationDatas((s) => {
                      return {
                        ...s,
                        action:
                          "Organisations non trouvés, Creation en cours ...",
                      };
                    });
                    // create the organisation
                    const result = await axiosInstance.post(
                      apiUrl + "/organisations",
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

                let postLabels = [];

                // try to get the postLabels
                postLabels = el[10].split(";").map(async (item) => {
                  setImportationDatas((s) => {
                    return { ...s, action: "Recherche des Etiquettes ..." };
                  });
                  const result = await axiosInstance.get(
                    apiUrl + `/post_labels?name=${item}`,
                    {
                      headers: {
                        "Access-Control-Allow-Origin": "*",
                      },
                    }
                  );
                  // console.log(result, "postLabels");
                  if (!result?.data?.length) {
                    setImportationDatas((s) => {
                      return {
                        ...s,
                        action: "Etiquettes non trouvés, Creation en cours ...",
                      };
                    });
                    // create the organisation
                    const result = await axiosInstance.post(
                      apiUrl + "/post_labels",
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

                let authors = [];
                // try to get the contacts
                authors = el[11].split(";").map(async (item) => {
                  setImportationDatas((s) => {
                    return {
                      ...s,
                      action: "Recherche des Auteurs associés ...",
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
                        action: "Auteurs non trouvés, Creation en cours...",
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

                Promise.all(countriesArray).then((values) => {
                  countriesArray = values;
                  Promise.all(postEditors).then((values) => {
                    postEditors = values;
                    Promise.all(organisations).then((values) => {
                      organisations = values;
                      Promise.all(authors).then((values) => {
                        authors = values;
                        Promise.all(postLabels).then((values) => {
                          postLabels = values;

                          const ob: any = {
                            title: el[0],
                            categorie: postCategorie,
                            content: el[2],
                            countries: countriesArray,
                            slug: el[4],
                            image: image ? image : "",
                            authors: authors,
                            editors: postEditors,
                            organisations,
                            source: el[8],
                            publication_language: el[9],
                            labels: postLabels,
                          };
                          body.push({ ...ob });
                          // await axios.post(apiUrl + "/organisations", el);
                          axiosInstance
                            .post(
                              apiUrl + "/posts",
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
                              message.error(
                                "Echec de l'importation des données !"
                              );
                              setImportLoading(false);
                            });
                        });
                      });
                    });
                  });
                });
              } else {
                message.destroy();
                // setImportLoading(false);
                message.error(`Le post "${el[0]}" existe déjà !`);
                setImportLoading(false);
                // console.log(fileImportInput);
                fileImportInput = null;
                // console.log(fileImportInput);
                // fileImportInput.current.files = [];
              }
            }
          }
        });
      },
    });
  }

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // console.log(postStatus);
    if (importLoading) {
      messageApi.destroy();
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
        resource: "posts",
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
    postStatus,
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
            return axiosInstance.delete(apiUrl + `/posts/${ob}`, {
              headers: {
                "Content-Type": "application/json",
              },
            });
          });

          await Promise.all(results);
          // console.log(results);
          invalidate({
            resource: "posts",
            invalidates: ["list"],
          });
          setCheckedArray([]);
        }
      },
    });
  };

  const confirmStatusChange = (id: string | number, status: string) => {
    let statusSelected = "";
    modal.confirm({
      title: "Confirmer le changement de statut",
      icon: <ExclamationCircleOutlined />,
      content: (
        <Space>
          <Select
            size="large"
            defaultValue={status}
            onChange={(status) => {
              statusSelected = status;
            }}
            style={{ width: 200 }}
            options={[
              {
                label: "Brouillon",
                value: "draft",
              },
              {
                label: "Publié",
                value: "published",
              },
              {
                label: "Archivé",
                value: "archived",
              },
              {
                label: "Corbeille",
                value: "trash",
              },
            ]}
          />
        </Space>
      ),
      okText: "Enrégistrer",
      cancelText: "Annuler",
      async onOk(...args) {
        // console.log(id, statusSelected);
        if (statusSelected) {
          setStatusInChange({ id: id, state: true });
          // const results = checkedArray.map(async (ob) => {
          await axiosInstance
            .put(
              apiUrl + `/posts/${id}`,
              {
                status: statusSelected,
              },
              {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then(() => {
              invalidate({
                resource: "posts",
                invalidates: ["list"],
              });
              setTimeout(() => {
                setStatusInChange({ id: null, state: false });
              }, 2500);
            });
          // });

          // console.log(results);
        }
      },
    });
  };

  const statusVariables = {
    draft: {
      color: "#1890ff",
      styles: {
        marginLeft: "auto",
        backgroundColor: "#1890ff",
      },
      label: "Brouillon",
    },
    published: {
      color: "#52c41a",
      styles: {
        marginLeft: "auto",
        backgroundColor: "#52c41a",
      },
      label: "Publié",
    },
    archived: {
      color: "#faad14",
      styles: {
        marginLeft: "auto",
        backgroundColor: "#faad14",
      },
      label: "Archivé",
    },
    trash: {
      color: "#ff4d4f",
      styles: {
        marginLeft: "auto",
        backgroundColor: "#ff4d4f",
      },
      label: "Corbeille",
    },
  };

  return (
    <>
      {contextHolder}
      {modalContextHolder}
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
                          title: el.title,
                          content: el.content,
                          country: el.country,
                          slug: el.slug,
                          image: el.image,
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
                          `articles-${new Date()}-${Math.round(
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
          pagination={false}
          rowKey="_id"
          scroll={{ x: 1800, y: "auto" }}
        >
          <Table.Column
            fixed="left"
            width={68}
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
                  ref={(input) => (checkboxRefs.current[record.id] = record.id)}
                  className="ant-table-row-checkbox"
                  onChange={() => handleCheckBox(event, record.id)}
                />
              );
            }}
          />
          {/* <AdminOrContributorOrUser>
            <Table.Column
              fixed="left"
              title="Statut"
              width="4%"
              dataIndex="actions"
              render={(_, record: BaseRecord) => (
                <Space>
                  <Tooltip
                    title={statusVariables[`${record.status}`].label}
                    color={statusVariables[`${record.status}`].color}
                    key={record.id}
                  >
                    {StatusInChange &&
                    StatusInChange.id == record.id &&
                    StatusInChange.state == true ? (
                      <Spin />
                    ) : (
                      <button className="btn-primary"
                        style={statusVariables[`${record.status}`].styles}
                        size="small"
                        shape="circle"
                        onClick={() => {
                          confirmStatusChange(record.id, record.status);
                        }}
                      ></button>
                    )}
                  </Tooltip>
                </Space>
              )}
            />
          </AdminOrContributorOrUser> */}
          {/* <Table.Column
            width={120}
            dataIndex={["image"]}
            title="Couverture"
            render={(value: any) => {
              if (value) {
                return <ImageField value={value} />;
              } else {
                return "-";
              }
            }}
          /> */}
          <Table.Column dataIndex="title" title="Titre" ellipsis={true} />
          {/* <Table.Column
            dataIndex={["categorie"]}
            title="Categorie"
            render={(value) => {
              if (value) {
                return (
                  <CustomLink
                    target="_blank"
                    to={`/post_categories/show/${value._id}`}
                  >
                    {value.name}
                  </CustomLink>
                );
              } else {
                return "";
              }
            }}
          /> */}
          {/* <Table.Column
            dataIndex={["user", "complete_name"]}
            title="Contributeur"
          /> */}
          <Table.Column
            dataIndex="airTags"
            title="Etiquettes"
            // render={(value: any[]) =>
            //   labelsIsLoading ? (
            //     <>Loading ...</>
            //   ) : (
            //     <>
            //         <CustomLink
            //           target="_blank"
            //           to={`/post_labels/show/${item._id}`}
            //         >
            //           <TagField value={value} />
            //         </CustomLink>
            //     </>
            //   )
            // }
          />
          <Table.Column
            dataIndex="airMedia"
            title="Média"
            // render={(value: any[]) =>
            //   organisationsIsLoading ? (
            //     <>Loading ...</>
            //   ) : (
            //     <>
            //       {value?.map((item, index) => (
            //         <CustomLink
            //           target="_blank"
            //           to={`/organisations/show/${item._id}`}
            //         >
            //           <TagField key={index} value={item?.name} />
            //         </CustomLink>
            //       ))}
            //     </>
            //   )
            // }
          />
          {/* <Table.Column
            dataIndex="editors"
            title="Editeurs"
            render={(value: any[]) =>
              editorsIsLoading ? (
                <>Loading ...</>
              ) : (
                <>
                  {value?.map((item, index) => (
                    <CustomLink
                      target="_blank"
                      to={`/organisations/show/${item._id}`}
                    >
                      <TagField key={index} value={item?.name} />
                    </CustomLink>
                  ))}
                </>
              )
            }
          /> */}
          {/* <Table.Column
            dataIndex="authors"
            title="Auteurs"
            render={(value: any[]) =>
              authorsIsLoading ? (
                <>Loading ...</>
              ) : (
                <>
                  {value?.map((item, index) => (
                    <CustomLink target="_blank" to={`/users/show/${item._id}`}>
                      <TagField key={index} value={item?.complete_name} />
                    </CustomLink>
                  ))}
                </>
              )
            }
          /> */}

          {/* <Table.Column
            dataIndex="countries"
            title="Pays"
            render={(value: any[]) =>
              countriesIsLoading ? (
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
          {/* <Table.Column dataIndex="slug" title="Slug" ellipsis={true} /> */}
          <Table.Column
            dataIndex="airLanguage"
            title="Langue de publication"
            render={(value) => (value === "FR" ? "Français" : "Anglais")}
            ellipsis={true}
          />
          <Table.Column
            fixed="right"
            title="Actions"
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <AdminOrContributor>
                  <EditButton hideText size="small" recordItemId={record.id} />
                </AdminOrContributor>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <Admin>
                  <DeleteButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                  />
                </Admin>
                {/*<Tooltip*/}
                {/*  title={statusVariables[`${record.status}`].label}*/}
                {/*  color={statusVariables[`${record.status}`].color}*/}
                {/*  key={record.id}*/}
                {/*>*/}
                {/*  <button className="btn-primary"*/}
                {/*    style={statusVariables[`${record.status}`].styles}*/}
                {/*    size="small"*/}
                {/*    shape="circle"*/}
                {/*    onClick={() => {*/}
                {/*      confirmStatusChange(record.id, record.status);*/}
                {/*    }}*/}
                {/*  ></button>*/}
                {/*</Tooltip>*/}
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
            {`${pageSize * 2} élements affichés`} Charger plus
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
    </>
  );
};
