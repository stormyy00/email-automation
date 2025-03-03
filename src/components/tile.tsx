import Link from "next/link";

type props = {
  icon: JSX.Element;
  text: string;
  link: string;
};

const Tile = ({ icon, text, link }: props) => {
  return (
    <Link
      href={link}
      className="mb-3 flex w-full justify-center items-center rounded-xl gap-5 bg-black p-6 shadow-xl hover:opacity-70 md:my-0 md:w-1/4"
      data-cy="tile-link"
    >
      <div className="text-white">{icon}</div>
      <div className="text-2xl font-bold leading-9 text-white">{text}</div>
    </Link>
  );
};

export default Tile;
