const Payment = ({ statistics = {}, latestLocations = [] }) => {
  const cards = [
    { label: "Properties", value: statistics.total_properties || 0 },
    { label: "Available", value: statistics.available_properties || 0 },
    {
      label: "Owners",
      value: statistics.total_owners || statistics.owner_count || 0,
    },
    {
      label: "Tenants",
      value: statistics.total_tenants || statistics.tenant_count || 0,
    },
  ];

  return (
    <section className="bg-white py-10 mt-10 border-t border-b border-black">
      <h2 className="text-center text-lg font-semibold text-black mb-6">
        Live Platform Metrics
      </h2>

      <div className="container mx-auto px-4 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center shadow-sm"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-black">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 md:px-10 mt-8">
        <div className="rounded-3xl bg-black p-6 text-white">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/60">
                Latest Locations
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                Fresh inventory across the platform
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {latestLocations.length > 0 ? (
                latestLocations.map((location) => (
                  <span
                    key={location}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm"
                  >
                    {location}
                  </span>
                ))
              ) : (
                <span className="text-sm text-white/70">
                  Location data will appear here as properties are published.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Payment;
