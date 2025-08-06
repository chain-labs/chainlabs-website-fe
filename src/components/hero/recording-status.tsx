"use client";
import React from "react";
import { motion } from "motion/react";

const RecordingStatus = React.memo(({ isRecording }: { isRecording: boolean }) => (
  <p className="text-sm text-text-secondary transition-all duration-300 flex items-center gap-2">
    {isRecording && (
      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
    )}
    {isRecording 
      ? "Recording your business requirements..." 
      : "Describe your business needs or press space to record."
    }
  </p>
));
RecordingStatus.displayName = "RecordingStatus";

export default RecordingStatus;