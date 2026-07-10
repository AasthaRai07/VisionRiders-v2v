-- HerNova PostgreSQL Database Schema Definition
-- Run this script to initialize or reset your production database structure.

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY, -- Firebase UID or custom auth string
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- user | mentor | admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    previous_role VARCHAR(255),
    break_duration VARCHAR(100),
    target_role VARCHAR(255),
    bio TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    daily_streak INTEGER DEFAULT 1,
    learning_streak INTEGER DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(100) PRIMARY KEY, -- e.g., 'module1', 'module2', 'module3'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100) NOT NULL, -- e.g., 'Finance', 'Career'
    total_lessons INTEGER DEFAULT 5
);

-- 4. COURSE PROGRESS TABLE
CREATE TABLE IF NOT EXISTS course_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(100) REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    last_watched_lesson VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- 5. FINANCIAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS financial_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    monthly_income NUMERIC(12,2) DEFAULT 0.00,
    monthly_expenses NUMERIC(12,2) DEFAULT 0.00,
    emergency_fund_target NUMERIC(12,2) DEFAULT 100000.00,
    emergency_fund_balance NUMERIC(12,2) DEFAULT 65400.00,
    investment_balance NUMERIC(12,2) DEFAULT 0.00,
    budget_remaining NUMERIC(12,2) DEFAULT 0.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Food', 'Rent', 'Education'
    description VARCHAR(255),
    date DATE DEFAULT CURRENT_DATE
);

-- 7. BUDGETS TABLE
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount_limit NUMERIC(10,2) NOT NULL,
    amount_spent NUMERIC(10,2) DEFAULT 0.00,
    UNIQUE(user_id, category)
);

-- 8. CAREER SCORES TABLE
CREATE TABLE IF NOT EXISTS career_scores (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    completed_courses_score INTEGER DEFAULT 0,
    resume_completion_score INTEGER DEFAULT 0,
    skills_score INTEGER DEFAULT 0,
    interview_score INTEGER DEFAULT 0,
    certifications_score INTEGER DEFAULT 0,
    portfolio_score INTEGER DEFAULT 0,
    applications_score INTEGER DEFAULT 0,
    overall_score INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(50) DEFAULT 'Beginner', -- Beginner | Intermediate | Expert
    UNIQUE(user_id, name)
);

-- 10. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE,
    url VARCHAR(500)
);

-- 11. MENTORS TABLE
CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL, -- e.g., 'VP Engineering'
    bio TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url VARCHAR(500),
    is_approved BOOLEAN DEFAULT FALSE
);

-- 12. MENTOR SESSIONS TABLE
CREATE TABLE IF NOT EXISTS mentor_sessions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    mentor_id INTEGER REFERENCES mentors(id) ON DELETE CASCADE,
    meeting_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled | completed | cancelled
    video_link VARCHAR(500)
);

-- 13. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    company_logo VARCHAR(500),
    description TEXT,
    salary VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    experience VARCHAR(100), -- e.g., 'Fresher', '1-3 Years', '5+ Years'
    job_type VARCHAR(100), -- Full Time | Part Time | Returnship | Internship | Freelance
    work_mode VARCHAR(100), -- Remote | Hybrid | Onsite
    required_skills TEXT, -- Comma-separated list or JSON array of skills
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    apply_url VARCHAR(500) NOT NULL,
    company_website VARCHAR(500),
    women_friendly_score INTEGER DEFAULT 0,
    women_friendly_badges TEXT, -- JSON representation of badges (e.g. ['Flexible Hours', 'Child Care Support'])
    returnship_details TEXT -- JSON representation of returnship info (e.g. eligibility, gap allowed)
);

-- 14. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS saved_jobs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- 14b. JOB ALERTS TABLE
CREATE TABLE IF NOT EXISTS job_alerts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    filter_criteria TEXT NOT NULL, -- JSON formatted filter query
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied', -- applied | interviewing | offered | rejected
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- Hackathon | Workshop | Seminar | NGO
    location VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    link VARCHAR(500),
    description TEXT,
    lat NUMERIC(9,6),
    lng NUMERIC(9,6)
);

-- 17. COMMUNITY POSTS TABLE
CREATE TABLE IF NOT EXISTS community_posts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. LIKES TABLE
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
);

-- 20. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g., 'mentor_reply', 'scholarship_deadline'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. BADGES TABLE
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    image_url VARCHAR(500)
);

-- 22. USER BADGES TABLE
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- 23. STREAKS TABLE
CREATE TABLE IF NOT EXISTS streaks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    daily_streak INTEGER DEFAULT 1,
    learning_streak INTEGER DEFAULT 0,
    last_streak_date DATE DEFAULT CURRENT_DATE
);

-- 24. AI TASKS TABLE
CREATE TABLE IF NOT EXISTS ai_tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    task_description VARCHAR(555) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    date DATE DEFAULT CURRENT_DATE
);

-- 25. SAFETY CONTACTS TABLE
CREATE TABLE IF NOT EXISTS safety_contacts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100)
);

-- 26. SUCCESS STORIES TABLE
CREATE TABLE IF NOT EXISTS success_stories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100) NOT NULL, -- Career Restart | Entrepreneurship | Financial Independence
    author_name VARCHAR(255),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data insertion statements for demo testing
INSERT INTO courses (id, title, description, image_url, category, total_lessons)
VALUES ('module3', 'Basics of Mutual Funds', 'Introduction to mutual fund asset allocations.', 'https://lh3.googleusercontent.com/aida-public/...', 'Finance', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO mentors (id, name, title, bio, email, avatar_url, is_approved)
VALUES (1, 'Priya Sharma', 'VP Engineering', 'VP Engineering and Career Re-entry Specialist', 'priya@hernova.com', 'https://lh3.googleusercontent.com/aida-public/...', true)
ON CONFLICT (id) DO NOTHING;
