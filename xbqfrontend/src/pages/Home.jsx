import { useApi } from '../hooks/useApi'

function Home() {
  const { data, loading, error } = useApi('/api/hello')

  return (
    <div className="page home">
      <h1>首页</h1>
      {loading && <p>加载中...</p>}
      {error && <p className="error">错误: {error}</p>}
      {data && <p>后端响应: {JSON.stringify(data)}</p>}
    </div>
  )
}

export default Home
