
-- Create addresses table for user shipping addresses
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'US',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) on the addresses table
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own addresses
CREATE POLICY "Users can view their own addresses" 
  ON public.addresses 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own addresses
CREATE POLICY "Users can create their own addresses" 
  ON public.addresses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to update their own addresses
CREATE POLICY "Users can update their own addresses" 
  ON public.addresses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to delete their own addresses
CREATE POLICY "Users can delete their own addresses" 
  ON public.addresses 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create policy for admins to manage all addresses
CREATE POLICY "Admins can manage all addresses" 
  ON public.addresses 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger to update the updated_at column
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
