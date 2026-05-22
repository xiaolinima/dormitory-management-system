import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Result, Space } from 'antd'
import request from '../utils/request'
import { isAdmin } from '../utils/auth'

function FloorManage() {
  const [data, setData] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [floorRes, buildingRes] = await Promise.all([request.get('/floors'), request.get('/buildings')])
      setData(floorRes.data || [])
      setBuildings(buildingRes.data || [])
    } catch (e) { message.error(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  const handleAdd = () => { setEditingId(null); form.resetFields(); setModalVisible(true) }
  const handleEdit = (record) => { setEditingId(record.id); form.setFieldsValue({ ...record, buildingId: record.building?.id }); setModalVisible(true) }
  const handleDelete = async (id) => { try { await request.delete(`/floors/${id}`); message.success('删除成功'); fetchData() } catch (e) { message.error(e.message) } }
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) await request.put(`/floors/${editingId}`, values)
      else await request.post('/floors', values)
      message.success('保存成功 / Сохранено')
      setModalVisible(false); fetchData()
    } catch (e) { message.error(e.message) }
  }

  const renderAction = (_, record) => {
    return (
      <Space>
        <Button type="link" onClick={() => handleEdit(record)}>编辑 / Редакт.</Button>
        <Popconfirm title="确认删除？/ Подтвердите?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger>删除 / Удал.</Button>
        </Popconfirm>
      </Space>
    )
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '所属楼栋 / Корпус', dataIndex: ['building', 'name'], key: 'buildingName' },
    { title: '楼层号 / Этаж', dataIndex: 'floorNumber', key: 'floorNumber' },
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
      <h2 className="page-title">楼层管理 / Управление этажами</h2>
      {isAdmin() && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>新增楼层 / Добавить этаж</Button>
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
      <Modal title={editingId ? '编辑楼层 / Редактировать' : '新增楼层 / Добавить'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="buildingId" label="所属楼栋 / Корпус" rules={[{ required: true }]}>
            <Select placeholder="选择楼栋 / Выберите">{buildings.map(b => <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="floorNumber" label="楼层号 / Этаж" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="description" label="描述 / Описание"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FloorManage
