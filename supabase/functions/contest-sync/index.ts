// Supabase Edge Function to sync contest data with external API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// External API endpoint
const EXTERNAL_API_URL = "https://8e04-150-242-197-103.ngrok-free.app/api/hackthon/";

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch contests from external API
    const response = await fetch(EXTERNAL_API_URL);
    
    if (!response.ok) {
      throw new Error(`External API request failed with status ${response.status}`);
    }
    
    const contests = await response.json();
    console.log(`Fetched ${contests.length} contests from external API`);

    // Process and store contests in Supabase
    // This is a simplified example - in a real implementation, you would:
    // 1. Create a 'contests' table in Supabase
    // 2. Transform the API data to match your schema
    // 3. Upsert the contests into the database
    
    // For this example, we'll just return the fetched contests
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Synced ${contests.length} contests`,
        data: contests 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error syncing contests:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});