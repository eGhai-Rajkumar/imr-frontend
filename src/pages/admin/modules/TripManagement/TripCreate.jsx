import { useEffect, useMemo, useState } from "react";
import {
  Info,
  Map,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  X,
  Search,
} from "lucide-react";
import "../../css/TripManagement/TripCreate.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SECURE_BASE = "https://api.yaadigo.com/secure/api/";
const API_KEY = "bS8WV0lnLRutJH-NbUlYrO003q30b_f8B4VGYy9g45M";
const AFTER_CREATE_REDIRECT = "/admin/dashboard/trip-management/list";
const AFTER_UPDATE_REDIRECT = "/admin/dashboard/trip-management/list";

const defaultCostingPackage = {
  title: "",
  description: "",
  base_price: "",
  discount: "",
  final_price: "",
  booking_amount: "",
  gst_percentage: "",
};

const defaultFixedDepartureSlot = {
  from_date: "",
  to_date: "",
  available_slots: "",
  costingPackages: [
    { ...defaultCostingPackage }
  ],
};

export default function TripCreate() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeStep, setActiveStep] = useState("basic");
  const [openDay, setOpenDay] = useState(null);
  const [selectedPricing, setSelectedPricing] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activityList, setActivityList] = useState([]);
  const [activePackageSlotIndex, setActivePackageSlotIndex] = useState(0);

  const [categoryList, setCategoryList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [faqInput, setFaqInput] = useState({ question: "", answer: "" });
  const [highlightsText, setHighlightsText] = useState("");
  const [inclusionsText, setInclusionsText] = useState("");
  const [exclusionsText, setExclusionsText] = useState("");

  const [fixedPackage, setFixedPackage] = useState([
    { ...defaultFixedDepartureSlot },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    overview: "",
    destination_id: "",
    destination_type: "",
    category_id: [],
    hotel_category: "",
    pickup_location: "",
    drop_location: "",
    days: "",
    nights: "",
    itineraryDays: [
      {
        id: 1,
        day_number: 1,
        title: "Day 1: Arrival",
        description: "",
        activities: [],
        hotel_name: "",
        meal_plan: [],
      },
    ],
    hero_image: null,
    gallery_images: [],
    pricing_model: "",
    pricing: {
      pricing_model: "",
      fixed_departure: [],
      customized: {
        pricing_type: "",
        base_price: "",
        discount: "",
        final_price: "",
        gst_percentage: "",
      },
    },
    highlights: "",
    inclusions: "",
    exclusions: "",
    terms: "",
    privacy_policy: "",
    payment_terms: "",
    custom_policies: [],
    feature_trip_flag: false,
    feature_trip_type: "",
    display_order: "",
    meta_title: "",
    meta_description: "",
  });

  const steps = useMemo(
    () => [
      { id: "basic", label: "Basic Info", icon: Info },
      { id: "itinerary", label: "Itinerary", icon: Map },
      { id: "media", label: "Media", icon: ImageIcon },
      { id: "pricing", label: "Pricing", icon: DollarSign },
      { id: "details", label: "Details", icon: FileText },
      { id: "policies", label: "Policies", icon: Shield },
      { id: "seo", label: "SEO", icon: Search },
    ],
    []
  );

  const currentIndex = steps.findIndex((s) => s.id === activeStep);
  const progress = ((currentIndex + 1) / steps.length) * 100 + "%";

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      let updatedValue = value;
      const updated = { ...prev };

      if (field === "slug") {
        updatedValue = value
          .toLowerCase()
          .replace(/[^a-z0-9\-_]/g, '')
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      updated[field] = updatedValue;

      if (field === "title" && (!id || !prev.slug)) {
        updated.slug = generateSlug(value);
      }

      // Auto-generate itinerary days when days field changes
      if (field === "days") {
        const daysInt = parseInt(value);
        if (daysInt > 0) {
          updated.nights = Math.max(0, daysInt - 1).toString();
          
          // Auto-generate itinerary days based on the number of days
          const newItineraryDays = [];
          for (let i = 1; i <= daysInt; i++) {
            newItineraryDays.push({
              id: i,
              day_number: i,
              title: `Day ${i}: ${i === 1 ? 'Arrival' : i === daysInt ? 'Departure' : 'Activity'}`,
              description: "",
              activities: [],
              hotel_name: "",
              meal_plan: [],
            });
          }
          updated.itineraryDays = newItineraryDays;
        } else {
          updated.nights = "";
          updated.itineraryDays = [{
            id: 1,
            day_number: 1,
            title: "Day 1: Arrival",
            description: "",
            activities: [],
            hotel_name: "",
            meal_plan: [],
          }];
        }
      }

      return updated;
    });
  };

  const handleArrayChange = (field, value, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: isChecked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleCategoryMultiSelect = (categoryId, isChecked) => {
    setFormData(prev => {
      const currentCategories = prev.category_id;
      const categoryIdStr = String(categoryId);

      if (isChecked) {
        if (!currentCategories.includes(categoryIdStr)) {
          return { ...prev, category_id: [...currentCategories, categoryIdStr] };
        }
      } else {
        return { ...prev, category_id: currentCategories.filter(id => id !== categoryIdStr) };
      }
      return prev;
    });
  };

  const toggleDay = (id) => setOpenDay(openDay === id ? null : id);

  const addNewDay = () => {
    setFormData((prev) => {
      const newId = prev.itineraryDays.length + 1;
      return {
        ...prev,
        itineraryDays: [
          ...prev.itineraryDays,
          {
            id: newId,
            day_number: newId,
            title: `Day ${newId}: New Activity`,
            description: "",
            activities: [],
            hotel_name: "",
            meal_plan: [],
          },
        ],
      };
    });
  };

  const deleteDay = (dayId) => {
    setFormData((prev) => {
      if (prev.itineraryDays.length === 1) {
        toast.warn("Cannot delete the last day. At least one day is required.");
        return prev;
      }

      const updatedDays = prev.itineraryDays
        .filter((day) => day.id !== dayId)
        .map((day, index) => ({
          ...day,
          id: index + 1,
          day_number: index + 1,
        }));

      if (openDay === dayId) {
        setOpenDay(null);
      }

      return {
        ...prev,
        itineraryDays: updatedDays,
      };
    });
  };

  const handleItineraryChange = (dayId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itineraryDays: prev.itineraryDays.map((d) =>
        d.id === dayId ? { ...d, [field]: value } : d
      ),
    }));
  };

  const handleActivitiesChange = (dayId, activity, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      itineraryDays: prev.itineraryDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: isChecked
                ? [...day.activities, activity]
                : day.activities.filter((a) => a !== activity),
            }
          : day
      ),
    }));
  };

  const handleMealPlanChange = (dayId, meal, isChecked) => {
    setFormData((prev) => ({
      ...prev,
      itineraryDays: prev.itineraryDays.map((day) =>
        day.id === dayId
          ? {
              ...day,
              meal_plan: isChecked
                ? [...day.meal_plan, meal]
                : day.meal_plan.filter((m) => m !== meal),
            }
          : day
      ),
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const okTypes = ["jpeg", "png", "jpg", "webp"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!okTypes.includes(ext)) {
      toast.error("Only JPG, JPEG, PNG or WEBP allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }

    const fd = new FormData();
    fd.append("image", file);
    fd.append("storage", "local");

    try {
      const res = await axios.post("https://api.yaadigo.com/upload", fd);
      if (res?.data?.message === "Upload successful") {
        setFormData((prev) => ({ ...prev, hero_image: res.data.url }));
        toast.success("Hero image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    }
  };

  const handleMultipleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const okTypes = ["jpeg", "png", "jpg", "webp"];
    for (const f of files) {
      const ext = f.name.split(".").pop().toLowerCase();
      if (!okTypes.includes(ext)) {
        toast.error(`Unsupported file type: ${f.name}`);
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`File too large (>5MB): ${f.name}`);
        return;
      }
    }

    const fd = new FormData();
    files.forEach((f) => fd.append("gallery_images", f));
    fd.append("storage", "local");

    try {
      const res = await axios.post("https://api.yaadigo.com/multiple", fd);
      if (res?.data?.message === "Files uploaded") {
        const uploaded = Array.isArray(res.data.files)
          ? res.data.files.flat()
          : [res.data.files];
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...(prev.gallery_images || []), ...uploaded],
        }));
        toast.success(`${uploaded.length} image(s) uploaded`);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    }
  };

  const removeHeroImage = () =>
    setFormData((prev) => ({ ...prev, hero_image: null }));

  const removeGalleryImage = (index) =>
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));

  const addFixedPackage = () => {
    const newSlot = {
      ...defaultFixedDepartureSlot,
      costingPackages: fixedPackage[0]?.costingPackages.map(pkg => ({...pkg})) || [{ ...defaultCostingPackage }]
    };
    setFixedPackage((p) => [...p, newSlot]);
  };

  const deleteFixedPackage = (indexToRemove) => {
    if (fixedPackage.length === 1) {
      setFixedPackage([{ ...defaultFixedDepartureSlot }]);
      return;
    }

    setFixedPackage((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const addCostingPackage = (slotIndex) => {
    setFixedPackage((prev) => {
      const updated = [...prev];
      for (let i = 0; i < updated.length; i++) {
        updated[i].costingPackages.push({ ...defaultCostingPackage });
      }
      return updated;
    });
  };

  const deleteCostingPackage = (slotIndex, packageIndexToRemove) => {
    setFixedPackage((prev) => {
      const updated = [...prev];
      if (updated[0].costingPackages.length === 1) {
        for (let i = 0; i < updated.length; i++) {
            updated[i].costingPackages = [{ ...defaultCostingPackage }];
        }
        return updated;
      }

      for (let i = 0; i < updated.length; i++) {
        updated[i].costingPackages = updated[i].costingPackages.filter((_, idx) => idx !== packageIndexToRemove);
      }
      return updated;
    });
  };

  const updateFixedPackage = (
    slotIndex,
    key,
    value,
    packageIndex = null
  ) => {
    setFixedPackage((prev) => {
      const updated = [...prev];
      
      if (packageIndex === null) {
        updated[slotIndex][key] = value;
      } else {
        for (let i = 0; i < updated.length; i++) {
            if (key !== 'final_price') {
                updated[i].costingPackages[packageIndex][key] = value;
            }
          
            const pkg = updated[i].costingPackages[packageIndex];

            const basePrice = parseFloat(pkg.base_price) || 0;
            const discount = parseFloat(pkg.discount) || 0;
            const gst = parseFloat(pkg.gst_percentage) || 0;

            const discounted = Math.max(basePrice - discount, 0);
            const finalPrice = discounted + (discounted * gst) / 100;

            pkg.final_price = isNaN(finalPrice) ? "" : finalPrice.toFixed(2);
        }
      }
      return updated;
    });
  };

  const handleCustomPricingChange = (field, value) => {
    setFormData((prev) => {
      const customized = {
        ...prev.pricing.customized,
        [field]: value,
      };
      
      const base = parseFloat(customized.base_price) || 0;
      const disc = parseFloat(customized.discount) || 0;
      const gst = parseFloat(customized.gst_percentage) || 0;
      const discounted = Math.max(base - disc, 0);
      const final = discounted + (discounted * gst) / 100;

      customized.final_price =
        isNaN(final) || !isFinite(final) ? "" : final.toFixed(2);
      
      if (['base_price', 'discount', 'gst_percentage', 'pricing_type'].includes(field)) {
          customized[field] = value;
      }

      return {
        ...prev,
        pricing: {
          ...prev.pricing,
          customized,
        },
      };
    });
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(`${SECURE_BASE}categories/`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) setCategoryList(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  const getDestinations = async () => {
    try {
      const res = await axios.get(`${SECURE_BASE}destinations/`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) setDestinationList(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch destinations");
    }
  };

  const getActivityTypes = async () => {
    try {
      const res = await axios.get(`${SECURE_BASE}activity-types/`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) {
        setActivityList(res.data.data.map(item => item.name) || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch activity types");
    }
  };

  const getSpecificTrip = async (tripId) => {
    try {
      const res = await axios.get(`${SECURE_BASE}trips/${tripId}`, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success === true) {
        const tripData = res.data.data;

        const convertToLineBreaks = (text) => {
          if (!text) return "";
          return text.split("; ").join("\n");
        };
        
        setHighlightsText(convertToLineBreaks(tripData.highlights));
        setInclusionsText(convertToLineBreaks(tripData.inclusions));
        setExclusionsText(convertToLineBreaks(tripData.exclusions));

        const itineraryDays =
          tripData.itinerary?.map((day, index) => ({
            id: index + 1,
            day_number: day.day_number,
            title: day.title,
            description: day.description,
            activities: day.activities || [],
            hotel_name: day.hotel_name,
            meal_plan: day.meal_plan || [],
          })) || [];

        const categoryId = tripData.category_id
          ? Array.isArray(tripData.category_id)
            ? tripData.category_id.map(String)
            : [String(tripData.category_id)]
          : [];

        setFormData((prev) => ({
          ...prev,
          title: tripData.title || "",
          slug: tripData.slug || "",
          overview: tripData.overview || "",
          destination_id: tripData.destination_id || "",
          destination_type: tripData.destination_type || "",
          category_id: categoryId,
          hotel_category: tripData.hotel_category?.toString() || "",
          pickup_location: tripData.pickup_location || "",
          drop_location: tripData.drop_location || "",
          days: tripData.days || "",
          nights: tripData.nights || "",
          hero_image: tripData.hero_image || null,
          gallery_images: tripData.gallery_images || [],
          highlights: tripData.highlights || "",
          inclusions: tripData.inclusions || "",
          exclusions: tripData.exclusions || "",
          terms: tripData.terms || "",
          privacy_policy: tripData.privacy_policy || "",
          payment_terms: tripData.payment_terms || "",
          pricing_model:
            tripData.pricing?.pricing_model === "fixed_departure"
              ? "fixed"
              : "custom",
          itineraryDays,
          pricing: {
            ...prev.pricing,
            customized: {
              pricing_type: tripData.pricing?.customized?.pricing_type || "",
              base_price: tripData.pricing?.customized?.base_price || "",
              discount: tripData.pricing?.customized?.discount || "",
              final_price: tripData.pricing?.customized?.final_price || "",
              gst_percentage: tripData.pricing?.customized?.gst_percentage || "",
            },
          },
          feature_trip_flag: tripData.feature_trip_flag || false,
          feature_trip_type: tripData.feature_trip_type || "",
          display_order: tripData.display_order || "",
          meta_title: tripData.meta_title || "",
          meta_description: tripData.meta_description || "",
        }));

        setFaqs(tripData.faqs || []);
        setSelectedPricing(
          tripData.pricing?.pricing_model === "fixed_departure"
            ? "fixed"
            : "custom"
        );

        if (tripData.pricing?.fixed_departure) {
          setFixedPackage(
            tripData.pricing.fixed_departure.map((slot) => ({
              from_date: slot.from_date?.split("T")[0] || "",
              to_date: slot.to_date?.split("T")[0] || "",
              available_slots: slot.available_slots || "",
              costingPackages: Array.isArray(slot.costingPackages) && slot.costingPackages.length > 0
                ? slot.costingPackages.map(pkg => ({
                    title: pkg.title || "",
                    description: pkg.description || "",
                    base_price: pkg.base_price || "",
                    discount: pkg.discount || "",
                    final_price: pkg.final_price || "",
                    booking_amount: pkg.booking_amount || "",
                    gst_percentage: pkg.gst_percentage || "",
                  }))
                : [{ ...defaultCostingPackage }]
            }))
          );
        }
      } else {
        toast.error("Failed to load trip data");
      }
    } catch (error) {
      console.error("Error fetching trip:", error?.response?.data || error.message);
      toast.error("Failed to load trip data");
    }
  };

  useEffect(() => {
    getCategories();
    getDestinations();
    getActivityTypes();
  }, []);

  useEffect(() => {
    if (!id && !formData.pricing_model) {
      handleInputChange("pricing_model", "custom");
      setSelectedPricing("custom");
    }
  }, [id]);

  useEffect(() => {
    if (id) getSpecificTrip(id);
  }, [id]);

  const prepareSubmissionData = () => {
    const formatDetailString = (text) =>
        text.split('\n')
            .map(item => item.trim())
            .filter(item => item.length > 0)
            .join('; ');

    return {
      title: formData.title,
      overview: formData.overview,
      destination_id: formData.destination_id ? parseInt(formData.destination_id) : null,
      destination_type: formData.destination_type,
      category_id: formData.category_id,
      themes: [],
      hotel_category: parseInt(formData.hotel_category) || 0,
      pickup_location: formData.pickup_location,
      drop_location: formData.drop_location,
      days: parseInt(formData.days) || 0,
      nights: parseInt(formData.nights) || 0,
      meta_tags: `${formData.title}`,
      slug: formData.slug || generateSlug(formData.title || ""), 
      pricing_model: formData.pricing_model,
      highlights: formatDetailString(highlightsText),
      inclusions: formatDetailString(inclusionsText),
      exclusions: formatDetailString(exclusionsText),
      faqs: faqs,
      terms: formData.terms,
      privacy_policy: formData.privacy_policy,
      payment_terms: formData.payment_terms,
      gallery_images: formData.gallery_images,
      hero_image: formData.hero_image,
      itinerary: formData.itineraryDays.map((day) => ({
        day_number: day.day_number,
        title: day.title,
        description: day.description,
        image_urls: [],
        activities: day.activities,
        hotel_name: day.hotel_name,
        meal_plan: day.meal_plan,
      })),
      pricing: {
        pricing_model:
          formData?.pricing_model === "fixed" ? "fixed_departure" : "customized",
        ...(formData.pricing_model === "fixed" && {
          fixed_departure: fixedPackage
            .filter(slot => slot.from_date || slot.to_date || slot.costingPackages.some(p => p.base_price))
            .map((slot) => ({
              from_date: slot.from_date ? `${slot.from_date}T00:00:00` : null,
              to_date: slot.to_date ? `${slot.to_date}T00:00:00` : null,
              available_slots: slot.available_slots ? parseInt(slot.available_slots) : 0,
              costingPackages: slot.costingPackages
                .filter(pkg => pkg.base_price)
                .map(pkg => ({
                  title: pkg.title || "",
                  description: pkg.description || "",
                  base_price: pkg.base_price ? parseFloat(pkg.base_price) : 0,
                  discount: pkg.discount ? parseFloat(pkg.discount) : 0,
                  final_price: pkg.final_price ? parseFloat(pkg.final_price) : 0,
                  booking_amount: pkg.booking_amount ? parseFloat(pkg.booking_amount) : 0,
                  gst_percentage: pkg.gst_percentage ? parseFloat(pkg.gst_percentage) : 0,
                })),
            })),
        }),
        ...(formData.pricing_model === "custom" && {
          customized: {
            pricing_type: formData.pricing.customized.pricing_type,
            base_price: parseFloat(formData.pricing.customized.base_price) || 0,
            discount: parseFloat(formData.pricing.customized.discount) || 0,
            final_price: parseFloat(formData.pricing.customized.final_price) || 0,
            gst_percentage:
              parseFloat(formData.pricing.customized.gst_percentage) || 0,
          },
        }),
      },
      policies: [
        ...(formData.terms ? [{ title: "Terms and Conditions", content: formData.terms }] : []),
        ...(formData.privacy_policy ? [{ title: "Cancellation Policy", content: formData.privacy_policy }] : []),
        ...(formData.payment_terms ? [{ title: "Payment Terms", content: formData.payment_terms }] : []),
        ...formData.custom_policies,
      ],
      feature_trip_flag: formData.feature_trip_flag,
      feature_trip_type: formData.feature_trip_flag ? formData.feature_trip_type : null,
      display_order: formData.display_order ? parseInt(formData.display_order) : null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
    };
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const submissionData = prepareSubmissionData();
      const res = await axios.post(`${SECURE_BASE}trips/`, submissionData, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) {
        toast.success("Trip created successfully!");
        navigate(AFTER_CREATE_REDIRECT);
      } else {
        toast.error(res?.data?.message || "Failed to create trip");
      }
    } catch (error) {
      console.error("Create trip error:", error?.response?.data || error.message);
      toast.error("Failed to create trip");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const submissionData = prepareSubmissionData();
      const res = await axios.put(`${SECURE_BASE}trips/${id}`, submissionData, {
        headers: { "x-api-key": API_KEY },
      });
      if (res?.data?.success) {
        toast.success("Trip updated successfully!");
        navigate(AFTER_UPDATE_REDIRECT);
      } else {
        toast.error(res?.data?.message || "Failed to update trip");
      }
    } catch (error) {
      console.error("Update trip error:", error?.response?.data || error.message);
      toast.error("Failed to update trip");
    } finally {
      setIsLoading(false);
    }
  };

  const CategoryMultiSelect = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedCategoryNames = formData.category_id.map(id => {
        const cat = categoryList.find(c => String(c.id) === id);
        return cat ? cat.name : null;
    }).filter(name => name !== null);

    const filteredCategories = categoryList.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mb-3">
            <label className="form-label d-block">Categories *</label>
            <div
                className={`form-control p-2 ${isOpen ? 'is-focused' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                style={{ cursor: 'pointer', minHeight: '38px' }}
            >
                {selectedCategoryNames.length === 0 ? (
                    <span className="text-muted">Select categories...</span>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {selectedCategoryNames.map(name => (
                            <span
                                key={name}
                                className="badge bg-primary d-flex align-items-center"
                                style={{ padding: '0.35em 0.65em' }}
                            >
                                {name}
                                <X
                                    size={12}
                                    style={{ marginLeft: '5px', cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const catId = categoryList.find(c => c.name === name)?.id;
                                        if (catId) handleCategoryMultiSelect(catId, false);
                                    }}
                                />
                            </span>
                        ))}
                    </div>
                )}
            </div>
            {isOpen && (
                <div className="border rounded mt-1 bg-white shadow-sm" style={{ position: 'absolute', zIndex: 100, width: '95%' }}>
                    <input
                        type="text"
                        className="form-control mb-1"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {filteredCategories.map((cat) => (
                            <div
                                key={cat.id}
                                className="form-check p-2"
                                style={{ paddingLeft: '2.5em', cursor: 'pointer' }}
                                onClick={(e) => {
                                    handleCategoryMultiSelect(cat.id, !formData.category_id.includes(String(cat.id)));
                                    e.stopPropagation();
                                }}
                            >
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={formData.category_id.includes(String(cat.id))}
                                    onChange={() => {}}
                                    style={{ marginTop: '0.45em' }}
                                />
                                <label className="form-check-label ms-2">{cat.name}</label>
                            </div>
                        ))}
                        {filteredCategories.length === 0 && (
                             <div className="p-2 text-muted text-center">No categories found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
  };

  const renderBasic = () => (
    <div className="container">
      <h3 className="mb-4 fw-bold fs-5">Trip Details</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Trip Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter trip title"
              maxLength={100}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
            <small className="text-muted">{formData.title?.length || 0}/100 characters</small>
          </div>

          <div className="mb-3">
            <label className="form-label">URL Slug *</label>
            <input
              type="text"
              className="form-control"
              placeholder="enter-url-slug"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
            />
            <small className="text-muted">Only alphanumeric, hyphens (-), and underscores (_) are allowed. Auto-generated from title on new trips.</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Trip Overview *</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Describe the trip overview..."
              value={formData.overview}
              onChange={(e) => handleInputChange("overview", e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Destination *</label>
            <select
              className="form-select"
              value={formData.destination_id}
              onChange={(e) => handleInputChange("destination_id", e.target.value)}
            >
              <option value="">Select destination</option>
              {destinationList?.map((d) => (
                <option key={d?.id} value={d?.id}>
                  {d?.title}
                </option>
              ))}
            </select>
          </div>

          <CategoryMultiSelect />

          <div className="mb-3">
            <label className="form-label d-block">Destination Type *</label>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="destType"
                className="form-check-input"
                checked={formData.destination_type === "Domestic"}
                onChange={() => handleInputChange("destination_type", "Domestic")}
              />
              <label className="form-check-label">Domestic</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="destType"
                className="form-check-input"
                checked={formData.destination_type === "International"}
                onChange={() => handleInputChange("destination_type", "International")}
              />
              <label className="form-check-label">International</label>
            </div>
          </div>

          {/* Featured Trip Section */}
          <div className="mb-3">
            <label className="form-label d-block">Featured Trip</label>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="featureTripFlag"
                className="form-check-input"
                checked={formData.feature_trip_flag === true}
                onChange={() => handleInputChange("feature_trip_flag", true)}
              />
              <label className="form-check-label">Yes</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="featureTripFlag"
                className="form-check-input"
                checked={formData.feature_trip_flag === false}
                onChange={() => handleInputChange("feature_trip_flag", false)}
              />
              <label className="form-check-label">No</label>
            </div>
          </div>

          {formData.feature_trip_flag && (
            <>
              <div className="mb-3">
                <label className="form-label">Featured Trip Page *</label>
                <select
                  className="form-select"
                  value={formData.feature_trip_type}
                  onChange={(e) => handleInputChange("feature_trip_type", e.target.value)}
                >
                  <option value="">Select page</option>
                  <option value="Homepage">Homepage</option>
                  <option value="Destination Page">Destination Page</option>
                  <option value="Category Page">Category Page</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter display order (e.g., 1, 2, 3...)"
                  value={formData.display_order}
                  onChange={(e) => handleInputChange("display_order", e.target.value)}
                />
                <small className="text-muted">Lower numbers appear first</small>
              </div>
            </>
          )}
        </div>
      </div>

      <h3 className="mb-4 fw-bold fs-5 mt-5">Location & Duration</h3>
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Pickup city *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter pickup city"
              value={formData.pickup_location}
              onChange={(e) => handleInputChange("pickup_location", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Drop city *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter drop city"
              value={formData.drop_location}
              onChange={(e) => handleInputChange("drop_location", e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">Days *</label>
              <input
                type="number"
                className="form-control"
                placeholder="Days"
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
              />
            </div>
            <div className="col-6 mb-3">
              <label className="form-label">Nights</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nights"
                value={formData.nights}
                onChange={(e) => handleInputChange("nights", e.target.value)}
                readOnly
              />
            </div>
          </div>
          <small className="text-muted">When you enter the number of days, itinerary days will be auto-generated. Nights = Days - 1.</small>
        </div>

        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label d-block">Hotel Category *</label>
            {["Camping & Cottages", "Home Stays", "3 Star Hotel", "4 Star Hotel", "5 Star Hotel"].map((cat, index) => (
              <div className="form-check" key={cat}>
                <input
                  type="radio"
                  name="hotelCategory"
                  className="form-check-input"
                  checked={formData.hotel_category === (index + 1).toString()}
                  onChange={() => handleInputChange("hotel_category", (index + 1).toString())}
                />
                <label className="form-check-label">{cat}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderItinerary = () => (
    <div className="form-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="font-bold text-lg mb-0">Trip Itinerary</h3>
        <span className="badge bg-info">{formData.itineraryDays.length} Days Created</span>
      </div>
      
      {formData.itineraryDays.map((day) => (
        <div
          key={day.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#f8f9fa",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, cursor: "pointer" }}
              onClick={() => toggleDay(day.id)}
            >
              <span className="font-medium">{day.title}</span>
              <span className="badge bg-secondary">Day {day.day_number}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {formData.itineraryDays.length > 1 && (
                <button
                  className="btn btn-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 12px",
                    background: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDay(day.id);
                  }}
                  title="Delete this day"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
              <div onClick={() => toggleDay(day.id)} style={{ cursor: "pointer" }}>
                {openDay === day.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
          </div>

          {openDay === day.id && (
            <div style={{ padding: "16px", background: "#fff" }}>
              <div className="form-group">
                <label>Day Title *</label>
                <input
                  type="text"
                  value={day.title}
                  onChange={(e) => handleItineraryChange(day.id, "title", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  placeholder="Trip Description"
                  value={day.description}
                  onChange={(e) => handleItineraryChange(day.id, "description", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Select Activities</label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {activityList.map((activity) => (
                    <label key={activity} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <input
                        type="checkbox"
                        checked={day.activities.includes(activity)}
                        onChange={(e) => handleActivitiesChange(day.id, activity, e.target.checked)}
                      />
                      {activity}
                    </label>
                  ))}
                  {activityList.length === 0 && <small className="text-muted">Loading activities...</small>}
                </div>
              </div>

              <div className="form-group">
                <label>Hotel Name *</label>
                <input
                  type="text"
                  placeholder="Hotel Name"
                  value={day.hotel_name}
                  onChange={(e) => handleItineraryChange(day.id, "hotel_name", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Meal Plan</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                    <label key={meal}>
                      <input
                        type="checkbox"
                        checked={day.meal_plan.includes(meal)}
                        onChange={(e) => handleMealPlanChange(day.id, meal, e.target.checked)}
                      />
                      {meal}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addNewDay}
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        + Add Another Day
      </button>
    </div>
  );

  const renderMedia = () => (
    <div className="form-container">
      <div className="media-header">
        <h3>Media Assets</h3>
        <p>Upload images and videos for your trip package</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", gap: 24, flexWrap: "wrap" }}>
        <div className="media-section" style={{ flex: 1, minWidth: "380px" }}>
          <div className="section-title">
            📷 Hero Image / Thumbnail <span className="required">*</span>
          </div>
          <div className="upload-area" onClick={() => document.getElementById("heroImage")?.click()}>
            <div className="upload-icon">📷</div>
            <div className="upload-text">
              <h4>Upload Hero Image</h4>
              <p>Drag and drop or click to browse</p>
              {formData?.hero_image && <p>Selected: {formData?.hero_image}</p>}
            </div>
            <input
              type="file"
              id="heroImage"
              name="hero_image"
              accept=".png,.jpeg,.jpg,.webp"
              className="file-input"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>

          {formData?.hero_image && (
            <div className="upload-image-div" style={{ position: "relative", marginTop: 10 }}>
              <img src={`${formData?.hero_image}`} alt="Hero" />
              <button
                title="Remove image"
                onClick={removeHeroImage}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(255,0,0,0.85)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  fontSize: 16,
                  cursor: "pointer",
                  lineHeight: "24px",
                }}
              >
                ×
              </button>
            </div>
          )}
          <div className="file-restrictions" style={{ marginTop: 8 }}>
            • Use high quality JPG, PNG or WebP format
            <br />
            • Recommended size: 1200x800 pixels
            <br />
            • Maximum file size: 5MB
          </div>
        </div>

        <div className="media-section" style={{ flex: 1, minWidth: "380px" }}>
          <div className="section-title">
            🖼️ Image Gallery <span className="required">*</span>
          </div>
          <div className="upload-area" onClick={() => document.getElementById("galleryImages")?.click()}>
            <div className="upload-icon">🖼️</div>
            <div className="upload-text">
              <h4>Image Gallery</h4>
              <p>Click to select multiple images</p>
            </div>
            <input
              type="file"
              id="galleryImages"
              name="gallery_images"
              accept=".png,.jpeg,.jpg,.webp"
              multiple
              className="file-input"
              style={{ display: "none" }}
              onChange={handleMultipleFileUpload}
            />
          </div>

          {Array.isArray(formData?.gallery_images) && formData.gallery_images.length > 0 && (
            <div
              className="d-flex flex-wrap"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "12px",
              }}
            >
              {formData.gallery_images.map((image, index) => (
                <div
                  className="upload-image-div destination-image-div"
                  key={`${image}-${index}`}
                  style={{
                    position: "relative",
                    width: "140px",
                    height: "140px",
                    overflow: "hidden",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                >
                  <div>
                    <img
                      src={encodeURI(image)}
                      alt={`Gallery-${index}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <button
                    title="Remove"
                    onClick={() => removeGalleryImage(index)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(255,0,0,0.85)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      fontSize: 14,
                      cursor: "pointer",
                      lineHeight: "22px",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="file-restrictions" style={{ marginTop: 8 }}>
            Gallery best practices: • Upload 5-10 high-quality images
            <br />
            • Show different attractions and activities
            <br />
            • Include both landscape and close-up shots
            <br />
            • Maintain consistent quality and style
            <br />• Recommended size: 1200x800px minimum
          </div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => {
    const masterCostingPackages = fixedPackage[0]?.costingPackages || [];

    return (
      <div className="container">
        <h5 className="mb-3 fw-bold">Pricing Model *</h5>

        <div className="row mb-4">
          <div className="col-md-6">
            <div
              className={`p-3 border rounded d-flex align-items-center ${selectedPricing === "fixed" ? "border-primary" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedPricing("fixed");
                handleInputChange("pricing_model", "fixed");
              }}
            >
              <input
                type="radio"
                className="form-check-input me-2"
                checked={selectedPricing === "fixed"}
                onChange={() => {
                  setSelectedPricing("fixed");
                  handleInputChange("pricing_model", "fixed");
                }}
              />
              <div>
                <label className="form-check-label fw-bold">Fixed Departure</label>
                <div className="small text-muted">Set specific dates with group bookings</div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className={`p-3 border rounded d-flex align-items-center ${selectedPricing === "custom" ? "border-primary" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSelectedPricing("custom");
                handleInputChange("pricing_model", "custom");
              }}
            >
              <input
                type="radio"
                className="form-check-input me-2"
                checked={selectedPricing === "custom"}
                onChange={() => {
                  setSelectedPricing("custom");
                  handleInputChange("pricing_model", "custom");
                }}
              />
              <div>
                <label className="form-check-label fw-bold">Customized Trip</label>
                <div className="small text-muted">Flexible dates based on customer preference</div>
              </div>
            </div>
          </div>
        </div>

        {selectedPricing === "fixed" && (
          <div className="fixed-departure-container">
            <div className="fixed-departure-header">
              <h5>Enter Slots & Packages</h5>
              <button className="btn-add-slot" onClick={addFixedPackage}>
                <Plus size={16} /> Add Slot
              </button>
            </div>

            <div className="slots-list">
              {fixedPackage.map((slot, slotIndex) => (
                <div key={`slot-${slotIndex}`} className="slot-container">
                  <div className="slot-header">
                    <div className="slot-indicator">
                      <div className="slot-dot" />
                      <span className="slot-label">Slot {slotIndex + 1}</span>
                    </div>
                    {fixedPackage.length > 1 && (
                      <button
                        className="btn-delete-slot"
                        onClick={() => deleteFixedPackage(slotIndex)}
                      >
                        <Trash2 size={14} /> 
                      </button>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="pricing-form-label">From Date *</label>
                      <input
                        type="date"
                        className="pricing-form-input"
                        value={slot.from_date}
                        onChange={(e) => updateFixedPackage(slotIndex, "from_date", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="pricing-form-label">To Date *</label>
                      <input
                        type="date"
                        className="pricing-form-input"
                        value={slot.to_date}
                        onChange={(e) => updateFixedPackage(slotIndex, "to_date", e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="pricing-form-label">Available Slots *</label>
                      <input
                        type="number"
                        className="pricing-form-input"
                        placeholder="Enter available slots"
                        value={slot.available_slots}
                        onChange={(e) => updateFixedPackage(slotIndex, "available_slots", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="costing-packages-section">
              <div className="costing-packages-header">
                <h6>Costing Packages (Applies to all slots)</h6>
                <button className="btn-add-package" onClick={() => addCostingPackage(0)}>
                  <Plus size={16} /> Add Package
                </button>
              </div>

              {masterCostingPackages.map((pkg, pkgIndex) => (
                <div key={`pkg-${pkgIndex}`} className="package-card">
                  <div className="package-header">
                    <label className="package-title">Package {pkgIndex + 1}</label>
                    {(pkgIndex !== 0 || masterCostingPackages.length > 1) && (
                      <button
                        className="btn-delete-package"
                        onClick={() => deleteCostingPackage(0, pkgIndex)}
                      >
                        <Trash2 size={12} /> 
                      </button>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="pricing-form-label">Package Title *</label>
                      <input
                        type="text"
                        className="pricing-form-input"
                        placeholder="e.g. Triple Occupancy"
                        value={pkg.title}
                        onChange={(e) => updateFixedPackage(0, "title", e.target.value, pkgIndex)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="pricing-form-label">Base Price (₹) *</label>
                      <input
                        type="number"
                        className="pricing-form-input"
                        placeholder="Enter base price"
                        value={pkg.base_price}
                        onChange={(e) => updateFixedPackage(0, "base_price", e.target.value, pkgIndex)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="pricing-form-label">Discount (₹)</label>
                      <input
                        type="number"
                        className="pricing-form-input"
                        placeholder="Enter discount"
                        value={pkg.discount}
                        onChange={(e) => updateFixedPackage(0, "discount", e.target.value, pkgIndex)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <label className="pricing-form-label">Booking Amount (₹)</label>
                      <input
                        type="number"
                        className="pricing-form-input"
                        placeholder="Enter booking amount"
                        value={pkg.booking_amount}
                        onChange={(e) => updateFixedPackage(0, "booking_amount", e.target.value, pkgIndex)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="pricing-form-label">GST Percentage (%)</label>
                      <input
                        type="number"
                        className="pricing-form-input"
                        placeholder="Enter GST %"
                        value={pkg.gst_percentage}
                        onChange={(e) => updateFixedPackage(0, "gst_percentage", e.target.value, pkgIndex)}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="pricing-form-label">Final Price (₹)</label>
                      <input
                        type="number"
                        className="pricing-form-input"
                        placeholder="Auto-calculated"
                        value={pkg.final_price}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPricing === "custom" && (
          <>
            <h6 className="fw-bold mb-2">Customized Pricing</h6>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label d-block">Pricing Type *</label>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="pricingType"
                    className="form-check-input"
                    checked={formData.pricing.customized.pricing_type === "Price Per Person"}
                    onChange={() => handleCustomPricingChange("pricing_type", "Price Per Person")}
                  />
                  <label className="form-check-label">Price Per Person</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    name="pricingType"
                    className="form-check-input"
                    checked={formData.pricing.customized?.pricing_type === "Price Per Package"}
                    onChange={() => handleCustomPricingChange("pricing_type", "Price Per Package")}
                  />
                  <label className="form-check-label">Price Per Package</label>
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Base Price (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter base price"
                  value={formData.pricing?.customized?.base_price}
                  onChange={(e) => handleCustomPricingChange("base_price", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Discount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter discount price"
                  value={formData.pricing.customized?.discount}
                  onChange={(e) => handleCustomPricingChange("discount", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">GST Percentage (%)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter GST percentage"
                  value={formData.pricing.customized?.gst_percentage || ""}
                  onChange={(e) => handleCustomPricingChange("gst_percentage", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label mt-3">Final Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Auto-calculated"
                  readOnly
                  value={formData.pricing.customized?.final_price}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDetails = () => (
    <div className="form-container details">
      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px", gap: "20px", flexWrap: "wrap" }}>
        
        <div style={{ border: "1px solid #ccc", width: "100%", maxWidth: "45%", padding: "20px", borderRadius: "8px" }} className="form-container">
          <h3 className="fs-5 fw-bold">Trip Highlight</h3>
          <label className="form-label">Enter highlights (one per line)</label>
          <textarea
            rows={6}
            className="form-control"
            placeholder="E.g.,\nVisit Taj Mahal\nExplore local markets\nSunset boat ride"
            value={highlightsText}
            onChange={(e) => setHighlightsText(e.target.value)}
          />
          <small className="text-muted d-block mt-1">Each line will be saved as a separate highlight item.</small>
        </div>

        <div style={{ border: "1px solid #ccc", width: "100%", maxWidth: "45%", padding: "20px", borderRadius: "8px" }} className="form-container">
          <h3 className="fs-5 fw-bold">Inclusions</h3>
          <label className="form-label">Enter inclusions (one per line)</label>
          <textarea
            rows={6}
            className="form-control"
            placeholder="E.g.,\n4 Nights Accommodation\nDaily Breakfast and Dinner\nAirport Transfers"
            value={inclusionsText}
            onChange={(e) => setInclusionsText(e.target.value)}
          />
          <small className="text-muted d-block mt-1">Each line will be saved as a separate inclusion item.</small>
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-around", margin: "20px", gap: "20px", flexWrap: "wrap" }}>
        <div style={{ border: "1px solid #ccc", width: "100%", maxWidth: "45%", padding: "20px", borderRadius: "8px" }} className="form-container">
          <h3 className="fs-5 fw-bold">Exclusions</h3>
          <label className="form-label">Enter exclusions (one per line)</label>
          <textarea
            rows={6}
            className="form-control"
            placeholder="E.g.,\nAirfare/Visa charges\nPersonal expenses\nTravel insurance"
            value={exclusionsText}
            onChange={(e) => setExclusionsText(e.target.value)}
          />
          <small className="text-muted d-block mt-1">Each line will be saved as a separate exclusion item.</small>
        </div>

        <div style={{ border: "1px solid #ccc", width: "100%", maxWidth: "45%", padding: "20px", borderRadius: "8px" }} className="form-container">
          <h3 className="fs-5 fw-bold">FAQ (Optional)</h3>
          <label className="form-label">Add FAQ</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "10px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter FAQ question"
              value={faqInput?.question}
              onChange={(e) => setFaqInput({ ...faqInput, question: e.target.value })}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Enter FAQ answer"
              value={faqInput?.answer}
              onChange={(e) => setFaqInput({ ...faqInput, answer: e.target.value })}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                if (faqInput?.question?.trim() && faqInput?.answer?.trim()) {
                  setFaqs((prev) => [...prev, faqInput]);
                  setFaqInput({ question: "", answer: "" });
                } else {
                  toast.warn("Please fill both question and answer!");
                }
              }}
            >
              Add FAQ
            </button>
          </div>

          <div>
            {faqs.length > 0 && (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {faqs.map((faq, index) =>
                  faq.question && faq.answer ? (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                        borderBottom: "1px solid #eee",
                        paddingBottom: "5px",
                      }}
                    >
                      <div style={{ flexGrow: 1, marginRight: '10px' }}>
                        <strong>Q:</strong> {faq.question}
                        <br />
                        <strong>A:</strong> {faq.answer}
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setFaqs((prev) => prev.filter((_, i) => i !== index))}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPolicies = () => (
    <div className="form-container">
      <div className="form-group">
        <label>Terms and Conditions Content</label>
        <textarea
          rows={3}
          placeholder="Enter terms and conditions"
          value={formData.terms}
          onChange={(e) => handleInputChange("terms", e.target.value)}
        />
        </div>

      <div className="form-group">
        <label>Cancellation Policy Content</label>
        <textarea
          rows={3}
          placeholder="Enter cancellation policy"
          value={formData.privacy_policy}
          onChange={(e) => handleInputChange("privacy_policy", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Payment Content</label>
        <textarea
          rows={3}
          placeholder="Enter payment details"
          value={formData.payment_terms}
          onChange={(e) => handleInputChange("payment_terms", e.target.value)}
        />
      </div>
    </div>
  );

  const renderSEO = () => (
    <div className="container">
      <h3 className="mb-4 fw-bold fs-5">SEO Settings</h3>
      <p className="text-muted mb-4">Optimize your trip page for search engines</p>
      
      <div className="row">
        <div className="col-md-12">
          <div className="mb-3">
            <label className="form-label">Meta Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter meta title for SEO (recommended: 50-60 characters)"
              maxLength={60}
              value={formData.meta_title}
              onChange={(e) => handleInputChange("meta_title", e.target.value)}
            />
            <small className="text-muted">{formData.meta_title?.length || 0}/60 characters</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Meta Description</label>
            <textarea
              rows={4}
              className="form-control"
              placeholder="Enter meta description for SEO (recommended: 150-160 characters)"
              maxLength={160}
              value={formData.meta_description}
              onChange={(e) => handleInputChange("meta_description", e.target.value)}
            />
            <small className="text-muted">{formData.meta_description?.length || 0}/160 characters</small>
            <div className="mt-2">
              <small className="text-info">
                <strong>Tips:</strong>
                <ul className="mb-0 mt-1">
                  <li>Include your main keyword</li>
                  <li>Write a compelling description that encourages clicks</li>
                  <li>Keep it under 160 characters for best display</li>
                </ul>
              </small>
            </div>
          </div>

          <div className="alert alert-info">
            <strong>Preview:</strong>
            <div className="mt-2 p-3 bg-white border rounded">
              <div className="text-primary" style={{ fontSize: '18px', fontWeight: '500' }}>
                {formData.meta_title || formData.title || 'Your Trip Title'}
              </div>
              <div className="text-success small">
                yourwebsite.com/trips/{formData.slug || 'trip-slug'}
              </div>
              <div className="text-muted small mt-1">
                {formData.meta_description || formData.overview || 'Your trip description will appear here...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case "basic":
        return renderBasic();
      case "itinerary":
        return renderItinerary();
      case "media":
        return renderMedia();
      case "pricing":
        return renderPricing();
      case "details":
        return renderDetails();
      case "policies":
        return renderPolicies();
      case "seo":
        return renderSEO();
      default:
        return <div>Step Not Found</div>;
    }
  };

  return (
    <div className="tour-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex justify-content-between">
        <div className="tour-header">
          <h2>{id ? "Edit Trip" : "Add New Trip"}</h2>
          <p>Create a comprehensive travel package</p>
        </div>
        <div>
          <button className="admin-add-button mt-0" style={{ background: "turquoise" }} onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: progress }} />
      </div>

      <div className="stepper">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = index <= currentIndex;
          return (
            <button key={step.id} onClick={() => setActiveStep(step.id)} className="step-button">
              <div className={`step-circle ${active ? "step-active" : "step-inactive"}`}>
                <Icon />
              </div>
              <span className={`step-label ${active ? "step-label-active" : "step-label-inactive"}`}>
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {renderStepContent()}

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#6b7280", fontSize: "14px" }}>
          {currentIndex + 1}/{steps.length} sections complete
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          {id ? (
            <button className="button button-green" onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Trip"}
            </button>
          ) : (
            <button className="button button-green" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Publishing..." : "Publish Trip"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}