"use client";
 

import * as React from "react"; 
import { ProviderLayout } from "@/components/layouts";

export interface ProvidersProps {
  children: React.ReactNode; 
}

export function Providers({ children }: ProvidersProps) {
  return <ProviderLayout>{children}</ProviderLayout>;
}
