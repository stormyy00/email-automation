type props = {
  icon: JSX.Element;
  text: string;
  className: string;
};
const QuickAcess = ({ icon, text, className }: props) => {
  return (
    <button
      className={`flex items-start gap-x-2 px-4 py-2 rounded-lg transition shadow-md ${className}`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span>{text}</span>
    </button>
  );
};

export default QuickAcess;
