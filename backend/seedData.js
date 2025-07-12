const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Question = require("./models/Question");
const User = require("./models/User");
const Answer = require("./models/Answer");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Clear existing data
    await Question.deleteMany({});
    await User.deleteMany({});
    await Answer.deleteMany({});

    // Create 5 test users
    const users = [];
    
    const user1 = new User({
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      dob: new Date("1990-01-15")
    });
    await user1.save();
    users.push(user1);

    const user2 = new User({
      username: "janesmith",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      password: "password123",
      dob: new Date("1985-03-20")
    });
    await user2.save();
    users.push(user2);

    const user3 = new User({
      username: "mikejohnson",
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike@example.com",
      password: "password123",
      dob: new Date("1992-07-10")
    });
    await user3.save();
    users.push(user3);

    const user4 = new User({
      username: "sarahwilson",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah@example.com",
      password: "password123",
      dob: new Date("1988-11-05")
    });
    await user4.save();
    users.push(user4);

    const user5 = new User({
      username: "alexbrown",
      firstName: "Alex",
      lastName: "Brown",
      email: "alex@example.com",
      password: "password123",
      dob: new Date("1995-09-25")
    });
    await user5.save();
    users.push(user5);

    // Create 5 test questions
    const questions = [];

    const question1 = new Question({
      title: "How does useEffect work in React?",
      body: "I'm confused about when and how often useEffect runs. Can someone explain it simply with examples?",
      tags: ["react", "javascript", "hooks"],
      user: users[0]._id,
      upvotes: 8,
      downvotes: 1,
      createdAt: new Date("2025-07-10T10:00:00Z")
    });
    await question1.save();
    questions.push(question1);

    const question2 = new Question({
      title: "What is the difference between let and var in JavaScript?",
      body: "I've seen both used but I'm not clear on the difference. Which one should I prefer and why? Are there any performance implications?",
      tags: ["javascript", "es6", "variables"],
      user: users[1]._id,
      upvotes: 5,
      downvotes: 0,
      createdAt: new Date("2025-07-09T14:30:00Z")
    });
    await question2.save();
    questions.push(question2);

    const question3 = new Question({
      title: "Best practices for MongoDB schema design?",
      body: "Should I embed documents or use references? How do I design schemas for scalability in MongoDB? What are the trade-offs?",
      tags: ["mongodb", "database", "schema-design"],
      user: users[2]._id,
      upvotes: 12,
      downvotes: 2,
      createdAt: new Date("2025-07-08T09:15:00Z")
    });
    await question3.save();
    questions.push(question3);

    const question4 = new Question({
      title: "How to handle authentication in Node.js with JWT?",
      body: "I'm building a REST API and need to implement JWT authentication. What's the best approach for token storage and validation?",
      tags: ["nodejs", "jwt", "authentication", "security"],
      user: users[3]._id,
      upvotes: 6,
      downvotes: 1,
      createdAt: new Date("2025-07-07T16:45:00Z")
    });
    await question4.save();
    questions.push(question4);

    const question5 = new Question({
      title: "CSS Grid vs Flexbox: When to use which?",
      body: "I'm always confused about when to use CSS Grid and when to use Flexbox. Can someone explain the differences and use cases?",
      tags: ["css", "grid", "flexbox", "layout"],
      user: users[4]._id,
      upvotes: 9,
      downvotes: 0,
      createdAt: new Date("2025-07-06T11:20:00Z")
    });
    await question5.save();
    questions.push(question5);

    // Create 15 test answers (3 for each question)
    const answers = [];

    // 3 answers for Question 1: How does useEffect work in React?
    const answer1 = new Answer({
      body: "useEffect runs after the component renders. It's like componentDidMount and componentDidUpdate combined. The dependency array controls when it runs:\n\n- No dependency array: runs after every render\n- Empty array []: runs only once after initial render\n- With dependencies [dep1, dep2]: runs when dependencies change",
      question: questions[0]._id,
      user: users[1]._id,
      upvotes: 4,
      downvotes: 0,
      createdAt: new Date("2025-07-10T12:00:00Z")
    });
    await answer1.save();
    answers.push(answer1);

    const answer2 = new Answer({
      body: "Think of useEffect as a way to synchronize your component with external systems. Here's a simple example:\n\n```javascript\nuseEffect(() => {\n  document.title = `You clicked ${count} times`;\n}, [count]); // Only re-run when count changes\n```\n\nThe cleanup function is also important for preventing memory leaks!",
      question: questions[0]._id,
      user: users[2]._id,
      upvotes: 6,
      downvotes: 1,
      createdAt: new Date("2025-07-10T14:30:00Z")
    });
    await answer2.save();
    answers.push(answer2);

    const answer3 = new Answer({
      body: "Don't forget about the cleanup function! It's crucial for subscriptions and event listeners:\n\n```javascript\nuseEffect(() => {\n  const subscription = someAPI.subscribe();\n  return () => {\n    subscription.unsubscribe(); // Cleanup!\n  };\n}, []);\n```\n\nThis prevents memory leaks and unexpected behavior.",
      question: questions[0]._id,
      user: users[3]._id,
      upvotes: 3,
      downvotes: 0,
      createdAt: new Date("2025-07-10T16:15:00Z")
    });
    await answer3.save();
    answers.push(answer3);

    // 3 answers for Question 2: What is the difference between let and var in JavaScript?
    const answer4 = new Answer({
      body: "The main differences are:\n\n1. **Scope**: `let` has block scope, `var` has function scope\n2. **Hoisting**: Both are hoisted, but `let` creates a temporal dead zone\n3. **Redeclaration**: `var` allows redeclaration, `let` doesn't\n4. **Loop behavior**: `let` creates new binding for each iteration\n\nAlways prefer `let` in modern JavaScript!",
      question: questions[1]._id,
      user: users[2]._id,
      upvotes: 5,
      downvotes: 0,
      createdAt: new Date("2025-07-09T16:00:00Z")
    });
    await answer4.save();
    answers.push(answer4);

    const answer5 = new Answer({
      body: "Here's a practical example showing the difference:\n\n```javascript\n// var example\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100); // Prints: 3, 3, 3\n}\n\n// let example\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100); // Prints: 0, 1, 2\n}\n```\n\nThis is because `let` creates a new binding for each iteration!",
      question: questions[1]._id,
      user: users[3]._id,
      upvotes: 8,
      downvotes: 0,
      createdAt: new Date("2025-07-09T18:30:00Z")
    });
    await answer5.save();
    answers.push(answer5);

    const answer6 = new Answer({
      body: "Don't forget about the temporal dead zone with `let`:\n\n```javascript\nconsole.log(x); // ReferenceError: Cannot access 'x' before initialization\nlet x = 5;\n\nconsole.log(y); // undefined (but no error)\nvar y = 5;\n```\n\nThis helps catch bugs early in development!",
      question: questions[1]._id,
      user: users[4]._id,
      upvotes: 2,
      downvotes: 0,
      createdAt: new Date("2025-07-09T20:00:00Z")
    });
    await answer6.save();
    answers.push(answer6);

    // 3 answers for Question 3: Best practices for MongoDB schema design?
    const answer7 = new Answer({
      body: "Here are the key principles:\n\n**Embed when:**\n- Data is always accessed together\n- Child documents are small\n- 1:1 or 1:few relationships\n\n**Reference when:**\n- Data is accessed independently\n- Large documents\n- Many-to-many relationships\n- Document size might exceed 16MB limit",
      question: questions[2]._id,
      user: users[3]._id,
      upvotes: 7,
      downvotes: 1,
      createdAt: new Date("2025-07-08T11:30:00Z")
    });
    await answer7.save();
    answers.push(answer7);

    const answer8 = new Answer({
      body: "Consider your query patterns first! Here's my approach:\n\n1. **Identify your most common queries**\n2. **Design schemas around those queries**\n3. **Use compound indexes effectively**\n4. **Denormalize frequently accessed data**\n5. **Keep the 16MB document limit in mind**\n\nExample: For a blog, embed comments if there are usually <100 per post, otherwise reference them.",
      question: questions[2]._id,
      user: users[0]._id,
      upvotes: 4,
      downvotes: 0,
      createdAt: new Date("2025-07-08T13:45:00Z")
    });
    await answer8.save();
    answers.push(answer8);

    const answer9 = new Answer({
      body: "Don't forget about MongoDB's aggregation pipeline! It's incredibly powerful for complex queries:\n\n```javascript\ndb.orders.aggregate([\n  { $match: { status: 'shipped' } },\n  { $group: { _id: '$customerId', total: { $sum: '$amount' } } },\n  { $sort: { total: -1 } }\n]);\n```\n\nDesign your schema to work well with aggregation operations!",
      question: questions[2]._id,
      user: users[1]._id,
      upvotes: 6,
      downvotes: 0,
      createdAt: new Date("2025-07-08T15:20:00Z")
    });
    await answer9.save();
    answers.push(answer9);

    // 3 answers for Question 4: How to handle authentication in Node.js with JWT?
    const answer10 = new Answer({
      body: "Here's a complete JWT authentication flow:\n\n1. User logs in with credentials\n2. Server validates and creates JWT\n3. Client stores token (localStorage/cookie)\n4. Client sends token in Authorization header\n5. Server validates token on protected routes\n\nUse middleware for token validation and consider refresh tokens for better security.",
      question: questions[3]._id,
      user: users[4]._id,
      upvotes: 5,
      downvotes: 0,
      createdAt: new Date("2025-07-07T18:00:00Z")
    });
    await answer10.save();
    answers.push(answer10);

    const answer11 = new Answer({
      body: "Here's a practical implementation with Express:\n\n```javascript\nconst jwt = require('jsonwebtoken');\n\n// Generate token\nconst token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });\n\n// Middleware to verify token\nconst verifyToken = (req, res, next) => {\n  const token = req.header('Authorization')?.replace('Bearer ', '');\n  if (!token) return res.status(401).json({ error: 'Access denied' });\n  \n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (error) {\n    res.status(400).json({ error: 'Invalid token' });\n  }\n};\n```",
      question: questions[3]._id,
      user: users[0]._id,
      upvotes: 9,
      downvotes: 0,
      createdAt: new Date("2025-07-07T19:30:00Z")
    });
    await answer11.save();
    answers.push(answer11);

    const answer12 = new Answer({
      body: "Security best practices for JWT:\n\n1. **Use HTTPS only** - Never send JWTs over HTTP\n2. **Short expiration times** - 15-30 minutes for access tokens\n3. **Implement refresh tokens** - For seamless user experience\n4. **Store securely** - HttpOnly cookies > localStorage\n5. **Include user roles** - For authorization\n6. **Use strong secrets** - At least 256 bits\n\nAlso consider using libraries like `helmet` for additional security headers!",
      question: questions[3]._id,
      user: users[1]._id,
      upvotes: 7,
      downvotes: 1,
      createdAt: new Date("2025-07-07T21:00:00Z")
    });
    await answer12.save();
    answers.push(answer12);

    // 3 answers for Question 5: CSS Grid vs Flexbox: When to use which?
    const answer13 = new Answer({
      body: "**Use Flexbox for:**\n- 1-dimensional layouts (row or column)\n- Distributing space between items\n- Centering content\n- Navigation bars, cards\n\n**Use Grid for:**\n- 2-dimensional layouts (rows and columns)\n- Complex layouts\n- Overlapping elements\n- Page layouts, image galleries\n\nThey work great together too!",
      question: questions[4]._id,
      user: users[0]._id,
      upvotes: 6,
      downvotes: 0,
      createdAt: new Date("2025-07-06T13:45:00Z")
    });
    await answer13.save();
    answers.push(answer13);

    const answer14 = new Answer({
      body: "Here's a practical example of when to use each:\n\n**Flexbox example (navigation bar):**\n```css\n.nav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\n**Grid example (card layout):**\n```css\n.card-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n}\n```\n\nFlexbox is perfect for components, Grid is perfect for layouts!",
      question: questions[4]._id,
      user: users[2]._id,
      upvotes: 8,
      downvotes: 0,
      createdAt: new Date("2025-07-06T15:20:00Z")
    });
    await answer14.save();
    answers.push(answer14);

    const answer15 = new Answer({
      body: "Pro tip: You can use them together! Grid for the overall layout, Flexbox for component alignment:\n\n```css\n.main-layout {\n  display: grid;\n  grid-template-areas: \n    'header header'\n    'sidebar main'\n    'footer footer';\n}\n\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```\n\nThis gives you the best of both worlds!",
      question: questions[4]._id,
      user: users[3]._id,
      upvotes: 4,
      downvotes: 0,
      createdAt: new Date("2025-07-06T17:00:00Z")
    });
    await answer15.save();
    answers.push(answer15);

    console.log("✅ Test data seeded successfully!");
    console.log(`👥 Created ${users.length} users`);
    console.log(`❓ Created ${questions.length} questions`);
    console.log(`💬 Created ${answers.length} answers (3 per question)`);
    
    console.log("\n📊 Data Summary:");
    users.forEach((user, index) => {
      console.log(`User ${index + 1}: ${user.username} (${user._id})`);
    });
    
    questions.forEach((question, index) => {
      console.log(`Question ${index + 1}: ${question.title} (${question._id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
