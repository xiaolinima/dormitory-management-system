import { useState, useEffect, useCallback } from 'react'
import request from '../utils/request'

export function useApi(apiPath, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await request.get(apiPath, { params: options.params })
      setData(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiPath])

  useEffect(() => {
    if (options.auto !== false) {
      fetchData()
    }
  }, [fetchData, options.auto])

  return { data, loading, error, refetch: fetchData }
}

export function useList(apiPath) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async (params) => {
    setLoading(true)
    try {
      const res = await request.get(apiPath, { params })
      setList(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      setList([])
    } finally {
      setLoading(false)
    }
  }, [apiPath])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { list, loading, fetch }
}

export function useDetail(apiPath, id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    request.get(`${apiPath}/${id}`).then(res => setData(res.data)).finally(() => setLoading(false))
  }, [apiPath, id])

  return { data, loading }
}
