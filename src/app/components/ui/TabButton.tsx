interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}
export default function TabButton({
  active,
  onClick,
  children,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-purple-600 to-blue-600"
          : "hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
