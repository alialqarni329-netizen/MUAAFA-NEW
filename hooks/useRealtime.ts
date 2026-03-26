import { useEffect, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@lib/supabase';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseRealtimeOptions {
  table: string;
  event?: RealtimeEvent;
  filter?: string;
  onChange: (payload: unknown) => void;
}

export function useRealtime({ table, event = '*', filter, onChange }: UseRealtimeOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channelName = `realtime-${table}-${Date.now()}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = supabase.channel(channelName).on('postgres_changes' as any, {
      event,
      schema: 'public',
      table,
      ...(filter ? { filter } : {}),
    }, onChange);

    channelRef.current = query.subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [table, event, filter, onChange]);
}
