
import React from "react";
import {
  Factory,
  Users,
  Layers,
  BarChart3,
  ArrowRight,
  UserRound,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Supplier Management",
      description: "Manage supplier and plant details",
    },
    {
      icon: Layers,
      title: "Press Capacity",
      description: "Maintain press configuration and availability",
    },
    {
      icon: BarChart3,
      title: "Capacity Analysis",
      description: "Track utilization and identify capacity gaps",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden bg-sky-100 flex flex-col">

      {/* Navbar */}
      <nav className="h-[65px] shrink-0 bg-sky-200 border-b border-sky-300">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Factory size={32} className="text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Capacity <span className="text-blue-600">Tracker</span>
            </h1>
          </div>

          <a
           href="/admin/login"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            <UserRound size={17} />
            Login
          </a>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 min-h-0 flex flex-col justify-center bg-sky-100">

        {/* Hero */}
        <section className="w-full shrink-0">
          <div className="max-w-7xl mx-auto px-6 py-5 md:py-7">
            <div className="grid md:grid-cols-2 items-center gap-6">

              <div>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
                  Press Capacity Management
                </p>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Press Capacity
                  <span className="block text-blue-600">Tracker</span>
                </h2>

                <p className="text-base text-gray-600 mt-4 leading-7 max-w-lg">
                  A simple platform to manage supplier press capacity,
                  track tonnage-wise utilization and identify capacity gaps.
                </p>

                <a
                  href="/admin/login"
                  className="inline-flex items-center gap-3 mt-6 bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Login to Continue
                  <ArrowRight size={19} />
                </a>
              </div>

              {/* Press Image */}
              <div className="flex justify-center items-center">
                <img
                  src="/abc.png"
                  alt="Industrial Press Machine"
                  className="w-full max-w-[450px] h-[350px] object-contain"
                />
              </div>

            </div>
          </div>
        </section>

        {/* Features */}
        <section className="shrink-0 bg-sky-200 border-y border-sky-300 py-5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 gap-4">

              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={index}
                    className="bg-sky-100 border border-sky-300 rounded-xl px-3 py-5 text-center"
                  >
                    <Icon
                      size={30}
                      className="text-blue-600 mx-auto mb-3"
                    />

                    <h3 className="text-sm md:text-base font-bold text-gray-900">
                      {feature.title}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-600 mt-2">
                      {feature.description}
                    </p>
                  </div>
                );
              })}

            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;
