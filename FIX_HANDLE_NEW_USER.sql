-- ============================================================================
-- FIX: Update handle_new_user() function to insert into correct table
-- ============================================================================

-- Drop and recreate the function to insert into public.users (not dash_users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Insert into public.users (not dash_users)
    INSERT INTO public.users (id, email, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'user')
    );
    RETURN new;
END;
$function$;

-- The trigger already exists, no need to recreate it
-- But if you want to verify it exists, here's the command:
-- SELECT * FROM information_schema.triggers
-- WHERE trigger_name = 'on_auth_user_created';
