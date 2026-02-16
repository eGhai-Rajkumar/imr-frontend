// src/modules/Destinations/DestinationList.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Copy, Eye, Search, X, CheckCircle, AlertTriangle } from "lucide-react";
import axios from "axios";

// --- API CONFIG, UTILITIES, MODAL/ALERT COMPONENTS (UNCHANGED) ---
const APIBaseUrl = axios.create({ baseURL: "https://api.yaadigo.com/secure/api/" });
const DESTINATION_API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";

const capitalizeWords = (str) =>
  str
    ? str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

const generateUniqueSlug = (originalSlug, originalTitle) => {
    const baseName = originalSlug || originalTitle || 'destination';
    const cleanBase = baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const timestamp = Date.now();
    return `${cleanBase}-copy-${timestamp}`;
};

const CustomModal = ({ open, onClickOutside, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClickOutside}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

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

// --- MAIN COMPONENT ---
const DestinationList = () => {
    const [destinationList, setDestinationList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true); 
    const [selectionModel, setSelectionModel] = useState([]);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const [duplicateId, setDuplicateId] = useState("");
    const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [alert, setAlert] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    const getDestinationId = (destination) => destination.id || destination._id;

    const showAlert = useCallback((message, type = "success") => {
        setAlert({ message, type });
        setTimeout(() => setAlert(null), 4000);
    }, []);

    const getAllDestination = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await APIBaseUrl.get("destinations/", {
                headers: { "x-api-key": DESTINATION_API_KEY, 'accept': 'application/json' },
            });
            if (res?.data?.success === true) {
                const processedList = (res.data.data || [])
                    .sort((a, b) => (b.id || b._id) - (a.id || a._id))
                    .map((dest, index) => ({
                        ...dest,
                        sno: index + 1,
                        id: getDestinationId(dest),
                    })) || [];
                setDestinationList(processedList);
            } else {
                setDestinationList([]);
            }
        } catch (error) {
            console.error("Failed to fetch destinations.", error);
            setDestinationList([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getAllDestination();
    }, [getAllDestination]);

    const filteredDestinations = useMemo(() => {
        if (!searchTerm) return destinationList;
        return destinationList.filter(
            (dest) =>
                dest.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dest.slug?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [destinationList, searchTerm]);

    const totalPages = Math.ceil(filteredDestinations.length / rowsPerPage);
    const paginatedDestinations = filteredDestinations.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    
    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxPagesToShow = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [totalPages, currentPage]);
    
    const handleUpdateNavigate = (_id) => {
        navigate(`/admin/dashboard/destination-create/${_id}`);
    }

    const handlePreview = (slug, id) => {
        const url = `/destination/${slug}/${id}`;
        window.open(url, '_blank');
    };

    const handleDeleteDestination = async (id) => { 
        try {
            await APIBaseUrl.delete(`destinations/${id}`, { headers: { "x-api-key": DESTINATION_API_KEY } });
            showAlert("Destination Deleted Successfully", "success");
            getAllDestination();
        } catch (error) {
            showAlert("Failed to delete destination.", "error");
        }
    }
    
    const handleBulkDelete = async () => { 
        if (selectionModel.length === 0) return;
        try {
            const deletePromises = selectionModel.map(id => APIBaseUrl.delete(`destinations/${id}`, { headers: { "x-api-key": DESTINATION_API_KEY } }));
            await Promise.allSettled(deletePromises);
            showAlert(`${selectionModel.length} destinations deleted successfully.`, "success");
            setOpenDeleteModal(false);
            setSelectionModel([]);
            getAllDestination();
        } catch (error) {
            showAlert("An error occurred during bulk delete.", "error");
            setOpenDeleteModal(false);
        }
    }
    
    const handleDeleteConfirm = () => {
        if (deleteId) {
            handleDeleteDestination(deleteId);
        } else if (selectionModel.length > 0) {
            handleBulkDelete();
        }
        setOpenDeleteModal(false);
        setDeleteId(null);
        setSelectionModel([]);
    }

    const handleDuplicateDestination = async () => {
        if (!duplicateId) return;
        setIsDuplicating(true);
        try {
            const getRes = await APIBaseUrl.get(`destinations/${duplicateId}`, { headers: { "x-api-key": DESTINATION_API_KEY, 'accept': 'application/json' } });
            if (!getRes?.data?.success || !getRes?.data?.data) throw new Error("Failed to fetch destination data for duplication.");
            
            const originalData = getRes.data.data;
            const newDestinationData = { ...originalData };
            
            delete newDestinationData.id; delete newDestinationData._id; delete newDestinationData.created_at; delete newDestinationData.updated_at;
            newDestinationData.title = `Copy of ${originalData.title}`;
            newDestinationData.slug = generateUniqueSlug(originalData.slug, originalData.title);

            // API Payload Sanitization (for nested objects/IDs)
            if (originalData.popular_trips && Array.isArray(originalData.popular_trips)) {
                newDestinationData.popular_trip_ids = originalData.popular_trips.map(trip => trip.id).filter(id => id != null);
            } else { newDestinationData.popular_trip_ids = []; }
            delete newDestinationData.popular_trips;

            if (originalData.custom_packages && Array.isArray(originalData.custom_packages)) {
                newDestinationData.custom_packages = originalData.custom_packages.map(pkg => {
                    const newPkg = { ...pkg }; delete newPkg.id; delete newPkg._id;
                    if (newPkg.trips && Array.isArray(newPkg.trips)) {
                        newPkg.trip_ids = newPkg.trips.map(trip => trip.id).filter(id => id != null);
                    } else { newPkg.trip_ids = newPkg.trip_ids || []; }
                    delete newPkg.trips;
                    return newPkg;
                });
            } else { newDestinationData.custom_packages = []; }

            newDestinationData.featured_blog_ids = originalData.featured_blog_ids || [];
            newDestinationData.related_blog_ids = originalData.related_blog_ids || [];
            newDestinationData.activity_ids = originalData.activity_ids || [];

            const postRes = await APIBaseUrl.post("destinations/", newDestinationData, { headers: { "x-api-key": DESTINATION_API_KEY, 'Content-Type': 'application/json' } });

            if (postRes?.data?.success === true) {
                showAlert("Destination Duplicated Successfully. A copy has been created.", "success");
                getAllDestination();
            } else {
                throw new Error(postRes?.data?.message || "Destination creation failed.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
            showAlert(`Failed to duplicate: ${errorMessage}`, "error");
        } finally {
            setIsDuplicating(false);
            setOpenDuplicateModal(false);
            setDuplicateId(null);
        }
    };

    const handleSelectRow = (id) => {
        setSelectionModel(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectionModel(destinationList.map(getDestinationId));
        else setSelectionModel([]);
    };
    const allSelected = destinationList.length > 0 && selectionModel.length === destinationList.length;

    return (
        <div className='admin-content-main p-6'>
            <Alert message={alert?.message} type={alert?.type} onClose={() => setAlert(null)} />

            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-3xl font-bold'>Destination List</h3>
                <div className='flex items-center space-x-3'>
                    {selectionModel.length > 0 && (
                        <button 
                            onClick={() => { setDeleteId(null); setOpenDeleteModal(true); }}
                            className='flex items-center px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-colors bg-red-600 hover:bg-red-700 disabled:bg-red-300' 
                        >
                            <Trash2 size={20} className='mr-2' /> Delete ({selectionModel.length}) Selected
                        </button>
                    )}
                    <button 
                        className='flex items-center px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-colors bg-orange-600 hover:bg-orange-700' 
                        onClick={() => navigate("/admin/dashboard/destination-create")}
                    >
                        <Plus size={20} className='mr-2' /> Add Destination
                    </button>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (<p className="text-center text-xl">Loading destinations...</p>) : (
                <div className="overflow-x-auto">
                    {/* 💡 ADJUSTMENT: Added table-fixed to fix column widths */}
                    <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg table-fixed">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left w-[5%]"><input type="checkbox" checked={allSelected} onChange={handleSelectAll} className="form-checkbox" /></th>
                                <th scope="col" className="px-6 py-3 text-left w-[5%] text-xs font-medium text-gray-500 uppercase tracking-wider">SNO</th>
                                <th scope="col" className="px-6 py-3 text-left w-[30%] text-xs font-medium text-gray-500 uppercase tracking-wider">Destination Name</th>
                                <th scope="col" className="px-6 py-3 text-left w-[20%] text-xs font-medium text-gray-500 uppercase tracking-wider">Destination Type</th>
                                <th scope="col" className="px-6 py-3 text-left w-[25%] text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th scope="col" className="px-6 py-3 text-left w-[15%] text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedDestinations.map((destination) => {
                                const id = getDestinationId(destination);
                                return (
                                    <tr key={id}> 
                                        <td className="px-6 py-4 w-[5%]"><input type="checkbox" checked={selectionModel.includes(id)} onChange={() => handleSelectRow(id)} className="form-checkbox" /></td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 w-[5%]">{destination.sno}</td>
                                        {/* 💡 ADJUSTMENT: Truncate long names */}
                                        <td className="px-6 py-4 text-sm text-gray-900 w-[30%] overflow-hidden whitespace-nowrap text-ellipsis max-w-xs">{capitalizeWords(destination.title)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 w-[20%]">{capitalizeWords(destination.destination_type)}</td>
                                        {/* 💡 ADJUSTMENT: Truncate long slugs */}
                                        <td className="px-6 py-4 text-sm text-gray-900 w-[25%] overflow-hidden whitespace-nowrap text-ellipsis max-w-sm">{destination.slug}</td>
                                        <td className="px-6 py-4 text-sm font-medium w-[15%]">
                                            <div className="flex items-center space-x-2 action-icons">
                                                <button onClick={() => handleUpdateNavigate(id)} title="Edit" className="text-blue-600 hover:text-blue-800"><Pencil size={18} /></button>
                                                <button onClick={() => { setDuplicateId(id); setOpenDuplicateModal(true); }} title="Duplicate" className="text-purple-600 hover:text-purple-800"><Copy size={18} /></button>
                                                <button onClick={() => { setDeleteId(id); setSelectionModel([]); setOpenDeleteModal(true); }} title="Delete" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                                <button onClick={() => handlePreview(destination.slug, id)} title="Preview" className="text-green-600 hover:text-green-800"><Eye size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* Pagination UI (rest of component unchanged) */}
            <div className="mt-8 flex justify-between items-center text-sm text-gray-700">
                <div className="flex items-center">
                    <span>Rows per page:</span>
                    <select
                        className="mx-2 p-1 border rounded custom-select"
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
                    <span className="text-gray-600">
                        {filteredDestinations.length === 0
                            ? "0"
                            : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(
                                currentPage * rowsPerPage,
                                filteredDestinations.length
                            )}`}{" "}
                        of {filteredDestinations.length}
                    </span>
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        className={`p-2 border rounded-lg transition-colors ${
                            currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-white border-gray-300' : 'hover:bg-gray-50 bg-white border-gray-300'
                        }`}
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>

                    {pageNumbers.map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                                currentPage === page
                                    ? 'bg-blue-600 text-white border-blue-600 shadow'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        className={`p-2 border rounded-lg transition-colors ${
                            currentPage === totalPages || totalPages === 0 ? 'opacity-50 cursor-not-allowed bg-white border-gray-300' : 'hover:bg-gray-50 bg-white border-gray-300'
                        }`}
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Modals (unchanged) */}
            <CustomModal
                open={openDeleteModal}
                onClickOutside={() => { if (!isLoading) { setOpenDeleteModal(false); setDeleteId(''); setSelectionModel([]); } }}
            >
                <div className='delete-model-view-main'>
                    <p className="text-center mb-6">
                        {deleteId 
                            ? "Are you sure do you want to delete this destination?"
                            : `Are you sure you want to delete the ${selectionModel.length} selected destinations?`}
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold" 
                            onClick={handleDeleteConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Yes, Delete'}
                        </button>
                        <button 
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-semibold" 
                            onClick={() => { setOpenDeleteModal(false); setDeleteId(''); setSelectionModel([]); }}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </CustomModal>
            
            <CustomModal
                open={openDuplicateModal}
                onClickOutside={() => { if (!isDuplicating) { setOpenDuplicateModal(false); setDuplicateId(""); } }}
            >
                <div className='delete-model-view-main'>
                    <p className="text-center mb-6">Are you sure you want to duplicate this destination?</p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold" 
                            onClick={handleDuplicateDestination} 
                            disabled={isDuplicating}
                        >
                            {isDuplicating ? 'Duplicating...' : 'Yes, Duplicate'}
                        </button>
                        <button 
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-semibold" 
                            onClick={() => { setOpenDuplicateModal(false); setDuplicateId(""); }} 
                            disabled={isDuplicating}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </CustomModal>

        </div>
    );
}

export default DestinationList;