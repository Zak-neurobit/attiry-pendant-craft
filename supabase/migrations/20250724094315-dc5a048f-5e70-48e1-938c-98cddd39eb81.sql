
-- Create events table for analytics tracking
CREATE TABLE public.events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  event TEXT NOT NULL CHECK (event IN ('page_view', 'product_view', 'image_view', 'image_click', 'add_to_cart', 'begin_checkout', 'purchase')),
  page TEXT,
  product_id UUID REFERENCES products(id),
  image_id UUID,
  amount NUMERIC,
  extras JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  verified BOOLEAN DEFAULT false,
  helpful INTEGER DEFAULT 0,
  not_helpful INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create loyalty_points table
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold')),
  total_spent NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_behavior table
CREATE TABLE public.user_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_products UUID[] DEFAULT ARRAY[]::UUID[],
  preferences JSONB DEFAULT '{}',
  recent_searches TEXT[] DEFAULT ARRAY[]::TEXT[],
  currency TEXT DEFAULT 'USD',
  locale TEXT DEFAULT 'en',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create gift_messages table
CREATE TABLE public.gift_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  message TEXT,
  gift_wrap BOOLEAN DEFAULT false,
  delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create alerts_config table
CREATE TABLE public.alerts_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric TEXT NOT NULL,
  comparator TEXT NOT NULL CHECK (comparator IN ('>', '<', '>=', '<=', '=')),
  threshold NUMERIC NOT NULL,
  channel TEXT DEFAULT 'email' CHECK (channel IN ('email', 'slack')),
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('hourly', 'daily', 'weekly')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create alerts_log table
CREATE TABLE public.alerts_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID NOT NULL REFERENCES alerts_config(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ DEFAULT now(),
  metric_value NUMERIC,
  sent BOOLEAN DEFAULT false
);

-- Create ab_tests table
CREATE TABLE public.ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id TEXT NOT NULL,
  variant TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create design_requests table
CREATE TABLE public.design_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  delivery_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns to existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes TEXT;

ALTER TABLE products ADD COLUMN IF NOT EXISTS cogs NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gateway_fee NUMERIC DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ad_spend NUMERIC DEFAULT 0;

-- Add selected_model to site_settings for AI
INSERT INTO site_settings (key, value, description) 
VALUES ('ai_selected_model', '{"model": "gpt-4.1-mini"}', 'Selected OpenAI model for AI operations')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for performance
CREATE INDEX idx_events_product_id ON events(product_id);
CREATE INDEX idx_events_event_created ON events(event, created_at);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX idx_user_behavior_user_id ON user_behavior(user_id);

-- Enable RLS on new tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Events policies
CREATE POLICY "Anyone can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all events" ON events FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all reviews" ON reviews FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Loyalty points policies
CREATE POLICY "Users can view their own loyalty points" ON loyalty_points FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all loyalty points" ON loyalty_points FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Referrals policies
CREATE POLICY "Users can view their referrals" ON referrals FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());
CREATE POLICY "Users can create referrals" ON referrals FOR INSERT WITH CHECK (referrer_id = auth.uid());
CREATE POLICY "Admins can manage all referrals" ON referrals FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- User behavior policies
CREATE POLICY "Users can manage their own behavior data" ON user_behavior FOR ALL USING (user_id = auth.uid());

-- Gift messages policies
CREATE POLICY "Users can view gift messages for their orders" ON gift_messages 
  FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = gift_messages.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can manage all gift messages" ON gift_messages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only policies for analytics tables
CREATE POLICY "Admins can manage alerts config" ON alerts_config FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can view alerts log" ON alerts_log FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can manage AB tests" ON ab_tests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Design requests policies
CREATE POLICY "Anyone can create design requests" ON design_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all design requests" ON design_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create materialized views for analytics
CREATE MATERIALIZED VIEW conversion_funnel_view AS
SELECT 
  event,
  COUNT(*) as total_events,
  COUNT(DISTINCT session_id) as unique_sessions
FROM events 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY event
ORDER BY CASE event
  WHEN 'page_view' THEN 1
  WHEN 'product_view' THEN 2
  WHEN 'add_to_cart' THEN 3
  WHEN 'begin_checkout' THEN 4
  WHEN 'purchase' THEN 5
  ELSE 6
END;

CREATE MATERIALIZED VIEW product_heat_view AS
SELECT 
  p.id,
  p.title,
  COUNT(CASE WHEN e.event = 'product_view' THEN 1 END) as views,
  COUNT(CASE WHEN e.event = 'add_to_cart' THEN 1 END) as add_to_carts,
  COUNT(CASE WHEN e.event = 'purchase' THEN 1 END) as purchases,
  COALESCE(SUM(CASE WHEN e.event = 'purchase' THEN e.amount END), 0) as revenue
FROM products p
LEFT JOIN events e ON p.id = e.product_id
WHERE e.created_at >= CURRENT_DATE - INTERVAL '30 days' OR e.created_at IS NULL
GROUP BY p.id, p.title;

-- Create admin customer overview view
CREATE VIEW admin_customer_overview AS
SELECT 
  p.id,
  p.user_id,
  p.email,
  p.first_name,
  p.last_name,
  p.phone,
  p.is_blocked,
  p.created_at as joined_at,
  COALESCE(lp.points, 0) as loyalty_points,
  COALESCE(lp.tier, 'bronze') as loyalty_tier,
  COALESCE(lp.total_spent, 0) as total_spent,
  COALESCE(order_stats.total_orders, 0) as total_orders,
  order_stats.last_order_at
FROM profiles p
LEFT JOIN loyalty_points lp ON p.user_id = lp.user_id
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as total_orders,
    MAX(created_at) as last_order_at
  FROM orders 
  GROUP BY user_id
) order_stats ON p.user_id = order_stats.user_id;

-- Create triggers for loyalty points
CREATE OR REPLACE FUNCTION update_loyalty_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award points for orders
  IF TG_OP = 'INSERT' AND NEW.status = 'paid' THEN
    INSERT INTO loyalty_points (user_id, points, total_spent)
    VALUES (NEW.user_id, FLOOR(NEW.total * 10), NEW.total)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      points = loyalty_points.points + FLOOR(NEW.total * 10),
      total_spent = loyalty_points.total_spent + NEW.total,
      tier = CASE 
        WHEN loyalty_points.total_spent + NEW.total >= 500 THEN 'gold'
        WHEN loyalty_points.total_spent + NEW.total >= 100 THEN 'silver'
        ELSE 'bronze'
      END,
      updated_at = now();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loyalty_points_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_loyalty_points();

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW conversion_funnel_view;
  REFRESH MATERIALIZED VIEW product_heat_view;
END;
$$ LANGUAGE plpgsql;
