import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BuildingManage from './pages/BuildingManage'
import FloorManage from './pages/FloorManage'
import RoomManage from './pages/RoomManage'
import BedAssign from './pages/BedAssign'
import RepairManage from './pages/RepairManage'
import AssetManage from './pages/AssetManage'
import TransferManage from './pages/TransferManage'
import FeeManage from './pages/FeeManage'
import DormApplication from './pages/DormApplication'
import { getUserInfo } from './utils/auth'

function PrivateRoute({ children }) {
  const user = getUserInfo()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="buildings" element={<BuildingManage />} />
        <Route path="floors" element={<FloorManage />} />
        <Route path="rooms" element={<RoomManage />} />
        <Route path="beds" element={<BedAssign />} />
        <Route path="repairs" element={<RepairManage />} />
        <Route path="assets" element={<AssetManage />} />
        <Route path="transfers" element={<TransferManage />} />
        <Route path="fees" element={<FeeManage />} />
        <Route path="applications" element={<DormApplication />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
