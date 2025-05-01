import { useState } from "react"
import Sidebar from "../components/sidebar"
import ShoppingListView from "../components/shopping-list-view"
import { PlusCircle } from 'lucide-react'

function Home() {
  const [activeList, setActiveList] = useState("Fruits")
  
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  
  if (!isLoggedIn) {
    // Uncomment baris di bawah jika ingin mengaktifkan redirect
    // navigate("/login")

    // Contoh ikon:
    // <PlusCircle size={24} className="text-blue-500" strokeWidth={1.5} />

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
        }}
      >
        <PlusCircle className="h-6 w-6 text-gray-500" />
      </button>
    </div>
  )
}

export default Home
