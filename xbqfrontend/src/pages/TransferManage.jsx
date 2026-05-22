import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space } from 'antd'
import request from '../utils/request'
import { isAdmin, getUserInfo } from '../utils/auth'

function TransferManage() {
  const [data, setData] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const user = getUserInfo()

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await request.get('/transfers')
      let transferData = res.data || []
      
      // 如果是学生，只显示自己的调宿记录
      if (!isAdmin() && user) {
        transferData = transferData.filter(item => item.student?.id === user.id)
      }
      
      setData(transferData)
      const roomRes = await request.get('/rooms')
      setRooms(roomRes.data || [])
    } catch (e) { message.error(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  const handleApply = async () => { try { const v = await form.validateFields(); await request.post('/transfers', v, { params: { studentId: user.id } }); message.success('申请成功 / Подано'); setModalVisible(false); fetchData() } catch (e) { message.error(e.message) } }
  const handleApprove = async (r) => { try { await request.post('/transfers/approve', { id: r.id, handlerId: user.id }); message.success('已批准 / Одобрено'); fetchData() } catch (e) { message.error(e.message) } }
  const handleReject = async (r) => { try { await request.post('/transfers/reject', { id: r.id, handlerId: user.id }); message.success('已拒绝 / Отклонено'); fetchData() } catch (e) { message.error(e.message) } }

  const statusMap = { PENDING: { text: '待处理 / Ожидание', color: 'orange' }, APPROVED: { text: '已批准 / Одобрено', color: 'green' }, REJECTED: { text: '已拒绝 / Отклонено', color: 'red' } }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '学生 / Студент', dataIndex: ['student', 'realName'], key: 'studentName' },
    { title: '原房间 / Откуда', dataIndex: ['fromRoom', 'roomNumber'], key: 'fromRoom', render: v => v || '-' },
    { title: '目标房间 / Куда', dataIndex: ['toRoom', 'roomNumber'], key: 'toRoom', render: v => v || '-' },
    { title: '原因 / Причина', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { title: '状态 / Статус', dataIndex: 'status', key: 'status', render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag> },
    { title: '申请时间 / Время', dataIndex: 'applyTime', key: 'applyTime', render: v => v ? v.slice(0, 16) : '-' },
    { title: '操作 / Действие', key: 'action', render: (_, r) => r.status === 'PENDING' && isAdmin() ? <Space><Button type="link" onClick={() => handleApprove(r)}>批准 / Одобрить</Button><Button type="link" danger onClick={() => handleReject(r)}>拒绝 / Отклонить</Button></Space> : null },
  ]

  return (
    <div className="page-container">
      <h2 className="page-title">调宿历史 / История переселения</h2>
      <div style={{ marginBottom: 16 }}>
        {!isAdmin() && <Button type="primary" onClick={() => { form.resetFields(); setModalVisible(true) }}>申请调宿 / Подать заявку</Button>}
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
      <Modal title="申请调宿 / Заявка на переселение" open={modalVisible} onOk={handleApply} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="fromRoomId" label="原房间 / Текущая комната">
            <Select allowClear placeholder="原房间（可选）">{rooms.map(r => <Select.Option key={r.id} value={r.id}>{r.roomNumber}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="toRoomId" label="目标房间 / Целевая комната" rules={[{ required: true }]}>
            <Select placeholder="目标房间">{rooms.map(r => <Select.Option key={r.id} value={r.id}>{r.roomNumber}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="reason" label="原因 / Причина"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TransferManage
