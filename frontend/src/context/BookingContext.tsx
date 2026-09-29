"use client";

import React, { createContext, useContext, useState } from "react";
import { AppointmentType } from "@/types/appointment";

export interface BookingState {
  appointmentType: AppointmentType;
  therapistId: string;
  therapistName: string;
  clinicId: string | null;
  clinicName: string | null;
  notes: string;
  selectedDate: string;
  selectedSlotStart: string | null;
  selectedSlotEnd: string | null;
}

interface BookingContextType {
  state: BookingState;
  setCareType: (type: AppointmentType) => void;
  setTherapist: (id: string, name: string) => void;
  setClinic: (id: string | null, name: string | null) => void;
  setAssessmentNotes: (notes: string) => void;
  setSlot: (date: string, startTime: string, endTime: string) => void;
  resetBooking: () => void;
}

const defaultState: BookingState = {
  appointmentType: "ONLINE",
  therapistId: "dr-sarah-jenkins",
  therapistName: "Dr. Sarah Jenkins, MPT",
  clinicId: null,
  clinicName: null,
  notes: "",
  selectedDate: new Date().toISOString().split("T")[0],
  selectedSlotStart: null,
  selectedSlotEnd: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BookingState>(defaultState);

  const setCareType = (appointmentType: AppointmentType) => {
    setState((prev) => ({ ...prev, appointmentType }));
  };

  const setTherapist = (therapistId: string, therapistName: string) => {
    setState((prev) => ({ ...prev, therapistId, therapistName }));
  };

  const setClinic = (clinicId: string | null, clinicName: string | null) => {
    setState((prev) => ({ ...prev, clinicId, clinicName }));
  };

  const setAssessmentNotes = (notes: string) => {
    setState((prev) => ({ ...prev, notes }));
  };

  const setSlot = (selectedDate: string, selectedSlotStart: string, selectedSlotEnd: string) => {
    setState((prev) => ({ ...prev, selectedDate, selectedSlotStart, selectedSlotEnd }));
  };

  const resetBooking = () => {
    setState(defaultState);
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        setCareType,
        setTherapist,
        setClinic,
        setAssessmentNotes,
        setSlot,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
