export default function Footer() {
  const sections = [
    {
      title: "For Job Seekers",
      items: [
        "Browse Jobs",
        "Career Resources",
        "Resume Builder",
        "Interview Prep",
      ],
    },
    {
      title: "For Employers",
      items: [
        "Post a Job",
        "Browse Candidates",
        "Recruiting Solutions",
        "Pricing",
      ],
    },
    {
      title: "Company",
      items: ["About Us", "Contact", "Careers", "Blog"],
    },
  ];

  return (
    <footer
      id="pricing"
      className="py-8 sm:py-12 px-3 sm:px-4 md:px-8 border-t border-gray-800"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <FooterLogoSection />

          {sections.map((section, index) => (
            <FooterSection
              key={index}
              title={section.title}
              items={section.items}
            />
          ))}
        </div>

        <Copyright />
      </div>
    </footer>
  );
}

const FooterLogoSection = () => (
  <div>
    <div className="flex items-center space-x-2 mb-4 sm:mb-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center">
        <span className="text-sm sm:text-lg font-bold">C</span>
      </div>
      <span className="text-lg sm:text-xl font-bold">CareerConnect</span>
    </div>
    <p className="text-gray-400 mb-4 text-sm sm:text-base">
      The world&#39;s most powerful job networking platform.
    </p>
    <SocialLinks />
  </div>
);

const SocialLinks = () => (
  <div className="flex space-x-3 sm:space-x-4">
    {["twitter", "linkedin", "facebook", "instagram"].map((social) => (
      <a
        key={social}
        href="#"
        className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
      >
        <span className="sr-only">{social}</span>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-400 rounded-full"></div>
        </div>
      </a>
    ))}
  </div>
);

const FooterSection = ({
  title,
  items,
}: {
  title: string;
  items: string[];
}) => (
  <div>
    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{title}</h3>
    <ul className="space-y-2">
      {items.map((item: string) => (
        <li key={item}>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base hover:translate-x-1 transform inline-block"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const Copyright = () => (
  <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-500">
    <p className="text-sm sm:text-base">
      © {new Date().getFullYear()} CareerConnect. All rights reserved.
    </p>
  </div>
);
