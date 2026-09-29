/**
 * Program and ProgramModule TypeScript interfaces matching backend schemas.
 */

export interface ProgramModule {
  id: string;
  program_id: string;
  name: string;
  description?: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  thumbnail_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  modules: ProgramModule[];
}

export interface ProgramCreatePayload {
  name: string;
  slug?: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  thumbnail_url?: string;
  is_active?: boolean;
  modules?: Array<{
    name: string;
    description?: string;
    order_index?: number;
  }>;
}
