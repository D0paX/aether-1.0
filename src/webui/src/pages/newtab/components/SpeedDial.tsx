import React from "react";
import { motion } from "framer-motion";
import { browserBridge } from "../../../chrome/services";
import "./SpeedDial.css";

const DEFAULT_SITES = [
  { id: 1,  name: "YouTube",  url: "https://youtube.com",          color: "#FF0000", letter: "Y" },
  { id: 2,  name: "GitHub",   url: "https://github.com",           color: "#24292F", letter: "G" },
  { id: 3,  name: "X",        url: "https://x.com",                color: "#000000", letter: "X" },
  { id: 4,  name: "Notion",   url: "https://notion.so",            color: "#2B2B2B", letter: "N" },
];

export function SpeedDial(): React.JSX.Element {
  return (
    <motion.div
      className="ntp-speed-dial-grid"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {DEFAULT_SITES.map((site) => (
        <motion.div
          key={site.id}
          className="ntp-speed-dial-item"
          whileHover={{ y: -5, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => void browserBridge.navigation.navigate(site.url)}
        >
          <motion.div 
            className="ntp-speed-dial-icon"
            initial={{ backgroundColor: site.color }}
            animate={{ backgroundColor: site.color }}
          >
            {site.letter}
          </motion.div>
          <div className="ntp-speed-dial-label">
            {site.name}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
