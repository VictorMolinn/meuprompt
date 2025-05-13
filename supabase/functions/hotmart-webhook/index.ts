import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.38.5';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SITE_URL = Deno.env.get('SITE_URL') || 'https://meuprompt.eiaiflix.com.br';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface HotmartWebhookPayload {
  data: {
    buyer: {
      email: string;
      name: string;
      first_name: string;
      last_name: string;
    };
    purchase: {
      status: string;
      transaction: string;
      price: {
        value: number;
        currency_value: string;
      };
      payment: {
        type: string;
      };
    };
    product: {
      id: number;
      ucode: string;
      name: string;
    };
    subscription?: {
      status: string;
      plan: {
        id: number;
        name: string;
      };
      subscriber: {
        code: string;
      };
    };
  };
  event: string;
}

async function logWebhookEvent(eventType: string, payload: any, status: 'success' | 'error', errorMessage?: string) {
  try {
    await supabase
      .from('webhook_logs')
      .insert({
        event_type: eventType,
        payload,
        status,
        error_message: errorMessage || null,
      });
  } catch (error) {
    console.error('Error logging webhook:', error instanceof Error ? error.message : 'Unknown error');
  }
}

async function handlePurchase(payload: HotmartWebhookPayload) {
  const buyerEmail = payload.data.buyer.email;
  const transaction = payload.data.purchase.transaction;
  
  // Validate required fields
  if (!buyerEmail || !transaction) {
    throw new Error('Missing required fields: email or transaction');
  }
  
  try {
    // Check if transaction already exists
    const { data: existingTransaction } = await supabase
      .from('hotmart_transactions')
      .select('id')
      .eq('transaction', transaction)
      .maybeSingle();
    
    if (existingTransaction) {
      console.log('Transaction already processed:', transaction);
      return new Response(JSON.stringify({ success: true, message: 'Transaction already processed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    
    // Store transaction data
    const { error: transactionError } = await supabase
      .from('hotmart_transactions')
      .insert({
        transaction,
        email: buyerEmail,
        name: payload.data.buyer.name,
        product_id: payload.data.product.ucode,
        status: payload.data.purchase.status,
        payment_type: payload.data.purchase.payment?.type,
        price: payload.data.purchase.price.value,
      });
    
    if (transactionError) {
      if (transactionError.code === '23505') { // Unique constraint violation
        console.log('Transaction already processed (race condition):', transaction);
        return new Response(JSON.stringify({ success: true, message: 'Transaction already processed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } else {
        console.error('Transaction error:', transactionError);
        throw new Error(`Failed to store transaction: ${transactionError.message}`);
      }
    }
    
    // Check if user exists
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error('Users error:', usersError);
      throw new Error(`Failed to list users: ${usersError.message}`);
    }
    
    const existingUser = users.find(u => u.email === buyerEmail);
    
    if (existingUser) {
      // Link transaction to existing user
      const { error: linkError } = await supabase
        .from('hotmart_transactions')
        .update({ user_id: existingUser.id })
        .eq('transaction', transaction);
      
      if (linkError) throw linkError;
      
      // Update user's subscription status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ subscription_status: 'premium' })
        .eq('id', existingUser.id);
      
      if (updateError) throw updateError;
    }
    
    // Handle subscription if present
    if (payload.data.subscription) {
      const { error: subscriptionError } = await supabase
        .from('hotmart_subscriptions')
        .upsert({
          user_id: existingUser?.id || newUser.user.id,
          subscription_id: payload.data.subscription.subscriber.code,
          plan: payload.data.subscription.plan.name,
          status: payload.data.subscription.status,
        }, { onConflict: 'subscription_id' });
      
      if (subscriptionError) throw subscriptionError;
    }
    
    await logWebhookEvent(payload.event, payload, 'success');
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    await logWebhookEvent(payload.event, payload, 'error', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }
  
  try {
    const payload: HotmartWebhookPayload = await req.json();
    
    if (!payload?.data?.buyer?.email) {
      const error = 'Missing buyer email';
      await logWebhookEvent('VALIDATION_ERROR', payload, 'error', error);
      return new Response(JSON.stringify({ error }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!payload?.data?.purchase?.transaction) {
      const error = 'Missing transaction ID';
      await logWebhookEvent('VALIDATION_ERROR', payload, 'error', error);
      return new Response(JSON.stringify({ error }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    if (!payload?.event) {
      const error = 'Missing event type';
      await logWebhookEvent('VALIDATION_ERROR', payload, 'error', error);
      return new Response(JSON.stringify({ error }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Handle purchase events
    if (payload.event === 'PURCHASE_COMPLETE' || payload.event === 'PURCHASE_APPROVED') {
      return handlePurchase(payload);
    }
    
    const errorMsg = `Unsupported event type: ${payload.event}`;
    const error = `Unsupported event type: ${payload.event}`;
    await logWebhookEvent('UNSUPPORTED_EVENT', payload, 'error', error);
    return new Response(JSON.stringify({ error: 'Unsupported event type' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook error:', errorMessage);
    await logWebhookEvent('PARSE_ERROR', await req.text(), 'error', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});