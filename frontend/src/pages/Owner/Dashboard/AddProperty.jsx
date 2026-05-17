import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  BD_DIVISIONS,
  DISTRICTS_BY_DIVISION,
  LOCATION_TREE,
} from "../../../../constants";
import useAuth from "../../../hooks/useAuth";
import {
  deleteProperty,
  fetchPropertyById,
  saveProperty,
} from "../../../utils/propertyStorage";

const selectInputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black";

const textInputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-4 md:p-5";

const floorOptions = ["Ground", "1st", "2nd"];

const AddProperty = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const [editingProperty, setEditingProperty] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;

    if (!propertyId) {
      return;
    }

    (async () => {
      try {
        const prop = await fetchPropertyById(propertyId);
        if (active) {
          setEditingProperty(prop);
        }
      } catch {
        if (active) setEditingProperty(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [propertyId]);
  const [floor, setFloor] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageInputKey, setImageInputKey] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentOwner = user || {};
  const isEditing = Boolean(editingProperty);

  const isDivisionSelected = Boolean(DISTRICTS_BY_DIVISION[division]);

  const districtOptions = useMemo(() => {
    if (!isDivisionSelected) {
      return [];
    }

    return DISTRICTS_BY_DIVISION[division];
  }, [division, isDivisionSelected]);

  const isDistrictSelected = districtOptions.includes(district);

  const areaOptions = useMemo(() => {
    if (!isDivisionSelected || !isDistrictSelected) {
      return [];
    }

    return LOCATION_TREE[division]?.[district] || [];
  }, [division, district, isDivisionSelected, isDistrictSelected]);

  useEffect(() => {
    let isActive = true;

    Promise.resolve().then(() => {
      if (!isActive) {
        return;
      }

      if (!editingProperty) {
        setFloor("");
        setDivision("");
        setDistrict("");
        setArea("");
        setUploadedImages([]);
        setImageInputKey((currentKey) => currentKey + 1);
        setStatusMessage("");
        return;
      }

      setFloor(editingProperty.floor || "");
      setDivision(editingProperty.division || "");
      setDistrict(editingProperty.district || "");
      setArea(editingProperty.area || "");
      setUploadedImages(
        Array.isArray(editingProperty.images) &&
          editingProperty.images.length > 0
          ? editingProperty.images
          : editingProperty.image
            ? [editingProperty.image]
            : [],
      );
      setImageInputKey((currentKey) => currentKey + 1);
      setStatusMessage("");
    });

    return () => {
      isActive = false;
    };
  }, [editingProperty]);

  const handleDivisionChange = (event) => {
    setDivision(event.target.value);
    setDistrict("");
    setArea("");
  };

  const handleDistrictChange = (event) => {
    setDistrict(event.target.value);
    setArea("");
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    // Compress images to avoid localStorage quota issues
    const nextImages = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              const img = new Image();
              img.onload = () => {
                // Create canvas and resize image to reduce size
                const canvas = document.createElement("canvas");
                const maxWidth = 400;
                const maxHeight = 400;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                  if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                  }
                } else {
                  if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                  }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to webp or jpeg with compression
                const compressed = canvas.toDataURL("image/jpeg", 0.6);
                resolve(compressed);
              };
              img.onerror = () => reject(new Error("Failed to load image"));
              img.src = String(reader.result);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );

    setUploadedImages((currentImages) => [...currentImages, ...nextImages]);
    setImageInputKey((currentKey) => currentKey + 1);
    event.target.value = "";
  };

  const handleRemoveImage = (imageIndex) => {
    setUploadedImages((currentImages) =>
      currentImages.filter((_, index) => index !== imageIndex),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage("Saving property...");

    // Validate required fields
    const title = String(event.currentTarget.title?.value || "").trim();
    const price = String(event.currentTarget.price?.value || "").trim();
    const bedrooms = event.currentTarget.bedrooms?.value;
    const bathrooms = event.currentTarget.bathrooms?.value;
    const shortAddress = String(
      event.currentTarget.shortAddress?.value || "",
    ).trim();

    if (!title) {
      setStatusMessage("Error: Property title is required");
      setIsSubmitting(false);
      return;
    }
    if (!price) {
      setStatusMessage("Error: Price is required");
      setIsSubmitting(false);
      return;
    }
    if (!bedrooms) {
      setStatusMessage("Error: Number of bedrooms is required");
      setIsSubmitting(false);
      return;
    }
    if (!bathrooms) {
      setStatusMessage("Error: Number of bathrooms is required");
      setIsSubmitting(false);
      return;
    }
    if (!shortAddress) {
      setStatusMessage("Error: Short address is required");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const facilities = formData.getAll("facilities");

    try {
      const property = await saveProperty({
        id: editingProperty?.id,
        title: title,
        category: String(formData.get("propertyType") || "Family"),
        type: String(formData.get("category") || "Property"),
        month: String(formData.get("month") || ""),
        location: [
          formData.get("area"),
          formData.get("district"),
          formData.get("division"),
        ]
          .filter(Boolean)
          .join(", "),
        price: price,
        priceType: String(formData.get("priceType") || "Monthly"),
        beds: bedrooms || "",
        baths: bathrooms || "",
        sqft: String(formData.get("sqft") || "").trim(),
        floor: String(formData.get("floor") || floor),
        gender: String(formData.get("gender") || ""),
        balcony: String(formData.get("balcony") || ""),
        division: String(formData.get("division") || division),
        district: String(formData.get("district") || district),
        area: String(formData.get("area") || area),
        sectorNo: String(formData.get("sectorNo") || ""),
        roadNo: String(formData.get("roadNo") || ""),
        houseNo: String(formData.get("houseNo") || ""),
        shortAddress: shortAddress,
        description: String(formData.get("description") || "").trim(),
        features: facilities,
        images: uploadedImages,
        image: uploadedImages[0] || "",
        owner: {
          name: currentOwner?.fullName || "Property Owner",
          phone: currentOwner?.phone || "N/A",
          email: currentOwner?.email || "N/A",
        },
        createdAt: editingProperty?.createdAt,
        raw: Object.fromEntries(formData.entries()),
      });

      setStatusMessage(
        `${property.title} ${isEditing ? "updated" : "saved"} successfully.`,
      );
      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/owner-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Property save error:", error);
      setStatusMessage(
        `Error saving property: ${error?.message || String(error)}`,
      );
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${editingProperty?.title}"? This action cannot be undone.`,
      )
    ) {
      deleteProperty(editingProperty.id);
      navigate("/owner-dashboard");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Posts &gt; {isEditing ? "Edit" : "Create"}
        </p>
        <h1 className="text-3xl font-bold text-black mt-1">
          {isEditing ? "Edit Post" : "Create Post"}
        </h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 mb-4">
        নতুন ভাড়াটিয়া পাওয়ার জন্য পোস্টটি যত বেশি তথ্যপূর্ণ হবে তত ভালো হবে।
      </div>

      <form
        key={editingProperty?.id || "new-property"}
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <section className={sectionClass}>
          <h2 className="text-base font-semibold text-black mb-4">
            Basic Information
          </h2>
          <div className="mb-4">
            <label className="text-sm font-medium text-black mb-1 block">
              Property Title*
            </label>
            <input
              name="title"
              className={textInputClass}
              placeholder="e.g. Spacious 3 Bedroom Family Flat"
              defaultValue={editingProperty?.title || ""}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Month*
              </label>
              <select
                name="month"
                className={selectInputClass}
                defaultValue={editingProperty?.month || ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Category*
              </label>
              <select
                name="category"
                className={selectInputClass}
                defaultValue={editingProperty?.type || ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>Flat</option>
                <option>Room</option>
                <option>Sublet</option>
                <option>Shop</option>
                <option>Hostel</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Property Type*
              </label>
              <select
                name="propertyType"
                className={selectInputClass}
                defaultValue={editingProperty?.category || ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>Family</option>
                <option>Bachelor</option>
                <option>Office</option>
                <option>Sublet</option>
                <option>Hostel</option>
                <option>Shop</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Bedroom*
              </label>
              <select
                name="bedrooms"
                className={selectInputClass}
                defaultValue={String(editingProperty?.beds ?? "")}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Bathroom*
              </label>
              <select
                name="bathrooms"
                className={selectInputClass}
                defaultValue={String(editingProperty?.baths ?? "")}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Balcony
              </label>
              <select
                name="balcony"
                className={selectInputClass}
                defaultValue={editingProperty?.balcony || ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Floor
              </label>
              <input
                name="floor"
                className={textInputClass}
                list="owner-floor-options"
                value={floor}
                onChange={(event) => setFloor(event.target.value)}
                placeholder="Ground / 1st / 2nd / 5th"
              />
              <datalist id="owner-floor-options">
                {floorOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Gender
              </label>
              <select
                name="gender"
                className={selectInputClass}
                defaultValue={editingProperty?.gender || ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option>Any</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Size (Square Feet)
              </label>
              <input
                name="sqft"
                className={textInputClass}
                placeholder="e.g. 1200"
                defaultValue={editingProperty?.sqft || ""}
              />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-base font-semibold text-black mb-4">
            Location Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Division*
              </label>
              <select
                name="division"
                className={selectInputClass}
                value={division}
                onChange={handleDivisionChange}
              >
                <option value="" disabled>
                  Select division
                </option>
                {BD_DIVISIONS.map((divisionName) => (
                  <option key={divisionName} value={divisionName}>
                    {divisionName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                District*
              </label>
              <select
                name="district"
                className={selectInputClass}
                value={district}
                onChange={handleDistrictChange}
                disabled={!isDivisionSelected}
              >
                <option value="" disabled>
                  {isDivisionSelected
                    ? "Select district"
                    : "Select division first"}
                </option>
                {districtOptions.map((districtName) => (
                  <option key={districtName} value={districtName}>
                    {districtName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Area / Thana*
              </label>
              <input
                name="area"
                className={textInputClass}
                list="owner-area-options"
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder={
                  isDistrictSelected
                    ? "Type or select area / thana"
                    : "Select district first"
                }
                disabled={!isDistrictSelected}
              />
              <datalist id="owner-area-options">
                {areaOptions.map((areaName) => (
                  <option key={areaName} value={areaName} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Sector no
              </label>
              <input
                name="sectorNo"
                className={textInputClass}
                placeholder="e.g. Sector 12"
                defaultValue={editingProperty?.sectorNo || ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Road no
              </label>
              <input
                name="roadNo"
                className={textInputClass}
                placeholder="e.g. Road 07"
                defaultValue={editingProperty?.roadNo || ""}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                House no
              </label>
              <input
                name="houseNo"
                className={textInputClass}
                placeholder="e.g. House 21"
                defaultValue={editingProperty?.houseNo || ""}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-black mb-1 block">
              Short Address*
            </label>
            <input
              name="shortAddress"
              className={textInputClass}
              placeholder="Write short address"
              defaultValue={editingProperty?.shortAddress || ""}
            />
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-base font-semibold text-black mb-4">
            Additional Information
          </h2>
          <div>
            <label className="text-sm font-medium text-black mb-1 block">
              Property Details
            </label>
            <textarea
              name="description"
              className={`${textInputClass} min-h-28 resize-y`}
              placeholder="Address and contact number can be provided here"
              defaultValue={editingProperty?.description || ""}
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-black mb-1 block">
              Images
            </label>
            <label className="block cursor-pointer rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 hover:border-black hover:text-black transition">
              <input
                key={imageInputKey}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
              Drag & Drop your files or{" "}
              <span className="text-blue-600">Browse</span>
            </label>

            {uploadedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {uploadedImages.map((image, index) => (
                  <div
                    key={`${image.slice(0, 24)}-${index}`}
                    className="relative overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={image}
                      alt={`Uploaded ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-base font-semibold text-black mb-4">
            Facilities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-black">
            {[
              "Lift",
              "Car Parking",
              "Bike Parking",
              "Line Gas",
              "Generator",
              "CCTV",
              "Furnished Home",
            ].map((facility) => (
              <label key={facility} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="facilities"
                  value={facility}
                  defaultChecked={editingProperty?.features?.includes(facility)}
                  className="accent-black"
                />
                {facility}
              </label>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className="text-base font-semibold text-black mb-4">Price</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-black mb-1 block">
                Price*
              </label>
              <div className="flex">
                <input
                  name="price"
                  className={`${textInputClass} rounded-r-none`}
                  placeholder="e.g. 25000"
                  defaultValue={editingProperty?.price || ""}
                />
                <span className="inline-flex items-center border border-l-0 border-gray-300 px-3 rounded-r-lg text-sm text-gray-600">
                  BDT
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Price Type
              </label>
              <select
                name="priceType"
                className={selectInputClass}
                defaultValue={editingProperty?.priceType || "Monthly"}
              >
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-black mb-2">
              Price includes
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-black">
              {[
                "Electricity bill",
                "Gas bill",
                "Water bill",
                "Lift bill",
                "Security bill",
              ].map((item) => (
                <label key={item} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-black" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
          </button>
          <Link
            to="/owner-dashboard"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-100"
          >
            Cancel
          </Link>
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 ml-auto"
            >
              Delete
            </button>
          )}
        </div>
        {statusMessage ? (
          <p
            className={`text-sm font-medium ${statusMessage.startsWith("Error") ? "text-red-600" : "text-green-600"}`}
          >
            {statusMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
};

export default AddProperty;
