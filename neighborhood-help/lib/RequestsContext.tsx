import React, { createContext, useContext, useState } from "react";

type Request = {
  id: number;
  title: string;
  description: string;
  location: string;
  phone: string;
};

type RequestsContextType = {
  requests: Request[];
  offers: Request[];
  addRequest: (req: Omit<Request, "id">) => void;
  offerHelp: (req: Request) => void;
};

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [offers, setOffers] = useState<Request[]>([]);

  const addRequest = (req: Omit<Request, "id">) => {
    const newReq = { ...req, id: Date.now() }; // unique id
    setRequests((prev) => [...prev, newReq]);
  };

  const offerHelp = (req: Request) => {
    setOffers((prev) => [...prev, req]);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  return (
    <RequestsContext.Provider value={{ requests, offers, addRequest, offerHelp }}>
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used inside RequestsProvider");
  return ctx;
};
