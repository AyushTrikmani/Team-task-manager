require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  // Clear existing data
  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');

  // Create users
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const memberPass = await bcrypt.hash('Member@123', 10);

  const admin = await User.create({ name: 'Rahul Sharma', email: 'rahul.admin@gmail.com', password: adminPass, role: 'admin' });
  const alice = await User.create({ name: 'Priya Patel', email: 'priya.patel@gmail.com', password: memberPass, role: 'member' });
  const bob = await User.create({ name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', password: memberPass, role: 'member' });
  const carol = await User.create({ name: 'Sneha Verma', email: 'sneha.verma@gmail.com', password: memberPass, role: 'member' });
  console.log('Users created');

  // Create projects
  const project1 = await Project.create({
    name: 'Website Redesign',
    description: 'Redesign the company website with modern UI/UX and improved performance.',
    created_by: admin._id,
    members: [admin._id, alice._id, bob._id],
  });

  const project2 = await Project.create({
    name: 'Mobile App Development',
    description: 'Build a cross-platform mobile app for iOS and Android using React Native.',
    created_by: admin._id,
    members: [admin._id, bob._id, carol._id],
  });

  const project3 = await Project.create({
    name: 'API Integration',
    description: 'Integrate third-party payment and notification APIs into the platform.',
    created_by: admin._id,
    members: [admin._id, alice._id, carol._id],
  });
  console.log('Projects created');

  const today = new Date();
  const future = (days) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  const past = (days) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

  // Tasks for Website Redesign
  await Task.insertMany([
    { title: 'Design homepage mockup', description: 'Create Figma mockup for the new homepage layout.', status: 'done', priority: 'high', due_date: past(5), project_id: project1._id, assigned_to: alice._id, created_by: admin._id },
    { title: 'Implement responsive navbar', description: 'Build a fully responsive navigation bar with mobile menu.', status: 'done', priority: 'high', due_date: past(2), project_id: project1._id, assigned_to: alice._id, created_by: admin._id },
    { title: 'Build landing page components', description: 'Develop hero section, features section and footer.', status: 'in_progress', priority: 'high', due_date: future(3), project_id: project1._id, assigned_to: bob._id, created_by: admin._id },
    { title: 'SEO optimization', description: 'Add meta tags, sitemap and improve page load speed.', status: 'in_progress', priority: 'medium', due_date: future(5), project_id: project1._id, assigned_to: alice._id, created_by: admin._id },
    { title: 'Cross browser testing', description: 'Test the website on Chrome, Firefox, Safari and Edge.', status: 'todo', priority: 'medium', due_date: future(7), project_id: project1._id, assigned_to: bob._id, created_by: admin._id },
    { title: 'Performance audit', description: 'Run Lighthouse audit and fix performance issues.', status: 'todo', priority: 'low', due_date: future(10), project_id: project1._id, assigned_to: alice._id, created_by: admin._id },
  ]);

  // Tasks for Mobile App Development
  await Task.insertMany([
    { title: 'Setup React Native project', description: 'Initialize project with navigation and folder structure.', status: 'done', priority: 'high', due_date: past(10), project_id: project2._id, assigned_to: bob._id, created_by: admin._id },
    { title: 'Design app screens in Figma', description: 'Create wireframes for all main screens of the app.', status: 'done', priority: 'high', due_date: past(7), project_id: project2._id, assigned_to: carol._id, created_by: admin._id },
    { title: 'Build authentication screens', description: 'Implement login, register and forgot password screens.', status: 'in_progress', priority: 'high', due_date: future(2), project_id: project2._id, assigned_to: bob._id, created_by: admin._id },
    { title: 'Integrate push notifications', description: 'Setup Firebase push notifications for iOS and Android.', status: 'todo', priority: 'medium', due_date: future(6), project_id: project2._id, assigned_to: carol._id, created_by: admin._id },
    { title: 'App store submission', description: 'Prepare app store listing and submit for review.', status: 'todo', priority: 'low', due_date: future(15), project_id: project2._id, assigned_to: bob._id, created_by: admin._id },
  ]);

  // Tasks for API Integration
  await Task.insertMany([
    { title: 'Research payment gateway options', description: 'Compare Stripe, Razorpay and PayPal for best fit.', status: 'done', priority: 'high', due_date: past(8), project_id: project3._id, assigned_to: carol._id, created_by: admin._id },
    { title: 'Integrate Stripe payment API', description: 'Implement Stripe checkout and webhook handling.', status: 'in_progress', priority: 'high', due_date: future(1), project_id: project3._id, assigned_to: alice._id, created_by: admin._id },
    { title: 'Setup email notification service', description: 'Integrate SendGrid for transactional emails.', status: 'in_progress', priority: 'medium', due_date: future(4), project_id: project3._id, assigned_to: carol._id, created_by: admin._id },
    { title: 'Write API documentation', description: 'Document all API endpoints using Swagger/Postman.', status: 'todo', priority: 'medium', due_date: future(8), project_id: project3._id, assigned_to: alice._id, created_by: admin._id },
    { title: 'API security audit', description: 'Review API for vulnerabilities and add rate limiting.', status: 'todo', priority: 'high', due_date: past(1), project_id: project3._id, assigned_to: carol._id, created_by: admin._id },
  ]);

  console.log('Tasks created');
  console.log('\n✅ Seed completed successfully!\n');
  console.log('Login credentials:');
  console.log('Admin  → rahul.admin@gmail.com  / Admin@123');
  console.log('Priya  → priya.patel@gmail.com  / Member@123');
  console.log('Arjun  → arjun.mehta@gmail.com  / Member@123');
  console.log('Sneha  → sneha.verma@gmail.com  / Member@123');

  await mongoose.disconnect();
};

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
