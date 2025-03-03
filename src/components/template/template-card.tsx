import { useState } from "react";
import {
  Copy,
  MoreVertical,
  Pen,
  ChevronDown,
  ChevronUp,
  Save,
} from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import { Input } from "../ui/input";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  operations: { bg: "bg-amber-50", text: "text-amber-600" },
  sponsorship: { bg: "bg-blue-50", text: "text-blue-600" },
};

type Props = {
  title: string;
  id: string;
  status: string;
  description?: string;
  handleConfigure: () => void;
  onClick: () => void;
  checked: boolean;
  onSave?: (id: string, data: { title: string; description: string }) => void;
};

const TemplateCard = ({
  title,
  id,
  status,
  description = "No description available",
  onClick,
  checked,
  onSave,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isEditing && !isOpen) {
      setIsEditing(false);
    }
  };

  const toggleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSave) {
      onSave(id, { title: editedTitle, description: editedDescription });
    }
    toast("Changes saved successfully");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <span onClick={onClick} className="cursor-pointer">
            <Checkbox checked={checked} />
          </span>
          <button
            className="text-lg font-medium text-gray-900 hover:text-gray-600 transition duration-200 flex items-center gap-1"
            onClick={toggleDropdown}
          >
            {title}
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
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
            onClick={toggleEdit}
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

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full"
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(false);
                    setEditedTitle(title);
                    setEditedDescription(description);
                  }}
                  className="px-3 py-1 bg-gray-100 rounded text-gray-600 hover:bg-gray-200 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-blue-600 rounded text-white hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-700">
              <h4 className="font-medium text-sm text-gray-500 mb-1">
                Description
              </h4>
              <p className="text-sm">{description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
