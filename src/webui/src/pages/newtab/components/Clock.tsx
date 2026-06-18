import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Clock.css";

function getGreeting(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function Clock(): React.JSX.Element {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="ntp-clock-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="ntp-clock-time">
        {formatTime(time)}
      </div>

      <div className="ntp-clock-date">
        {formatDate(time)}
      </div>

      <div className="ntp-clock-greeting">
        {getGreeting(time.getHours())}
      </div>
    </motion.div>
  );
}
