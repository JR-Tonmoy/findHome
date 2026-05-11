import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({
  variant = "default",
  size = "md",
  showSubtitle = true,
  linkTo = "/",
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 20,
      title: "text-lg",
      subtitle: "text-xs",
      gap: "gap-1.5",
      padding: "p-1",
    },
    md: {
      icon: 28,
      title: "text-xl",
      subtitle: "text-sm",
      gap: "gap-2",
      padding: "p-1.5",
    },
    lg: {
      icon: 32,
      title: "text-2xl",
      subtitle: "text-base",
      gap: "gap-2",
      padding: "p-2",
    },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Variant configurations
  const variants = {
    default: {
      containerClass: "flex flex-col",
      logoBoxClass:
        "bg-blue-600 text-white rounded-lg flex items-center justify-center",
      titleClass: "font-bold text-gray-900",
      subtitleClass: "text-gray-600 font-medium",
    },
    light: {
      containerClass: "flex flex-col",
      logoBoxClass:
        "bg-gray-100 text-blue-600 rounded-lg flex items-center justify-center",
      titleClass: "font-bold text-gray-900",
      subtitleClass: "text-gray-500 font-medium",
    },
    dark: {
      containerClass: "flex flex-col",
      logoBoxClass:
        "bg-gray-900 text-white rounded-lg flex items-center justify-center",
      titleClass: "font-bold text-white",
      subtitleClass: "text-gray-400 font-medium",
    },
    white: {
      containerClass: "flex flex-col",
      logoBoxClass:
        "bg-white text-blue-600 border border-gray-200 rounded-lg flex items-center justify-center",
      titleClass: "font-bold text-white",
      subtitleClass: "text-gray-200 font-medium",
    },
    minimal: {
      containerClass: "flex items-center",
      logoBoxClass: "",
      titleClass: "font-bold text-gray-900",
      subtitleClass: "",
    },
  };

  const variantConfig = variants[variant] || variants.default;

  const content = (
    <div className={`${variantConfig.containerClass} items-center`}>
      <div className={`flex items-center ${config.gap}`}>
        {variant !== "minimal" && (
          <div className={`${variantConfig.logoBoxClass} ${config.padding}`}>
            <Home size={config.icon} />
          </div>
        )}
        <div className="flex flex-col">
          <span className={`${variantConfig.titleClass} ${config.title}`}>
            BashaLagbe
          </span>
          {showSubtitle && (
            <span
              className={`${variantConfig.subtitleClass} ${config.subtitle}`}
            >
              Find your perfect flat easily
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return linkTo ? (
    <Link to={linkTo} className="hover:opacity-80 transition-opacity">
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;
