import React from "react";
import { SidebarData } from "./SidebarData";
import { eventBus } from "../utils/eventBus";

function Sidebar(){
    function createFilterFolderEvent(folderName){
        eventBus.dispatch("filterFolder", {folder: folderName});
    }

    function createFilterListEvent(folderName, listName){
        eventBus.dispatch("filterList", {folder: folderName, list: listName});
    }
    
    
    return (
    <div className="sidebar">
        <ul className="sidebarList">
            <li key="allfolders" className="row folder">
                <div 
                    key="title"
                    onClick={() => eventBus.dispatch("filterFolder", {})}
                >
                All Tasks
            </div>
            </li>
            
            {SidebarData.map((folderval,folderkey) => 
                <li key={folderkey} className="row folder">
                    {/* <div>{folderval.icon}</div> */}
                    <div 
                        key="title"
                        onClick={() => createFilterFolderEvent(folderval.title)}
                    >
                        {folderval.title}
                    </div>

                    <ul className="folderList" key="listInFolder">
                        {folderval.lists.map((listVal,listKey) => 
                            <li 
                                key={listKey} 
                                className="row list"
                                onClick={() => createFilterListEvent(folderval.title, listVal)}
                                >
                                {listVal}
                            </li>
                        )}
                    </ul>
                </li>

            )}
        </ul>
    </div>
    );
}

export default Sidebar;