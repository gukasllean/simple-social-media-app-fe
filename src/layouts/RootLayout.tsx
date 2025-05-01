import { Outlet } from 'react-router-dom'
import { Sidebar } from 'lucide-react'

const RootLayout = () => {
  return (
    <div>
      <Sidebar />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout