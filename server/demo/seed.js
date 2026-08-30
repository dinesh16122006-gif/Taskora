/**
 * TaskFlow Demo Data Seeder
 * Run with: npm run seed
 * Creates demo users, projects, tasks, notifications, and activities.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Activity = require('../models/Activity');
const { logActivity, createNotification } = require('../utils/helpers');

const daysFromNow = (delta) => {
  const d = new Date();
  d.setDate(d.getDate() + delta);
  return d;
};

const seed = async () => {
  await connectDB();

  console.log('Clearing existing demo data...');
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    Notification.deleteMany({}),
    Activity.deleteMany({}),
  ]);

  console.log('Creating users...');
  const [sarah, jordan, alex, priya, mark] = await User.create([
    {
      name: 'Sarah Chen',
      email: 'sarah@taskflow.app',
      password: 'password123',
      role: 'admin',
    },
    {
      name: 'Jordan Reed',
      email: 'jordan@taskflow.app',
      password: 'password123',
    },
    {
      name: 'Alex Morgan',
      email: 'alex@taskflow.app',
      password: 'password123',
    },
    {
      name: 'Priya Patel',
      email: 'priya@taskflow.app',
      password: 'password123',
    },
    {
      name: 'Mark Wilson',
      email: 'mark@taskflow.app',
      password: 'password123',
    },
  ]);

  console.log('Creating projects...');
  const [mobileApp, marketing, website, analytics] = await Project.create([
    {
      name: 'Mobile App Development',
      description:
        'Build a cross-platform mobile application for iOS and Android to manage personal finances with budgeting tools, expense tracking, and monthly reports.',
      owner: sarah._id,
      members: [jordan._id, alex._id],
      startDate: daysFromNow(-30),
      deadline: daysFromNow(30),
      status: 'In Progress',
      priority: 'High',
    },
    {
      name: 'Marketing Website Redesign',
      description:
        'Redesign our corporate marketing website with a modern look, improved performance, better SEO, and a streamlined conversion funnel.',
      owner: jordan._id,
      members: [priya._id, mark._id],
      startDate: daysFromNow(-15),
      deadline: daysFromNow(15),
      status: 'In Progress',
      priority: 'Medium',
    },
    {
      name: 'Customer Analytics Dashboard',
      description:
        'Create an internal analytics dashboard to track customer behavior, retention, and revenue metrics with interactive visualizations.',
      owner: alex._id,
      members: [sarah._id, jordan._id],
      startDate: daysFromNow(-45),
      deadline: daysFromNow(10),
      status: 'On Hold',
      priority: 'High',
    },
    {
      name: 'Internal HR Portal',
      description:
        'Develop an employee self-service portal for managing leave requests, viewing payslips, and accessing company policies.',
      owner: priya._id,
      members: [mark._id],
      startDate: daysFromNow(-60),
      deadline: daysFromNow(-5),
      status: 'Completed',
      priority: 'Low',
    },
  ]);

  console.log('Creating tasks...');
  const tasks = [];
  const makeTask = (data) => tasks.push(data);
  const saveTasks = async () => {
    const saved = await Task.create(tasks);
    return saved;
  };

  // Mobile App tasks
  makeTask({ title: 'Set up React Native project', description: 'Initialize the mobile app project with React Native and configure navigation.', project: mobileApp._id, assignedTo: jordan._id, createdBy: sarah._id, status: 'Completed', priority: 'High', dueDate: daysFromNow(-25) });
  makeTask({ title: 'Design login & registration screens', description: 'Create wireframes and high-fidelity designs for authentication screens.', project: mobileApp._id, assignedTo: alex._id, createdBy: sarah._id, status: 'Completed', priority: 'High', dueDate: daysFromNow(-20) });
  makeTask({ title: 'Implement expense tracking module', description: 'Build the core expense entry, categorization, and list view functionality.', project: mobileApp._id, assignedTo: jordan._id, createdBy: sarah._id, status: 'In Progress', priority: 'High', dueDate: daysFromNow(10) });
  makeTask({ title: 'Integrate payment reminders', description: 'Add push notifications for bill payment reminders and due dates.', project: mobileApp._id, assignedTo: alex._id, createdBy: sarah._id, status: 'In Progress', priority: 'Medium', dueDate: daysFromNow(15) });
  makeTask({ title: 'Budget planning screen', description: 'Design and implement the monthly budget planning and tracking screen.', project: mobileApp._id, assignedTo: jordan._id, createdBy: sarah._id, status: 'To Do', priority: 'Medium', dueDate: daysFromNow(20) });
  makeTask({ title: 'Monthly report generation', description: 'Generate PDF and in-app monthly spending reports with charts.', project: mobileApp._id, assignedTo: alex._id, createdBy: sarah._id, status: 'To Do', priority: 'Low', dueDate: daysFromNow(25) });
  makeTask({ title: 'App store listing preparation', description: 'Prepare screenshots, descriptions, and metadata for app store submission.', project: mobileApp._id, assignedTo: sarah._id, createdBy: sarah._id, status: 'Review', priority: 'Low', dueDate: daysFromNow(28) });

  // Marketing Website tasks
  makeTask({ title: 'Conduct UX audit of current site', description: 'Identify usability issues and improvement opportunities on the existing website.', project: marketing._id, assignedTo: priya._id, createdBy: jordan._id, status: 'Completed', priority: 'Medium', dueDate: daysFromNow(-12) });
  makeTask({ title: 'Define brand style guide', description: 'Create a comprehensive brand style guide with colors, typography, and components.', project: marketing._id, assignedTo: priya._id, createdBy: jordan._id, status: 'Completed', priority: 'High', dueDate: daysFromNow(-8) });
  makeTask({ title: 'Build homepage sections', description: 'Develop the homepage hero, features, testimonials, and pricing sections.', project: marketing._id, assignedTo: mark._id, createdBy: jordan._id, status: 'In Progress', priority: 'High', dueDate: daysFromNow(5) });
  makeTask({ title: 'SEO keyword optimization', description: 'Optimize page titles, meta descriptions, and content for target keywords.', project: marketing._id, assignedTo: priya._id, createdBy: jordan._id, status: 'In Progress', priority: 'Medium', dueDate: daysFromNow(8) });
  makeTask({ title: 'Set up conversion tracking', description: 'Integrate analytics and conversion tracking for signup and contact forms.', project: marketing._id, assignedTo: mark._id, createdBy: jordan._id, status: 'To Do', priority: 'High', dueDate: daysFromNow(12) });

  // Analytics Dashboard tasks
  makeTask({ title: 'Ingest customer data pipeline', description: 'Build the data ingestion pipeline from CRM and transaction sources.', project: analytics._id, assignedTo: sarah._id, createdBy: alex._id, status: 'In Progress', priority: 'High', dueDate: daysFromNow(3) });
  makeTask({ title: 'Retention cohort analysis', description: 'Implement cohort-based retention analysis and visualization.', project: analytics._id, assignedTo: jordan._id, createdBy: alex._id, status: 'In Progress', priority: 'High', dueDate: daysFromNow(-2) });
  makeTask({ title: 'Revenue trend charts', description: 'Create interactive revenue and MRR trend charts with forecasting.', project: analytics._id, assignedTo: sarah._id, createdBy: alex._id, status: 'In Progress', priority: 'Medium', dueDate: daysFromNow(6) });

  // HR Portal tasks (completed)
  makeTask({ title: 'Employee profile module', description: 'Build employee profile and directory module.', project: website._id, assignedTo: mark._id, createdBy: priya._id, status: 'Completed', priority: 'Low', dueDate: daysFromNow(-50) });
  makeTask({ title: 'Leave request workflow', description: 'Implement leave request submission and approval workflow.', project: website._id, assignedTo: priya._id, createdBy: priya._id, status: 'Completed', priority: 'Medium', dueDate: daysFromNow(-30) });
  makeTask({ title: 'Payslip download functionality', description: 'Add monthly payslip generation and download.', project: website._id, assignedTo: mark._id, createdBy: priya._id, status: 'Completed', priority: 'Low', dueDate: daysFromNow(-15) });
  makeTask({ title: 'Policy documents library', description: 'Create a searchable library for company policy documents.', project: website._id, assignedTo: priya._id, createdBy: priya._id, status: 'Completed', priority: 'Low', dueDate: daysFromNow(-7) });

  const savedTasks = await saveTasks();

  console.log('Creating activities...');
  const activityDefs = [
    { project: mobileApp._id, user: sarah._id, action: 'Project created', description: 'Sarah Chen created the project "Mobile App Development"' },
    { project: mobileApp._id, user: sarah._id, action: 'Task created', description: 'Sarah Chen created task "Set up React Native project"' },
    { project: mobileApp._id, user: jordan._id, action: 'Task status changed', description: 'Jordan Reed moved "Set up React Native project" from To Do to Completed' },
    { project: mobileApp._id, user: alex._id, action: 'Task status changed', description: 'Alex Morgan moved "Design login & registration screens" from To Do to Completed' },
    { project: marketing._id, user: jordan._id, action: 'Project created', description: 'Jordan Reed created the project "Marketing Website Redesign"' },
    { project: marketing._id, user: mark._id, action: 'Task created', description: 'Mark Wilson created task "Build homepage sections"' },
    { project: analytics._id, user: alex._id, action: 'Project created', description: 'Alex Morgan created the project "Customer Analytics Dashboard"' },
    { project: analytics._id, user: sarah._id, action: 'Task assigned', description: 'Sarah Chen assigned "Ingest customer data pipeline" to a member' },
    { project: website._id, user: priya._id, action: 'Project created', description: 'Priya Patel created the project "Internal HR Portal"' },
    { project: website._id, user: mark._id, action: 'Task status changed', description: 'Mark Wilson moved "Payslip download functionality" from In Progress to Completed' },
    { project: website._id, user: priya._id, action: 'Task completed', description: 'Task "Policy documents library" was completed' },
  ];
  for (const a of activityDefs) {
    await logActivity(a);
  }

  console.log('Creating notifications...');
  const notifDefs = [
    { user: jordan._id, message: 'You were assigned task "Set up React Native project"', type: 'assignment' },
    { user: alex._id, message: 'You were assigned task "Design login & registration screens"', type: 'assignment' },
    { user: priya._id, message: 'You were added to project "Marketing Website Redesign"', type: 'update' },
    { user: mark._id, message: 'Task "Build homepage sections" is due in 5 days', type: 'deadline' },
    { user: jordan._id, message: 'Task "Retention cohort analysis" is overdue!', type: 'overdue' },
    { user: sarah._id, message: 'Task "Revenue trend charts" is due in 6 days', type: 'deadline' },
  ];
  for (const n of notifDefs) {
    await createNotification(n);
  }

  console.log('✅ Demo data seeded successfully!');
  console.log('---------------------------------');
  console.log('Demo users (password: password123):');
  console.log('  admin: sarah@taskflow.app');
  console.log('  user : jordan@taskflow.app');
  console.log('  user : alex@taskflow.app');
  console.log('  user : priya@taskflow.app');
  console.log('  user : mark@taskflow.app');
  console.log('---------------------------------');
  console.log(`Projects: ${await Project.countDocuments()}`);
  console.log(`Tasks: ${await Task.countDocuments()}`);
  console.log(`Activities: ${await Activity.countDocuments()}`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
