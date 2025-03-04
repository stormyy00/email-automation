import { Input } from "@/components/ui/input";
import { Send, Edit } from "lucide-react";
import { toast } from "sonner";

type ProfileInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  isEditing: boolean;
  isSubmitted: boolean;
  setIsEditing: (value: boolean) => void;
  setIsSubmitted: (value: boolean) => void;
};

const ProfileInput = ({
  value,
  onChange,
  placeholder,
  isEditing,
  isSubmitted,
  setIsEditing,
  setIsSubmitted,
}: ProfileInputProps) => {
  return (
    <div className="relative w-full">
      <Input
        value={value}
        onChange={onChange}
        disabled={isSubmitted || !isEditing}
        placeholder={placeholder}
        className="pr-12 pl-4 py-2 w-full text-sm border-gray-300 focus:ring-2 focus:ring-gray-300 focus:border-gray-400 rounded-lg"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10">
        {isEditing ? (
          <Send
            onClick={() => {
              toast(`${placeholder} has been updated`);
              setIsSubmitted(true);
              setIsEditing(false);
            }}
            size={16}
            className="text-gray-400"
          />
        ) : (
          <Edit
            onClick={() => {
              setIsEditing(true);
              setIsSubmitted(false);
            }}
            size={18}
            className="text-gray-600"
          />
        )}
      </div>
    </div>
  );
};

export default ProfileInput;
