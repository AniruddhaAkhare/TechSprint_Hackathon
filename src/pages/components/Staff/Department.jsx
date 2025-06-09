import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Card, Table, Tag, Space, Typography, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";

const { Option } = Select;
const { Title, Text } = Typography;

// Styled components for modern look
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const StyledCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  .ant-card-head {
    border-bottom: none;
  }
`;

const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Department = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  // Fetch users and departments from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch users
        const usersCollectionRef = collection(db, 'Users');
        const usersSnapshot = await getDocs(usersCollectionRef);
        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          displayName: doc.data().displayName || 'Unknown',
        }));
        setUsers(userList);

        // Fetch departments
        const departmentsCollectionRef = collection(db, 'Departments');
        const departmentsSnapshot = await getDocs(departmentsCollectionRef);
        const departmentsList = departmentsSnapshot.docs.map((doc) => ({
          key: doc.id,
          id: doc.id,
          name: doc.data().departmentName,
          lead: userList.find((user) => user.id === doc.data().leadId)?.displayName || 'Unknown',
          parent: doc.data().parentDepartmentId
            ? departmentsSnapshot.docs.find((d) => d.id === doc.data().parentDepartmentId)?.data().departmentName || 'No Department'
            : 'No Department',
          employees: doc.data().employees || 0,
          status: doc.data().status || 'active',
        }));
        setDepartments(departmentsList);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showModal = (department = null) => {
    if (department) {
      form.setFieldsValue({
        departmentName: department.name,
        departmentLead: department.leadId,
        parentDepartment: department.parentDepartmentId || undefined,
      });
      setEditingDepartmentId(department.id);
    } else {
      form.resetFields();
      setEditingDepartmentId(null);
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then(async (values) => {
        try {
          const departmentData = {
            departmentName: values.departmentName,
            leadId: values.departmentLead,
            parentDepartmentId: values.parentDepartment || null,
            employees: 0, // Initialize employees count
            status: 'active',
            createdAt: new Date().toISOString(),
          };

          if (editingDepartmentId) {
            // Update department
            const departmentRef = doc(db, 'Departments', editingDepartmentId);
            await updateDoc(departmentRef, departmentData);
            setDepartments((prev) =>
              prev.map((dept) =>
                dept.id === editingDepartmentId
                  ? {
                      ...dept,
                      name: departmentData.departmentName,
                      lead: users.find((user) => user.id === departmentData.leadId)?.displayName || 'Unknown',
                      parent: departmentData.parentDepartmentId
                        ? departments.find((d) => d.id === departmentData.parentDepartmentId)?.name || 'No Department'
                        : 'No Department',
                      status: departmentData.status,
                    }
                  : dept
              )
            );
          } else {
            // Create new department
            const docRef = await addDoc(collection(db, 'Departments'), departmentData);
            setDepartments((prev) => [
              ...prev,
              {
                key: docRef.id,
                id: docRef.id,
                name: departmentData.departmentName,
                lead: users.find((user) => user.id === departmentData.leadId)?.displayName || 'Unknown',
                parent: departmentData.parentDepartmentId
                  ? departments.find((d) => d.id === departmentData.parentDepartmentId)?.name || 'No Department'
                  : 'No Department',
                employees: departmentData.employees,
                status: departmentData.status,
              },
            ]);
          }

          form.resetFields();
          setIsModalVisible(false);
          setEditingDepartmentId(null);
        } catch (error) {
          console.error('Error saving department:', error);
          setError(`Failed to save department: ${error.message}`);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setEditingDepartmentId(null);
  };

  const handleDelete = async (departmentId) => {
    try {
      await deleteDoc(doc(db, 'Departments', departmentId));
      setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
    } catch (error) {
      console.error('Error deleting department:', error);
      setError(`Failed to delete department: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Lead',
      dataIndex: 'lead',
      key: 'lead',
    },
    {
      title: 'Parent Department',
      dataIndex: 'parent',
      key: 'parent',
    },
    {
      title: 'Employees',
      dataIndex: 'employees',
      key: 'employees',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <ActionButton
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <ActionButton
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <PageHeader>
        <Title level={3} style={{ margin: 0 }}>Department Management</Title>
        <Space>
          <Input
            placeholder="Search departments..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', border: 'none' }}
          >
            Add Department
          </Button>
        </Space>
      </PageHeader>

      <StyledCard>
        {error && <Text type="danger">{error}</Text>}
        <Table
          columns={columns}
          dataSource={departments.filter((dept) =>
            dept.name.toLowerCase().includes(searchText.toLowerCase())
          )}
          pagination={{ pageSize: 5 }}
          bordered={false}
          loading={loading}
        />
      </StyledCard>

      <Modal
        title={
          <span style={{ fontSize: '20px', fontWeight: '500' }}>
            {editingDepartmentId ? 'Edit Department' : 'Create New Department'}
          </span>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingDepartmentId ? 'Update Department' : 'Create Department'}
        cancelText="Cancel"
        width={600}
        okButtonProps={{ style: { background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)', border: 'none' } }}
      >
        <Divider style={{ margin: '16px 0' }} />
        <Form
          form={form}
          layout="vertical"
          name="department_form"
        >
          <Form.Item
            name="departmentName"
            label={<Text strong>Department Name</Text>}
            rules={[{ required: true, message: 'Please input the department name!' }]}
          >
            <Input placeholder="Enter department name" size="large" />
          </Form.Item>

          <Form.Item
            name="departmentLead"
            label={<Text strong>Department Lead</Text>}
            rules={[{ required: true, message: 'Please select a department lead!' }]}
          >
            <Select
              showSearch
              placeholder="Select a department lead"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {users.map((user) => (
                <Option key={user.id} value={user.id}>
                  {user.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="parentDepartment"
            label={<Text strong>Parent Department</Text>}
          >
            <Select
              showSearch
              placeholder="Select a parent department (optional)"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              allowClear
            >
              <Option value="">No Department</Option>
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Department;