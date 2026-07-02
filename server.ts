import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('student_management.db');

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    name TEXT,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT,
    dob TEXT, -- Format: DDMMYYYY
    department TEXT,
    year TEXT,
    semester TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    admission_date TEXT
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    name TEXT,
    instructor TEXT,
    semester TEXT,
    credits INTEGER
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    course_id TEXT,
    date TEXT,
    status TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    course_id TEXT,
    semester INTEGER,
    internal_marks INTEGER,
    external_marks INTEGER,
    grade TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id),
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    total_fee INTEGER,
    paid_amount INTEGER,
    payment_date TEXT,
    status TEXT,
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    course_id TEXT,
    description TEXT,
    deadline TEXT,
    file_path TEXT,
    FOREIGN KEY(course_id) REFERENCES courses(id)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_id INTEGER,
    student_id TEXT,
    submission_date TEXT,
    file_name TEXT,
    FOREIGN KEY(assignment_id) REFERENCES assignments(id),
    FOREIGN KEY(student_id) REFERENCES students(id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    message TEXT,
    date TEXT
  );

  CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT,
    teacher TEXT,
    day TEXT,
    time TEXT,
    classroom TEXT
  );
`);

// Seed default staff if not exists
const staffCount = db.prepare('SELECT count(*) as count FROM staff').get() as { count: number };
if (staffCount.count === 0) {
  db.prepare('INSERT INTO staff (username, password, name, email) VALUES (?, ?, ?, ?)').run('admin', 'admin123', 'System Administrator', 'admin@school.edu');
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8080;

  app.use(express.json());

  // Auth API
  app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    if (role === 'staff') {
      const user = db.prepare('SELECT * FROM staff WHERE username = ? AND password = ?').get(username, password) as any;
      if (user) {
        res.json({ success: true, user: { id: user.id, name: user.name, role: 'staff' } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid staff credentials' });
      }
    } else if (role === 'student') {
      // Student login: username is name, password is DOB
      const user = db.prepare('SELECT * FROM students WHERE name = ? AND dob = ?').get(username, password) as any;
      if (user) {
        res.json({ success: true, user: { ...user, role: 'student' } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid student name or DOB' });
      }
    } else {
      res.status(400).json({ success: false, message: 'Invalid role' });
    }
  });

  // Students API
  app.get('/api/students', (req, res) => {
    const students = db.prepare('SELECT * FROM students').all();
    res.json(students);
  });

  app.post('/api/students', (req, res) => {
    const { id, name, dob, department, year, semester, email, phone, address, admission_date } = req.body;
    try {
      db.prepare(`INSERT INTO students (id, name, dob, department, year, semester, email, phone, address, admission_date) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, name, dob, department, year, semester, email, phone, address, admission_date);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/students/:id', (req, res) => {
    const { name, dob, department, year, semester, email, phone, address } = req.body;
    const { id } = req.params;
    db.prepare(`UPDATE students SET name=?, dob=?, department=?, year=?, semester=?, email=?, phone=?, address=? WHERE id=?`)
      .run(name, dob, department, year, semester, email, phone, address, id);
    res.json({ success: true });
  });

  app.delete('/api/students/:id', (req, res) => {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Courses API
  app.get('/api/courses', (req, res) => {
    const courses = db.prepare('SELECT * FROM courses').all();
    res.json(courses);
  });

  app.post('/api/courses', (req, res) => {
    const { id, name, instructor, semester, credits } = req.body;
    try {
      db.prepare('INSERT INTO courses (id, name, instructor, semester, credits) VALUES (?, ?, ?, ?, ?)').run(id, name, instructor, semester, credits);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/courses/:id', (req, res) => {
    const { name, instructor, semester, credits } = req.body;
    try {
      db.prepare('UPDATE courses SET name=?, instructor=?, semester=?, credits=? WHERE id=?').run(name, instructor, semester, credits, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/courses/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Attendance API
  app.get('/api/attendance', (req, res) => {
    const attendance = db.prepare(`
      SELECT a.*, s.name as student_name, c.name as course_name 
      FROM attendance a 
      JOIN students s ON a.student_id = s.id 
      JOIN courses c ON a.course_id = c.id
    `).all();
    res.json(attendance);
  });

  app.post('/api/attendance', (req, res) => {
    const { student_id, course_id, date, status } = req.body;
    try {
      db.prepare('INSERT INTO attendance (student_id, course_id, date, status) VALUES (?, ?, ?, ?)').run(student_id, course_id, date, status);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/attendance/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM attendance WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/attendance/:id', (req, res) => {
    const { student_id, course_id, date, status } = req.body;
    try {
      db.prepare('UPDATE attendance SET student_id=?, course_id=?, date=?, status=? WHERE id=?')
        .run(student_id, course_id, date, status, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Marks API
  app.get('/api/marks', (req, res) => {
    const marks = db.prepare(`
      SELECT m.*, s.name as student_name, c.name as course_name 
      FROM marks m 
      JOIN students s ON m.student_id = s.id 
      JOIN courses c ON m.course_id = c.id
    `).all();
    res.json(marks);
  });

  app.post('/api/marks', (req, res) => {
    const { student_id, course_id, semester, internal_marks, external_marks, grade } = req.body;
    try {
      db.prepare('INSERT INTO marks (student_id, course_id, semester, internal_marks, external_marks, grade) VALUES (?, ?, ?, ?, ?, ?)').run(student_id, course_id, semester, internal_marks, external_marks, grade);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/marks/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM marks WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/marks/:id', (req, res) => {
    const { student_id, course_id, semester, internal_marks, external_marks, grade } = req.body;
    try {
      db.prepare('UPDATE marks SET student_id=?, course_id=?, semester=?, internal_marks=?, external_marks=?, grade=? WHERE id=?')
        .run(student_id, course_id, semester, internal_marks, external_marks, grade, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Fees API
  app.get('/api/fees', (req, res) => {
    const fees = db.prepare(`
      SELECT f.*, s.name as student_name 
      FROM fees f 
      JOIN students s ON f.student_id = s.id
    `).all();
    res.json(fees);
  });

  app.post('/api/fees', (req, res) => {
    const { student_id, total_fee, paid_amount, payment_date, status } = req.body;
    try {
      db.prepare('INSERT INTO fees (student_id, total_fee, paid_amount, payment_date, status) VALUES (?, ?, ?, ?, ?)').run(student_id, total_fee, paid_amount, payment_date, status);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/fees/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM fees WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/fees/:id', (req, res) => {
    const { student_id, total_fee, paid_amount, payment_date, status } = req.body;
    try {
      db.prepare('UPDATE fees SET student_id=?, total_fee=?, paid_amount=?, payment_date=?, status=? WHERE id=?')
        .run(student_id, total_fee, paid_amount, payment_date, status, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Assignments API
  app.get('/api/assignments', (req, res) => {
    const assignments = db.prepare(`
      SELECT a.*, c.name as course_name 
      FROM assignments a 
      JOIN courses c ON a.course_id = c.id
    `).all();
    res.json(assignments);
  });

  app.post('/api/assignments', (req, res) => {
    const { title, course_id, description, deadline, file_path } = req.body;
    try {
      db.prepare('INSERT INTO assignments (title, course_id, description, deadline, file_path) VALUES (?, ?, ?, ?, ?)').run(title, course_id, description, deadline, file_path);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/assignments/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM assignments WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/assignments/:id', (req, res) => {
    const { title, course_id, description, deadline, file_path } = req.body;
    try {
      db.prepare('UPDATE assignments SET title=?, course_id=?, description=?, deadline=?, file_path=? WHERE id=?')
        .run(title, course_id, description, deadline, file_path, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Submissions API
  app.get('/api/submissions', (req, res) => {
    const submissions = db.prepare(`
      SELECT s.*, a.title as assignment_title, st.name as student_name 
      FROM submissions s 
      JOIN assignments a ON s.assignment_id = a.id 
      JOIN students st ON s.student_id = st.id
    `).all();
    res.json(submissions);
  });

  app.post('/api/submissions', (req, res) => {
    const { assignment_id, student_id, submission_date, file_name } = req.body;
    try {
      db.prepare('INSERT INTO submissions (assignment_id, student_id, submission_date, file_name) VALUES (?, ?, ?, ?)').run(assignment_id, student_id, submission_date, file_name);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Announcements API
  app.get('/api/announcements', (req, res) => {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY date DESC').all();
    res.json(announcements);
  });

  app.post('/api/announcements', (req, res) => {
    const { title, message, date } = req.body;
    try {
      db.prepare('INSERT INTO announcements (title, message, date) VALUES (?, ?, ?)').run(title, message, date);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/announcements/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/announcements/:id', (req, res) => {
    const { title, message, date } = req.body;
    try {
      db.prepare('UPDATE announcements SET title=?, message=?, date=? WHERE id=?')
        .run(title, message, date, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Timetable API
  app.get('/api/timetable', (req, res) => {
    const timetable = db.prepare('SELECT * FROM timetable').all();
    res.json(timetable);
  });

  app.post('/api/timetable', (req, res) => {
    const { course_name, teacher, day, time, classroom } = req.body;
    try {
      db.prepare('INSERT INTO timetable (course_name, teacher, day, time, classroom) VALUES (?, ?, ?, ?, ?)').run(course_name, teacher, day, time, classroom);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.delete('/api/timetable/:id', (req, res) => {
    try {
      db.prepare('DELETE FROM timetable WHERE id = ?').run(req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  app.put('/api/timetable/:id', (req, res) => {
    const { course_name, teacher, day, time, classroom } = req.body;
    try {
      db.prepare('UPDATE timetable SET course_name=?, teacher=?, day=?, time=?, classroom=? WHERE id=?')
        .run(course_name, teacher, day, time, classroom, req.params.id);
      res.json({ success: true });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
