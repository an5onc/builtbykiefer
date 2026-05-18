grant usage on type lead_status to anon;

grant insert (
  name,
  email,
  phone,
  project_type,
  budget_range,
  status,
  next_follow_up,
  notes
) on leads to anon;

create policy "public quote requests create new leads"
on leads for insert
to anon
with check (
  status = 'new'
  and length(btrim(name)) between 2 and 120
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and length(btrim(email)) <= 160
  and length(btrim(phone)) between 7 and 60
  and length(btrim(project_type)) between 2 and 120
  and length(btrim(budget_range)) between 1 and 120
  and next_follow_up is not null
  and length(btrim(notes)) between 1 and 3000
  and notes like 'Website Quote Request%'
);
