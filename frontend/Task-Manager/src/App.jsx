import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Login from './pages/Auth/Login'
import SingUp from './pages/Auth/SingUp'
import Dashboard from './pages/Admin/Dashboard'
import CreateTask from './pages/Admin/CreateTask'
import ManageTask from "./pages/Admin/ManageTask"
import ManageUsers from "./pages/Admin/MangeUsers";
import PrivateRoute from "./routes/PrivateRoute";
import UserDashboard from './pages/User/UserDashboard'
import MyTask from './pages/User/MyTask'
import ViewTaskDetails from "./pages/User/ViewTaskDetails";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='singUp' element={<SingUp />} />
        </Routes>

        {/* Admin Routes */}
        <Routes element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/create-task' element={<CreateTask />} />
          <Route path='/admin/task' element={<ManageTask />} />
          <Route path='/admin/users' element={<ManageUsers />} />
        </Routes>
        {/** User Routes */}
        <Routes element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path='/user/dashboard' element={<UserDashboard />} />
          <Route path='/user/my-task' element={<MyTask />} />
          <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
        </Routes>
      </Router>
    </>
  )
}

export default App