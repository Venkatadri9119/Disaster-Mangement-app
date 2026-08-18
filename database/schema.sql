-- Disaster AI Database Schema with PostGIS extensions

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enum types (represented as standard VARCHAR with constraints)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CITIZEN', 'VOLUNTEER', 'NGO', 'ADMIN')),
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Citizen Profiles
CREATE TABLE IF NOT EXISTS citizen_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    emergency_contact VARCHAR(20),
    medical_notes TEXT,
    location GEOMETRY(Point, 4326),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NGOs
CREATE TABLE IF NOT EXISTS ngos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    organization_name VARCHAR(150) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    service_areas JSONB DEFAULT '[]'::jsonb,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Volunteer Profiles
CREATE TABLE IF NOT EXISTS volunteer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    ngo_id UUID REFERENCES ngos(id) ON DELETE SET NULL,
    skills JSONB DEFAULT '[]'::jsonb, -- ['flood_rescue', 'medical_first_aid', 'boat_operator']
    availability_status VARCHAR(20) DEFAULT 'UNAVAILABLE' CHECK (availability_status IN ('AVAILABLE', 'UNAVAILABLE', 'ON_MISSION')),
    location GEOMETRY(Point, 4326),
    medical_certified BOOLEAN DEFAULT FALSE,
    workload_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Requests
CREATE TABLE IF NOT EXISTS emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    disaster_type VARCHAR(50) NOT NULL, -- 'flood', 'fire', 'cyclone', 'earthquake', 'medical', 'building_collapse'
    people_count INT DEFAULT 1,
    medical_need BOOLEAN DEFAULT FALSE,
    missing_person BOOLEAN DEFAULT FALSE,
    evacuation_required BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('CRITICAL', 'HIGH', 'NORMAL')),
    location GEOMETRY(Point, 4326) NOT NULL,
    address_text TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'AI_PRIORITIZED', 'VOLUNTEER_ASSIGNED', 'ON_THE_WAY', 'REACHED', 'COMPLETED', 'RESOLVED', 'CANCELLED')),
    ai_extracted_data JSONB DEFAULT '{}'::jsonb,
    photo_url TEXT,
    flagged_fraud BOOLEAN DEFAULT FALSE,
    fraud_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Request Assignments
CREATE TABLE IF NOT EXISTS request_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'ASSIGNED' CHECK (status IN ('ASSIGNED', 'ACCEPTED', 'REJECTED', 'COMPLETED')),
    match_score DOUBLE PRECISION DEFAULT 0.0,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Chat Sessions & Messages
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'ai')),
    message TEXT NOT NULL,
    tool_calls JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shelters
CREATE TABLE IF NOT EXISTS shelters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    capacity INT NOT NULL DEFAULT 100,
    current_occupancy INT NOT NULL DEFAULT 0,
    facilities JSONB DEFAULT '[]'::jsonb, -- ['food', 'water', 'medical', 'generators']
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resources
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shelter_id UUID REFERENCES shelters(id) ON DELETE CASCADE,
    ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'food_kits', 'water_bottles', 'medical_kits', 'boats', 'blankets'
    quantity INT NOT NULL DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'units',
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'LOW', 'EXHAUSTED')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Missing Person Reports
CREATE TABLE IF NOT EXISTS missing_person_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    person_name VARCHAR(100) NOT NULL,
    age INT,
    last_known_location GEOMETRY(Point, 4326),
    location_text TEXT,
    description TEXT,
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'SEARCHING' CHECK (status IN ('SEARCHING', 'FOUND', 'RESOLVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disaster Hotspots
CREATE TABLE IF NOT EXISTS disaster_hotspots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disaster_type VARCHAR(50) NOT NULL,
    centroid GEOMETRY(Point, 4326) NOT NULL,
    radius_km DOUBLE PRECISION DEFAULT 2.0,
    request_count INT DEFAULT 0,
    critical_count INT DEFAULT 0,
    ai_summary TEXT,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Indexes for Fast Spatial Queries
CREATE INDEX IF NOT EXISTS idx_citizen_loc ON citizen_profiles USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_volunteer_loc ON volunteer_profiles USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_emergency_loc ON emergency_requests USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_shelters_loc ON shelters USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_hotspots_loc ON disaster_hotspots USING GIST (centroid);
