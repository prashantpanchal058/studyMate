import groupStatusContext from "./groupStatusContext";
import type { GroupStatus } from "./groupStatusContext";
import { useState } from "react";

interface GroupStatusProviderProps {
    children: React.ReactNode;
}

const StateGroupStatus: React.FC<GroupStatusProviderProps> = ({ children }) => {
    const host = "http://localhost:8007/status";

    const [groupStatus, setGroupstatus] = useState<GroupStatus[]>([]);

    const createGroupStatus = async (id: string) => {
        try {
            const response = await fetch(`${host}/sendGrouprequest/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token") || "",
                }
            });

            const result = await response.json();

            if (response.ok) {
                setGroupstatus((prev) => [...prev, result.group]);
            }
            return result;

        } catch (error) {
            console.error("Create Status failed", error);
        }
    };

    const getAdminGroupStatus = async () => {
        try {
            const response = await fetch(`${host}/getownerGroupStatus`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token") || "",
                }
            });

            const result = await response.json();

            if (response.ok && result.groupStatus) {
                setGroupstatus(result.groupStatus);
            }

            return result;

        } catch (error) {
            console.error("getting Status failed", error);
        }
    };

    const deleteGroupStatus = async (id:string) => {
        try {
            const response = await fetch(`${host}/deleteGrouprequest/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token") || "",
                }
            });

            const result = await response.json();

            if (response.ok && result.groupStatus) {
                setGroupstatus(result.groupStatus);
            }
            return result;

        } catch (error) {
            console.error("delete Status failed", error);
        }
    };

    const updateGroupStatus = async (id:string) => {
        try {
            const response = await fetch(`${host}/updateGroupStatus/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token") || "",
                }
            });

            const result = await response.json();

            if (response.ok && result.groupStatus) {
                setGroupstatus(result.groupStatus);
            }
            return result;

        } catch (error) {
            console.error("Update Status failed", error);
        }
    };

    const getFindGroupStatus = async (id:string) => {
        try {
            const response = await fetch(`${host}/getGroupStatus/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "auth-token": localStorage.getItem("token") || "",
                }
            });
            const result = await response.json();
            return result;

        } catch (error) {
            console.error("Update Status failed", error);
        }
    };

    const getrequestedGroupStatus = async () => {
        try {
            const response = await fetch(`${host}/getrequestedGroupStatus`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token") || "",
                }
            });

            const result = await response.json();

            if (response.ok && result.groupStatus) {
                setGroupstatus(result.groupStatus);
            }
            return result;
        } catch (error) {
            console.error("getting Status failed", error);
        }
    };

    const getFindStatus = async ( id: string) => {
        try {
            const response = await fetch(`${host}/getuserFind/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const result = await response.json();

            if (response.ok && result.groupStatus) {
                setGroupstatus(result.groupStatus);
            }
            return result;
        } catch (error) {
            console.error("getting Status failed", error);
        }
    }
    
    return (
        <groupStatusContext.Provider
            value={{
                groupStatus,
                createGroupStatus,
                getAdminGroupStatus,
                deleteGroupStatus,
                updateGroupStatus,
                getFindGroupStatus,
                getrequestedGroupStatus,
                getFindStatus
            }}
        >
            {children}
        </groupStatusContext.Provider>
    );
};
export default StateGroupStatus;