import TabButton from "../ui/TabButton";
import FeatureList from "../ui/FeatureList";

interface TabsSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export default function TabsSection({
  activeTab,
  setActiveTab,
}: TabsSectionProps) {
  return (
    <section id="how-it-works" className="py-12 sm:py-16">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 max-w-4xl">
        <Header />

        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-gray-800 rounded-xl p-1 flex">
            <TabButton
              active={activeTab === "job-seekers"}
              onClick={() => setActiveTab("job-seekers")}
            >
              Job Seekers
            </TabButton>
            <TabButton
              active={activeTab === "recruiters"}
              onClick={() => setActiveTab("recruiters")}
            >
              Recruiters
            </TabButton>
          </div>
        </div>

        <TabContent activeTab={activeTab} />
      </div>
    </section>
  );
}

const Header = () => (
  <div className="text-center mb-12 sm:mb-16">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
      Built For Everyone
    </h2>
    <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
      Whether you&#39;re looking for your next career move or searching for the
      perfect candidate, CareerConnect has everything you need.
    </p>
  </div>
);

interface TabContentProps {
  activeTab: string;
}
const TabContent = ({ activeTab }: TabContentProps) => (
  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 sm:p-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
      <FeatureList activeTab={activeTab} />
      <TabIllustration activeTab={activeTab} />
    </div>
  </div>
);

interface TabIllustrationProps {
  activeTab: string;
}
const TabIllustration = ({ activeTab }: TabIllustrationProps) => (
  <div className="flex items-center justify-center">
    <div className="relative w-full max-w-xs h-48 sm:h-64">
      <div
        className={`absolute inset-0 bg-gradient-to-br rounded-2xl shadow-2xl transition-all duration-500 ${
          activeTab === "job-seekers"
            ? "from-purple-600/20 to-blue-600/20"
            : "from-blue-600/20 to-cyan-600/20"
        }`}
      ></div>

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="text-center p-4 sm:p-6">
          <div className="inline-block p-3 sm:p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 mb-3 sm:mb-4">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {activeTab === "job-seekers" ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              )}
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">
            {activeTab === "job-seekers"
              ? "Find Your Dream Job"
              : "Hire Top Talent"}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            {activeTab === "job-seekers"
              ? "Join thousands who found their perfect career match"
              : "Access our exclusive network of professionals"}
          </p>
        </div>
      </div>
    </div>
  </div>
);
