import React from "react";

type StatsProps = {
  value: string;
  color: "blue" | "purple" | "green" | "orange";
  label: string;
};
const Stats = ({ value, color, label }: StatsProps) => {
  const colorClasses = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    orange: "text-orange-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 md:p-6 flex flex-col items-start justify-center min-h-[100px] md:min-h-[120px] hover:border-gray-600 transition-colors flex-1">
      <div
        className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2 ${colorClasses[color]}`}
      >
        {value}
      </div>
      <div className="text-gray-400 text-xs md:text-sm lg:text-base font-medium">
        {label}
      </div>
    </div>
  );
};

const StatsGrid = () => {
  const stats: StatsProps[] = [
    { value: "500K+", color: "purple", label: "Active Members" },
    { value: "10K+", color: "blue", label: "Companies" },
    { value: "85%", color: "green", label: "Success Rate" },
    { value: "24h", color: "orange", label: "Avg. Response Time" },
  ];

  return (
    <div className="py-8 md:py-12 lg:py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <Stats
              key={index}
              value={stat.value}
              color={stat.color}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
