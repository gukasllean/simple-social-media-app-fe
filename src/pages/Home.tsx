import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Trash, Edit, X, User } from 'lucide-react';
import axios from "../utils/AxiosInstance";

// Interface yang sesuai dengan entity backend
interface Category {
  id: number;
  name: string;
  isActive: boolean;
  items: ShoppingItem[];
}

interface ShoppingItem {
  id: number;
  itemName: string; // Sesuai dengan entity ShoppingItem di backend
  quantity: number;
  categoryId: number;
  category: Category;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;
function Home() {
  const [showItemActions, setShowItemActions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [editItemName, setEditItemName] = useState("");
  const [editItemQuantity, setEditItemQuantity] = useState(1);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil data kategori dan item
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mengambil semua kategori dengan item-nya
      const response = await axios.get<Category[]>(`${API_BASE_URL}/categories`);
      
      // Filter hanya kategori aktif
      const activeCategories = response.data.filter(category => category.isActive);
      setCategories(activeCategories);
      
      if (activeCategories.length > 0) {
        setActiveCategory(activeCategories[0].id);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Gagal mengambil data kategori dari server');
      setIsLoading(false);
    }
  };

  // Mengambil data saat komponen dimuat
  useEffect(() => {
    fetchData();
  }, []);

  // Mendapatkan kategori aktif
  const getActiveCategory = () => {
    return categories.find(cat => cat.id === activeCategory);
  };

  // Fungsi untuk menampilkan aksi item (edit/delete)
  const handleItemClick = (item: ShoppingItem) => {
    setSelectedItem(item);
    setShowItemActions(true);
  };

  // Fungsi untuk menghapus item
  const handleDeleteItem = async (itemId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/items${itemId}`);
      
      // Refresh data setelah menghapus
      fetchData();
      setShowItemActions(false);
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Gagal menghapus item');
    }
  };

  // Fungsi untuk membuka modal edit
  const handleOpenEditModal = () => {
    if (selectedItem) {
      setEditItemName(selectedItem.itemName);
      setEditItemQuantity(selectedItem.quantity);
      setShowEditModal(true);
      setShowItemActions(false);
    }
  };

  // Fungsi untuk memperbarui item (nama dan jumlah)
  const handleUpdateItem = async () => {
    if (!selectedItem) return;
    
    if (editItemName.trim() === "") {
      alert("Nama item tidak boleh kosong");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/items/${selectedItem.id}`, { 
        itemName: editItemName,
        quantity: editItemQuantity 
      });
      
      // Refresh data setelah update
      fetchData();
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating item:', err);
      alert('Gagal memperbarui item');
    }
  };

  // Fungsi untuk menambahkan item atau kategori baru
  const handleAddItem = async () => {
    if (newItemName.trim() === "") {
      alert("Nama item tidak boleh kosong");
      return;
    }

    try {
      if (isAddingCategory) {
        if (newCategoryName.trim() === "") {
          alert("Nama kategori tidak boleh kosong");
          return;
        }

        // Buat kategori baru terlebih dahulu
        const categoryResponse = await axios.post(`${API_BASE_URL}/categories`, {
          name: newCategoryName,
          isActive: true
        });

        const newCategory = categoryResponse.data;

        // Kemudian tambahkan item ke kategori baru tersebut
        await axios.post(`${API_BASE_URL}/items`, {
          itemName: newItemName,
          quantity: newItemQuantity,
          categoryId: newCategory.id
        });

        // Refresh data setelah menambahkan
        fetchData();
        setActiveCategory(newCategory.id);
      } else {
        // Menambahkan item ke kategori yang sudah ada
        if (!activeCategory) {
          alert("Pilih kategori terlebih dahulu");
          return;
        }

        await axios.post(`${API_BASE_URL}/items`, {
          itemName: newItemName,
          quantity: newItemQuantity,
          categoryId: activeCategory
        });

        // Refresh data setelah menambahkan
        fetchData();
      }

      // Reset form dan tutup modal
      setNewItemName("");
      setNewItemQuantity(1);
      setNewCategoryName("");
      setIsAddingCategory(false);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Gagal menambahkan item');
    }
  };

  // Fungsi untuk menghapus semua item dalam kategori
  const handleDeleteCategory = async () => {
    if (!activeCategory) return;
    
    if (confirm("Apakah Anda yakin ingin menghapus seluruh kategori ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/categories/${activeCategory}`);
        
        // Refresh data setelah menghapus
        fetchData();
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Gagal menghapus kategori');
      }
    }
  };

  // Fungsi untuk mengganti kategori aktif
  const handleChangeCategory = (categoryId: number) => {
    setActiveCategory(categoryId);
  };

  // Tampilkan loading spinner saat data sedang dimuat
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <div className="w-10"></div> {/* Spacer untuk menyeimbangkan layout */}
        <h1 className="text-xl font-bold">Shopping List</h1>
        <Link to="/profile">
          <button
            className="bg-white rounded-full p-2 shadow-md"
            aria-label="Profile"
          >
            <User className="h-5 w-5 text-blue-500" />
          </button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {/* Kategori Selector */}
        {categories.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => handleChangeCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {activeCategory && getActiveCategory()?.items.length ? (
          <div className="border rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-medium">{getActiveCategory()?.name}</span>
              </div>
            </div>

            <div className="p-3">
              {getActiveCategory()?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2"
                  onClick={() => handleItemClick(item)}
                >
                  <span>{item.itemName}</span>
                  <span className="text-gray-500">{item.quantity}x</span>
                </div>
              ))}
            </div>

            <div className="border-t p-2 flex justify-end">
              <button
                className="px-4 py-1 bg-red-100 text-red-500 rounded-full text-sm"
                onClick={handleDeleteCategory}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            {categories.length > 0 
              ? "Daftar belanja kategori ini kosong. Tambahkan item menggunakan tombol +."
              : "Tidak ada kategori. Tambahkan kategori baru menggunakan tombol +."}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 rounded-full p-3 shadow-md"
        aria-label="Add new item"
        onClick={() => setShowAddModal(true)}
      >
        <PlusCircle className="h-6 w-6 text-white" />
      </button>

      {/* Modal untuk aksi item (edit/delete) */}
      {showItemActions && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-md">
            <h3 className="text-xl font-bold mb-4">{selectedItem.itemName}</h3>
            <div className="flex items-center justify-between mb-4">
              <span>Jumlah: {selectedItem.quantity}x</span>
              <div className="flex space-x-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded-md flex items-center"
                  onClick={handleOpenEditModal}
                >
                  <Edit className="h-5 w-5 mr-1" />
                  Edit
                </button>
                <button
                  className="p-2 bg-red-500 text-white rounded-md flex items-center"
                  onClick={() => handleDeleteItem(selectedItem.id)}
                >
                  <Trash className="h-5 w-5 mr-1" />
                  Hapus
                </button>
              </div>
            </div>
            <button className="w-full p-2 bg-gray-200 rounded-md" onClick={() => setShowItemActions(false)}>
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Modal untuk mengedit item */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Edit Item</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowEditModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
              <input
                type="text"
                value={editItemName}
                onChange={(e) => setEditItemName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama item"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
              <input
                type="number"
                min="1"
                value={editItemQuantity}
                onChange={(e) => setEditItemQuantity(parseInt(e.target.value) || 1)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <button 
                className="flex-1 bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600" 
                onClick={handleUpdateItem}
              >
                Simpan
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2 hover:bg-gray-300"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal untuk menambahkan item/kategori baru */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {isAddingCategory ? "Tambah Kategori & Item Baru" : "Tambah Item Baru"}
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowAddModal(false);
                  setIsAddingCategory(false);
                  setNewItemName("");
                  setNewItemQuantity(1);
                  setNewCategoryName("");
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="addCategory"
                  checked={isAddingCategory}
                  onChange={(e) => setIsAddingCategory(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="addCategory" className="text-sm font-medium text-gray-700">
                  Tambahkan ke kategori baru
                </label>
              </div>

              {isAddingCategory && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama kategori"
                  />
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Item</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama item"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
              <input
                type="number"
                min="1"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600" onClick={handleAddItem}>
                Tambah
              </button>
              <button
                className="flex-1 bg-gray-200 text-gray-800 rounded-md py-2 hover:bg-gray-300"
                onClick={() => {
                  setShowAddModal(false);
                  setIsAddingCategory(false);
                  setNewItemName("");
                  setNewItemQuantity(1);
                  setNewCategoryName("");
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;