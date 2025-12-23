import { Outlet } from "react-router-dom";
import Navbar from "../componets/Navbar";
import StateGroup from "../context/groups/StateGroup";
import StateGroupStatus from "../context/groupStatus/StateGroupStatus";

const MainLayout: React.FC = () => {
    return (
        <StateGroup >
            <StateGroupStatus>
                    <Navbar />
                    <div className="mt-18">
                        <Outlet />
                    </div>
            </StateGroupStatus>
        </StateGroup>
    );
}

export default MainLayout;