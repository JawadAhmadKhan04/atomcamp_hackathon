# Wafaqi Mohtasib (Federal Ombudsman) Complaint Management System

![Project Status](https://img.shields.io/badge/Status-Hackathon_Prototype-blue)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-latest-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E?logo=supabase&logoColor=white)

## 📌 Project Overview

This is the frontend prototype for the **Wafaqi Mohtasib (Federal Ombudsman Secretariat)** complaint management system, built as part of a Hackathon project. 

The application digitizes the pipeline where citizens file complaints against government agencies (e.g., K-Electric, NADRA, FBR, Provincial Police). Specifically, it faithfully recreates the internal review dashboards used by government officials:
1. **Registrar-I Stage**: The initial vetting of a citizen's complaint.
2. **Authorised Officer (AO) Stage**: The secondary review and jurisdiction decision.

### 🤖 Future AI / Agentic Integration
While this repository currently functions as a robust React frontend wired to a Supabase PostgreSQL backend, its ultimate purpose is to serve as the foundation for an **AI Agentic Workflow (RAG)**. 

Currently, the AI features are stubbed via an "Autofill" button which simulates an AI reading the complaint and automatically suggesting admissibility criteria, jurisdiction, and remarks. In the future, a real AI agent will be bolted onto the backend to auto-fill and auto-decide these fields, drastically reducing manual review time.

---

## ✨ Key Features

- **High-Fidelity UI Recreations**: Faithfully styled React interfaces mirroring the real federal system.
- **Dynamic Forms & State**: Complex form handling abstracted into a reusable `useComplaintForm` React hook.
- **Supabase Integration**: Fully connected to a real PostgreSQL database with a custom data mapping layer (`complaintsApi.js`).
- **AI Autofill Stub**: A modular UI feature that simulates AI classification of complaints with loading states and confirmation banners.
- **Data Seeding**: A built-in Node.js seeding script to populate the Supabase backend with realistic, context-accurate mock government complaints.

---

## 🛠️ Technology Stack

- **Framework**: React 18 powered by Vite.
- **Styling**: Tailwind CSS v4 (Utility-first styling mapped via `index.css`).
- **Routing**: React Router DOM.
- **Backend / Database**: Supabase (PostgreSQL).
- **Environment**: Node.js.

---

## 📂 Project Structure

```text
my-react-app/
├── scripts/
│   └── seedSupabase.js          # Node script to inject mock data into Supabase
├── src/
│   ├── api/
│   │   ├── automationApi.js     # Stubbed AI classification engine
│   │   └── complaintsApi.js     # Supabase DB CRUD and camelCase data mappers
│   ├── components/
│   │   ├── common/              # Reusable UI (Buttons, Fields, Dropdowns, Audit Trails)
│   │   └── layout/              # AppLayout, Header, Sidebar
│   ├── data/
│   │   ├── admissibilityOptions.js
│   │   ├── agencyOptions.js
│   │   ├── mockComplaints.js    # 10 realistic government complaint scenarios
│   │   └── natureOfComplaintOptions.js
│   ├── hooks/
│   │   └── useComplaintForm.js  # Global form state management hook
│   ├── lib/
│   │   └── supabaseClient.js    # Supabase connection initializer
│   ├── pages/
│   │   ├── AuthorisedOfficerInterface.jsx
│   │   ├── ComplaintListing.jsx
│   │   └── RegistrarOneInterface.jsx
│   ├── App.jsx                  # Main router config
│   ├── index.css                # Tailwind directives and global CSS
│   └── main.jsx                 # React DOM mount
├── .env.example                 # Example environment variables
├── package.json                 
└── vite.config.js               
```

---

## 🚀 Getting Started

Follow these instructions to run the application locally.

### 1. Prerequisites
- Node.js (v18+ recommended)
- A [Supabase](https://supabase.com/) account and project.

### 2. Installation
Clone the repository and install the dependencies:
```bash
cd Frontend/my-react-app
npm install
```

### 3. Environment Setup
Create a `.env` file in the root of `my-react-app` based on the `.env.example` structure:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Go to your Supabase project's SQL Editor and run the following schema to create the `register_complaints` table:

```sql
CREATE TABLE register_complaints (
    id SERIAL PRIMARY KEY,
    s_no INTEGER,
    complaint_number VARCHAR(255) UNIQUE NOT NULL,
    complainant_name VARCHAR(255),
    agency VARCHAR(255),
    station VARCHAR(255),
    diary_date TIMESTAMP,
    admissibility VARCHAR(255),
    reasons TEXT,
    admissibility_date TIMESTAMP,
    status VARCHAR(100),
    gender VARCHAR(50),
    address TEXT,
    district VARCHAR(255),
    tehsil VARCHAR(255),
    city VARCHAR(255),
    cnic VARCHAR(50),
    mobile VARCHAR(50),
    phone VARCHAR(50),
    fax VARCHAR(50),
    email VARCHAR(255),
    receiving_office VARCHAR(100),
    ntn VARCHAR(50),
    passport VARCHAR(100),
    agency_ref_no VARCHAR(100),
    value NUMERIC,
    subject TEXT,
    main_points TEXT,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

### 5. Seed the Database
Run the seeding script to populate your database with realistic mock data:
```bash
node scripts/seedSupabase.js
```
*Note: Ensure your `.env` file is properly configured before running this command.*

### 6. Run the Development Server
Start the Vite development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` to view the application.

---

## 🧠 Using the AI Autofill Stub

When navigating to either the **Registrar-I** or **Authorised Officer** interface, you will find an **Autofill** button in the "Review & Decision" section header. 

1. Clicking this button triggers `classifyComplaint()` from `src/api/automationApi.js`.
2. It simulates a 2-second network request.
3. Upon completion, it auto-populates the Admissibility dropdown, the Admissibility Status, and the Remarks fields.
4. A purple banner will appear prompting the official to review the AI's suggestions before hitting "Save".

*(For the Hackathon, this allows judges to experience the future UX of the agentic workflow before the heavy LLM backend is fully wired up).*

---

## 📄 License
This project is created for hackathon purposes. Data used in the mock files are strictly fictional representations created to mimic real-world government complaints.
