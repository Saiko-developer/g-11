create or replace function public.is_main_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from auth.users where id = _user_id
    and lower(email) in ('saikokayzin123@gmail.com', 'jaxsai939@gmail.com', 'kayzinphyo1616@gmail.com'))
$$;