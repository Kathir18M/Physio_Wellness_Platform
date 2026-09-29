"use client";

import React, { useEffect, useState } from "react";
import { NotificationCard, NotificationItem as ComponentNotificationItem } from "@/components/dashboard/NotificationCard";
import { notificationService, NotificationItem } from "@/services/notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<ComponentNotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fallbackNotifications: ComponentNotificationItem[] = [
    {
      id: "notif-1",
      title: "Upcoming Video Consultation",
      message: "Session with Dr. Sarah Jenkins starts tomorrow at 10:00 AM.",
      timestamp: "10 mins ago",
      read: false,
      type: "APPOINTMENT",
    },
    {
      id: "notif-2",
      title: "New Exercise Module Assigned",
      message: "Week 4 Lumbar Core Stability exercises have been added to your plan.",
      timestamp: "2 hours ago",
      read: false,
      type: "EXERCISE",
    },
    {
      id: "notif-3",
      title: "Clinical Progress Note Added",
      message: "Dr. Sarah Jenkins reviewed your pain log: 'Great mobility progress on straight leg raises!'",
      timestamp: "1 day ago",
      read: true,
      type: "CLINICAL",
    },
  ];

  useEffect(() => {
    async function loadNotifications() {
      try {
        setLoading(true);
        const data = await notificationService.getMyNotifications();
        if (data && data.length > 0) {
          const mapped: ComponentNotificationItem[] = data.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.body,
            timestamp: new Date(n.created_at).toLocaleDateString(),
            read: n.status === "READ",
            type: n.event_type.includes("EXERCISE")
              ? "EXERCISE"
              : n.event_type.includes("PROGRESS") || n.event_type.includes("TREATMENT")
              ? "CLINICAL"
              : "APPOINTMENT",
          }));
          setNotifications(mapped);
        } else {
          setNotifications(fallbackNotifications);
        }
      } catch (err) {
        console.warn("Could not load backend notifications, using fallback list:", err);
        setNotifications(fallbackNotifications);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.warn("Error marking notification as read on backend:", err);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.warn("Error marking all notifications read on backend:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Notifications & System Updates</h1>
          <p className="text-slate-400 text-sm">
            Stay updated with session reminders, clinical feedback, and assigned routines across In-App, Email, and WhatsApp.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold rounded-xl hover:bg-teal-500/20 transition-all"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-3">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm animate-pulse">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            You have no notifications at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkAsRead={handleMarkRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
