import { useState } from "react";
import { Menu, X, User} from "lucide-react";
import { useNavigate } from "react-router-dom"

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="text-gray-600 body-font shadow-sm fixed top-0 left-0 w-full z-50 bg-white">
            <div className="w-full flex flex-wrap p-3 items-center justify-between">
                {/* Left Section: Logo + Links */}
                <div className="flex items-center">
                    {/* Logo */}
                    <a
                        href="/"
                        className="flex title-font font-medium items-center text-gray-900"
                    >
                        <img src="logo.svg" alt="Study Group Finder" className="w-11 h-11 ms-3 mt-1" />
                        <span className="ms-4 text-2xl font-semibold">StudyMate</span>
                    </a>

                    {/* Links (visible on desktop) */}
                    <nav className="hidden md:flex md:ml-10 space-x-6 items-center">
                        <a href="/" className="text-black hover:text-gray-800">
                            Home
                        </a>
                        <a href="/find-group" className="text-black hover:text-gray-800">
                            Find Group
                        </a>
                        <a href="/my_groups" className="text-black hover:text-gray-800">
                            My Groups
                        </a>
                        <a href="/createGroups" className="text-black hover:text-gray-800">
                            create groups
                        </a>
                    </nav>
                </div>

                {/* Right Section: Buttons + Mobile Menu Toggle */}
                <div className="flex items-center justify-end ml-auto md:mr-0">
                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-3">

                        <div onClick={() => { navigate("/profile") }} className="flex flex-col pe-3 items-center cursor-pointer">
                            <button className="rounded-full hover:bg-gray-100 p-1.5">
                                <User className="w-6 h-6 text-gray-700" />
                            </button>
                            <span className="text-xs mt-0.5">Profile</span>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    {/* Mobile Right Icons */}
                    <div className="flex items-center gap-2 md:hidden ml-2">

                        {/* Profile */}
                        <button
                            onClick={() => navigate("/profile")}
                            className="p-2 rounded-full hover:bg-gray-100"
                        // className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <User className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center bg-gray-100 dark:bg-gray-800 border-0 p-2 rounded text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <nav className="md:hidden flex flex-col px-5 py-4 bg-white dark:bg-gray-900 shadow-md rounded-b-2xl space-y-4">

                    {/* Links */}
                    <div className="flex flex-col space-y-3 text-sm font-medium">
                        <a href="/" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            Home
                        </a>
                        <a href="/find-group" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            Find Group
                        </a>
                        <a href="/my_groups" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            My Groups
                        </a>
                        <a href="/createGroups" className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            Create Groups
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                </nav>
            )}
        </header>
    );
}

export default Navbar;