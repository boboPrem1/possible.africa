import React from "react";
import { IResourceComponentsProps, useMany, useShow } from "@refinedev/core";
import { DeleteButton, EmailField, Show, TagField, TextField } from "@refinedev/antd";
import { Space, Typography } from "antd";
import parse from "html-react-parser";
import { htmlParseOptions } from "../posts/show";
import { Admin } from "../../custom-components/AccessControl";
import Link from "antd/es/typography/Link";

const { Title } = Typography;

export const OrganisationShow: React.FC<IResourceComponentsProps> = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  // const { data: coveredCountriesData, isLoading: coveredCountriesIsLoading } =
  //   useMany({
  //     resource: "countries",
  //     ids:
  //       record?.covered_countries?.map(
  //         (item: any) => item?.covered_countries
  //       ) ?? [],
  //   });

  // const { data: organisationTypesData, isLoading: organisationTypesIsLoading } = useMany({
  //   resource: "organisation_types",
  //   ids: record?.types?.map((item: any) => item?.types) ?? [],
  // });
  // const { data: contactsData, isLoading: contactsIsLoading } = useMany({
  //   resource: "users",
  //   ids: record?.contacts?.map((item: any) => item?.contacts) ?? [],
  // });
  // const { data: activityAreasData, isLoading: activityAreasIsLoading } =
  //   useMany({
  //     resource: "activity_areas",
  //     ids:
  //       record?.activity_areas?.map((item: any) => item?.activity_areas) ?? [],
  //   });

  return (
    <Show
      isLoading={isLoading}
      headerProps={{
        extra: (
          <Admin>
            <Space>
              <DeleteButton recordItemId={record?.id} />
            </Space>
          </Admin>
        ),
      }}
    >
      <Title level={5}>Nom</Title>
      <TextField value={record?.name} />
      {/* <Title level={5}>Pays d'origine</Title>
      <TextField value={record?.country?.translations?.fra?.common} /> */}
      {/* <Title level={5}>Pays couverts</Title> */}
      {/* {coveredCountriesIsLoading ? (
        <>Loading ...</>
      ) : coveredCountriesData?.data?.length &&
        record?.covered_countries?.length ? (
        <>
          {record?.covered_countries?.map((covered_country: any) => (
            <Link
              href={
                "https://www.google.com/maps/search/" +
                covered_country?.translations?.fra?.common
              }
              target="_blank"
              key={covered_country?._id}
            >
              {covered_country?.translations?.fra?.common + " "}
            </Link>
          ))}
        </>
      ) : (
        "_"
      )}
      <Title level={5}>Secteur d'activité</Title>
      {/*<TextField value={record?.activity_area} />*/}
      {/* {activityAreasIsLoading ? (
        <>Loading ...</>
      ) : activityAreasData?.data?.length && record?.activity_areas?.length ? (
        <>
          {record?.activity_areas?.map((activityArea: any, index) => (
            <TagField key={activityArea?._id} value={activityArea?.name} />
          ))}
        </>
      ) : (
        "_"
      )} */}
      {/* <Title level={5}>Types</Title>
      {organisationTypesIsLoading ? (
        <>Loading ...</>
      ) : organisationTypesData?.data?.length && record?.types?.length ? (
        <>
          {record?.types?.map((type: any) => (
            <TagField key={type?._id} value={type?.name} />
          ))}
        </>
      ) : (
        "_"
      )} */}
      {/* <Title level={5}>Contributeur</Title>
      <TextField value={record?.contributeur?.complete_name} /> */}

      {/* <Title level={5}>Contacts</Title>
      {contactsIsLoading ? (
        <>Loading ...</>
      ) : contactsData?.data?.length && record?.contacts?.length ? (
        <>
          {record?.contacts.map((contact: any) => (
            <TagField key={contact?._id} value={contact?.complete_name} />
          ))}
        </>
      ) : (
        "_"
      )} */}
      <Title level={5}>Description</Title>
      <span>
        {
          record?.description
          // &&
          // parse(
          //   record?.description.replace(/\\n/g, "<br />"),
          //   htmlParseOptions
          // )
        }
      </span>
      <Title level={5}>Secteur</Title>
      <TextField value={record?.sector} />
      <Title level={5}>Source</Title>
      <TextField value={record?.source} />
      <Title level={5}>Pays</Title>
      <TextField value={record?.region} />
      <Title level={5}>Siège</Title>
      <TextField value={record?.headquarter} />
      <Title level={5}>Pays Couverts</Title>
      <TextField value={record?.operatingCountries} />
      {/* <Title level={5}>Telephone</Title>
      {record?.telephone ? (
        <Link
          href={
            "https://www.google.com/search?q=" +
            record?.telephone?.indicatif +
            " " +
            record?.telephone?.number
          }
          // href="#"
        >
          {record?.telephone?.indicatif + " " + record?.telephone?.number}
        </Link>
      ) : (
        "-"
      )} */}
      <Title level={5}>Site Web</Title>
      {record?.website ? (
        <Link
          // href={"https://www.google.com/search?q=" + value}
          href={record?.website}
          target="_blank"
        >
          {record?.website}
        </Link>
      ) : (
        "-"
      )}
      {/* <Title level={5}>Url Linkedin</Title>
      {record?.linkedin_url ? (
        <Link
          // href={"https://www.google.com/search?q=" + value}
          href={record?.linkedin_url}
          target="_blank"
        >
          {record?.linkedin_url}
        </Link>
      ) : (
        "-"
      )}
      <Title level={5}>Url Facebook</Title>
      {record?.facebook_url ? (
        <Link
          // href={"https://www.google.com/search?q=" + value}
          href={record?.facebook_url}
          target="_blank"
        >
          {record?.facebook_url}
        </Link>
      ) : (
        "-"
      )}
      <Title level={5}>Url Twitter</Title>
      {record?.twitter_url ? (
        <Link
          // href={"https://www.google.com/search?q=" + value}
          href={record?.twitter_url}
          target="_blank"
        >
          {record?.twitter_url}
        </Link>
      ) : (
        "-"
      )}
      <Title level={5}>Adresse</Title>
      {record?.adresse ? (
        <Link
          // href={"https://www.google.com/search?q=" + value}
          href={"https://www.google.com/maps/search/" + record?.adresse}
          target="_blank"
        >
          {record?.adresse}
        </Link>
      ) : (
        "-"
      )} */}
    </Show>
  );
};
