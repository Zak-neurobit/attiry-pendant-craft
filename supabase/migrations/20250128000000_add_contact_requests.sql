-- Migration: Add contact requests functionality
-- Description: Creates contact_requests table and related functions for the contact form

-- Create contact_requests table
CREATE TABLE contact_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID
);

-- Create indexes for better performance
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX idx_contact_requests_email ON contact_requests(email);

-- Enable RLS (Row Level Security)
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow anyone to insert contact requests (public contact form)
CREATE POLICY "Anyone can submit contact requests" ON contact_requests
    FOR INSERT 
    WITH CHECK (true);

-- Only authenticated users can view/update contact requests (simplified for now)
CREATE POLICY "Only authenticated users can view contact requests" ON contact_requests
    FOR SELECT 
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update contact requests" ON contact_requests
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_contact_requests_updated_at
    BEFORE UPDATE ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_request_updated_at();

-- Function to get contact request statistics for admin dashboard
CREATE OR REPLACE FUNCTION get_contact_request_stats()
RETURNS JSON AS $$
BEGIN
    RETURN (
        SELECT json_build_object(
            'total', COUNT(*),
            'new', COUNT(*) FILTER (WHERE status = 'new'),
            'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
            'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
            'today', COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE),
            'this_week', COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW())),
            'this_month', COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW()))
        )
        FROM contact_requests
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to admins
GRANT EXECUTE ON FUNCTION get_contact_request_stats() TO authenticated;

-- Function to submit a new contact request (for the API)
CREATE OR REPLACE FUNCTION submit_contact_request(
    p_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_subject TEXT,
    p_message TEXT
)
RETURNS UUID AS $$
DECLARE
    request_id UUID;
BEGIN
    -- Validate input
    IF p_name IS NULL OR trim(p_name) = '' THEN
        RAISE EXCEPTION 'Name is required';
    END IF;
    
    IF p_email IS NULL OR trim(p_email) = '' THEN
        RAISE EXCEPTION 'Email is required';
    END IF;
    
    IF p_subject IS NULL OR trim(p_subject) = '' THEN
        RAISE EXCEPTION 'Subject is required';
    END IF;
    
    IF p_message IS NULL OR trim(p_message) = '' THEN
        RAISE EXCEPTION 'Message is required';
    END IF;
    
    -- Insert the contact request
    INSERT INTO contact_requests (name, email, phone, subject, message)
    VALUES (trim(p_name), trim(p_email), trim(p_phone), trim(p_subject), trim(p_message))
    RETURNING id INTO request_id;
    
    RETURN request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users (for public contact form)
GRANT EXECUTE ON FUNCTION submit_contact_request(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION submit_contact_request(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Insert some sample contact requests for testing (optional)
INSERT INTO contact_requests (name, email, phone, subject, message, status) VALUES
('John Doe', 'john@example.com', '+1234567890', 'Custom Pendant Inquiry', 'I would like to create a custom pendant with my daughter''s name. What are the available options?', 'new'),
('Sarah Johnson', 'sarah@example.com', NULL, 'Order Status', 'I placed an order last week and haven''t received any updates. Can you please check the status?', 'new'),
('Michael Brown', 'michael@example.com', '+1987654321', 'Design Consultation', 'I have a specific design idea for an engagement pendant. Would love to discuss the possibilities.', 'in_progress');

-- Create notification function for new contact requests
CREATE OR REPLACE FUNCTION notify_new_contact_request()
RETURNS TRIGGER AS $$
BEGIN
    -- This could be extended to send actual notifications
    -- For now, we'll just log it
    RAISE LOG 'New contact request submitted: % (ID: %)', NEW.subject, NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to notify when new contact request is created
CREATE TRIGGER notify_new_contact_request_trigger
    AFTER INSERT ON contact_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_contact_request();

COMMENT ON TABLE contact_requests IS 'Stores contact form submissions from website visitors';
COMMENT ON FUNCTION submit_contact_request(TEXT, TEXT, TEXT, TEXT, TEXT) IS 'Public function to submit contact requests from the website';
COMMENT ON FUNCTION get_contact_request_stats() IS 'Returns statistics about contact requests for admin dashboard';