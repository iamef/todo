import React from "react";
// import "../App.css";
import { SidebarData } from "./SidebarData";

function Sidebar(){
    return <div className="sidebar">
        <ul className="sidebarList">
            <li>Happy</li>
            <li>Happy</li>
            <li>Happy</li>
            <li>Happy</li>
            <li>Happy</li>
            <li>Happy</li>

            {SidebarData.map((val,key) => 
                <li key={key} className="sidebarRow">
                    <div>{val.icon}</div>
                    <div>{val.title}</div>
                </li>
            )}
        </ul>
    </div>;
}

export default Sidebar;