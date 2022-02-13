import React from "react";
import { SidebarData } from "./SidebarData";

function Sidebar(){
    return <div className="sidebar">
        <ul className="sidebarList">
            {SidebarData.map((folderval,folderkey) => 
                <li key={folderkey} className="row folder">
                    {/* <div>{folderval.icon}</div> */}
                    <div 
                        key="title"
                        
                    >
                        {folderval.title}
                    </div>

                    <ul className="folderList" key="listInFolder">
                        {folderval.lists.map((listVal,listKey) => 
                            <li 
                                key={listKey} 
                                className="row list"
                                >
                                {listVal}
                            </li>
                        )}
                    </ul>
                </li>

)}
        </ul>
    </div>;
}

export default Sidebar;