import { FaHome } from 'react-icons/fa';
import { TbUserSquareRounded } from 'react-icons/tb';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const Navigation__links = [
    { id: 1, path: '/Dashboard', name: 'Dashboard', icon: FaHome },
    { id: 2, path: '/Register', name: 'Sign Up', icon: TbUserSquareRounded },
  ];

  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 h-screen border-0 pt-8 px-4 bg-white backdrop-blur-md">
      <div className="mb-8">
        {/* logo */}
        <img
          src="https://download.logo.wine/logo/Laravel/Laravel-Logo.wine.png"
          alt="react-svg"
          className="w-40"
        />
      </div>
      {/* Navigation Links */}
      <ul className="mt-6 space-y-6">
        {Navigation__links.map((link, index) => (
          <li
            key={link.id}
            className=" font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-indigo-500"
          >
            <Link
              to={link.path}
              className="flex justify-center md:justify-start items-center md:space-x-5"
            >
              <span>{link.icon()} </span>
              <span className="text-sm text-gray-500 hidden md:flex">
                {link.name}{' '}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
