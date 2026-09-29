"use client";

import React, { useState } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "APPOINTMENT" | "EXERCISE" | "CLINICAL" | "SYSTEM";
}

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const [isRead, setIsRead] = useState(notification.read);

  const handleRead = () => {
    setIsRead(true);
    if (onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case "APPOINTMENT":
        return "📅";
      case "EXERCISE":
        return "🧘‍♂️";
      case "CLINICAL":
        return "📋";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
        isRead
          ? "bg-slate-900/40 border-slate-800 text-slate-400"
          : "bg-slate-800/90 border-slate-700/80 text-slate-200 shadow-md shadow-slate-950/20"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sm shrink-0 mt-0.5">
          {getIcon()}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={`text-sm font-semibold truncate ${isRead ? "text-slate-300" : "text-white"}`}>
              {notification.title}
            </h4>
            {!isRead && (
              <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0"></span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-1">{notification.message}</p>
          <span className="text-[10px] text-slate-500 font-mono">{notification.timestamp}</span>
        </div>
      </div>

      {!isRead && (
        <button
          type="button"
          onClick={handleRead}
          className="text-xs text-teal-400 hover:text-teal-300 font-medium whitespace-nowrap shrink-0 hover:underline pt-0.5"
        >
          Mark as read
        </button>
      )}
    </div>
  );
};
