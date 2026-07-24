# CMS and Frontend Integration

A full-stack, decouple CMS architecture built with React, Next.js, Express.js, and MongoDB.

## Architecture Overview

This project uses a headless architecture, decoupling the content management from the public-facing frontend.
- **Database**: MongoDB handles a scalable, block-based data schema.
- **Backend**: Express.js REST API offering secure JWT authenticated routes for content and admin management.
- **Admin Frontend**: A React application (powered by Vite) using Redux Toolkit for complex state management and TipTap for block-based content editing.
- **Public Frontend**: A Next.js application that fetches the blocks and renders them dynamically, supporting rich structures such as LaTeX math formulas via KaTeX. Tailwind CSS provides a modern and premium design.

## Setup Instructions

Ensure you have Docker and Docker Compose installed on your system.

1. **Clone the repository.**
2. **Setup environment variables.**
   - Copy `.env.example` to `.env` in the root directory (or use `.env.example` directly if your docker-compose passes the values).
3. **Run via Docker.**
   ```bash
   docker-compose up --build
   ```

## Assumptions

- A single Admin user can be created on first start via an initialization script or directly in the DB. (A default admin user is seeded on backend startup for testing purposes).
- Rich text content is block-based (Headers, Paragraphs, Lists, Tables, Equations).
- The public frontend handles reading from the REST API, while the admin frontend handles CUD (Create, Update, Delete) operations.

## Default Credentials

An admin account is seeded automatically:
- **Username**: admin
- **Password**: admin123
