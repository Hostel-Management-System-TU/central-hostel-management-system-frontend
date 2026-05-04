// layouts/UserLayout.jsx
import { Outlet } from "react-router"
import { useState } from "react"
import Navbar from "../components/navbar/Navbar"
import UserSidebar from "../components/sidebar/user_sidebar"

export default function UserLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen)
  const closeSidebar = () => setIsMobileSidebarOpen(false)

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Mobile Navbar */}
      <Navbar 
        onMenuClick={toggleSidebar} 
        isOpen={isMobileSidebarOpen} 
      />

      <div className="flex">
        {/* Sidebar - Desktop always visible, Mobile slide-over */}
        <UserSidebar 
          isMobileOpen={isMobileSidebarOpen} 
          onClose={closeSidebar} 
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-6xl pt-8 sm:px-6 px-5 max-sm:pt-22">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}