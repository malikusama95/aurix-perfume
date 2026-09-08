INSERT INTO public.user_roles (user_id, role)
VALUES ('6857e155-4432-4bf4-9e23-dc0c8c275026', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;