-- Supabase Schema for Lead2Client Battle Station
-- Full PostgreSQL schema

-- Prospects table (from research agents)
create table prospects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Basic info
    name text not null,
    company text,
    title text,
    
    -- Contact
    email text,
    phone text,
    linkedin_url text,
    website text,
    
    -- Source tracking
    source text not null,
    source_id text,
    found_by text not null,
    
    -- Qualification
    agent_type text,
    pain_points text[],
    current_crm text,
    budget_range text,
    
    -- Scoring
    priority int default 3,
    lead_score int default 0,
    
    -- Status
    status text default 'new',
    assigned_to text
);

-- VA Activities table
create table va_activities (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    va_name text not null,
    date date not null default current_date,
    activity_type text not null,
    prospect_id uuid references prospects(id),
    platform text,
    content text,
    sent boolean default false,
    replied boolean default false,
    booked_meeting boolean default false,
    notes text
);

-- Campaigns table
create table campaigns (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    platform text not null,
    daily_budget decimal(10,2),
    total_spend decimal(10,2) default 0,
    status text default 'draft',
    impressions int default 0,
    clicks int default 0,
    leads int default 0,
    customers int default 0
);

-- Daily metrics
create table daily_metrics (
    id uuid default gen_random_uuid() primary key,
    date date not null unique,
    new_prospects int default 0,
    meetings_booked int default 0,
    meetings_held int default 0,
    new_clients int default 0,
    ad_spend decimal(10,2) default 0
);

-- Agent logs
create table agent_logs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    agent_name text not null,
    task text not null,
    status text default 'started',
    prospects_found int default 0,
    cost decimal(10,4),
    runtime_seconds int
);

-- Tasks queue
create table tasks (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    assignee text,
    priority int default 3,
    status text default 'pending',
    due_date date
);
