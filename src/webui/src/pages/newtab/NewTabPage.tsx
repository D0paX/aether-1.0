import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./NewTabPage.css";
import { NTPBackground } from "./components/NTPBackground";
import { Clock } from "./components/Clock";
import { NTPSearchBar } from "./components/NTPSearchBar";
import { SpeedDial } from "./components/SpeedDial";

export function NewTabPage(): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="newtab-page">
      <NTPBackground />
      <motion.div 
        className="ntp-content-stack"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Clock />
        <NTPSearchBar inputRef={inputRef} />
        <SpeedDial />
      </motion.div>
    </div>
  );
}
