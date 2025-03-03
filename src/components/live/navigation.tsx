import Link from "next/link";

const ITEMS = ["user"];

const Navigation = () => {
  return (
    <div className="flex justify-between items-center w-full sticky top-0 p-4 shadow-md z-50 bg-white/80 backdrop-blur-lg">
      {/* Logo */}
      <Link href="/" className="text-2xl font-semibold text-black">
        Auto-Auto
      </Link>
      <div className="flex gap-x-6 items-center">
        {ITEMS.map((item) => (
          <Link
            key={item}
            href={`/${item}`}
            className="relative text-black text-lg font-medium group"
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
            <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
        <Link
          href="/register"
          className="px-4 py-2 bg-gradient-to-br from-orange-300 to-orange-700 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        >
          Join Us
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
