# replit.md

## Overview

**Ikigai for Teens** is an AI-driven web application designed to help teenagers discover their life purpose by finding the intersection of their passion, skills, mission, and vocation. The application uses personality assessments, daily journaling, and AI-powered analysis to provide personalized career recommendations. Built as a full-stack TypeScript application, it features a React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and a purple-focused color scheme
- **Routing**: wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Authentication**: Session-based authentication integrated with routing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: OpenID Connect integration with Replit's authentication system
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with comprehensive error handling and request logging

### Database Design
- **Primary Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle migrations with schema definitions in shared directory
- **Key Tables**:
  - Users with profile information and authentication data
  - Personality assessments using Big Five personality model
  - Journal entries with AI analysis results (keywords, themes, skills)
  - Career database with detailed career information and personality vectors
  - Career recommendations with match scores

### AI and NLP Pipeline
- **Natural Language Processing**: Custom keyword extraction and theme analysis for journal entries
- **Career Matching Algorithm**: Vector-based similarity matching between user profiles and career requirements
- **Personality Assessment**: Big Five personality model implementation
- **Recommendation Engine**: Combines personality scores with journal analysis to generate personalized career suggestions

### Data Flow Architecture
1. **User Input**: Personality assessment and daily journal entries
2. **Analysis Pipeline**: NLP processing of journal text to extract skills, themes, and interests
3. **Profile Generation**: Dynamic user profile vector combining personality traits and extracted insights
4. **Career Matching**: Similarity algorithm comparing user profiles against career database
5. **Recommendations**: Ranked list of career suggestions with detailed information and roadmaps

### Development and Deployment
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Development Environment**: Integrated Replit development with hot reloading
- **Database Migrations**: Drizzle Kit for schema management and migrations
- **Environment Configuration**: Environment-based configuration for database connections and authentication

## External Dependencies

### Core Framework Dependencies
- **Frontend**: React, TypeScript, Vite, wouter (routing)
- **Backend**: Express.js, Node.js with ES modules
- **Database**: Neon PostgreSQL serverless, Drizzle ORM
- **UI Library**: shadcn/ui components, Radix UI primitives, Tailwind CSS

### Authentication and Session Management
- **Replit Authentication**: OpenID Connect integration for user authentication
- **Session Storage**: connect-pg-simple for PostgreSQL-based session storage
- **Passport.js**: Authentication middleware with OpenID Connect strategy

### Development and Build Tools
- **Vite**: Frontend build tool with React plugin and runtime error overlay
- **esbuild**: Backend compilation for production builds
- **TypeScript**: Type checking and compilation across the entire stack
- **Drizzle Kit**: Database migration and schema management tool

### Utility Libraries
- **TanStack Query**: Server state management and caching
- **date-fns**: Date manipulation and formatting
- **clsx/tailwind-merge**: Conditional CSS class management
- **class-variance-authority**: Component variant management
- **zod**: Runtime type validation and schema definition

### Production Dependencies
- **WebSocket Support**: ws library for Neon database connections
- **Form Handling**: React Hook Form with resolvers for validation
- **Memoization**: memoizee for performance optimization of expensive operations