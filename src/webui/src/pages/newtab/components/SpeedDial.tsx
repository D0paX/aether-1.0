import React from "react";
import { motion } from "framer-motion";
import { browserBridge } from "../../../chrome/services";
import "./SpeedDial.css";

const DEFAULT_SITES = [
  { id: 1,  name: "YouTube",  url: "https://youtube.com",          color: "#FF0000", letter: "Y" },
  { id: 2,  name: "GitHub",   url: "https://github.com",           color: "#24292F", letter: "G" },
  { id: 3,  name: "X",        url: "https://x.com",                color: "#000000", letter: "X" },
  { id: 4,  name: "Notion",   url: "https://notion.so",            color: "#2B2B2B", letter: "N" },
  { id: 5,  name: "Figma",    url: "https://figma.com",            color: "#F24E1E", letter: "F" },
  { id: 6,  name: "Gmail",    url: "https://gmail.com",            color: "#EA4335", letter: "M" },
  { id: 7,  name: "Drive",    url: "https://drive.google.com",     color: "#4285F4", letter: "D" },
  { id: 8,  name: "Claude",   url: "https://claude.ai",            color: "#CC785C", letter: "C" },
  { id: 9,  name: "Reddit",   url: "https://reddit.com",           color: "#FF4500", letter: "R" },
  { id: 10, name: "Spotify",  url: "https://open.spotify.com",     color: "#1DB954", letter: "S" },
  { id: 11, name: "Netflix",  url: "https://netflix.com",          color: "#E50914", letter: "N" },
  { id: 12, name: "ChatGPT",  url: "https://chatgpt.com",          color: "#10A37F", letter: "G" },
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
