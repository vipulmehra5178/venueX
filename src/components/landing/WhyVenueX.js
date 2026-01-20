export default function WhyVenueX() {
  const features = [
    {
      title: "Secure Payments",
      desc: "Industry-grade encryption and safe checkout for every booking.",
    },
    {
      title: "Verified Organizers",
      desc: "All events are reviewed and approved to ensure quality.",
    },
    {
      title: "Real-Time Availability",
      desc: "Live ticket counts so you never miss out or overbook.",
    },
    {
      title: "Smart Event Discovery",
      desc: "Curated experiences based on what people actually love.",
    },
  ];

  return (
    <section className="relative py-40 text-white overflow-hidden
      bg-gradient-to-b from-[#12081F] via-[#1B0F2E] to-[#09030F]">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        h-[500px] w-[500px] rounded-full bg-pink-500/20 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          
          <div>
            <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Built for <br />
              <span className="text-pink-500">Modern Events</span>
            </h2>

            <p className="mt-8 text-lg text-slate-300 max-w-xl">
              VenueX is designed for the new generation of event-goers and
              organizers — fast, reliable, and beautifully simple.
            </p>

            <p className="mt-6 text-slate-400 max-w-xl">
              Whether it’s a concert, workshop, or meetup, VenueX ensures
              seamless discovery, secure booking, and unforgettable experiences.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl bg-white/5 backdrop-blur-xl
                p-8 border border-white/10
                transition-all duration-300
                hover:bg-gradient-to-br hover:from-pink-500/30 hover:to-purple-500/20
                hover:scale-105"
              >
                <h3 className="text-xl font-semibold group-hover:text-pink-400">
                  {f.title}
                </h3>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            ["50K+", "Active Users"],
            ["1,200+", "Events Hosted"],
            ["300+", "Verified Organizers"],
            ["99.9%", "Payment Success"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-4xl font-bold text-pink-500">{value}</p>
              <p className="mt-2 text-sm text-slate-400 uppercase tracking-wider">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
