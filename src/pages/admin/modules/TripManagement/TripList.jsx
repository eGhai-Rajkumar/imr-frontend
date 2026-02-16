// src/modules/TripManagement/TripList.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Copy, Eye, Trash2, Search, X, CheckCircle, AlertTriangle } from "lucide-react"; 
import axios from "axios";
// import "../../css/TripManagement/TripList.css"; 

// --- Reusable Modal Component (UNCHANGED) ---
const CustomModal = ({ open, onClickOutside, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClickOutside}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// --- Reusable Alert Component (UNCHANGED) ---
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

const APIBaseUrl = axios.create({
  baseURL: "https://api.yaadigo.com/secure/api/",
});
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const headers = { headers: { "x-api-key": API_KEY, accept: "application/json" } };

const capitalize = (str) =>
  str ? str.replace(/\b\w/g, (c) => c.toUpperCase()) : "";

const slugify = (title) =>
  title
    ?.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "";

export default function TripList() {
  const [tripList, setTripList] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [duplicateId, setDuplicateId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [alert, setAlert] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  
  const showAlert = useCallback((message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await APIBaseUrl.get("trips/", headers);
      if (res?.data?.success) {
        const list = res.data.data
          .sort((a, b) => (b.id || b._id) - (a.id || a._id))
          .map((t, i) => ({ ...t, sno: i + 1 }));
        setTripList(list);
        setFilteredTrips(list);
      }
    } catch (err) {
      console.error("Failed to fetch trips", err);
      showAlert("Failed to load trips.", "error");
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const deleteTrip = async (id) => {
    try {
      await APIBaseUrl.delete(`trips/${id}`, headers);
      showAlert("Trip deleted successfully!", "success");
      fetchTrips(); // Auto-refresh
    } catch (err) {
      console.error("Error deleting trip", err);
      showAlert("Error deleting trip.", "error");
    }
  };

  const bulkDelete = async () => {
    try {
        await Promise.all(selectedIds.map((id) => APIBaseUrl.delete(`trips/${id}`, headers)));
        setSelectedIds([]);
        showAlert(`${selectedIds.length} trips deleted successfully!`, "success");
        fetchTrips(); // Auto-refresh
    } catch (err) {
        console.error("Error during bulk delete", err);
        showAlert("Error during bulk delete.", "error");
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteTrip(deleteId);
    } else if (selectedIds.length > 0) {
      bulkDelete();
    }
    setIsDeleteModalOpen(false);
    setDeleteId(null);
    setSelectedIds([]);
  };

  const duplicateTrip = async () => {
    try {
      setDuplicating(true);
      
      const res = await APIBaseUrl.get(`trips/${duplicateId}`, headers);
      const src = res.data.data;
      if (!src) return;

      const payload = {
        ...src,
        title: `Copy of ${src.title}`,
        slug: slugify(`Copy of ${src.title}-${Date.now()}`),
      };
      
      delete payload.id;
      delete payload._id; 
      delete payload.sno;

      const createRes = await APIBaseUrl.post("trips/", payload, headers);
      
      if (createRes?.data?.success) {
          showAlert("Trip duplicated successfully!", "success");
          fetchTrips();
      } else {
          throw new Error(createRes?.data?.message || "Trip creation failed on server.");
      }
      
    } catch (e) {
      console.error("Duplicate failed", e);
      const errorMessage = e.response?.data?.message || e.message || "An unknown error occurred.";
      showAlert(`Duplicate failed: ${errorMessage}`, "error");
    } finally {
      setDuplicating(false);
      setIsDuplicateModalOpen(false);
      setDuplicateId(null);
    }
  };

  useEffect(() => {
    const filtered = tripList.filter(
      (trip) =>
        trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.drop_location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrips(filtered);
    setCurrentPage(1);
  }, [searchTerm, tripList]);

  const totalPages = Math.ceil(filteredTrips.length / rowsPerPage);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? paginatedTrips.map((t) => t.id) : []);
  };
  
  const getTripTitle = useMemo(() => {
      if (!duplicateId) return 'this trip';
      const trip = tripList.find(t => t.id === duplicateId);
      return trip ? trip.title : 'this trip';
  }, [duplicateId, tripList]);

  return (
    <div className="admin-content-main p-6">
      <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
          <h3 className="text-3xl font-bold whitespace-nowrap">Trip List</h3>
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setDeleteId(null);
                setIsDeleteModalOpen(true);
              }}
              className="!bg-red-600 hover:!bg-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center transition-colors"
            >
              <Trash2 size={18} className="mr-2" /> Delete ({selectedIds.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard/trip-management/create")}
            className="!bg-green-600 hover:!bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2" /> Create Trip
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading trips...</p>
      ) : (
        <div className="overflow-x-auto">
            {/* 💡 ADJUSTMENT: Added table-fixed to fix column widths */}
          <table className="min-w-full bg-white rounded shadow table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left w-[5%]">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === paginatedTrips.length &&
                      paginatedTrips.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-4 py-3 w-[5%]">S.No</th>
                <th className="px-4 py-3 w-[30%]">Title</th>
                <th className="px-4 py-3 w-[15%]">Type</th>
                <th className="px-4 py-3 w-[15%]">Pickup</th>
                <th className="px-4 py-3 w-[15%]">Drop</th>
                <th className="px-4 py-3 w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrips.map((trip) => (
                <tr key={trip.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 w-[5%]">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(trip.id)}
                      onChange={() => toggleSelect(trip.id)}
                    />
                  </td>
                  <td className="px-4 py-3 w-[5%]">{trip.sno}</td>
                    {/* 💡 ADJUSTMENT: Truncate long content */}
                  <td className="px-4 py-3 w-[30%] overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">{trip.title}</td>
                  <td className="px-4 py-3 w-[15%]">{capitalize(trip.destination_type)}</td>
                    {/* 💡 ADJUSTMENT: Truncate long content */}
                  <td className="px-4 py-3 w-[15%] overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">{capitalize(trip.pickup_location)}</td>
                    {/* 💡 ADJUSTMENT: Truncate long content */}
                  <td className="px-4 py-3 w-[15%] overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">{capitalize(trip.drop_location)}</td>
                  <td className="px-4 py-3 w-[15%] flex gap-3">
                    <button
                      title="Edit"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() =>
                        navigate(`/admin/dashboard/trip-management/create/${trip.id}`)
                      }
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      title="Duplicate"
                      className="text-purple-600 hover:text-purple-800"
                      onClick={() => {
                        setDuplicateId(trip.id);
                        setIsDuplicateModalOpen(true);
                      }}
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      title="Preview"
                      className="text-green-600 hover:text-green-800"
                      onClick={() =>
                        window.open(`/trip-preview/${trip.slug}/${trip.id}`, "_blank")
                      }
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      title="Delete"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        setDeleteId(trip.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (unchanged) */}
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
            {filteredTrips.length === 0
              ? "0"
              : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                  currentPage * rowsPerPage,
                  filteredTrips.length
                )}`}{" "}
            of {filteredTrips.length}
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
      
      {/* Delete Modal */}
      <CustomModal
        open={isDeleteModalOpen}
        onClickOutside={() => {
            if (!loading) {
                setIsDeleteModalOpen(false);
                setDeleteId(null);
                setSelectedIds([]);
            }
        }}
      >
        <h4 className="text-xl font-bold mb-4 text-center">Confirm Deletion</h4>
        <p className="text-center text-gray-700 mb-6">
          {deleteId 
            ? `Are you sure you want to delete this trip?` 
            : `Are you sure you want to delete the ${selectedIds.length} selected trips?`}
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="!bg-red-600 hover:!bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button
            className="!bg-gray-300 hover:!bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setDeleteId(null);
              setSelectedIds([]);
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </CustomModal>

      {/* Duplicate Modal */}
      <CustomModal
        open={isDuplicateModalOpen}
        onClickOutside={() => {
          if (!duplicating) {
            setIsDuplicateModalOpen(false);
            setDuplicateId(null);
          }
        }}
      >
        <h4 className="text-xl font-bold mb-4 text-center text-purple-600">Duplicate Trip</h4>
        <p className="text-center text-gray-700 mb-6">
          Do you want to create a copy of **{getTripTitle}**?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="!bg-purple-600 hover:!bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold"
            onClick={duplicateTrip}
            disabled={duplicating}
          >
            {duplicating ? 'Duplicating...' : 'Yes, Duplicate'}
          </button>
          <button
            className="!bg-gray-300 hover:!bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold"
            onClick={() => {
              setIsDuplicateModalOpen(false);
              setDuplicateId(null);
            }}
            disabled={duplicating}
          >
            Cancel
          </button>
        </div>
      </CustomModal>
      
    </div>
  );
}