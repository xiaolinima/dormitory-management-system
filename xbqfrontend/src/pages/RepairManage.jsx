import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space } from 'antd'
import request from '../utils/request'
import { isAdmin, getUserInfo } from '../utils/auth'

function RepairManage() {
  const [data, setData] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const user = getUserInfo()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await request.get('/repairs')
      let repairData = res.data || []
      
      // 如果是学生，只显示自己的申请记录
      if (!isAdmin() && user) {
        repairData = repairData.filter(item => item.student?.id === user.id)
      }
      
      setData(repairData)
      const roomRes = await request.get('/rooms')
      setRooms(roomRes.data || [])
    } catch (e) { message.error(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  const handleApply = async () => { try { const v = await form.validateFields(); await request.post('/repairs', v, { params: { studentId: user.id } }); message.success('申请成功 / Подано'); setModalVisible(false); fetchData() } catch (e) { message.error(e.message) } }
  const handleApprove = async (r) => { try { await request.post('/repairs/handle', { id: r.id, result: '已处理', handlerId: user.id }); message.success('已处理 / Выполнено'); fetchData() } catch (e) { message.error(e.message) } }
  const handleReject = async (r) => { try { await request.post('/repairs/reject', { id: r.id, reason: '已拒绝', handlerId: user.id }); message.success('已拒绝 / Отклонено'); fetchData() } catch (e) { message.error(e.message) } }

  const statusMap = { PENDING: { text: '待处理 / Ожидание', color: 'orange' }, COMPLETED: { text: '已完成 / Выполнено', color: 'green' }, REJECTED: { text: '已拒绝 / Отклонено', color: 'red' } }
  const typeMap = { REPAIR: '维修 / Ремонт', LIFE_SERVICE: '生活服务 / Услуга' }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '房间号 / Комната', dataIndex: ['room', 'roomNumber'], key: 'roomNumber' },
    { title: '申请人 / Заявитель', dataIndex: ['student', 'realName'], key: 'studentName' },
    { title: '类型 / Тип', dataIndex: 'type', key: 'type', render: v => <Tag>{typeMap[v] || v}</Tag> },
    { title: '描述 / Описание', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '状态 / Статус', dataIndex: 'status', key: 'status', render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag> },
    { title: '申请时间 / Время', dataIndex: 'applyTime', key: 'applyTime', render: v => v ? v.slice(0, 16) : '-' },
    { title: '操作 / Действие', key: 'action', render: (_, r) => r.status === 'PENDING' && isAdmin() ? <Space><Button type="link" onClick={() => handleApprove(r)}>通过 / Одобрить</Button><Button type="link" danger onClick={() => handleReject(r)}>拒绝 / Отклонить</Button></Space> : null },
  ]

  return (
    <div className="page-container">
      <h2 className="page-title">维修与生活服务 / Ремонт и услуги</h2>
      <div style={{ marginBottom: 16 }}>
        {!isAdmin() && <Button type="primary" onClick={() => { form.resetFields(); setModalVisible(true) }}>申请服务 / Подать заявку</Button>}
      </div>
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
      <Modal title="申请服务 / Подать заявку" open={modalVisible} onOk={handleApply} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="roomId" label="房间 / Комната" rules={[{ required: true }]}>
            <Select placeholder="选择房间">{rooms.map(r => <Select.Option key={r.id} value={r.id}>{r.roomNumber}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="type" label="服务类型 / Тип услуги" rules={[{ required: true }]}>
            <Select><Select.Option value="REPAIR">维修 / Ремонт</Select.Option><Select.Option value="LIFE_SERVICE">生活服务 / Услуга</Select.Option></Select>
          </Form.Item>
          <Form.Item name="description" label="描述 / Описание"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RepairManage
