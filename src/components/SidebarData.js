import { Home, HomeRepairServiceOutlined, Mail } from "@mui/icons-material";
import React from "react";

export const SidebarData = [
    {
        title: "Home title",
        icon: <Home />,
        link: "/home"
    },
    {
        title: "Mail title",
        icon: <Mail />,
        link: "/mail"
    },
    {
        title: "Fruit",
        icon: <HomeRepairServiceOutlined />,
        link: "/fruit"
    }
];