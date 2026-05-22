import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Result, Space } from 'antd'
import request from '../utils/request'
import { isAdmin } from '../utils/auth'

function AssetManage() {
  const [data, setData] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [assetRes, roomRes] = await Promise.all([request.get('/assets'), request.get('/rooms')])
      setData(assetRes.data || [])
      setRooms(roomRes.data || [])
    } catch (e) { message.error(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  const handleAdd = () => { setEditingId(null); form.resetFields(); setModalVisible(true) }
  const handleEdit = (r) => { setEditingId(r.id); form.setFieldsValue({ ...r, roomId: r.room?.id }); setModalVisible(true) }
  const handleCheck = async (id) => { try { await request.post(`/assets/check/${id}`); message.success('盘点完成 / Проверено'); fetchData() } catch (e) { message.error(e.message) } }
  const handleDelete = async (id) => { try { await request.delete(`/assets/${id}`); message.success('删除成功 / Удалено'); fetchData() } catch (e) { message.error(e.message) } }
  const handleSubmit = async () => {
    try {
      const v = await form.validateFields()
      if (editingId) await request.put(`/assets/${editingId}`, v)
      else await request.post('/assets', v)
      message.success('保存成功 / Сохранено')
      setModalVisible(false); fetchData()
    } catch (e) { message.error(e.message) }
  }

  const conditionMap = { GOOD: { text: '良好 / Хорошее', color: 'green' }, DAMAGED: { text: '损坏 / Повреждено', color: 'orange' }, LOST: { text: '丢失 / Утеряно', color: 'red' } }

  const renderAction = (_, r) => {
    return (
      <Space>
        <Button type="link" onClick={() => handleEdit(r)}>编辑 / Редакт.</Button>
        <Button type="link" onClick={() => handleCheck(r.id)}>盘点 / Проверить</Button>
        {isAdmin() && (
          <Popconfirm title="确认删除？/ Подтвердите" onConfirm={() => handleDelete(r.id)}>
            <Button type="link" danger>删除 / Удал.</Button>
          </Popconfirm>
        )}
      </Space>
    )
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '房间号 / Комната', dataIndex: ['room', 'roomNumber'], key: 'roomNumber' },
    { title: '楼栋 / Корпус', dataIndex: ['room', 'floor', 'building', 'name'], key: 'buildingName' },
    { title: '资产名称 / Название', dataIndex: 'name', key: 'name' },
    { title: '数量 / Количество', dataIndex: 'quantity', key: 'quantity' },
    { title: '状态 / Состояние', dataIndex: 'conditionStatus', key: 'conditionStatus', render: v => <Tag color={conditionMap[v]?.color}>{conditionMap[v]?.text}</Tag> },
    { title: '盘点时间 / Проверка', dataIndex: 'lastCheckTime', key: 'lastCheckTime', render: v => v ? v.slice(0, 16) : '-' },
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
      <h2 className="page-title">资产盘点 / Инвентаризация</h2>
      {isAdmin() && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={handleAdd}>新增资产 / Добавить</Button>
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
      <Modal title={editingId ? '编辑资产 / Редактировать' : '新增资产 / Добавить'} open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="roomId" label="房间 / Комната" rules={[{ required: true }]}>
            <Select placeholder="选择房间">{rooms.map(r => <Select.Option key={r.id} value={r.id}>{r.roomNumber}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="name" label="资产名称 / Название" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="quantity" label="数量 / Количество" rules={[{ required: true }]}><Input type="number" /></Form.Item>
          <Form.Item name="conditionStatus" label="状态 / Состояние">
            <Select><Select.Option value="GOOD">良好 / Хорошее</Select.Option><Select.Option value="DAMAGED">损坏 / Повреждено</Select.Option><Select.Option value="LOST">丢失 / Утеряно</Select.Option></Select>
          </Form.Item>
          <Form.Item name="description" label="描述 / Описание"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AssetManage
