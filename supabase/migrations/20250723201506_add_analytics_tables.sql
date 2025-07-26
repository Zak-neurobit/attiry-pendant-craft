-- Add favourites functionality to profiles table
ALTER TABLE public.profiles 
ADD COLUMN favourites text[] DEFAULT '{}';

-- Add index for better performance on favourites queries
CREATE INDEX idx_profiles_favourites ON public.profiles USING GIN(favourites);

-- Create or update trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();