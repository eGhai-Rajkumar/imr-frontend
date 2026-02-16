import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, X, Pencil, Trash2, Copy, Eye, CheckCircle, AlertTriangle } from "lucide-react";
import axios from "axios";
import CreateActivity from "./CreateActivity";
// import "../../../css/Categories/CategoryList.css"; // reuse consistent styling
import "../../css/Categories/CategoryList.css";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const ACTIVITY_API_URL = "https://api.yaadigo.com/secure/api/activities/";
const PUBLIC_DOMAIN = "https://indianmountainrovers.com";

// ✅ Reusable Alert component
const Alert = ({ message, type, onClose }) => {
  if (!message) return null;
  const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white flex items-center z-50 transition-opacity duration-300";
  const typeStyle = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? CheckCircle : AlertTriangle;
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

export default function ActivityList() {
  const [activities, setActivities] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityData, setActivityData] = useState({});
  const [validation, setValidation] = useState({});
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  const getActivityId = (a) => a.id || a._id;

  const getAllActivities = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${ACTIVITY_API_URL}?skip=0&limit=1000&tenant_id=1`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) {
        const processed = res.data.data.map((a, index) => ({
          ...a,
          sno: index + 1,
        }));
        setActivities(processed);
      }
    } catch (err) {
      showAlert("Failed to load activities", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllActivities();
  }, []);

  // --- CRUD ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    try {
      await axios.delete(`${ACTIVITY_API_URL}${id}?tenant_id=1`, {
        headers: { "x-api-key": API_KEY },
      });
      showAlert("Activity deleted successfully");
      getAllActivities();
    } catch {
      showAlert("Failed to delete activity", "error");
    }
  };

  const handleDuplicate = async (activity) => {
    const clone = { ...activity };
    delete clone.id;
    delete clone._id;

    const timestamp = Date.now();
    const duplicatedData = {
      ...clone,
      name: `${activity.name} (Copy)`,
      slug: `${activity.slug}-copy-${timestamp}`,
      tenant_id: 1,
    };

    try {
      const res = await axios.post(ACTIVITY_API_URL, duplicatedData, {
        headers: { "x-api-key": API_KEY },
      });
      if (res.data.success) {
        showAlert("Activity duplicated successfully");
        getAllActivities();
      }
    } catch {
      showAlert("Error duplicating activity", "error");
    }
  };

  const handleView = (activity) => {
    const id = getActivityId(activity);
    const slug = activity.slug;
    if (slug && id) {
      window.open(`${PUBLIC_DOMAIN}/activity/${slug}/${id}`, "_blank");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected activities?`)) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${ACTIVITY_API_URL}${id}?tenant_id=1`, { headers: { "x-api-key": API_KEY } })
        )
      );
      showAlert("Selected activities deleted successfully!");
      setSelectedIds([]);
      getAllActivities();
    } catch {
      showAlert("Error deleting selected activities", "error");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredActivities.map(getActivityId));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const filteredActivities = useMemo(() => {
    if (!searchTerm) return activities;
    return activities.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activities, searchTerm]);

  const totalPages = Math.ceil(filteredActivities.length / rowsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="category-list-main p-6">
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
          <h2 className="text-3xl font-bold whitespace-nowrap">Activity List</h2>
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center transition-colors"
            >
              <Trash2 size={18} className="mr-2" /> Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsUpdate(false);
              setActivityData({});
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2" /> Add Activity
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading activities...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === paginatedActivities.length &&
                      paginatedActivities.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold">S.No</th>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Slug</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivities.map((a) => {
                const id = getActivityId(a);
                return (
                  <tr key={id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(id)}
                        onChange={() => handleSelectRow(id)}
                      />
                    </td>
                    <td className="px-4 py-3">{a.sno}</td>
                    <td className="px-4 py-3">{a.name}</td>
                    <td className="px-4 py-3">{a.slug}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        title="Edit"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          setActivityData(a);
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
                        onClick={() => handleDuplicate(a)}
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        title="View"
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleView(a)}
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

      {/* Pagination */}
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
          </select>
          <span>
            {filteredActivities.length === 0
              ? "0"
              : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                  currentPage * rowsPerPage,
                  filteredActivities.length
                )}`}{" "}
            of {filteredActivities.length}
          </span>
        </div>

        <div className="flex items-center space-x-1">
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
        </div>
      </div>

      <CreateActivity
        open={isModalOpen}
        setOpen={setIsModalOpen}
        isUpdate={isUpdate}
        setIsUpdate={setIsUpdate}
        activityData={activityData}
        setActivityData={setActivityData}
        getAllActivities={getAllActivities}
        showAlert={showAlert}
      />
    </div>
  );
}
