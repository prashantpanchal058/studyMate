import groupContext from "./groupContext";
import type { Group } from "./groupContext";
import { useState } from "react";

interface GroupProviderProps {
    children: React.ReactNode;
}

const StateGroup: React.FC<GroupProviderProps> = ({ children }) => {
    // const host = "http://localhost:8007/group";
    const host = import.meta.env.VITE_GROUP_HOST;
    const [groups, setGroups] = useState<Group[]>([]);

    // Create a group
    const createGroup = async (data: Group) => {
        const response = await fetch(`${host}/createGroup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token") || "",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        // Optionally store in state
        if (response.ok) {
            setGroups(Array.isArray(result.groups) ? result.groups : []);
        }

        return result;
    };

    const getGroups = async () => {

        try {
            const response = await fetch(`${host}/getGroups`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token") || "",
                }
            });

            const result = await response.json();

            if (response.ok) {
                setGroups(Array.isArray(result.groups) ? result.groups : []);
            }

            return result;

        } catch (error) {

        }
    }

    const deleteGroup = async (id: string) => {
        try {
            const response = await fetch(`${host}/deleteGroup/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token") || "",
                }
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Delete group failed:", error);
            throw error;
        }
    };

    const getAllGroup = async () => {
        const response = await fetch(`${host}/getAllGroup`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token") || "",
            }
        });

        const result = await response.json();

        if (response.ok) {
            setGroups(Array.isArray(result.groups) ? result.groups : []);
        }

        return result;
    }

    return (
        <groupContext.Provider
            value={{
                groups,
                createGroup,
                getGroups,
                deleteGroup,
                getAllGroup
            }}
        >
            {children}
        </groupContext.Provider>
    );
};

export default StateGroup;
