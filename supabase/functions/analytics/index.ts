
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const analyticsType = pathParts[pathParts.length - 1];

    if (req.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    switch (analyticsType) {
      case 'sales':
        const { data: salesData, error: salesError } = await supabase
          .from('orders')
          .select('total, created_at, status')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (salesError) {
          return new Response(JSON.stringify({ error: salesError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Group by day and calculate totals
        const salesByDay = salesData.reduce((acc, order) => {
          const date = new Date(order.created_at).toDateString();
          if (!acc[date]) {
            acc[date] = { total: 0, count: 0 };
          }
          acc[date].total += parseFloat(order.total);
          acc[date].count += 1;
          return acc;
        }, {});

        return new Response(JSON.stringify(salesByDay), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'visitors':
        const { data: visitorData, error: visitorError } = await supabase
          .from('analytics_events')
          .select('created_at, session_id')
          .eq('event_type', 'page_view')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (visitorError) {
          return new Response(JSON.stringify({ error: visitorError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const visitorsByDay = visitorData.reduce((acc, event) => {
          const date = new Date(event.created_at).toDateString();
          if (!acc[date]) {
            acc[date] = new Set();
          }
          acc[date].add(event.session_id);
          return acc;
        }, {});

        const visitors = Object.entries(visitorsByDay).map(([date, sessions]) => ({
          date,
          visitors: (sessions as Set<string>).size
        }));

        return new Response(JSON.stringify(visitors), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'cart':
        const { data: cartData, error: cartError } = await supabase
          .from('analytics_events')
          .select('created_at, session_id, event_type')
          .in('event_type', ['add_to_cart', 'checkout_start', 'purchase'])
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        if (cartError) {
          return new Response(JSON.stringify({ error: cartError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const cartAnalytics = cartData.reduce((acc, event) => {
          if (!acc[event.event_type]) {
            acc[event.event_type] = 0;
          }
          acc[event.event_type] += 1;
          return acc;
        }, {});

        return new Response(JSON.stringify(cartAnalytics), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'live':
        const { data: liveData, error: liveError } = await supabase
          .from('analytics_events')
          .select('session_id')
          .eq('event_type', 'page_view')
          .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString());

        if (liveError) {
          return new Response(JSON.stringify({ error: liveError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        const uniqueSessions = new Set(liveData.map(event => event.session_id));
        return new Response(JSON.stringify({ live_visitors: uniqueSessions.size }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid analytics type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
