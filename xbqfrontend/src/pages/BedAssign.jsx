import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Select, Input, message, Tag, Space } from 'antd'
import request from '../utils/request'
import { isAdmin } from '../utils/auth'

function BedAssign() {
  const [beds, setBeds] = useState([])
  const [allBeds, setAllBeds] = useState([])
  const [students, setStudents] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(false)
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [assignForm] = Form.useForm()

  const fetchBeds = async () => {
    setLoading(true)
    try {
      console.log('开始获取数据...')
      const [bedRes, roomRes, studentRes] = await Promise.all([
        request.get('/beds').catch(e => { console.error('获取床位失败:', e); return { data: [] } }),
        request.get('/rooms').catch(e => { console.error('获取房间失败:', e); return { data: [] } }),
        request.get('/users/students').catch(e => { console.error('获取学生失败:', e); return { data: [] } }),
      ])
      console.log('床位响应:', bedRes)
      console.log('房间响应:', roomRes)
      console.log('学生响应:', studentRes)
      setAllBeds(bedRes.data || [])
      setBeds(bedRes.data || [])
      setRooms(roomRes.data || [])
      setStudents(studentRes.data || [])
    } catch (e) {
      console.error('fetchBeds错误:', e)
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBeds() }, [])
  const handleCreateBed = async () => { try { const v = await form.validateFields(); await request.post('/beds', v); message.success('创建成功 / Создано'); setCreateModalVisible(false); fetchBeds() } catch (e) { message.error(e.message) } }
  const handleAssign = async () => { try { const v = await assignForm.validateFields(); await request.post('/beds/assign', { bedId: v.bedId, studentId: v.studentId }); message.success('分配成功 / Распределено'); setAssignModalVisible(false); fetchBeds() } catch (e) { message.error(e.message) } }
  const handleVacate = async (id) => { try { await request.post('/beds/vacate', { bedId: id }); message.success('退床成功 / Освобождено'); fetchBeds() } catch (e) { message.error(e.message) } }
  const handleGenderChange = async (g) => {
    // 根据性别筛选床位
    if (g === 'ALL') {
      setBeds(allBeds)
    } else {
      const filtered = allBeds.filter(bed => {
        // 尝试从床位关联信息中获取性别
        const roomGender = bed.room?.gender
        return roomGender === g
      })
      setBeds(filtered)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '房间号 / Комната', dataIndex: ['room', 'roomNumber'], key: 'roomNumber' },
    { title: '楼栋 / Корпус', dataIndex: ['room', 'floor', 'building', 'name'], key: 'buildingName' },
    { title: '床位号 / Койка', dataIndex: 'bedNumber', key: 'bedNumber' },
    { title: '性别 / Пол', dataIndex: ['room', 'gender'], key: 'gender', render: v => v === 'MALE' ? '男 / М' : '女 / Ж' },
    { title: '状态 / Статус', dataIndex: 'status', key: 'status', render: v => v === 'AVAILABLE' ? <Tag color="green">可用 / Свободно</Tag> : <Tag color="red">已占 / Занято</Tag> },
    { title: '学生 / Студент', dataIndex: ['student', 'realName'], key: 'studentName', render: v => v || '-' },
    { title: '操作 / Действие', key: 'action', render: (_, r) => r.status === 'AVAILABLE' && isAdmin() ? <Button type="link" onClick={() => { assignForm.setFieldsValue({ bedId: r.id }); setAssignModalVisible(true) }}>分配 / Распред.</Button> : r.status === 'OCCUPIED' && isAdmin() ? <Button type="link" danger onClick={() => handleVacate(r.id)}>退床 / Освоб.</Button> : null },
  ]

  return (
    <div className="page-container">
      <h2 className="page-title">床位分配 / Распределение мест</h2>
      <Space style={{ marginBottom: 16 }}>
        <Select defaultValue="ALL" style={{ width: 150 }} onChange={handleGenderChange}>
          <Select.Option value="ALL">全部 / Все</Select.Option>
          <Select.Option value="MALE">男生床位 / Мужские</Select.Option>
          <Select.Option value="FEMALE">女生床位 / Женские</Select.Option>
        </Select>
        {isAdmin() && (
          <Button type="primary" onClick={() => { form.resetFields(); setCreateModalVisible(true) }}>创建床位 / Создать</Button>
        )}
      </Space>
      <Table 
        columns={columns} 
        dataSource={beds} 
        rowKey="id" 
        loading={loading}
        pagination={{
          pageSize: 5,
          showTotal: (total) => `共 ${total} 条数据`,
          showSizeChanger: false
        }}
      />
      <Modal title="分配床位 / Распределить" open={assignModalVisible} onOk={handleAssign} onCancel={() => setAssignModalVisible(false)}>
        <Form form={assignForm} layout="vertical">
          <Form.Item name="bedId" label="床位ID / ID койки" rules={[{ required: true }]}><Input disabled /></Form.Item>
          <Form.Item name="studentId" label="选择学生 / Студент" rules={[{ required: true }]}>
            <Select showSearch placeholder="选择学生">{students.map(s => <Select.Option key={s.id} value={s.id}>{s.realName || s.username}（{s.studentId}）</Select.Option>)}</Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="创建床位 / Создать койку" open={createModalVisible} onOk={handleCreateBed} onCancel={() => setCreateModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="roomId" label="选择房间 / Комната" rules={[{ required: true }]}>
            <Select placeholder="选择房间">{rooms.map(r => <Select.Option key={r.id} value={r.id}>{r.roomNumber}（{r.floor?.building?.name}）</Select.Option>)}</Select>
          </Form.Item>
          <Form.Item name="bedNumber" label="床位号 / Номер койки" rules={[{ required: true }]}><Input placeholder="如：1号床" /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BedAssign