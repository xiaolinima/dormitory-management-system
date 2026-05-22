import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="page not-found">
      <h1>404</h1>
      <p>页面未找到</p>
      <Link to="/">返回首页</Link>
    </div>
  )
}

export default NotFound
