import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom"

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setLogin] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setLogin(true);   // user logged in
        } else {
            setLogin(false);  // user not logged in
        }
    }, []);


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
                        <img src="logo.svg" alt="Study Group Finder" className="w-9 h-9" />
                        <span className="ml-2 text-xl font-semibold">StudyMate</span>
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

                        {!isLogin ? (
                            <div className="flex gap-2">
                                <button onClick={() => navigate("/login")} className="px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm">
                                    Sign In
                                </button>
                                <button onClick={() => navigate("/Signup")} className="px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm">
                                    Sign Up
                                </button>
                            </div>
                        ) :
                            <div className="flex gap-2">
                                <button onClick={() => {
                                    localStorage.removeItem('token');
                                    setLogin(false);
                                }} className="px-3 py-1.5 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm">
                                    Sign out
                                </button>
                            </div>
                        }
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden inline-flex items-center bg-gray-100 border-0 p-2 rounded text-gray-600 hover:bg-gray-200 focus:outline-none ml-2"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <nav className="md:hidden flex flex-col items-start space-y-3 px-5 pb-4 bg-gray-50">
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
                    <a href="profile" className="text-black hover:text-gray-800">
                        Profile
                    </a>

                    {isLogin ? (
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                setLogin(false);
                            }}
                            className="w-24 bg-indigo-500 text-white py-1.5 rounded hover:bg-indigo-900 text-sm"
                        >
                            Sign Out
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 w-full mt-2">
                            <button
                                onClick={() => navigate("/login")}
                                className="w-24 bg-indigo-500 text-white py-1.5 rounded hover:bg-indigo-900 text-sm"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate("/signup")}
                                className="w-24 bg-indigo-500 text-white py-1.5 rounded hover:bg-indigo-900 text-sm"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                </nav>
            )}
        </header>
    );
}

export default Navbar;