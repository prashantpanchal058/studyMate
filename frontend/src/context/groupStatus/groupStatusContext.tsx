import { createContext } from "react";

export interface GroupStatus {
    userId: string;
    groupId: string;
    groupMateId: string;
    status:string;
}

interface GroupStatusContextType {
    groupStatus: GroupStatus[];
    createGroupStatus: (id: string) => Promise<any>;
    getAdminGroupStatus: () => Promise<any>;
    deleteGroupStatus: (id: string) => Promise<any>;
    updateGroupStatus: (id: string) => Promise<any>;
    getFindGroupStatus: (id: string) => Promise<any>;
    getrequestedGroupStatus: () => Promise<any>;
    getFindStatus: (id: string) => Promise<any>;
}

const groupStatusContext = createContext<GroupStatusContextType | null>(null);

export default groupStatusContext;