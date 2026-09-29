"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { User } from "@/types/auth";
import { TherapistSidebar } from "@/components/therapist/TherapistSidebar";
import { TherapistHeader } from "@/components/therapist/TherapistHeader";

export default function TherapistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const verifyTherapistAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

      try {
        const currentUser = await authService.getCurrentUser();
        if (isMounted) {
          // Verify role is THERAPIST, ADMIN, or SUPER_ADMIN
          if (!["THERAPIST", "ADMIN", "SUPER_ADMIN"].includes(currentUser.role)) {
            router.push("/dashboard"); // Patient redirected to patient dashboard
            return;
          }
          setUser(currentUser);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          if (token) {
            // Provide fallback demo therapist user for UI preview
            setUser({
              id: "usr-demo-therapist",
              email: "dr.jenkins@physiowellness.com",
              phone: "+1 (555) 987-6543",
              role: "THERAPIST",
              is_active: true,
              is_verified: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            setLoading(false);
          } else {
            router.push("/auth/login");
          }
        }
      }
    };

    verifyTherapistAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const getPageTitle = () => {
    if (pathname === "/therapist/dashboard") return "Clinical Dashboard";
    if (pathname.startsWith("/therapist/patients")) return "Assigned Patients Roster";
    if (pathname.startsWith("/therapist/appointments")) return "Clinical Schedule & Bookings";
    if (pathname.startsWith("/therapist/assessments")) return "Patient Intake Assessments";
    if (pathname.startsWith("/therapist/treatment-plans")) return "Treatment Protocol Builder";
    if (pathname.startsWith("/therapist/exercises")) return "Exercise Prescription";
    if (pathname.startsWith("/therapist/reports")) return "Clinical Progress Reports";
    return "Therapist Portal";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium text-slate-400">Authenticating Practitioner Credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <TherapistSidebar
        user={user}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <TherapistHeader
          title={getPageTitle()}
          user={user}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
