interface BannerProps {
    variant: "warning" | "info" | "success" | "error";
    label: string;
  }
  
  const Banner = ({ variant, label }: BannerProps) => {
    const variants = {
      warning: "bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500",
      info: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
      success: "bg-green-100 text-green-700 border-l-4 border-green-500",
      error: "bg-red-100 text-red-700 border-l-4 border-red-500",
    };
  
    return (
      <div className={`p-4 rounded-md shadow-md mt-4 ${variants[variant]}`}>
        <p>{label}</p>
      </div>
    );
  };
  
  export default Banner;
  