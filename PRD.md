# Planning Guide

A comprehensive workflow management system designed for public institutions to track, manage, and coordinate tasks across multiple departments and processes using Trello-style boards, detailed task tracking, and institutional governance features.

**Experience Qualities**:
1. **Professional** - Clean, enterprise-grade interface that conveys authority and trustworthiness for government/institutional use
2. **Efficient** - Quick access to critical information with minimal clicks, optimized for daily workflow management by busy administrators
3. **Structured** - Clear information hierarchy and consistent patterns that make complex institutional processes feel manageable

**Complexity Level**: Complex Application (advanced functionality, accounts)
This is a full-featured enterprise workflow management system with multiple interconnected features (kanban boards, calendar, notifications, admin panels), role-based access, and integration-ready architecture for backend APIs.

## Essential Features

### Sidebar Navigation
- **Functionality**: Fixed left sidebar with hierarchical menu structure including main navigation items and collapsible admin section
- **Purpose**: Provides quick access to all major features while maintaining context across the application
- **Trigger**: Always visible; admin section expands/collapses on click
- **Progression**: User clicks menu item → Route changes → Main content updates → Active item highlighted
- **Success criteria**: Navigation is always accessible, current page is clearly indicated, admin grouping is visually distinct

### Dashboard Overview
- **Functionality**: Summary cards showing task counts (My Tasks, Overdue, Completed), status distribution chart, and activity feed
- **Purpose**: Provides at-a-glance overview of personal workload and recent system activity for quick daily orientation
- **Trigger**: Default landing page after login or clicking Dashboard menu item
- **Progression**: Page loads → Cards populate with counts → Chart renders → Activity stream appears
- **Success criteria**: All data loads within 1 second, metrics are accurate, chart is readable

### Task Management View
- **Functionality**: Filterable table of all tasks with columns for title, workflow, step, status, assignee, and due date
- **Purpose**: Centralized location to view, search, and manage all tasks across workflows and institutions
- **Trigger**: Click Tasks menu item
- **Progression**: Table loads → User applies filters → Results update → Click row → Detail drawer opens from right
- **Success criteria**: Table supports sorting, filters work independently and in combination, drawer shows complete task details

### Task Detail Drawer
- **Functionality**: Right-side sliding panel displaying full task information with inline editing of status, assignee, due date, labels, and history
- **Purpose**: Allows detailed task management without leaving current view or losing context
- **Trigger**: Click task row in table, task card in kanban, or calendar event
- **Progression**: Drawer slides in → Task data loads → User edits field → Saves → Drawer updates → Success notification
- **Success criteria**: Drawer is dismissible, changes save properly, history tracks all modifications

### Kanban Board
- **Functionality**: Drag-and-drop board with columns representing workflow steps/statuses, cards showing task summaries with visual metadata
- **Purpose**: Visual workflow management allowing quick status updates and workload assessment across process stages
- **Trigger**: Click Boards menu item
- **Progression**: Board loads → Columns render with tasks → User drags card → Drop on new column → Status updates → Card repositions
- **Success criteria**: Drag-drop is smooth, columns show accurate counts, filters refine visible tasks, changes persist

### Calendar View
- **Functionality**: Month/week calendar displaying tasks on their due dates as compact cards
- **Purpose**: Time-based view of deadlines and workload distribution for planning and deadline management
- **Trigger**: Click Calendar menu item
- **Progression**: Calendar renders → Tasks appear on dates → User toggles month/week → View updates → Click task → Detail drawer opens
- **Success criteria**: Both views are readable, tasks are positioned correctly, navigation between time periods is smooth

### Global Search
- **Functionality**: Search bar with tabbed results (Tasks, Workflows, Users, Institutions) and result preview
- **Purpose**: Quickly locate any entity in the system regardless of current page context
- **Trigger**: Click Search menu item or keyboard shortcut
- **Progression**: User types query → Results populate in real-time → Switch tabs → Click result → Navigate to detail
- **Success criteria**: Search is fast (<500ms), results are relevant, all entity types are searchable

### Notifications Center
- **Functionality**: List of system notifications with filtering by type (All, Mentions, My Tasks, Deadlines)
- **Purpose**: Keep users informed of mentions, assignments, deadlines, and workflow changes
- **Trigger**: Click Notifications menu item or notification badge
- **Progression**: List loads → User filters by type → Relevant notifications show → Click notification → Navigate to related item
- **Success criteria**: Unread count is accurate, filters work, clicking notification marks as read and navigates correctly

### Admin Section
- **Functionality**: Collection of management interfaces for Workflows, Institutions, Roles, Templates, Statuses, Users, Analytics, Settings
- **Purpose**: System configuration and governance for administrators managing the institutional workflow platform
- **Trigger**: Expand admin section in sidebar, click specific admin item
- **Progression**: Admin page loads → Table/form displays → User edits → Saves → Data updates → Confirmation shown
- **Success criteria**: Only accessible to admin users, CRUD operations work, data validation prevents errors

## Edge Case Handling

- **Empty States**: Dashboard with no tasks shows onboarding message; kanban columns without tasks show "Drop here" placeholder; calendar without events shows clean grid
- **Overdue Tasks**: Highlighted in red across all views (table, kanban, calendar); filter option available; counted separately in dashboard
- **Loading States**: Skeleton loaders for tables and cards; spinner for drawer content; disabled state for drag operations during save
- **Permission Errors**: Admin section hidden for non-admin users; unauthorized actions show error toast; graceful degradation of features
- **Long Content**: Task titles truncate with ellipsis and tooltip; descriptions show "Read more" expansion; scrollable drawer content
- **No Search Results**: Helpful message with suggestions; clear filters button; switch between result tabs to explore
- **Network Failures**: Retry mechanism for failed API calls; offline indicator; cached data display with warning banner
- **Drag-Drop Errors**: Card returns to original position if drop fails; error toast explains issue; undo option available

## Design Direction

The design should feel authoritative, efficient, and institutional - evoking the reliability and structure of government systems while avoiding bureaucratic clutter. A minimal interface with purposeful use of space serves the complex data and workflows, keeping focus on task completion rather than decoration.

## Color Selection

Custom palette with professional institutional tones

- **Primary Color**: Deep Blue (oklch(0.45 0.12 252)) - Communicates trust, authority, and institutional credibility; used for primary actions and navigation
- **Secondary Colors**: Slate Gray (oklch(0.55 0.02 252)) for secondary buttons and backgrounds; Light Blue (oklch(0.85 0.05 252)) for hover states and highlights
- **Accent Color**: Teal (oklch(0.55 0.15 200)) - Attention-grabbing for notifications, status changes, and CTAs; conveys progress and action
- **Foreground/Background Pairings**:
  - Background (White oklch(0.98 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 12.5:1 ✓
  - Card (Light Gray oklch(0.96 0 0)): Dark Gray text (oklch(0.25 0 0)) - Ratio 11.8:1 ✓
  - Primary (Deep Blue oklch(0.45 0.12 252)): White text (oklch(0.98 0 0)) - Ratio 7.2:1 ✓
  - Secondary (Slate Gray oklch(0.55 0.02 252)): White text (oklch(0.98 0 0)) - Ratio 4.8:1 ✓
  - Accent (Teal oklch(0.55 0.15 200)): White text (oklch(0.98 0 0)) - Ratio 5.1:1 ✓
  - Muted (Light Slate oklch(0.92 0.01 252)): Medium Gray text (oklch(0.45 0.02 252)) - Ratio 6.1:1 ✓

## Font Selection

Typography should convey professionalism and clarity, with excellent readability for data-heavy tables and long task descriptions; Inter provides the clean, neutral character needed for institutional software while remaining highly legible at all sizes.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter SemiBold/32px/tight letter-spacing (-0.02em) - Used in top bar
  - H2 (Section Header): Inter SemiBold/24px/tight letter-spacing (-0.01em) - Dashboard cards, admin sections
  - H3 (Card Title): Inter Medium/18px/normal letter-spacing - Task cards, notification headers
  - Body (Primary): Inter Regular/14px/relaxed line-height (1.6) - Table content, descriptions
  - Small (Metadata): Inter Regular/12px/normal line-height (1.5) - Timestamps, labels, secondary info
  - Button: Inter Medium/14px/slight letter-spacing (0.01em) - All interactive buttons

## Animations

Animations should be subtle and functional, reinforcing the professional nature while providing smooth feedback - avoid playful or exaggerated motion that might undermine institutional credibility.

- **Purposeful Meaning**: Drawer slides communicate direction (appearing from right, dismissed to right); drag preview follows cursor to show physicality; filter changes fade-in results to acknowledge data refresh
- **Hierarchy of Movement**: Task drawer slide-in (300ms) is most prominent; kanban card drag has immediate follow; hover states are instant; filter updates are smooth (200ms fade)

## Component Selection

- **Components**: 
  - Sidebar component for fixed navigation with collapsible sections
  - Card for dashboard metrics and task cards
  - Table with sortable headers for task list
  - Sheet/Drawer for task details (slides from right)
  - Tabs for notification filters and search results
  - Select dropdowns for status, assignee, workflow filters
  - Calendar (react-day-picker) for date selection and calendar view
  - Badge for status indicators and labels
  - Avatar for user assignments
  - Dialog for confirmation modals
  - Button with variants (primary, secondary, ghost, destructive)
  - Input and Textarea for forms
  - Toast (sonner) for success/error notifications
  - ScrollArea for long content in drawer
  - Separator for visual divisions

- **Customizations**:
  - Custom KanbanBoard component with drag-drop using native HTML5 API (no external lib needed)
  - Custom TaskCard component with status indicator dot, assignee avatar, and label pills
  - Custom FilterBar component for reusable multi-select filtering
  - Custom ActivityFeed component for dashboard timeline
  - Custom StatsCard component for dashboard metrics
  
- **States**:
  - Buttons: Hover darkens by 5%, active state adds subtle shadow, disabled is 50% opacity
  - Inputs: Focus shows ring in primary color, error state shows destructive border, success shows accent border
  - Cards: Hover lifts with subtle shadow (0 4px 8px rgba), selected shows primary border
  - Table rows: Hover shows muted background, selected row shows primary tint
  - Sidebar items: Active shows primary background with white text, hover shows muted background
  
- **Icon Selection**: 
  - SquaresFour for Dashboard
  - ListChecks for Tasks
  - KanbanBoard for Boards (custom columns icon)
  - Calendar for Calendar
  - Bell for Notifications
  - MagnifyingGlass for Search
  - GearSix for Settings
  - Users for Users admin
  - ChartBar for Analytics
  - Tag for Labels/Statuses
  - Buildings for Institutions
  - FlowArrow for Workflows
  - ShieldCheck for Roles & Permissions
  - Plus for add actions
  - X for close/dismiss
  - FunnelSimple for filters
  - CaretDown for dropdowns
  
- **Spacing**:
  - Page padding: p-6 (24px)
  - Card padding: p-4 (16px)
  - Section gaps: gap-6 (24px)
  - Component gaps: gap-4 (16px)
  - Inline spacing: gap-2 (8px)
  - Border radius: rounded-lg (var(--radius))
  
- **Mobile**:
  - Sidebar collapses to icon-only or hamburger menu <768px
  - Task drawer becomes full-screen modal on mobile
  - Table switches to stacked card layout
  - Kanban board allows horizontal scroll with column snapping
  - Dashboard cards stack vertically
  - Filters collapse into expandable drawer
  - Top bar shows hamburger menu, page title, and user avatar only
