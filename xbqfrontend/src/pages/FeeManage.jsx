import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, message, Tag, Space, Card, Row, Col } from 'antd'
import request from '../utils/request'
import { isAdmin, getUserInfo } from '../utils/auth'

function FeeManage() {
  const [data, setData] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const user = getUserInfo()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [feeRes, studentRes] = await Promise.all([request.get('/fees'), request.get('/users/students')])
      let feeData = feeRes.data || []
      
      // 如果是学生，只显示自己的缴费记录
      if (!isAdmin() && user) {
        feeData = feeData.filter(item => item.student?.id === user.id)
      }
      
      setData(feeData)
      setStudents(studentRes.data || [])
    } catch (e) { message.error(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])
  const handleCreate = async () => { try { const v = await form.validateFields(); await request.post('/fees', v); message.success('创建成功 / Создано'); setModalVisible(false); fetchData() } catch (e) { message.error(e.message) } }
  const handlePay = async (r) => { 
    // 学生只能缴自己的费用
    if (!isAdmin() && r.student?.id !== user.id) {
      message.error('你只能缴纳自己的费用！')
      return
    }
    try { await request.post(`/fees/pay/${r.id}`); message.success('缴费成功 / Оплачено'); fetchData() } catch (e) { message.error(e.message) } 
  }
  const handleDelete = async (id) => { try { await request.delete(`/fees/${id}`); message.success('删除成功 / Удалено'); fetchData() } catch (e) { message.error(e.message) } }

  const statusMap = { PAID: { text: '已缴费 / Оплачено', color: 'green' }, UNPAID: { text: '未缴费 / Не оплачено', color: 'orange' }, OVERDUE: { text: '已逾期 / Просрочено', color: 'red' } }
  const unpaidList = data.filter(f => f.status !== 'PAID')

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '学生 / Студент', dataIndex: ['student', 'realName'], key: 'studentName' },
    { title: '学号 / Номер', dataIndex: ['student', 'studentId'], key: 'studentId' },
    { title: '学期 / Семестр', dataIndex: 'semester', key: 'semester' },
    { title: '金额 / Сумма', dataIndex: 'amount', key: 'amount', render: v => `${v} ₽` },
    { title: '截止日期 / Срок', dataIndex: 'dueDate', key: 'dueDate' },
    { title: '状态 / Статус', dataIndex: 'status', key: 'status', render: v => <Tag color={statusMap[v]?.color}>{statusMap[v]?.text}</Tag> },
    { title: '操作 / Действие', key: 'action', render: (_, r) => {
      // 学生只能缴自己的费用
      const canPay = (isAdmin() || r.student?.id === user.id) && r.status !== 'PAID'
      return (
        <Space>
          {canPay && <Button type="link" onClick={() => handlePay(r)}>缴费 / Оплатить</Button>}
          {isAdmin() && r.status !== 'PAID' && <Button type="link" danger onClick={() => handleDelete(r.id)}>删除 / Удал.</Button>}
        </Space>
      )
    }},
  ]

  return (
    <div className="page-container">
      <h2 className="page-title">住宿费管理 / Оплата проживания</h2>
      {isAdmin() && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}><Card title="欠费人数 / Должников"><div style={{ fontSize: 32, fontWeight: 'bold', color: '#f5222d' }}>{unpaidList.length}</div></Card></Col>
          <Col span={8}><Card title="欠费总额 / Сумма долга"><div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>{unpaidList.reduce((s, f) => s + (parseFloat(f.amount) || 0), 0).toFixed(2)} ₽</div></Card></Col>
          <Col span={8}><Card title="已缴费人数 / Оплачено"><div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>{data.filter(f => f.status === 'PAID').length}</div></Card></Col>
        </Row>
      )}
      {isAdmin() && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => { form.resetFields(); setModalVisible(true) }}>创建账单 / Создать счёт</Button>
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
      <Modal title="创建账单 / Создать счёт" open={modalVisible} onOk={handleCreate} onCancel={() => setModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="studentId" label="学生 / Студент" rules={[{ required: true }]}>
            <Select placeholder="选择学生">{students.map(s => <Select.Option key={s.id} value={s.id}>{s.realName || s.username}</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="semester" label="学期 / Семестр" rules={[{ required: true }]}><Input placeholder="如：2024-2025-1" /></Form.Item>
          <Form.Item name="amount" label="金额 / Сумма" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={0} precision={2} /></Form.Item>
          <Form.Item name="dueDate" label="截止日期 / Срок оплаты" rules={[{ required: true }]}><Input placeholder="如：2025-01-01" /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FeeManage
