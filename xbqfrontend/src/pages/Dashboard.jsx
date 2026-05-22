import { useEffect, useState } from 'react'
import { Card, Row, Col } from 'antd'
import request from '../utils/request'
import { getUserInfo } from '../utils/auth'

function Dashboard() {
  const [stats, setStats] = useState({ building: 0, room: 0, student: 0, repair: 0 })
  const user = getUserInfo()

  useEffect(() => {
    Promise.all([
      request.get('/buildings').catch(() => ({ data: [] })),
      request.get('/rooms').catch(() => ({ data: [] })),
      request.get('/users/students').catch(() => ({ data: [] })),
      request.get('/repairs').catch(() => ({ data: [] })),
    ]).then(([b, r, s, rp]) => {
      setStats({
        building: Array.isArray(b.data) ? b.data.length : 0,
        room: Array.isArray(r.data) ? r.data.length : 0,
        student: Array.isArray(s.data) ? s.data.length : 0,
        repair: Array.isArray(rp.data) ? rp.data.length : 0,
      })
    })
  }, [])

  const items = [
    { label: '楼栋数量 / Корпусов', value: stats.building, color: '#1890ff' },
    { label: '房间数量 / Комнат', value: stats.room, color: '#52c41a' },
    { label: '学生数量 / Студентов', value: stats.student, color: '#faad14' },
    { label: '维修申请 / Заявок на ремонт', value: stats.repair, color: '#f5222d' },
  ]

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>欢迎使用宿舍管理系统 / Добро пожаловать</h2>
      <p style={{ marginBottom: 24 }}>当前用户 / Текущий пользователь：{user?.realName || user?.username}（{user?.role === 'ADMIN' ? '管理员 / Администратор' : '学生 / Студент'}）</p>
      <Row gutter={16}>
        {items.map(item => (
          <Col span={6} key={item.label}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#666', fontSize: 14 }}>{item.label}</div>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: item.color }}>{item.value}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Dashboard
