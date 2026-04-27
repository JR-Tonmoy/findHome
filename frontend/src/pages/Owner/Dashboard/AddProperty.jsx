import { Link } from "react-router-dom";

const selectInputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black";

const textInputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-black";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-4 md:p-5";

const AddProperty = () => {
  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Posts &gt; Create</p>
        <h1 className="text-3xl font-bold text-black mt-1">Create Post</h1>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-600 mb-4">
        নতুন ভাড়াটিয়া পাওয়ার জন্য পোস্টটি যত বেশি তথ্যপূর্ণ হবে তত ভালো হবে।
      </div>

      <form className="space-y-4">
        <section className={sectionClass}>
          <h2 className="text-base font-semibold text-black mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Month*
              </label>
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Category*
              </label>
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>Flat</option>
                <option>Room</option>
                <option>Sublet</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Property Type*
              </label>
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>Family</option>
                <option>Bachelor</option>
                <option>Office</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Bedroom*
              </label>
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Bathroom*
              </label>
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Balcony
              </label>
              <select className={selectInputClass} defaultValue="">
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
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>Ground</option>
                <option>1st</option>
                <option>2nd</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Gender
              </label>
              <select className={selectInputClass} defaultValue="">
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
              <input className={textInputClass} placeholder="e.g. 1200" />
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
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Rajshahi</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                District*
              </label>
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>Dhaka</option>
                <option>Gazipur</option>
                <option>Narayanganj</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Area*
              </label>
              <select className={selectInputClass} defaultValue="">
                <option value="" disabled>
                  Select an option
                </option>
                <option>Uttara</option>
                <option>Mirpur</option>
                <option>Bashundhara</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Sector no
              </label>
              <input className={textInputClass} placeholder="e.g. Sector 12" />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                Road no
              </label>
              <input className={textInputClass} placeholder="e.g. Road 07" />
            </div>
            <div>
              <label className="text-sm font-medium text-black mb-1 block">
                House no
              </label>
              <input className={textInputClass} placeholder="e.g. House 21" />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-black mb-1 block">
              Short Address*
            </label>
            <input
              className={textInputClass}
              placeholder="Write short address"
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
              className={`${textInputClass} min-h-28 resize-y`}
              placeholder="Address and contact number can be provided here"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-black mb-1 block">
              Images
            </label>
            <div className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500">
              Drag & Drop your files or{" "}
              <span className="text-blue-600">Browse</span>
            </div>
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
                <input type="checkbox" className="accent-black" />
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
                  className={`${textInputClass} rounded-r-none`}
                  placeholder="e.g. 25000"
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
              <select className={selectInputClass} defaultValue="Monthly">
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
            type="button"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create
          </button>
          <Link
            to="/owner-dashboard"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-100"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
