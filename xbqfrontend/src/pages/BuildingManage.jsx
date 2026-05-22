import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, message, Popconfirm, Result, Space } from 'antd'
import request from '../utils/request'
import { isAdmin } from '../utils/auth'

function BuildingManage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await request.get('/buildings')
      setData(res.data || [])
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAdd = () => { setEditingId(null); form.resetFields(); setModalVisible(true) }
  const handleEdit = (record) => { setEditingId(record.id); form.setFieldsValue(record); setModalVisible(true) }
  const handleDelete = async (id) => {
    try { await request.delete(`/buildings/${id}`); message.success('删除成功 / Удалено'); fetchData() } catch (e) { message.error(e.message) }
  }
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) await request.put(`/buildings/${editingId}`, values)
      else await request.post('/buildings', values)
      message.success('保存成功 / Сохранено')
      setModalVisible(false)
      fetchData()
    } catch (e) { message.error(e.message) }
  }

  const renderAction = (_, record) => {
    return (
      <Space>
        <Button type="link" onClick={() => handleEdit(record)}>编辑 / Редакт.</Button>
        <Popconfirm title="确认删除？/ Подтвердите" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger>删除 / Удал.</Button>
        </Popconfirm>
      </Space>
    )
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '楼栋名称 / Название', dataIndex: 'name', key: 'name' },
    { title: '地址 / Адрес', dataIndex: 'address', key: 'address' },
    { title: '总楼层数 / Этажей', dataIndex: 'totalFloors', key: 'totalFloors' },
    { title: '描述 / Описание', dataIndex: 'description', key: 'description' },
    { title: '操作 / Действие', key: 'action', render: renderAction },
  ]

  // 如果不是管理员，显示无权限
  if (!isAdmin()) {
    return (
      <div className="page-container">
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面 / У вас нет доступа"
        />
      </div>
    )
  }

  return (
    <div className="page-container">
      <h2 className="page-title">楼栋管理 / Управление корпусами</h2>
      {isAdmin() && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>新增楼栋 / Добавить корпус</Button>
        </div>
      )}
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        pagination={{
          pageSize: 5,
          showTotal: (total) => `共 ${total} 条数据`,
          showSizeChanger: false
        }}
      />
      <Modal title={editingId ? '编辑楼栋 / Редактировать' : '新增楼栋 / Добавить'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="楼栋名称 / Название" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="address" label="地址 / Адрес"><Input /></Form.Item>
          <Form.Item name="totalFloors" label="总楼层数 / Этажей" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="description" label="描述 / Описание"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BuildingManage
