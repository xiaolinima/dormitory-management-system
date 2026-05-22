import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import request from '../utils/request'
import { setUserInfo } from '../utils/auth'

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await request.post('/auth/login', values)
      setUserInfo({ ...res.data, token: '' })
      message.success('Вход выполнен / 登录成功')
      navigate('/')
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5', padding: '20px' }}>
      <Card style={{ width: '100%', maxWidth: '360px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', color: '#333', fontWeight: 'normal' }}>
            学生宿舍管理系统 / Система управления общежитием
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#999' }}>登录你的账号 / Войдите в свой аккаунт</p>
        </div>
        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名 / Введите имя пользователя' }]}>
            <Input prefix={<UserOutlined style={{ color: '#bbb' }} />} placeholder="用户名 / Имя пользователя" style={{ borderRadius: '4px' }} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码 / Введите пароль' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#bbb' }} />} placeholder="密码 / Пароль" style={{ borderRadius: '4px' }} />
          </Form.Item>
          <Form.Item style={{ marginBottom: '12px' }}>
            <Button type="primary" htmlType="submit" loading={loading} block style={{ height: '38px', borderRadius: '4px', fontSize: '15px' }}>
              登录 / ВОЙТИ
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>
            还没有账号？<a onClick={() => navigate('/register')} style={{ color: '#1890ff' }}>立即注册 / Зарегистрироваться</a>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
