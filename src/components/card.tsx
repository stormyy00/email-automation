import { Copy, MoreVertical, Pen } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-amber-50", text: "text-amber-600" },
  scheduled: { bg: "bg-blue-50", text: "text-blue-600" },
  sent: { bg: "bg-green-50", text: "text-green-600" },
};

type props = {
  title: string;
  id: string;
  status: string;
  handleConfigure: () => void;
  onClick: () => void;
  checked: boolean;
};
const Card = ({
  title,
  id,
  status,
  handleConfigure,
  onClick,
  checked,
}: props) => {
  const pathname = usePathname();

  return (
    <div className=" flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center gap-4">
        <span onClick={onClick} className="cursor-pointer">
          <Checkbox checked={checked} />
        </span>
        <Link
          href={`${pathname}/${id}`}
          className="text-lg font-medium text-gray-900 hover:text-gray-600 transition duration-200"
        >
          {title}
        </Link>
      </div>
      <div className="flex items-center gap-3 text-gray-500">
        <div
          className={`${STATUS_STYLES[status]?.bg || "bg-gray-50"} ${STATUS_STYLES[status]?.text || "text-gray-600"} 
                      px-3 py-1 rounded-full text-xs font-medium`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        <Pen
          size={20}
          onClick={handleConfigure}
          className="cursor-pointer hover:text-black transition duration-200"
        />
        <Copy
          size={20}
          className="cursor-pointer hover:text-black transition duration-200"
          onClick={() => toast("Copied to clipboard")}
        />
        <MoreVertical
          size={20}
          className="cursor-pointer text-gray-400 hover:text-black transition duration-200"
          onClick={() => toast("Hello")}
        />
      </div>
    </div>
  );
};

export default Card;
