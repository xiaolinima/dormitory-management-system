import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Select, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import request from '../utils/request'

function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await request.post('/auth/register', { ...values, role: values.role || 'STUDENT' })
      message.success('注册成功，请登录 / Регистрация прошла успешно')
      navigate('/login')
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '20px' }}>
      <Card style={{ width: '100%', maxWidth: '380px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333', fontWeight: 'normal' }}>用户注册 / Регистрация</h2>
        </div>
        <Form onFinish={onFinish} layout="vertical" size="large">
          <Form.Item name="username" label="用户名 / Имя пользователя" rules={[{ required: true, message: '请输入用户名 / Введите имя' }]}>
            <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="用户名 / Имя пользователя" />
          </Form.Item>
          <Form.Item name="password" label="密码 / Пароль" rules={[{ required: true, message: '请输入密码 / Введите пароль' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="密码 / Пароль" />
          </Form.Item>
          <Form.Item name="role" label="身份 / Роль" rules={[{ required: true, message: '请选择身份 / Выберите роль' }]}>
            <Select placeholder="请选择身份 / Выберите роль">
              <Select.Option value="STUDENT">学生 / Студент</Select.Option>
              <Select.Option value="ADMIN">管理员 / Администратор</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="gender" label="性别 / Пол" rules={[{ required: true, message: '请选择性别 / Выберите пол' }]}>
            <Select placeholder="请选择性别 / Выберите пол">
              <Select.Option value="MALE">男 / Мужской</Select.Option>
              <Select.Option value="FEMALE">女 / Женский</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="grade" label="年级 / Курс" rules={[{ required: true, message: '请输入年级 / Введите курс' }]}>
            <Input type="number" placeholder="如：2024 / Например: 2024" />
          </Form.Item>
          <Form.Item name="studentId" label="学号 / Номер студенческого" rules={[{ required: true, message: '请输入学号 / Введите номер' }]}>
            <Input placeholder="学号 / Номер студенческого" />
          </Form.Item>
          <Form.Item style={{ marginBottom: '10px' }}>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '38px', borderRadius: '4px' }}>
              注册 / ЗАРЕГИСТРИРОВАТЬСЯ
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
            已有账号？<a onClick={() => navigate('/login')} style={{ color: '#1890ff' }}>立即登录 / Войти</a>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
