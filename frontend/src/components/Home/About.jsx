const About = ({
  statistics = {},
  latestLocations = [],
  testimonials = [],
}) => {
  const stats = [
    { label: "Total Properties", value: statistics.total_properties || 0 },
    {
      label: "Available Properties",
      value: statistics.available_properties || 0,
    },
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
    <section className="container mx-auto px-4 md:px-10 mt-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">
              Platform Snapshot
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-black">
              Live marketplace data from the backend.
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-600 leading-7">
              Property counts, owners, tenants, locations, and booking activity
              are fetched from Laravel so the landing page always reflects the
              current database.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-black">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-gray-200 bg-black p-6 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-white/60">
              Latest Locations
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
                  No location data yet.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
              Recent Testimonials
            </p>
            <div className="mt-4 space-y-4">
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="rounded-2xl bg-gray-50 p-4"
                  >
                    <p className="text-sm font-semibold text-black">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.role} • {testimonial.property}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      {testimonial.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                  No testimonial records are available yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
