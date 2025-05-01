"use client"

import { type FC, useState } from "react"

interface ShoppingItem {
  id: string
  name: string
  quantity: number
}

interface ShoppingListViewProps {
  listName: string
}

const ShoppingListView: FC<ShoppingListViewProps> = ({ listName }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(listName)
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: "1", name: "Banana", quantity: 1 },
    { id: "2", name: "Watermelon", quantity: 1 },
  ])

  const handleDeleteList = () => {
    // In a real app, this would delete the list from storage
    setItems([])
  }

  return (
    <div className="w-full max-w-xs">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
              className="w-full text-lg font-medium border-2 border-blue-400 rounded px-2 py-1 outline-none"
              autoFocus
            />
          ) : (
            <div
              className="text-lg font-medium border-2 border-transparent px-2 py-1 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </div>
          )}

          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-centaer">
                <span>{item.name}</span>
                <span className="text-gray-500">{item.quantity}x</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-100 p-2 flex justify-center">
          <button className="text-xs px-4 py-1 rounded-full bg-red-100 text-red-500" onClick={handleDeleteList}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ShoppingListView
