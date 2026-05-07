insert into clients (id, name, email, phone) values
  ('11111111-1111-4111-8111-111111111111', 'Avery Thompson', 'avery@example.com', '(970) 555-0181'),
  ('11111111-1111-4111-8111-111111111112', 'Morgan Ridge', 'morgan@example.com', '(970) 555-0194'),
  ('11111111-1111-4111-8111-111111111113', 'Summit Creek Holdings', 'projects@summitcreek.example', '(970) 555-0167')
on conflict (id) do nothing;

insert into leads (id, name, email, phone, project_type, budget_range, status, next_follow_up, notes) values
  ('22222222-2222-4222-8222-222222222221', 'Danielle Porter', 'danielle@example.com', '(970) 555-0142', 'Custom Home', '$900k-$1.2M', 'qualified', '2026-05-12', 'Interested in a modern ranch layout near Windsor.'),
  ('22222222-2222-4222-8222-222222222222', 'Chris Valdez', 'chris@example.com', '(970) 555-0178', 'Kitchen Remodel', '$120k-$180k', 'contacted', '2026-05-10', 'Wants premium finishes and a tighter construction window.'),
  ('22222222-2222-4222-8222-222222222223', 'Northline Dental', 'buildout@northline.example', '(970) 555-0118', 'Commercial Buildout', '$450k-$650k', 'new', '2026-05-09', 'Commercial tenant improvement inquiry.')
on conflict (id) do nothing;

insert into projects (id, client_id, name, location, type, status, current_phase, progress, budget_range, start_date, estimated_completion, notes, hero_image) values
  ('33333333-3333-4333-8333-333333333331', '11111111-1111-4111-8111-111111111111', 'Highland Ridge Custom Home', 'Windsor, CO', 'Custom Home', 'active', 'Interior rough-in', 58, '$950k-$1.15M', '2026-02-03', '2026-09-18', 'Owner-ready progress updates with internal controls.', '/images/project-3/exterior-twilight-front.jpg'),
  ('33333333-3333-4333-8333-333333333332', '11111111-1111-4111-8111-111111111112', 'Poudre Canyon Mountain Modern', 'Bellvue, CO', 'Mountain Custom Home', 'active', 'Exterior completion', 76, '$780k-$940k', '2025-11-10', '2026-07-22', 'Remote-site progress photos and document tracking.', '/images/project-2/exterior-front-facade.jpg'),
  ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111113', 'Timnath Commercial Buildout', 'Timnath, CO', 'Commercial', 'planning', 'Preconstruction', 18, '$420k-$560k', '2026-06-01', '2026-11-15', 'Commercial workflow for documents and follow-ups.', '/images/project-1/exterior-1.jpg')
on conflict (id) do nothing;

insert into project_phases (id, project_id, title, description, status, date_label, sort_order) values
  ('44444444-4444-4444-8444-444444444441', '33333333-3333-4333-8333-333333333331', 'Preconstruction', 'Selections, budget alignment, and schedule lock.', 'completed', 'Feb 2026', 1),
  ('44444444-4444-4444-8444-444444444442', '33333333-3333-4333-8333-333333333331', 'Foundation & Framing', 'Foundation, framing, and dried-in milestone.', 'completed', 'Mar 2026', 2),
  ('44444444-4444-4444-8444-444444444443', '33333333-3333-4333-8333-333333333331', 'Interior Rough-In', 'MEP rough-in, inspections, and coordination notes.', 'in-progress', 'May 2026', 3),
  ('44444444-4444-4444-8444-444444444444', '33333333-3333-4333-8333-333333333332', 'Exterior Completion', 'Exterior punch and weatherproofing details.', 'in-progress', 'May 2026', 1)
on conflict (id) do nothing;

insert into project_files (id, project_id, name, file_type, visibility, storage_bucket, storage_path, size_label, uploaded_at) values
  ('55555555-5555-4555-8555-555555555551', '33333333-3333-4333-8333-333333333331', 'Rough-in inspection packet.pdf', 'document', 'internal', 'project-documents', '33333333-3333-4333-8333-333333333331/documents/rough-in-inspection-packet.pdf', '1.8 MB', '2026-05-04T12:00:00Z'),
  ('55555555-5555-4555-8555-555555555552', '33333333-3333-4333-8333-333333333331', 'Kitchen progress photo set', 'photo', 'customer', 'project-photos', '33333333-3333-4333-8333-333333333331/photos/kitchen-progress.jpg', '12 photos', '2026-05-05T12:00:00Z'),
  ('55555555-5555-4555-8555-555555555553', '33333333-3333-4333-8333-333333333332', 'Exterior punch notes.pdf', 'document', 'internal', 'project-documents', '33333333-3333-4333-8333-333333333332/documents/exterior-punch-notes.pdf', '420 KB', '2026-05-02T12:00:00Z')
on conflict (id) do nothing;

insert into workers (id, name, role, is_active) values
  ('66666666-6666-4666-8666-666666666661', 'Caleb Jensen', 'Lead Carpenter', true),
  ('66666666-6666-4666-8666-666666666662', 'Maya Torres', 'Project Coordinator', true),
  ('66666666-6666-4666-8666-666666666663', 'Eli Brooks', 'Finish Carpenter', true)
on conflict (id) do nothing;

insert into time_entries (id, worker_id, project_id, clock_in, clock_out, notes) values
  ('77777777-7777-4777-8777-777777777771', '66666666-6666-4666-8666-666666666661', '33333333-3333-4333-8333-333333333331', '2026-05-06T07:12:00-06:00', '2026-05-06T15:48:00-06:00', 'Interior blocking and coordination.'),
  ('77777777-7777-4777-8777-777777777772', '66666666-6666-4666-8666-666666666662', '33333333-3333-4333-8333-333333333331', '2026-05-06T08:00:00-06:00', '2026-05-06T12:30:00-06:00', 'Updated selections and owner notes.'),
  ('77777777-7777-4777-8777-777777777773', '66666666-6666-4666-8666-666666666663', '33333333-3333-4333-8333-333333333332', '2026-05-06T06:45:00-06:00', null, 'Active shift demo.')
on conflict (id) do nothing;

insert into invoices (id, invoice_number, project_id, client_id, status, issue_date, due_date, notes) values
  ('88888888-8888-4888-8888-888888888881', 'KBC-2026-001', '33333333-3333-4333-8333-333333333331', '11111111-1111-4111-8111-111111111111', 'draft', '2026-05-07', '2026-05-22', 'Demo invoice for platform walkthrough.'),
  ('88888888-8888-4888-8888-888888888882', 'KBC-2026-002', '33333333-3333-4333-8333-333333333332', '11111111-1111-4111-8111-111111111112', 'sent', '2026-05-01', '2026-05-16', 'Demo exterior milestone invoice.')
on conflict (id) do nothing;

insert into invoice_line_items (id, invoice_id, description, quantity, unit_price, sort_order) values
  ('99999999-9999-4999-8999-999999999991', '88888888-8888-4888-8888-888888888881', 'Interior rough-in labor', 42.50, 86.00, 1),
  ('99999999-9999-4999-8999-999999999992', '88888888-8888-4888-8888-888888888881', 'MEP coordination allowance', 1.00, 2800.00, 2),
  ('99999999-9999-4999-8999-999999999993', '88888888-8888-4888-8888-888888888882', 'Exterior punch labor', 31.00, 82.00, 1)
on conflict (id) do nothing;
