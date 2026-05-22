import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import {
  HomeOutlined,
  ApartmentOutlined,
  ClusterOutlined,
  TeamOutlined,
  ToolOutlined,
  AppstoreOutlined,
  SwapOutlined,
  DollarOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { removeUserInfo, isAdmin } from '../utils/auth'

const { Header, Sider, Content } = Layout

function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    removeUserInfo()
    navigate('/login')
  }

  // 根据角色动态生成菜单
  const getMenuItems = () => {
    const baseMenu = [
      { key: '/', icon: <HomeOutlined />, label: <Link to="/">首页 / Главная</Link> },
      { key: '/applications', icon: <AppstoreOutlined />, label: <Link to="/applications">宿舍申请 / Заявка</Link> },
      { key: '/beds', icon: <TeamOutlined />, label: <Link to="/beds">床位分配 / Места</Link> },
      { key: '/repairs', icon: <ToolOutlined />, label: <Link to="/repairs">维修服务 / Ремонт</Link> },
      { key: '/transfers', icon: <SwapOutlined />, label: <Link to="/transfers">调宿历史 / Переселение</Link> },
      { key: '/fees', icon: <DollarOutlined />, label: <Link to="/fees">欠费查询 / Задолженность</Link> },
    ]

    // 管理员有更多菜单
    if (isAdmin()) {
      const adminMenu = [
        { key: '/buildings', icon: <ApartmentOutlined />, label: <Link to="/buildings">楼栋管理 / Корпуса</Link> },
        { key: '/floors', icon: <ClusterOutlined />, label: <Link to="/floors">楼层管理 / Этажи</Link> },
        { key: '/rooms', icon: <AppstoreOutlined />, label: <Link to="/rooms">房间管理 / Комнаты</Link> },
        { key: '/assets', icon: <AppstoreOutlined />, label: <Link to="/assets">资产盘点 / Инвентарь</Link> },
      ]
      // 把管理员菜单插入到首页之后
      return [baseMenu[0], ...adminMenu, ...baseMenu.slice(1)]
    }

    return baseMenu
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', color: '#fff', background: '#001529' }}>
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginRight: 40 }}>
          学生宿舍管理系统 / Система управления общежитием
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <UserOutlined /> {localStorage.getItem('username') || ''}
          <LogoutOutlined onClick={handleLogout} style={{ cursor: 'pointer' }} />
        </div>
      </Header>
      <Layout>
        <Sider width={220} style={{ background: '#fff' }}>
          <Menu mode="inline" selectedKeys={[location.pathname]} items={getMenuItems()} style={{ height: '100%' }} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ marginTop: 24 }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MainLayout
