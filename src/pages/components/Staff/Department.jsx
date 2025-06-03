import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const Department = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        console.log('Received values:', values);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  // Sample data - replace with your actual data
  const departmentLeads = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Robert Johnson' },
  ];

  const parentDepartments = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Engineering' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Finance' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Departments</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showModal}
          style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
        >
          Add Department
        </Button>
      </div>

      <Modal
        title="Add New Department"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="department_form"
        >
          <Form.Item
            name="departmentName"
            label="Department Name"
            rules={[{ required: true, message: 'Please input the department name!' }]}
          >
            <Input placeholder="Enter department name" />
          </Form.Item>

          <Form.Item
            name="departmentLead"
            label="Department Lead"
            rules={[{ required: true, message: 'Please select a department lead!' }]}
          >
            <Select
              showSearch
              placeholder="Select a department lead"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {departmentLeads.map(lead => (
                <Option key={lead.id} value={lead.id}>{lead.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="parentDepartment"
            label="Parent Department"
          >
            <Select
              showSearch
              placeholder="Select a parent department (optional)"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear
            >
              {parentDepartments.map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Your department list/content would go here */}
      <div style={{ background: '#fff', padding: '24px', minHeight: '380px', borderRadius: '8px' }}>
        {/* Department table/list content */}
        <p>Your department content will appear here</p>
      </div>
    </div>
  );
};

export default Department;