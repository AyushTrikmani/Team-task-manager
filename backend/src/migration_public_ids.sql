CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE projects ADD COLUMN IF NOT EXISTS public_id UUID;
UPDATE projects SET public_id = gen_random_uuid() WHERE public_id IS NULL;
ALTER TABLE projects ALTER COLUMN public_id SET DEFAULT gen_random_uuid();
ALTER TABLE projects ALTER COLUMN public_id SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS projects_public_id_idx ON projects(public_id);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS public_id UUID;
UPDATE tasks SET public_id = gen_random_uuid() WHERE public_id IS NULL;
ALTER TABLE tasks ALTER COLUMN public_id SET DEFAULT gen_random_uuid();
ALTER TABLE tasks ALTER COLUMN public_id SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS tasks_public_id_idx ON tasks(public_id);
