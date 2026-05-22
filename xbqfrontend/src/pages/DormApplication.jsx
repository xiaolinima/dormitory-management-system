import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space } from 'antd'
import request from '../utils/request'
import { isAdmin, getUserInfo } from '../utils/auth'

function DormApplication() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const user = getUserInfo()

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = isAdmin() ? '/applications' : `/applications/student/${user.id}`
      const res = await request.get(url)
      setApplications(res.data || [])
    } catch (e) { message.error(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  const handleApply = async () => { try { const v = await form.validateFields(); await request.post('/applications', v, { params: { studentId: user.id } }); message.success('申请成功 / Подано'); setModalVisible(false); fetchData() } catch (e) { message.error(e.message) } }
  const handleApprove = async (r) => { try { await request.post('/applications/approve', { id: r.id, result: '已批准', handlerId: user.id }); message.success('已批准 / Одобрено'); fetchData() } catch (e) { message.error(e.message) } }
  const handleReject = async (r) => { try { await request.post('/applications/reject', { id: r.id, reason: '已拒绝', handlerId: user.id }); message.success('已拒绝 / Отклонено'); fetchData() } catch (e) { message.error(e.message) } }
  const handleCancel = async (id) => { try { await request.delete(`/applications/${id}`, { params: { studentId: user.id } }); message.success('已取消 / Отменено'); fetchData() } catch (e) { message.error(e.message) } }

  const statusMap = { PENDING: { text: '待处理 / Ожидание', color: 'orange' }, APPROVED: { text: '已批准 / Одобрено', color: 'green' }, REJECTED: { text: '已拒绝 / Отклонено', color: 'red' } }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '学生 / Студент', dataIndex: ['student', 'realName'], key: 'studentName' },
    { title: '性别 / Пол', dataIndex: 'gender', key: 'gender', render: v => v === 'MALE' ? '男 / М' : '女 / Ж' },
    { title: '备注 / Примечание', dataIndex: 'remark', key: 'remark', ellipsis: true },
    { title: '状态 / Статус', dataIndex: 'status', key: 'status', render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag> },
    { title: '申请时间 / Время', dataIndex: 'applyTime', key: 'applyTime', render: v => v ? v.slice(0, 16) : '-' },
    { title: '操作 / Действие', key: 'action', render: (_, r) => {
      if (isAdmin() && r.status === 'PENDING') {
        return <Space><Button type="link" onClick={() => handleApprove(r)}>批准 / Одобрить</Button><Button type="link" danger onClick={() => handleReject(r)}>拒绝 / Отклонить</Button></Space>
      }
      if (!isAdmin() && r.status === 'PENDING') {
        return <Button type="link" danger onClick={() => handleCancel(r.id)}>取消 / Отменить</Button>
      }
      return null
    } },
  ]

  return (
    <div className="page-container">
      <h2 className="page-title">宿舍申请 / Заявка на общежитие</h2>
      <div style={{ marginBottom: 16 }}>
        {!isAdmin() && <Button type="primary" onClick={() => { form.resetFields(); setModalVisible(true) }}>申请宿舍 / Подать заявку</Button>}
      </div>
      <Table 
        columns={columns} 
        dataSource={applications} 
        rowKey="id" 
        loading={loading}
        pagination={{
          pageSize: 5,
          showTotal: (total) => `共 ${total} 条数据`,
          showSizeChanger: false
        }}
      />
      <Modal title="申请宿舍 / Заявка на общежитие" open={modalVisible} onOk={handleApply} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="gender" label="性别 / Пол" rules={[{ required: true }]}>
            <Select placeholder="请选择性别">
              <Select.Option value="MALE">男 / М</Select.Option>
              <Select.Option value="FEMALE">女 / Ж</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注 / Примечание"><Input.TextArea rows={3} placeholder="请填写备注（可选）" /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DormApplication
