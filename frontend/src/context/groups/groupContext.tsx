import { createContext } from "react";

export interface Group {
    topic: string;
    subtopic: string;
    desc: string;
    time: string;
    days: string;
}

interface GroupContextType {
    groups: Group[];
    createGroup: (data: Group) => Promise<any>;
    getGroups: () => Promise<any>;
    deleteGroup: (id: string) => Promise<any>;
    getAllGroup: () => Promise<any>;
}

const groupContext = createContext<GroupContextType | null>(null);

export default groupContext;
