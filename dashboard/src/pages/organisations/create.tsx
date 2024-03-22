import React, { useEffect, useState } from "react";
import {
  file2Base64,
  IResourceComponentsProps,
  useApiUrl,
} from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, message, Select, Space, Typography, Upload } from "antd";
import { axiosInstance } from "../../custom-data-provider/data-provider";
import ReactQuill from "react-quill";
import { imageUploadHandler, reactQuillModules } from "../posts/create";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import CustomFormDivider from "../../custom-components/FormDivider";

export const OrganisationCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult, onFinish } = useForm();
  const [editorContent, setEditorContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [realPhoneNumber, setRealPhoneNumber] = useState("");
  const [indicatif, setIndicatif] = useState();
  const [countries, setCountries] = useState([]);
  const apiUrl = useApiUrl();

  const { Text } = Typography;

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = async (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    // return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps["onChange"] = async (
    info: UploadChangeParam<UploadFile>
  ) => {
    setUploadLoading(true);
    setImageUrl("");
    const base64 = await file2Base64(info.file);
    const url = await imageUploadHandler(base64);
    setImageUrl(url);
  };

  async function onSubmitCapture(values: any) {
    let imgTags = editorContent.match(/<img[^>]+src="([^">]+)"/g);
    if (imgTags && imgTags.length > 0) {
      let imgs = imgTags.map((imgTag) => {
        const img = {
          base64: "",
          url: "",
        };
        img.base64 = imgTag
          .match(/src="([^">]+)"/g)[0]
          .replace('src="', "")
          .replace('"', "");

        return img;
      });
      let content = editorContent;
      const result = imgs.map(async (img) => {
        img.url = await imageUploadHandler(img.base64);
        // console.log(img.url);
        content = content.replace(`${img.base64}`, `${img.url}`);
        return content;
      });

      values.content = await Promise.all(result).then((values: string[]) => {
        //return the last element of values array
        content = values[values.length - 1];
        return content;
      });
    }

    if (values.logo) {
      values.logo = imageUrl;
    }
    if (values.telephone) {
      // console.log(values.telephone);
      values.telephone = {
        indicatif: indicatif,
        number: realPhoneNumber,
      };
    }
    if (!values?.owner?._id) {
      values.owner = null;
    }
    if (!values?.contacts) {
      values.contacts = null;
    }
    if (!values?.activity_areas) {
      values.activity_areas = null;
    }
    if (!values?.covered_countries) {
      values.covered_countries = null;
    }
    if (!values?.types) {
      values.types = null;
    }
    // console.log(values);

    onFinish(values);
  }

  // const { selectProps: contactsSelectProps } = useSelect({
  //   resource: "users",
  //   optionValue: "_id",
  //   optionLabel: "complete_name",
  //   filters: [
  //     {
  //       field: "role",
  //       operator: "eq",
  //       value: "contact",
  //     },
  //   ],
  // });

  // const { selectProps: activityAreasSelectProps } = useSelect({
  //   resource: "activity_areas",
  //   optionValue: "_id",
  //   optionLabel: "name",
  // });

  // const { selectProps: organisationTypesSelectProps } = useSelect({
  //   resource: "organisation_types",
  //   optionValue: "_id",
  //   optionLabel: "name",
  // });

  // const { selectProps: countrySelectProps } = useSelect({
  //   resource: "countries",
  //   optionValue: "_id",
  //   optionLabel: "translations.fra.common",
  //   // defaultValue: "",
  // });

  // const { selectProps: indicatifSelectProps } = useSelect({
  //   resource: "countries",
  //   optionValue: "_id",
  //   optionLabel: "translations.fra.common",
  //   // defaultValue: "",
  // });

  // const { selectProps: coveredCountriesSelectProps } = useSelect({
  //   resource: "countries",
  //   optionValue: "_id",
  //   optionLabel: "translations.fra.common",
  // });

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;
    let formattedNumber = value.replace(/\D/g, "");
    setRealPhoneNumber(formattedNumber);
    if (formattedNumber.length % 2 === 0) {
      formattedNumber = formattedNumber.replace(/(\d{2})/g, "$1 ");
    } else {
      formattedNumber = formattedNumber.replace(/(\d{3})/g, "$1 ");
    }
    if (formattedNumber.slice(-1) === " ")
      formattedNumber = formattedNumber.slice(0, formattedNumber.length - 1);
    // console.log(formattedNumber);
    setPhoneNumber(formattedNumber);
  };

  useEffect(() => {
    // console.log(countrySelectProps);
    if (imageUrl) {
      setUploadLoading(false);
    }
    if (!countries.length) {
      // Get all countries from api
      axiosInstance.get(`https://restcountries.com/v3.1/all`).then((res) => {
        const countrieDatas = res.data;

        let countrieDatasFiltered = [];

        for (let i = 0; i < countrieDatas.length; i++) {
          const countrieData = countrieDatas[i];
          if (countrieData.idd.root || countrieData.idd.suffixes) {
            countrieData.idd.suffixes.map((suffix) => {
              countrieDatasFiltered.push({
                ...countrieData,
                idd: { root: `${countrieData.idd.root}${suffix}` },
              });
            });
            // countrieDatasFiltered.push(countrieData);
          }
          continue;
        }

        // Filter countries by alphabetic order
        countrieDatasFiltered.sort((a: any, b: any) =>
          a?.translations?.fra?.common > b?.translations?.fra?.common ? 1 : -1
        );
        setCountries(countrieDatasFiltered);
      });
    }
  }, [imageUrl, countries, uploadLoading]);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={onSubmitCapture}>
        <CustomFormDivider text="Informations générales" />
        <Form.Item
          label="Nom"
          name={["name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item label="Pays d'origine" name={["country"]}>
          <SelectCountry />
          <Select
            {...countrySelectProps}
            onSearch={undefined}
            filterOption={true}
            optionFilterProp="label"
          />
        </Form.Item> */}
        {/* <Form.Item
          label="Pays couverts"
          name={["covered_countries"]}
          getValueProps={(value: any[]) => {
            return {
              value: value?.map((item) => item),
            };
          }}
          getValueFromEvent={(...args: any) => {
            const toBeReturned = args[1].map((item: any) => {
              return item.value;
            });
            return toBeReturned;
          }}
        >
          <SelectCountry />
          <Select
            mode="multiple"
            {...coveredCountriesSelectProps}
            onSearch={undefined}
            filterOption={true}
            optionFilterProp="label"
          />
        </Form.Item> */}
        <Form.Item label="Logo" name="logo">
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {uploadLoading || !imageUrl ? (
              uploadButton
            ) : (
              <div style={{ position: "relative" }}>
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    color: "GrayText",
                    backgroundColor: "white",
                  }}
                >
                  Modifier
                </span>
              </div>
            )}
          </Upload>
          {/* </Form.Item> */}
        </Form.Item>
        <Form.Item label="Secteur" name={["sector"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name={["description"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Source" name={["source"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Pays" name={["region"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Siège" name={["headquarter"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Pays Couverts" name={["operatingCountries"]}>
          <Input />
        </Form.Item>
        {/* <Form.Item
          label="Type"
          name={["types"]}
          getValueProps={(value: any[]) => {
            return {
              value: value?.map((item) => item),
            };
          }}
          getValueFromEvent={(...args: any) => {
            const toBeReturned = args[1].map((item: any) => {
              return item.value;
            });
            return toBeReturned;
          }}
        >
          <Select
            mode="multiple"
            {...organisationTypesSelectProps}
            onSearch={undefined}
            filterOption={true}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item label="Année de creation" name={["creation_year"]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Secteur d'activité"
          name={["activity_areas"]}
          getValueProps={(value: any[]) => {
            return {
              value: value?.map((item) => item),
            };
          }}
          getValueFromEvent={(...args: any) => {
            const toBeReturned = args[1].map((item: any) => {
              return item.value;
            });
            return toBeReturned;
          }}
        >
          <Select
            mode="multiple"
            {...activityAreasSelectProps}
            onSearch={undefined}
            filterOption={true}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name={["description"]}
          style={{
            height: "600px",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <ReactQuill
            style={{ height: "500px", width: "100%" }}
            modules={reactQuillModules}
            value={editorContent}
            onChange={setEditorContent}
            theme="snow"
            placeholder="Placez votre contenu ici..."
          />
        </Form.Item> */}
        <CustomFormDivider text="Coordonnées" />
        {/* <Form.Item
          label="Contacts"
          name={["contacts"]}
          getValueProps={(value: any[]) => {
            return {
              value: value?.map((item) => item),
            };
          }}
          getValueFromEvent={(...args: any) => {
            const toBeReturned = args[1].map((item: any) => {
              return item.value;
            });
            return toBeReturned;
          }}
        >
          <Select
            mode="multiple"
            {...contactsSelectProps}
            onSearch={undefined}
            filterOption={true}
            optionFilterProp="label"
          />
        </Form.Item> */}

        <Form.Item label="Site Web" name={["website"]}>
          <Input />
        </Form.Item>
        {/* <Form.Item label="Email" name={["email"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Telephone" name={["telephone"]}>
          <Space.Compact style={{ width: "100%" }}>
            <Select
              style={{ width: "25%" }}
              value={indicatif}
              onChange={setIndicatif}
              placeholder="+000"
            >
              {countries.map((country, index) => (
                <Select.Option
                  key={country.name}
                  value={
                    // (country.flag ? country.flag + " " : "") +
                    (country.idd.root ? country.idd.root.toString() : "") +
                    (country.idd.suffixes
                      ? country.idd.suffixes.join("").toString()
                      : "")
                  }
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      textAlign: "start",
                    }}
                  >
                    <div
                      style={{
                        width: "35%",
                      }}
                    >
                      <Text style={{ textAlign: "start" }}>
                        {country.flag ? country.flag + " " : null}
                        {country.idd.root ? country.idd.root.toString() : null}
                        {country.idd.suffixes
                          ? country.idd.suffixes.join("").toString()
                          : null}
                      </Text>
                    </div>
                    <div
                      style={{
                        width: "60%",
                        textAlign: "left",
                      }}
                    >
                      <Text style={{ textAlign: "start" }}>
                        {" " + country?.translations?.fra?.common}
                      </Text>
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
            <Input
              style={{ width: "25%" }}
              onChange={handlePhoneNumberChange}
              value={phoneNumber}
              placeholder="26 88 88 88"
            />
          </Space.Compact>
        </Form.Item>
        <Form.Item label="Adresse" name={["adresse"]}>
          <Input />
        </Form.Item> */}
        {/* <Form.Item label="Url LinkeDin" name={["linkedin_url"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Url Twitter" name={["twitter_url"]}>
          <Input />
        </Form.Item> */}
        {/* <Form.Item label="Url Facebook" name={["facebook_url"]}>
          <Input />
        </Form.Item> */}
      </Form>
    </Create>
  );
};
