const Payment = () => {
  return (
    <div className="bg-white py-2 mt-10 border-t border-b border-black">
      {/* Title */}
      <h2 className="text-center text-lg font-semibold text-black mb-6">
        Pay With
      </h2>

      {/* Payment Logos Container */}
      <div className="flex flex-wrap justify-center gap-4 px-4 md:px-10">
        {/* Logo Box */}
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img src="/Visa.png" alt="Visa" className="h-8" />
        </div>

        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img src="/Master.png" alt="Mastercard" className="h-8" />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img src="/sonali.png" alt="Sonali Bank" className="h-8" />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img src="/brac.jpg" alt="Brac Bank" className="h-8" />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img src="/DutchBangla.png" alt="Dutch-Bangla Bank" className="h-8" />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img src="/Nrbc.png" alt="NRBC Bank" className="h-8" />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdhhiuRkiVRnwe3O9bwe2ppvAalwshIoo5OA&s"
            alt="bKash"
            className="h-8"
          />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img
            src="https://images.seeklogo.com/logo-png/31/1/dutch-bangla-rocket-logo-png_seeklogo-317692.png"
            alt="Rocket"
            className="h-8"
          />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img
            src="https://freepnglogo.com/images/all_img/1725618513nagad-logo.png"
            alt="Nagad"
            className="h-8"
          />
        </div>
        <div className="bg-white border border-black rounded-lg p-3 shadow">
          <img src="Upai.png" alt="Rocket" className="h-8" />
          <img src="/Upai.png" alt="Upai" className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default Payment;
