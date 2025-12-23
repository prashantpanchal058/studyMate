import { useState } from "react";
import { Bell, Lock, User, ShieldAlert, Trash2 } from "lucide-react";

const Settings:React.FC = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        groupUpdates: false,
        reminders: true,
    });

    const [privacy, setPrivacy] = useState({
        showEmail: false,
        showProfile: true,
    });

    const [account, setAccount] = useState({
        username: "Prashant",
        email: "prashant@example.com",
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">

                {/* Title */}
                <h1 className="text-3xl font-bold mb-6">Settings</h1>

                {/* ------------------------- */}
                {/* Account Settings */}
                {/* ------------------------- */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-indigo-600" /> Account Settings
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="font-medium">Username</label>
                            <input
                                type="text"
                                className="w-full mt-1 border rounded-lg p-2"
                                value={account.username}
                                onChange={(e) =>
                                    setAccount({ ...account, username: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full mt-1 border rounded-lg p-2"
                                value={account.email}
                                onChange={(e) =>
                                    setAccount({ ...account, email: e.target.value })
                                }
                            />
                        </div>

                        <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            Update Account
                        </button>
                    </div>
                </div>

                <hr className="my-8" />

                {/* ------------------------- */}
                {/* Notification Settings */}
                {/* ------------------------- */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-indigo-600" /> Notification Settings
                    </h2>

                    <div className="space-y-6">
                        {/* Toggle */}
                        {[
                            { label: "Email Notifications", key: "email" },
                            { label: "Group Updates", key: "groupUpdates" },
                            { label: "Reminder Alerts", key: "reminders" },
                        ].map((item) => (
                            <div
                                key={item.key}
                                className="flex justify-between items-center"
                            >
                                <span>{item.label}</span>

                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={notifications[item.key as keyof typeof notifications]}
                                        onChange={() =>
                                            setNotifications({
                                                ...notifications,
                                                [item.key]:
                                                    !notifications[item.key as keyof typeof notifications],
                                            })
                                        }
                                    />

                                    <div className="peer h-5 w-10 rounded-full bg-gray-300 peer-checked:bg-indigo-600 peer-focus:ring-2 peer-focus:ring-indigo-500 transition">
                                    </div>

                                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="my-8" />

                {/* ------------------------- */}
                {/* Privacy Settings */}
                {/* ------------------------- */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <Lock className="w-5 h-5 text-indigo-600" /> Privacy Settings
                    </h2>

                    <div className="space-y-6">
                        {[
                            { label: "Show Email Publicly", key: "showEmail" },
                            { label: "Allow Profile Visibility", key: "showProfile" },
                        ].map((item) => (
                            <div key={item.key} className="flex justify-between items-center">
                                <span>{item.label}</span>

                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={privacy[item.key as keyof typeof privacy]}
                                        onChange={() =>
                                            setPrivacy({
                                                ...privacy,
                                                [item.key]:
                                                    !privacy[item.key as keyof typeof privacy],
                                            })
                                        }
                                    />

                                    <div className="peer h-5 w-10 rounded-full bg-gray-300 
                        peer-checked:bg-indigo-600 transition">
                                    </div>

                                    <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white
                        transition peer-checked:translate-x-5"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="my-8" />

                {/* ------------------------- */}
                {/* Danger Zone */}
                {/* ------------------------- */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold flex items-center gap-2 text-red-600 mb-4">
                        <ShieldAlert className="w-5 h-5" /> Danger Zone
                    </h2>

                    <div className="p-4 border border-red-300 rounded-xl bg-red-50">
                        <p className="text-gray-700 mb-4">
                            Once you delete your account, all your data will be permanently removed.
                        </p>

                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-3 hover:bg-red-700">
                            <Trash2 size={18} /> Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;