/**
 * Database Adapter for SILUEL Landing
 * 
 * CURRENT: In-memory storage (for development/small scale)
 * TO UPGRADE: Uncomment Supabase or Firestore sections below
 */

export interface Lead {
  id: string;
  timestamp: Date;
  source: string;
  data: {
    name: string;
    email?: string;
    phone: string;
    service: string;
    preferredDate?: string;
    preferredTime?: string;
    notes?: string;
    createdAt: string;
    userAgent?: string;
  };
  status: 'pending' | 'contacted' | 'converted' | 'lost';
}

// In-memory store (persists during server runtime)
const memoryStore: Lead[] = [];

export async function saveLead(lead: Lead): Promise<{ success: boolean; db: 'memory' }> {
  // Store in memory
  memoryStore.push(lead);
  console.log('[DB] Lead saved to memory:', lead.id);
  
  // TODO: Add Supabase integration
  // if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  //   const { createClient } = require('@supabase/supabase-js');
  //   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  //   await supabase.from('leads').insert({ ... });
  //   console.log('[DB] Lead saved to Supabase');
  //   return { success: true, db: 'supabase' };
  // }

  // TODO: Add Firestore integration  
  // if (process.env.FIRESTORE_PROJECT_ID) {
  //   const { Firestore } = require('@google-cloud/firestore');
  //   const firestore = new Firestore({ projectId: process.env.FIRESTORE_PROJECT_ID });
  //   await firestore.collection('leads').add({ ... });
  //   console.log('[DB] Lead saved to Firestore');
  //   return { success: true, db: 'firestore' };
  // }

  return { success: true, db: 'memory' };
}

export async function getLeads(limit = 50): Promise<Lead[]> {
  return memoryStore.slice(-limit).reverse();
}
