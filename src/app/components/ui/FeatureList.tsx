interface FeatureListProps {
  activeTab: string;
}
export default function FeatureList({ activeTab }: FeatureListProps) {
  const features =
    activeTab === "job-seekers"
      ? [
          "Get discovered by top companies worldwide",
          "Direct access to hiring managers",
          "Personalized job recommendations",
          "Free career development resources",
        ]
      : [
          "Access to verified, top-tier talent",
          "AI-powered candidate matching",
          "Streamlined recruitment process",
          "Advanced analytics dashboard",
        ];

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold mb-4">
        {activeTab === "job-seekers" ? "For Job Seekers" : "For Recruiters"}
      </h3>
      <ul className="space-y-3 sm:space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <FeatureIcon activeTab={activeTab} />
            <p className="text-sm sm:text-base">{feature}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FeatureIconProps {
  activeTab: string;
}
const FeatureIcon = ({ activeTab }: FeatureIconProps) => {
  const colorClass =
    activeTab === "job-seekers"
      ? "bg-green-500/10 text-green-400"
      : "bg-blue-500/10 text-blue-400";

  return (
    <div
      className={`p-1.5 sm:p-2 rounded-lg mr-3 sm:mr-4 flex-shrink-0 ${colorClass}`}
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
  );
};
