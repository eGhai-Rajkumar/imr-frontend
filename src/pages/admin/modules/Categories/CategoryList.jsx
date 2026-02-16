import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, X, Pencil, Trash2, Copy, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import CreateCategory from './CreateCategory'; 
import axios from 'axios'; 
import "../../css/Categories/CategoryList.css"; 

// --- API Configuration ---
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M"; 
const CATEGORY_API_URL = "https://api.yaadigo.com/secure/api/categories/";
const UPLOAD_URL = "https://api.yaadigo.com/multiple"; 
const BACKEND_DOMAIN = "https://api.yaadigo.com/uploads"; 
const PUBLIC_DOMAIN = "https://indianmountainrovers.com"; 

// --- Alert Component ---
const Alert = ({ message, type, onClose }) => {
  if (!message) return null;
  const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white flex items-center z-50 transition-opacity duration-300";
  const typeStyle = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircle : AlertTriangle;
  return (
    <div className={`${baseStyle} ${typeStyle}`}>
      <Icon size={20} className="mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20">
        <X size={16} />
      </button>
    </div>
  );
};

export default function CategoryList() {
  const [categories, setCategories] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState({});
  const [validation, setValidation] = useState({});
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]); 
  const [alert, setAlert] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Helpers ---
  const showAlert = useCallback((message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  const getCategoryId = (category) => category.id || category._id;

  // --- API ---
  const getAllTourCategory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${CATEGORY_API_URL}?skip=0&limit=1000&tenant_id=2`, { 
        headers: { 'accept': 'application/json', 'x-api-key': API_KEY }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        const processed = result.data.map((cat, index) => ({
          ...cat,
          sno: index + 1,
        }));
        setCategories(processed);
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { getAllTourCategory(); }, []);

  // --- CRUD Actions ---
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axios.delete(`${CATEGORY_API_URL}${id}?tenant_id=2`, { headers: { 'x-api-key': API_KEY } });
      showAlert("Category deleted successfully!");
      getAllTourCategory();
    } catch (error) {
      showAlert("Failed to delete category.", 'error');
    }
  };

  const handleDuplicate = (category) => {
    const clone = { ...category };
    delete clone.id;
    delete clone._id;
    setCategoryData({
      ...clone,
      name: `${category.name} (Copy)`,
      slug: `${category.slug}-copy`,
      tenant_id: 2,
      isDuplicating: true,
    });
    setIsUpdate(false);
    setIsModalOpen(true);
  };

  const handleView = (category) => {
    const id = getCategoryId(category);
    const slug = category.slug;
    if (slug && id) window.open(`${PUBLIC_DOMAIN}/category/${slug}/${id}`, "_blank");
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredCategories.map(getCategoryId));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected categories?`)) return;
    try {
      await Promise.all(selectedIds.map((id) => axios.delete(`${CATEGORY_API_URL}${id}?tenant_id=2`, { headers: { 'x-api-key': API_KEY } })));
      showAlert("Selected categories deleted successfully!");
      setSelectedIds([]);
      getAllTourCategory();
    } catch {
      showAlert("Error deleting selected categories.", "error");
    }
  };

  // --- Filter + Pagination ---
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="category-list-main p-6">
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
          <h2 className="text-3xl font-bold whitespace-nowrap">Trip Category</h2>
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="!bg-red-600 hover:!bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center transition-colors"
            >
              <Trash2 size={18} className="mr-2" /> Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="!bg-green-600 hover:!bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2" /> Add Category
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading categories...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === paginatedCategories.length &&
                      paginatedCategories.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold">S.No</th>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Slug</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category) => {
                const id = getCategoryId(category);
                return (
                  <tr key={id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => handleSelectRow(id)}
                      />
                    </td>
                    <td className="px-4 py-3">{category.sno}</td>
                    <td className="px-4 py-3">{id}</td>
                    <td className="px-4 py-3">{category.name}</td>
                    <td className="px-4 py-3">{category.slug}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        title="Edit"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setCategoryData(category);
                          setIsUpdate(true);
                          setIsModalOpen(true);
                        }}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(id)}
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        title="Duplicate"
                        className="text-purple-600 hover:text-purple-800"
                        onClick={() => handleDuplicate(category)}
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        title="View"
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleView(category)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-700">
        <div>
          Rows per page:
          <select
            className="mx-2 p-1 border rounded"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>
            {filteredCategories.length === 0
              ? "0"
              : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                  currentPage * rowsPerPage,
                  filteredCategories.length
                )}`}{" "}
            of {filteredCategories.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            className={`px-2 py-1 border rounded ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            className={`px-2 py-1 border rounded ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Modal */}
      <CreateCategory
        open={isModalOpen}
        setOpen={setIsModalOpen}
        categoryData={categoryData}
        setcategoryData={setCategoryData}
        validation={validation}
        setValidation={setValidation}
        isViewOnly={isViewOnly}
        setIsViewOnly={setIsViewOnly}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        handleSubmit={() => {}}
        handleUpdate={() => {}}
        handleFileUpload={() => {}}
        handleRemoveImage={() => {}}
        getAllTourCategory={getAllTourCategory}
      />
    </div>
  );
}
