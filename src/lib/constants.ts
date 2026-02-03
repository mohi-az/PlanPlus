/**
 * Application-wide constants
 */

// Task Status Constants
export const TASK_STATUS = {
  TODO: 'Todo',
  DONE: 'Done',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: 'Something went wrong!',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_REGISTERED: 'This email is already registered',
  NO_PERMISSION_CATEGORY: 'You do not have permission to modify this category',
  CATEGORY_IN_USE: (count: number) => 
    `You cannot delete this category as it is being used by ${count} task(s)`,
} as const;

// Success Messages  
export const SUCCESS_MESSAGES = {
  LOGGED_IN: 'Logged in successfully',
  TASK_ADDED: 'Task added successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
} as const;

// Date/Time Constants
export const DATE_FORMATS = {
  ISO_DATE: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DD HH:mm:ss',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  ACHIEVEMENT: 'achievement',
  REMINDER: 'reminder',
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
