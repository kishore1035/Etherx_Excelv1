# EtherX Excel - API Endpoints Reference

## Base URL
```
Production: https://api.etherx-excel.app/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 📋 Table of Contents
1. [Authentication](#authentication-endpoints)
2. [Users](#user-endpoints)
3. [Spreadsheets](#spreadsheet-endpoints)
4. [Sheets](#sheet-endpoints)
5. [Cells](#cell-endpoints)
6. [Collaboration](#collaboration-endpoints)
7. [Comments](#comment-endpoints)
8. [Images](#image-endpoints)
9. [Versions](#version-endpoints)
10. [Activity](#activity-endpoints)
11. [Notifications](#notification-endpoints)
12. [Settings](#settings-endpoints)
13. [Export](#export-endpoints)
14. [Import](#import-endpoints)
15. [Integrations](#integration-endpoints)
16. [Templates](#template-endpoints)

---

## Authentication Endpoints

### Send OTP
Send one-time password to email or phone.

```http
POST /auth/send-otp
```

**Request Body:**
```json
{
  "emailOrPhone": "user@example.com" | "+1234567890"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email/phone format
- `429 Too Many Requests` - Rate limit exceeded (max 3 per hour)

---

### Verify OTP & Login
Verify OTP and get authentication token.

```http
POST /auth/verify-otp
```

**Request Body:**
```json
{
  "emailOrPhone": "user@example.com",
  "otp": "123456"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid OTP
- `401 Unauthorized` - OTP expired
- `404 Not Found` - User not found

---

### Sign Up
Create a new user account.

```http
POST /auth/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890" // optional
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "userId": "uuid",
  "message": "Account created successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email/phone already exists

---

### Logout
Invalidate authentication token.

```http
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Refresh Token
Get a new access token using refresh token.

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response: 200 OK**
```json
{
  "token": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

### Get Current User
Get authenticated user information.

```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "+1234567890",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

---

## User Endpoints

### Update Profile
Update user profile information.

```http
PUT /users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com",
  "phone": "+1234567890"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "newemail@example.com",
    "phone": "+1234567890"
  }
}
```

---

### Delete Account
Delete user account and all associated data.

```http
DELETE /users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## Spreadsheet Endpoints

### List Spreadsheets
Get all spreadsheets for the authenticated user.

```http
GET /spreadsheets
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)
- `sort` (optional) - Sort field (default: updatedAt)
- `order` (optional) - Sort order (asc/desc, default: desc)

**Response: 200 OK**
```json
{
  "spreadsheets": [
    {
      "id": "uuid",
      "name": "My Spreadsheet",
      "ownerId": "uuid",
      "ownerName": "John Doe",
      "collaboratorsCount": 3,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

### Create Spreadsheet
Create a new spreadsheet.

```http
POST /spreadsheets
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My New Spreadsheet"
}
```

**Response: 201 Created**
```json
{
  "spreadsheet": {
    "id": "uuid",
    "name": "My New Spreadsheet",
    "ownerId": "uuid",
    "sheets": [
      {
        "id": "sheet-uuid",
        "name": "Sheet 1",
        "position": 0,
        "cells": {}
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### Get Spreadsheet
Get a specific spreadsheet with all data.

```http
GET /spreadsheets/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "spreadsheet": {
    "id": "uuid",
    "name": "My Spreadsheet",
    "ownerId": "uuid",
    "sheets": [
      {
        "id": "sheet-uuid",
        "name": "Sheet 1",
        "color": "#3b82f6",
        "position": 0,
        "cells": {
          "A1": {
            "value": "Hello",
            "formula": null,
            "bold": true,
            "italic": false,
            "underline": false,
            "color": "#000000",
            "backgroundColor": "#ffffff"
          }
        }
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-02T00:00:00Z"
  },
  "collaborators": [
    {
      "id": "user-uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "owner",
      "status": "active",
      "lastActive": "2025-01-02T00:00:00Z"
    }
  ],
  "shareSettings": {
    "linkSharing": false,
    "linkAccess": "viewer",
    "allowComments": true,
    "allowDownload": true,
    "requireLogin": false
  }
}
```

**Error Responses:**
- `403 Forbidden` - No access to spreadsheet
- `404 Not Found` - Spreadsheet not found

---

### Update Spreadsheet
Update spreadsheet data (name, sheets, cells).

```http
PUT /spreadsheets/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "sheets": [
    {
      "id": "sheet-uuid",
      "name": "Sheet 1",
      "color": "#3b82f6",
      "cells": {
        "A1": {
          "value": "Updated value",
          "bold": true
        }
      }
    }
  ]
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "spreadsheet": { /* updated spreadsheet */ }
}
```

---

### Delete Spreadsheet
Delete a spreadsheet permanently.

```http
DELETE /spreadsheets/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Spreadsheet deleted successfully"
}
```

---

## Sheet Endpoints

### Create Sheet
Add a new sheet to spreadsheet.

```http
POST /spreadsheets/:spreadsheetId/sheets
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Sheet 2",
  "color": "#10b981",
  "position": 1
}
```

**Response: 201 Created**
```json
{
  "sheet": {
    "id": "sheet-uuid",
    "name": "Sheet 2",
    "color": "#10b981",
    "position": 1,
    "cells": {}
  }
}
```

---

### Update Sheet
Update sheet properties.

```http
PUT /spreadsheets/:spreadsheetId/sheets/:sheetId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Renamed Sheet",
  "color": "#ef4444",
  "position": 0
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "sheet": { /* updated sheet */ }
}
```

---

### Delete Sheet
Delete a sheet from spreadsheet.

```http
DELETE /spreadsheets/:spreadsheetId/sheets/:sheetId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Sheet deleted successfully"
}
```

---

## Cell Endpoints

### Update Cell
Update a single cell.

```http
PUT /spreadsheets/:spreadsheetId/sheets/:sheetId/cells/:cellId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "value": "New value",
  "formula": "=SUM(A1:A10)",
  "bold": true,
  "italic": false,
  "underline": false,
  "color": "#000000",
  "backgroundColor": "#ffff00"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "cell": {
    "cellId": "A1",
    "value": "New value",
    "formula": "=SUM(A1:A10)",
    "bold": true,
    "color": "#000000",
    "backgroundColor": "#ffff00"
  }
}
```

---

### Update Multiple Cells
Batch update multiple cells.

```http
POST /spreadsheets/:spreadsheetId/sheets/:sheetId/cells/batch
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cells": {
    "A1": { "value": "Hello", "bold": true },
    "A2": { "value": "World", "italic": true },
    "B1": { "value": "123", "formula": "=A1+A2" }
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "updated": 3,
  "cells": { /* updated cells */ }
}
```

---

## Collaboration Endpoints

### Invite Collaborator
Send collaboration invite to user.

```http
POST /spreadsheets/:id/invite
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "collaborator@example.com",
  "role": "editor" | "viewer"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "invitation": {
    "id": "uuid",
    "spreadsheetId": "uuid",
    "email": "collaborator@example.com",
    "role": "editor",
    "status": "pending",
    "invitedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

### List Collaborators
Get all collaborators for spreadsheet.

```http
GET /spreadsheets/:id/collaborators
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "collaborators": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "owner",
      "status": "active",
      "lastActive": "2025-01-02T00:00:00Z"
    }
  ]
}
```

---

### Update Collaborator Role
Change collaborator's role.

```http
PUT /spreadsheets/:id/collaborators/:userId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "editor" | "viewer"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Role updated successfully"
}
```

---

### Remove Collaborator
Remove user from spreadsheet.

```http
DELETE /spreadsheets/:id/collaborators/:userId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Collaborator removed successfully"
}
```

---

### Update Share Settings
Update sharing and permission settings.

```http
PUT /spreadsheets/:id/settings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "linkSharing": true,
  "linkAccess": "viewer",
  "allowComments": true,
  "allowDownload": false,
  "requireLogin": true
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "settings": { /* updated settings */ }
}
```

---

### Generate Share Link
Create/regenerate share link.

```http
POST /spreadsheets/:id/share-link
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "enabled": true,
  "access": "viewer" | "editor"
}
```

**Response: 200 OK**
```json
{
  "shareLink": "https://etherx-excel.app/s/abc123xyz",
  "expiresAt": null
}
```

---

## Comment Endpoints

### Get Comments
Get all comments for a spreadsheet.

```http
GET /spreadsheets/:id/comments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `sheetId` (optional) - Filter by sheet
- `cellId` (optional) - Filter by cell

**Response: 200 OK**
```json
{
  "comments": {
    "A1": [
      {
        "id": "uuid",
        "cellId": "A1",
        "sheetId": "sheet-uuid",
        "author": "John Doe",
        "authorId": "user-uuid",
        "authorInitials": "JD",
        "content": "This needs to be updated",
        "timestamp": "2025-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### Add Comment
Add a comment to a cell.

```http
POST /spreadsheets/:id/sheets/:sheetId/cells/:cellId/comments
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "This is a comment"
}
```

**Response: 201 Created**
```json
{
  "comment": {
    "id": "uuid",
    "cellId": "A1",
    "author": "John Doe",
    "authorId": "user-uuid",
    "content": "This is a comment",
    "timestamp": "2025-01-01T00:00:00Z"
  }
}
```

---

### Delete Comment
Delete a comment.

```http
DELETE /spreadsheets/:id/comments/:commentId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## Image Endpoints

### Upload Image
Upload an image file.

```http
POST /upload/image
```

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData with 'image' field
```

**Response: 200 OK**
```json
{
  "imageUrl": "https://cdn.etherx-excel.app/images/uuid.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg"
}
```

---

### Add Image to Cell
Associate image with a cell.

```http
POST /spreadsheets/:id/sheets/:sheetId/cells/:cellId/image
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Image added successfully"
}
```

---

### Remove Image from Cell
Remove image from a cell.

```http
DELETE /spreadsheets/:id/sheets/:sheetId/cells/:cellId/image
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Image removed successfully"
}
```

---

## Version Endpoints

### List Versions
Get version history for spreadsheet.

```http
GET /spreadsheets/:id/versions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Items per page

**Response: 200 OK**
```json
{
  "versions": [
    {
      "id": "uuid",
      "spreadsheetId": "uuid",
      "timestamp": "2025-01-02T00:00:00Z",
      "author": "John Doe",
      "authorEmail": "user@example.com",
      "changesSummary": "Updated cells A1-A10",
      "changesCount": 10,
      "isCurrent": true,
      "size": "15 KB"
    }
  ]
}
```

---

### Create Version
Save current state as new version.

```http
POST /spreadsheets/:id/versions
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "changesSummary": "Major update to Q4 data",
  "data": { /* spreadsheet data */ }
}
```

**Response: 201 Created**
```json
{
  "version": {
    "id": "uuid",
    "timestamp": "2025-01-02T00:00:00Z",
    "changesSummary": "Major update to Q4 data"
  }
}
```

---

### Restore Version
Restore spreadsheet to a previous version.

```http
POST /spreadsheets/:id/versions/:versionId/restore
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "spreadsheet": { /* restored spreadsheet */ },
  "newVersion": { /* new version created from current state */ }
}
```

---

### Get Version Data
Get full data for a specific version.

```http
GET /spreadsheets/:id/versions/:versionId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "version": { /* version info */ },
  "data": { /* spreadsheet data at this version */ }
}
```

---

## Activity Endpoints

### Get Activity Log
Get activity history for spreadsheet.

```http
GET /spreadsheets/:id/activity
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional) - Filter by type
- `userId` (optional) - Filter by user
- `limit` (optional) - Items to return
- `offset` (optional) - Offset for pagination

**Response: 200 OK**
```json
{
  "activities": [
    {
      "id": "uuid",
      "type": "edit",
      "user": "John Doe",
      "userId": "uuid",
      "userEmail": "user@example.com",
      "description": "Updated cell A1",
      "timestamp": "2025-01-02T00:00:00Z",
      "cellId": "A1",
      "details": "Changed value from 10 to 20"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0
  }
}
```

---

### Log Activity
Create a new activity log entry.

```http
POST /spreadsheets/:id/activity
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "edit",
  "description": "Updated Q4 revenue data",
  "cellId": "B5",
  "details": "Updated formula"
}
```

**Response: 201 Created**
```json
{
  "activity": {
    "id": "uuid",
    "type": "edit",
    "user": "John Doe",
    "description": "Updated Q4 revenue data",
    "timestamp": "2025-01-02T00:00:00Z"
  }
}
```

---

## Notification Endpoints

### Get Notifications
Get all notifications for user.

```http
GET /notifications
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `unreadOnly` (optional) - Filter unread only
- `type` (optional) - Filter by type
- `limit` (optional) - Items to return

**Response: 200 OK**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "comment",
      "title": "New Comment",
      "message": "John Doe commented on cell A1",
      "timestamp": "2025-01-02T00:00:00Z",
      "isRead": false,
      "actionUrl": "/spreadsheets/uuid",
      "fromUser": "John Doe",
      "fromUserId": "uuid"
    }
  ],
  "unreadCount": 5
}
```

---

### Mark Notification as Read
Mark a single notification as read.

```http
PUT /notifications/:id/read
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true
}
```

---

### Mark All as Read
Mark all notifications as read.

```http
PUT /notifications/read-all
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true,
  "count": 15
}
```

---

### Delete Notification
Dismiss a notification.

```http
DELETE /notifications/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "success": true
}
```

---

## Settings Endpoints

### Get User Settings
Get user preferences and settings.

```http
GET /users/me/settings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response: 200 OK**
```json
{
  "settings": {
    "autoSave": true,
    "autoSaveInterval": 30,
    "showGridLines": true,
    "showFormulas": false,
    "defaultZoom": 100,
    "enableNotifications": true,
    "emailNotifications": true,
    "commentNotifications": true,
    "shareNotifications": true,
    "theme": "dark",
    "fontSize": "medium",
    "enableBetaFeatures": false
  }
}
```

---

### Update User Settings
Update user preferences.

```http
PUT /users/me/settings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "autoSave": false,
  "theme": "light",
  "fontSize": "large"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "settings": { /* updated settings */ }
}
```

---

## Export Endpoints

### Export Spreadsheet
Export spreadsheet in specified format.

```http
POST /spreadsheets/:id/export
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "format": "csv" | "json" | "pdf" | "xlsx",
  "sheetId": "sheet-uuid" // optional, export specific sheet
}
```

**Response: 200 OK**
```
Binary file download with appropriate Content-Type and Content-Disposition headers
```

---

## Template Endpoints

### List Templates
Get all available templates.

```http
GET /templates
```

**Response: 200 OK**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Budget Tracker",
      "category": "Finance",
      "description": "Track your monthly budget",
      "thumbnail": "https://cdn.etherx-excel.app/templates/budget.jpg",
      "usageCount": 1250
    }
  ]
}
```

---

### Get Template Data
Get template with full cell data.

```http
GET /templates/:id
```

**Response: 200 OK**
```json
{
  "template": {
    "id": "uuid",
    "name": "Budget Tracker",
    "category": "Finance",
    "sheets": [
      {
        "name": "Monthly Budget",
        "cells": {
          "A1": { "value": "Category", "bold": true },
          "B1": { "value": "Amount", "bold": true }
        }
      }
    ]
  }
}
```

---

### Create Template
Create a new template (admin only).

```http
POST /templates
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "name": "Custom Template",
  "category": "Business",
  "description": "Description here",
  "data": { /* template data */ }
}
```

**Response: 201 Created**
```json
{
  "template": { /* created template */ }
}
```

---

## WebSocket Endpoints

### Real-Time Collaboration
Connect to WebSocket for real-time updates.

```
WS /ws/spreadsheets/:id
```

**Connection Parameters:**
```
?token=<jwt_token>
```

**Client → Server Messages:**

```json
// Cursor Movement
{
  "type": "cursor_move",
  "cellId": "A1",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "color": "#3b82f6"
  }
}

// Cell Update
{
  "type": "cell_update",
  "cellId": "A1",
  "value": "New value",
  "formatting": { "bold": true }
}

// Cell Selection
{
  "type": "cell_select",
  "cellId": "A1"
}
```

**Server → Client Messages:**

```json
// Cursor Update
{
  "type": "cursor_update",
  "users": [
    {
      "id": "uuid",
      "name": "John Doe",
      "cellId": "A1",
      "color": "#3b82f6"
    }
  ]
}

// Cell Updated by Another User
{
  "type": "cell_updated",
  "cellId": "A1",
  "cell": { /* updated cell data */ },
  "userId": "uuid",
  "userName": "John Doe"
}

// User Joined
{
  "type": "user_joined",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}

// User Left
{
  "type": "user_left",
  "userId": "uuid"
}
```

---

### Notification WebSocket
Connect for real-time notifications.

```
WS /ws/notifications
```

**Connection Parameters:**
```
?token=<jwt_token>
```

**Server → Client Messages:**

```json
{
  "type": "notification",
  "notification": {
    "id": "uuid",
    "type": "comment",
    "title": "New Comment",
    "message": "John Doe commented on your spreadsheet",
    "timestamp": "2025-01-02T00:00:00Z"
  }
}
```

---

## Rate Limits

### Default Rate Limits
- **Authentication**: 5 requests per minute
- **OTP Send**: 3 requests per hour per user
- **Read Operations**: 100 requests per minute
- **Write Operations**: 50 requests per minute
- **WebSocket Messages**: 100 messages per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    }
  }
}
```

### Common Error Codes
- `AUTH_REQUIRED` - Authentication required
- `AUTH_INVALID` - Invalid token
- `AUTH_EXPIRED` - Token expired
- `PERMISSION_DENIED` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Input validation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVER_ERROR` - Internal server error

---

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Permission denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service down

---

**Last Updated**: October 2, 2025
**API Version**: 1.0.0