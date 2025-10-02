# EtherX Excel - Backend Integration Guide

## Overview
EtherX Excel is a comprehensive spreadsheet application with advanced collaboration, export, and management features. This document outlines all frontend components and their expected backend integrations.

## Current Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **Storage**: Currently using localStorage (needs backend replacement)
- **Authentication**: OTP-based email/phone login (needs backend API)

---

## 🔐 Authentication System

### Current Implementation
- **Components**: `LoginPage.tsx`, `SignupPage.tsx`
- **Flow**: Email/Phone → OTP Verification → Session

### Backend Requirements
```typescript
// API Endpoints Needed:
POST /api/auth/send-otp
  Body: { emailOrPhone: string }
  Response: { success: boolean, message: string }

POST /api/auth/verify-otp
  Body: { emailOrPhone: string, otp: string }
  Response: { 
    success: boolean, 
    token: string, 
    user: { id, name, email, phone } 
  }

POST /api/auth/signup
  Body: { name: string, email: string, phone?: string }
  Response: { success: boolean, userId: string }

POST /api/auth/logout
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

GET /api/auth/me
  Headers: { Authorization: Bearer <token> }
  Response: { user: User }
```

---

## 📊 Spreadsheet Management

### Current Implementation
- **Components**: `SpreadsheetApp.tsx`, `SpreadsheetGrid.tsx`, `SheetTabs.tsx`
- **Storage**: localStorage
- **Structure**: Sheets with cells (Map<string, Cell>)

### Backend Requirements
```typescript
// API Endpoints Needed:
GET /api/spreadsheets
  Headers: { Authorization: Bearer <token> }
  Response: { spreadsheets: Spreadsheet[] }

POST /api/spreadsheets
  Headers: { Authorization: Bearer <token> }
  Body: { name: string }
  Response: { spreadsheet: Spreadsheet }

GET /api/spreadsheets/:id
  Headers: { Authorization: Bearer <token> }
  Response: { spreadsheet: Spreadsheet }

PUT /api/spreadsheets/:id
  Headers: { Authorization: Bearer <token> }
  Body: { sheets: Sheet[], name?: string }
  Response: { success: boolean }

DELETE /api/spreadsheets/:id
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

// Data Types:
interface Spreadsheet {
  id: string;
  name: string;
  ownerId: string;
  sheets: Sheet[];
  createdAt: Date;
  updatedAt: Date;
}

interface Sheet {
  id: string;
  name: string;
  color?: string;
  cells: Map<string, Cell>;
}

interface Cell {
  value: string;
  formula?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  backgroundColor?: string;
}
```

---

## 👥 Collaboration System

### Current Implementation
- **Component**: `CollaborationPanel.tsx`
- **Features**: Invite users, manage roles, share links, permissions
- **Storage**: Mock data in component state

### Backend Requirements
```typescript
// API Endpoints Needed:
POST /api/spreadsheets/:id/invite
  Headers: { Authorization: Bearer <token> }
  Body: { email: string, role: "editor" | "viewer" }
  Response: { success: boolean, invitation: Invitation }

GET /api/spreadsheets/:id/collaborators
  Headers: { Authorization: Bearer <token> }
  Response: { collaborators: Collaborator[] }

DELETE /api/spreadsheets/:id/collaborators/:userId
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

PUT /api/spreadsheets/:id/collaborators/:userId
  Headers: { Authorization: Bearer <token> }
  Body: { role: "editor" | "viewer" }
  Response: { success: boolean }

PUT /api/spreadsheets/:id/settings
  Headers: { Authorization: Bearer <token> }
  Body: { shareSettings: ShareSettings }
  Response: { success: boolean }

POST /api/spreadsheets/:id/share-link
  Headers: { Authorization: Bearer <token> }
  Body: { enabled: boolean, access: "editor" | "viewer" }
  Response: { shareLink: string }

// Data Types:
interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  status: "active" | "pending" | "offline";
  lastActive: Date;
}

interface ShareSettings {
  linkSharing: boolean;
  linkAccess: "viewer" | "editor";
  allowComments: boolean;
  allowDownload: boolean;
  requireLogin: boolean;
}
```

---

## 💬 Comments System

### Current Implementation
- **Component**: `CellComment.tsx`
- **Features**: Add, view, delete comments on cells
- **Storage**: Map<string, Comment[]> in component state

### Backend Requirements
```typescript
// API Endpoints Needed:
GET /api/spreadsheets/:id/comments
  Headers: { Authorization: Bearer <token> }
  Response: { comments: Record<string, Comment[]> }

POST /api/spreadsheets/:id/cells/:cellId/comments
  Headers: { Authorization: Bearer <token> }
  Body: { content: string }
  Response: { comment: Comment }

DELETE /api/spreadsheets/:id/comments/:commentId
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

// Data Types:
interface Comment {
  id: string;
  cellId: string;
  author: string;
  authorId: string;
  authorInitials: string;
  content: string;
  timestamp: Date;
}
```

---

## 🖼️ Image Management

### Current Implementation
- **Component**: `ImageInsert.tsx`
- **Features**: Insert images/GIFs via URL
- **Storage**: Map<string, string> (cellId → imageUrl) in component state

### Backend Requirements
```typescript
// API Endpoints Needed:
POST /api/spreadsheets/:id/cells/:cellId/image
  Headers: { Authorization: Bearer <token> }
  Body: { imageUrl: string }
  Response: { success: boolean }

DELETE /api/spreadsheets/:id/cells/:cellId/image
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

// Optional: Image Upload
POST /api/upload/image
  Headers: { Authorization: Bearer <token> }
  Body: FormData with image file
  Response: { imageUrl: string }
```

---

## 🕐 Version History

### Current Implementation
- **Component**: `VersionHistory.tsx`
- **Features**: View, restore, preview, export versions
- **Storage**: Mock data in component state

### Backend Requirements
```typescript
// API Endpoints Needed:
GET /api/spreadsheets/:id/versions
  Headers: { Authorization: Bearer <token> }
  Response: { versions: Version[] }

POST /api/spreadsheets/:id/versions
  Headers: { Authorization: Bearer <token> }
  Body: { spreadsheetData: any, changesSummary: string }
  Response: { version: Version }

POST /api/spreadsheets/:id/versions/:versionId/restore
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean, spreadsheet: Spreadsheet }

GET /api/spreadsheets/:id/versions/:versionId
  Headers: { Authorization: Bearer <token> }
  Response: { version: Version, data: any }

// Data Types:
interface Version {
  id: string;
  spreadsheetId: string;
  timestamp: Date;
  author: string;
  authorEmail: string;
  changesSummary: string;
  changesCount: number;
  isCurrent: boolean;
  size: string;
}
```

---

## 📋 Activity Log

### Current Implementation
- **Component**: `ActivityLog.tsx`
- **Features**: Track all user actions
- **Storage**: Array in component state

### Backend Requirements
```typescript
// API Endpoints Needed:
GET /api/spreadsheets/:id/activity
  Headers: { Authorization: Bearer <token> }
  Query: { type?: string, limit?: number, offset?: number }
  Response: { activities: ActivityEvent[] }

POST /api/spreadsheets/:id/activity
  Headers: { Authorization: Bearer <token> }
  Body: { 
    type: string, 
    description: string, 
    cellId?: string,
    details?: string 
  }
  Response: { activity: ActivityEvent }

// Data Types:
interface ActivityEvent {
  id: string;
  spreadsheetId: string;
  type: "edit" | "comment" | "share" | "download" | "delete" | "view" | "invite";
  user: string;
  userId: string;
  userEmail: string;
  description: string;
  timestamp: Date;
  cellId?: string;
  details?: string;
}
```

---

## 🔔 Notifications System

### Current Implementation
- **Component**: `NotificationCenter.tsx`
- **Features**: Real-time notifications, mark as read
- **Storage**: Array in component state

### Backend Requirements
```typescript
// API Endpoints Needed:
GET /api/notifications
  Headers: { Authorization: Bearer <token> }
  Query: { unreadOnly?: boolean }
  Response: { notifications: Notification[] }

PUT /api/notifications/:id/read
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

PUT /api/notifications/read-all
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

DELETE /api/notifications/:id
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

// WebSocket for real-time notifications:
WS /ws/notifications
  Headers: { Authorization: Bearer <token> }
  Messages: { notification: Notification }

// Data Types:
interface Notification {
  id: string;
  userId: string;
  type: "comment" | "mention" | "share" | "edit" | "invite";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  fromUser?: string;
  fromUserId?: string;
}
```

---

## ⚙️ Settings & Preferences

### Current Implementation
- **Component**: `SettingsDialog.tsx`
- **Features**: User preferences, privacy, notifications
- **Storage**: localStorage

### Backend Requirements
```typescript
// API Endpoints Needed:
GET /api/users/me/settings
  Headers: { Authorization: Bearer <token> }
  Response: { settings: AppSettings }

PUT /api/users/me/settings
  Headers: { Authorization: Bearer <token> }
  Body: { settings: Partial<AppSettings> }
  Response: { success: boolean }

PUT /api/users/me/profile
  Headers: { Authorization: Bearer <token> }
  Body: { name?: string, email?: string, phone?: string }
  Response: { success: boolean, user: User }

DELETE /api/users/me
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

// Data Types:
interface AppSettings {
  autoSave: boolean;
  autoSaveInterval: number;
  showGridLines: boolean;
  showFormulas: boolean;
  defaultZoom: number;
  enableNotifications: boolean;
  emailNotifications: boolean;
  commentNotifications: boolean;
  shareNotifications: boolean;
  shareUsageData: boolean;
  allowTracking: boolean;
  theme: "light" | "dark" | "auto";
  compactMode: boolean;
  fontSize: "small" | "medium" | "large";
  enableBetaFeatures: boolean;
  maxUndoSteps: number;
  cellLimit: number;
}
```

---

## 📤 Export System

### Current Implementation
- **Components**: Export dropdown in header
- **Formats**: CSV, JSON, PDF, XLSX
- **Method**: Client-side generation

### Backend Requirements (Optional)
```typescript
// For server-side PDF/XLSX generation:
POST /api/spreadsheets/:id/export
  Headers: { Authorization: Bearer <token> }
  Body: { format: "csv" | "json" | "pdf" | "xlsx" }
  Response: Binary file download

// Current client-side methods:
- CSV: Native implementation
- JSON: Native implementation
- PDF: Browser print dialog
- XLSX: TSV format (can be upgraded with SheetJS)
```

---

## 📥 Import System

### Current Implementation
- **Component**: `ImportDialog.tsx`
- **Features**: Local file upload, Google Drive, Dropbox
- **Formats**: CSV files
- **Storage**: Imported data merged into spreadsheet

### Backend Requirements
```typescript
// API Endpoints Needed:

// Local file import
POST /api/spreadsheets/:id/import
  Headers: { Authorization: Bearer <token> }
  Body: FormData with CSV file
  Response: { 
    success: boolean, 
    cellsImported: number,
    spreadsheet: Spreadsheet 
  }

// Import from URL
POST /api/spreadsheets/:id/import/url
  Headers: { Authorization: Bearer <token> }
  Body: { url: string }
  Response: { success: boolean, spreadsheet: Spreadsheet }

// Google Drive OAuth
GET /api/integrations/google-drive/auth
  Headers: { Authorization: Bearer <token> }
  Response: { authUrl: string }

GET /api/integrations/google-drive/callback
  Query: { code: string, state: string }
  Response: { success: boolean }

// List Google Drive files
GET /api/integrations/google-drive/files
  Headers: { Authorization: Bearer <token> }
  Query: { folderId?: string, search?: string }
  Response: { 
    files: Array<{
      id: string,
      name: string,
      mimeType: string,
      size: string,
      modifiedDate: string
    }>
  }

// Import from Google Drive
POST /api/spreadsheets/:id/import/google-drive
  Headers: { Authorization: Bearer <token> }
  Body: { fileId: string }
  Response: { success: boolean, spreadsheet: Spreadsheet }

// Dropbox OAuth
GET /api/integrations/dropbox/auth
  Headers: { Authorization: Bearer <token> }
  Response: { authUrl: string }

GET /api/integrations/dropbox/callback
  Query: { code: string }
  Response: { success: boolean }

// List Dropbox files
GET /api/integrations/dropbox/files
  Headers: { Authorization: Bearer <token> }
  Query: { path?: string, search?: string }
  Response: { 
    files: Array<{
      id: string,
      name: string,
      type: "file" | "folder",
      size: string,
      modifiedDate: string
    }>
  }

// Import from Dropbox
POST /api/spreadsheets/:id/import/dropbox
  Headers: { Authorization: Bearer <token> }
  Body: { path: string }
  Response: { success: boolean, spreadsheet: Spreadsheet }

// Disconnect integrations
DELETE /api/integrations/google-drive
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

DELETE /api/integrations/dropbox
  Headers: { Authorization: Bearer <token> }
  Response: { success: boolean }

// Data Types:
interface ImportResult {
  success: boolean;
  cellsImported: number;
  rowsImported: number;
  errors?: string[];
}
```

---

## 🔄 Real-Time Collaboration

### Current Implementation
- **Component**: `CollaborativeCursors.tsx`
- **Features**: Mock live cursors
- **Status**: Needs WebSocket implementation

### Backend Requirements
```typescript
// WebSocket Endpoints Needed:
WS /ws/spreadsheets/:id
  Headers: { Authorization: Bearer <token> }
  
  // Client → Server Messages:
  {
    type: "cursor_move",
    cellId: string,
    user: { id, name, color }
  }
  {
    type: "cell_edit",
    cellId: string,
    value: string,
    user: { id, name }
  }
  {
    type: "cell_select",
    cellId: string,
    user: { id, name }
  }
  
  // Server → Client Messages:
  {
    type: "cursor_update",
    users: Array<{ id, name, cellId, color }>
  }
  {
    type: "cell_update",
    cellId: string,
    cell: Cell,
    userId: string
  }
  {
    type: "user_joined",
    user: { id, name, email }
  }
  {
    type: "user_left",
    userId: string
  }
```

---

## 🎨 Templates & Demo Data

### Current Implementation
- **Components**: `Templates.tsx`, `DemoData.tsx`
- **Storage**: Hardcoded in components
- **Status**: Can be moved to backend

### Backend Requirements (Optional)
```typescript
// API Endpoints:
GET /api/templates
  Response: { templates: Template[] }

GET /api/templates/:id
  Response: { template: Template, data: Cell[] }

POST /api/templates
  Headers: { Authorization: Bearer <token> }
  Body: { name: string, category: string, data: Cell[] }
  Response: { template: Template }
```

---

## 🔒 Security Considerations

### Authentication
- Use JWT tokens with proper expiration
- Implement refresh token mechanism
- Store tokens securely (httpOnly cookies)

### Authorization
- Verify user permissions on every request
- Implement role-based access control (RBAC)
- Check spreadsheet ownership/collaboration status

### Data Validation
- Validate all input data
- Sanitize cell content to prevent XSS
- Limit cell count per spreadsheet
- Limit spreadsheet size

### Rate Limiting
- Implement rate limiting on all endpoints
- Especially for:
  - OTP sending (max 3 per hour)
  - Spreadsheet updates (max 100 per minute)
  - Collaboration invites (max 20 per day)

---

## 📦 Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Spreadsheets Table
```sql
CREATE TABLE spreadsheets (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sheets Table
```sql
CREATE TABLE sheets (
  id UUID PRIMARY KEY,
  spreadsheet_id UUID REFERENCES spreadsheets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(7),
  position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Cells Table
```sql
CREATE TABLE cells (
  id UUID PRIMARY KEY,
  sheet_id UUID REFERENCES sheets(id) ON DELETE CASCADE,
  cell_id VARCHAR(10) NOT NULL, -- e.g., "A1"
  value TEXT,
  formula TEXT,
  bold BOOLEAN DEFAULT FALSE,
  italic BOOLEAN DEFAULT FALSE,
  underline BOOLEAN DEFAULT FALSE,
  color VARCHAR(7),
  background_color VARCHAR(7),
  UNIQUE(sheet_id, cell_id)
);
```

### Collaborators Table
```sql
CREATE TABLE collaborators (
  id UUID PRIMARY KEY,
  spreadsheet_id UUID REFERENCES spreadsheets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('owner', 'editor', 'viewer')),
  status VARCHAR(20) CHECK (status IN ('active', 'pending', 'offline')),
  invited_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  UNIQUE(spreadsheet_id, user_id)
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  sheet_id UUID REFERENCES sheets(id) ON DELETE CASCADE,
  cell_id VARCHAR(10) NOT NULL,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Versions Table
```sql
CREATE TABLE versions (
  id UUID PRIMARY KEY,
  spreadsheet_id UUID REFERENCES spreadsheets(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  author_id UUID REFERENCES users(id),
  changes_summary TEXT,
  changes_count INTEGER,
  is_current BOOLEAN DEFAULT FALSE,
  size_bytes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Activities Table
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  spreadsheet_id UUID REFERENCES spreadsheets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  cell_id VARCHAR(10),
  details TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  from_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Settings Table
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Implementation Priority

### Phase 1 - Core (Week 1-2)
1. Authentication API (OTP, Login, Logout)
2. Spreadsheet CRUD operations
3. Cell updates and synchronization
4. Basic collaboration (invites, roles)

### Phase 2 - Collaboration (Week 3-4)
5. Real-time updates (WebSocket)
6. Comments system
7. Activity logging
8. Share settings and links

### Phase 3 - Advanced (Week 5-6)
9. Version history
10. Notifications system
11. Image management
12. Settings & preferences

### Phase 4 - Polish (Week 7-8)
13. Export enhancements (server-side PDF/XLSX)
14. Templates backend
15. Search and analytics
16. Performance optimization

---

## 🧪 Testing Requirements

### Unit Tests
- Authentication flow
- CRUD operations
- Permission checks
- Data validation

### Integration Tests
- WebSocket connections
- Real-time collaboration
- File uploads
- Export generation

### Load Tests
- Concurrent users per spreadsheet
- Cell update frequency
- WebSocket message throughput
- Database query performance

---

## 📝 Environment Variables Needed

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=30d

# OTP Service (Twilio, SendGrid, etc.)
OTP_SERVICE_API_KEY=your-api-key
OTP_EXPIRY_MINUTES=10

# Email Service
EMAIL_SERVICE=sendgrid
EMAIL_FROM=noreply@etherx-excel.app
EMAIL_API_KEY=your-email-api-key

# SMS Service
SMS_SERVICE=twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# Storage (for images)
STORAGE_SERVICE=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=etherx-excel-images

# WebSocket
WS_PORT=3001
REDIS_URL=redis://localhost:6379

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=https://etherx-excel.app
```

---

## 🎯 Success Metrics

### Performance
- API response time < 200ms
- WebSocket latency < 50ms
- Page load time < 2s
- Auto-save delay < 1s

### Scalability
- Support 50+ concurrent users per spreadsheet
- Handle 1000+ spreadsheets per user
- Process 100+ updates per second

### Reliability
- 99.9% uptime
- Zero data loss
- Automatic backups every hour
- Version history for 30 days

---

## 📚 Additional Resources

### Recommended Libraries
- **Backend Framework**: Express.js / NestJS / Fastify
- **Database ORM**: Prisma / TypeORM
- **WebSocket**: Socket.io / ws
- **Authentication**: Passport.js / Auth0
- **File Storage**: AWS S3 / Google Cloud Storage
- **Email**: SendGrid / AWS SES
- **SMS**: Twilio / AWS SNS
- **Excel Export**: SheetJS (xlsx)
- **PDF Export**: Puppeteer / PDFKit

### Documentation Links
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Shadcn/ui: https://ui.shadcn.com

---

## 💬 Support & Contact

For questions about backend integration, please refer to this document or reach out to the development team.

**Last Updated**: October 2, 2025