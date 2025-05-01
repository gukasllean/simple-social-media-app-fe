import { useState } from "react"
import Sidebar from "../components/sidebar"
import ShoppingListView from "../components/shopping-list-view"
import { PlusCircle } from 'lucide-react'

function Home() {
  const [activeList, setActiveList] = useState("Fruits")
  
  // Cek apakah user sudah login (contoh sederhana)
  // Dalam aplikasi nyata, gunakan context atau state management
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  
  // Redirect ke halaman login jika belum login
  if (!isLoggedIn) {
    // Uncomment baris di bawah jika ingin mengaktifkan redirect
    // navigate("/login")
    // return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeList={activeList} setActiveList={setActiveList} />
      <main className="flex-1 p-4 flex justify-center">
        <ShoppingListView listName={activeList} />
      </main>
      <button 
        className="fixed bottom-6 right-6 bg-gray-200 rounded-full p-3 shadow-md" 
        aria-label="Add new item"
        onClick={() => {
          // Logika untuk menambahkan item baru
          // Bisa dengan membuka modal atau navigasi ke halaman baru
        }}
      >
        <PlusCircle className="h-6 w-6 text-gray-500" />
      </button>
    </div>
  )
}

export default Home