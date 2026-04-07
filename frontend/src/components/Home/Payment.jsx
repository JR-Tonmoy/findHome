const Payment = () => {
  return (
    <div className="bg-gray-100 py-8 mt-10">

      {/* Title */}
      <h2 className="text-center text-lg font-semibold text-gray-700 mb-6">
        Pay With
      </h2>

      {/* Payment Logos Container */}
      <div className="flex flex-wrap justify-center gap-4 px-10">

        {/* Logo Box */}
        <div className="bg-white border rounded-lg p-3 shadow">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-8"
          />
        </div>

        <div className="bg-white border rounded-lg p-3 shadow">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-8"
          />
        </div>

        <div className="bg-white border rounded-lg p-3 shadow">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/BKash_logo.svg"
            alt="bKash"
            className="h-8"
          />
        </div>

        <div className="bg-white border rounded-lg p-3 shadow">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Nagad_logo.svg"
            alt="Nagad"
            className="h-8"
          />
        </div>

        <div className="bg-white border rounded-lg p-3 shadow">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/8e/PayPal_logo.svg"
            alt="PayPal"
            className="h-8"
          />
        </div>

      </div>

    </div>
  );
};

export default Payment;