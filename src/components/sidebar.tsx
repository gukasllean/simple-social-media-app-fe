"use client"

import type { FC } from "react"

interface SidebarProps {
  activeList: string
  setActiveList: (list: string) => void
}

const Sidebar: FC<SidebarProps> = ({ activeList, setActiveList }) => {
  return (
    <div className="w-24 md:w-32 bg-white border-r border-gray-200 flex flex-col">
      {/* Bagian atas: logo dan judul */}
      <div className="flex-1">
        <div className="p-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto mb-2"></div>
          <h2 className="text-xs text-center font-medium">Shopping List</h2>
        </div>

        {/* Navigasi */}
        <nav className="mt-6">
          <button
            className={`w-full py-3 text-xs font-medium transition-colors ${
              activeList === "Today's List"
                ? "text-blue-500 bg-blue-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveList("Today's List")}
          >
            Today&apos;s List
          </button>

          <button
            className={`w-full py-3 text-xs font-medium transition-colors ${
              activeList === "Add New List"
                ? "text-blue-500 bg-blue-50"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveList("Add New List")}
          >
            Add New List
          </button>
        </nav>
      </div>

      {/* Footer / tombol Settings */}
      <button className="w-full py-4 text-xs font-medium text-gray-700 border-t border-gray-200 hover:bg-gray-100 transition-colors">
        Settings
      </button>
    </div>
  )
}

export default Sidebar
