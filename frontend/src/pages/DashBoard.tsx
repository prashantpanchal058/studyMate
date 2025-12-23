const DashBoard:React.FC = () => {
    return (
        <div>
            <section className="text-gray-700 body-font">
                {/* Hero Section */}
                <div className="container mx-auto flex px-5 py-2 items-center justify-center flex-col">

                    {/* Main Title */}
                    <div className="text-center lg:w-2/3 w-full">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
                            Find Your Perfect Study Group
                        </h1>
                        <p className="mb-6 leading-relaxed text-gray-600">
                            Connect with students who share your course, interests, and availability.
                            Join or create groups and study together efficiently.
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4">
                            <a href="/find-group">
                                <button className="inline-flex text-white bg-indigo-600 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-700 rounded text-lg">
                                    Find a Group
                                </button>
                            </a>

                            <a href="/signup">
                                <button className="inline-flex text-indigo-600 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                                    Get Started
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="bg-gray-50 py-20">
                    <div className="container mx-auto px-5">
                        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                            Why Use Study Group Finder?
                        </h2>

                        <div className="grid md:grid-cols-3 gap-10">

                            {/* Feature 1 */}
                            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="text-xl font-semibold mb-3">Match by Interests</h3>
                                <p className="text-gray-600">
                                    Connect with students who study the same subjects or share similar goals.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="text-xl font-semibold mb-3">Real-Time Chat</h3>
                                <p className="text-gray-600">
                                    Communicate instantly with group members using integrated chat.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
                                <h3 className="text-xl font-semibold mb-3">Organize Sessions</h3>
                                <p className="text-gray-600">
                                    Schedule study sessions easily based on availability matching.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

            </section>

        </div>
    )
}

export default DashBoard