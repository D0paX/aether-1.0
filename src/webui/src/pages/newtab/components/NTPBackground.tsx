import React from "react";
import { motion } from "framer-motion";
import "./NTPBackground.css";

export function NTPBackground(): React.JSX.Element {
  return (
    <div className="ntp-background">
      <motion.div
        className="ntp-orb ntp-orb-1"
        animate={{ x: [0, 28, 0], y: [0, 18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ntp-orb ntp-orb-2"
        animate={{ x: [0, -20, 0], y: [0, -25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ntp-orb ntp-orb-3"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
