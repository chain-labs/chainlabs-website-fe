"use client";
import React from "react";

const RecordingStatus = React.memo(({ isRecording }: { isRecording: boolean }) => (
  <p className="text-sm text-text-secondary transition-all duration-300 flex items-center gap-2">
    {isRecording && (
      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
    )}
    {isRecording 
      ? "Recording your business requirements..." 
      : "Share your goal in a sentence. We’ll ask one quick follow‑up to tailor everything for you."
    }
  </p>
));
RecordingStatus.displayName = "RecordingStatus";

export default RecordingStatus;