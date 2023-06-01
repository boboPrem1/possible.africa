import React from "react";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Checkbox } from "antd";
import dayjs from "dayjs";
import { Option } from "antd/es/mentions";

export const EventCreate: React.FC<IResourceComponentsProps> = () => {
  const { formProps, saveButtonProps, queryResult } = useForm();

  const { selectProps: organisationSelectProps } = useSelect({
    resource: "organisations",
    optionValue: "_id",
    optionLabel: "name",
  });

  const { selectProps: eventTypeSelectProps } = useSelect({
    resource: "event_types",
    optionValue: "_id",
    optionLabel: "name",
  });

  const { selectProps: userSelectProps } = useSelect({
    resource: "users",
    optionValue: "_id",
    optionLabel: "username",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Organisation" name={["organisation", "_id"]}>
          <Select {...organisationSelectProps} />
        </Form.Item>
        <Form.Item
          label="Title"
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Beginning Date"
          name={["beginningDate"]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="Ending Date"
          name={["endingDate"]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : undefined,
          })}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item label="Event Type" name={["event_type", "_id"]}>
          <Select {...eventTypeSelectProps} />
        </Form.Item>
        <Form.Item label="Format" name={["format"]}>
          <Select defaultValue="">
            <Option value="">Selectionner</Option>
            <Option value="online">En Ligne</Option>
            <Option value="hybrid">Hybride</Option>
            <Option value="physical">Presentiel</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Target Countriy" name={["target_countriy"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Secteur d'activité" name={["activity_area"]}>
          <Select defaultValue="">
            <Option value="">Selectionner</Option>
            <Option value="agriculture">Agriculture</Option>
            <Option value="industry">Industry</Option>
            <Option value="services">Services</Option>
            <Option value="commerce">Commerce</Option>
            <Option value="construction">Construction</Option>
            <Option value="transport">Transport</Option>
            <Option value="health">Santé</Option>
            <Option value="education">Éducation</Option>
            <Option value="administration">Administration</Option>
            <Option value="other">Autres</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Description" name={["description"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Registration Link" name={["registration_link"]}>
          <Input />
        </Form.Item>
        <Form.Item label="Location" name={["location"]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Is Recurrent"
          valuePropName="checked"
          name={["is_recurrent"]}
        >
          <Checkbox>Is Recurrent</Checkbox>
        </Form.Item>
        <Form.Item label="Frequence" name={["frequence"]}>
          <Input />
        </Form.Item>
        <Form.Item label="User" name={["user", "_id"]}>
          <Select {...userSelectProps} />
        </Form.Item>
      </Form>
    </Create>
  );
};
