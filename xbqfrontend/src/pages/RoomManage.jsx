import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Result, Space } from 'antd'
import request from '../utils/request'
import { isAdmin } from '../utils/auth'

function RoomManage() {
  const [data, setData] = useState([])
  const [floors, setFloors] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [roomRes, floorRes] = await Promise.all([request.get('/rooms'), request.get('/floors')])
      setData(roomRes.data || [])
      setFloors(floorRes.data || [])
    } catch (e) { message.error(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  const handleAdd = () => { setEditingId(null); form.resetFields(); setModalVisible(true) }
  const handleEdit = (record) => { setEditingId(record.id); form.setFieldsValue({ ...record }); setModalVisible(true) }
  const handleDelete = async (id) => { try { await request.delete(`/rooms/${id}`); message.success('删除成功'); fetchData() } catch (e) { message.error(e.message) } }
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) await request.put(`/rooms/${editingId}`, values)
      else await request.post('/rooms', values)
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
    { title: '楼层 / Этаж', dataIndex: 'floorName', key: 'floorNumber' },
    { title: '房间号 / Номер', dataIndex: 'roomNumber', key: 'roomNumber' },
    { title: '容量 / Вместим.', dataIndex: 'capacity', key: 'capacity' },
    { title: '当前人数 / Сейчас', dataIndex: 'currentCount', key: 'currentCount' },
    { title: '性别 / Пол', dataIndex: 'gender', key: 'gender', render: v => v === 'MALE' ? '男 / М' : '女 / Ж' },
    { title: '状态 / Статус', dataIndex: 'status', key: 'status' },
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
      <h2 className="page-title">房间管理 / Управление комнатами</h2>
      {isAdmin() && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>新增房间 / Добавить комнату</Button>
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
      <Modal title={editingId ? '编辑房间 / Редакт.' : '新增房间 / Добавить'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="floorId" label="所属楼层 / Этаж" rules={[{ required: true }]}>
            <Select placeholder="选择楼层 / Выберите">{floors.map(f => <Select.Option key={f.id} value={f.id}>{f.floorNumber}层 - {f.building?.name}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="roomNumber" label="房间号 / Номер" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="capacity" label="容量 / Вместимость" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="gender" label="性别 / Пол" rules={[{ required: true }]}>
            <Select><Select.Option value="MALE">男 / М</Select.Option><Select.Option value="FEMALE">女 / Ж</Select.Option></Select>
          </Form.Item>
          <Form.Item name="description" label="描述 / Описание"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoomManage
