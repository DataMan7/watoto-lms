import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import {
  Search,
  Person,
} from '@mui/icons-material';

const StudentsPage = () => {
  const students = [
    // Grade 7 Students
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@school.edu',
      grade: 7,
      courses: ['Digital Arts', 'Python Programming'],
      progress: 78,
      status: 'Active',
      avatar: 'A',
    },
    {
      id: 2,
      name: 'Charlie Brown',
      email: 'charlie.brown@school.edu',
      grade: 7,
      courses: ['Music Basics', 'Digital Arts'],
      progress: 92,
      status: 'Active',
      avatar: 'C',
    },
    {
      id: 3,
      name: 'David Wilson',
      email: 'david.wilson@school.edu',
      grade: 7,
      courses: ['Python Programming', 'Music Basics'],
      progress: 85,
      status: 'Active',
      avatar: 'D',
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.davis@school.edu',
      grade: 7,
      courses: ['Digital Arts', 'Python Programming'],
      progress: 73,
      status: 'Active',
      avatar: 'E',
    },
    {
      id: 5,
      name: 'Frank Miller',
      email: 'frank.miller@school.edu',
      grade: 7,
      courses: ['Music Basics', 'Digital Arts'],
      progress: 88,
      status: 'Active',
      avatar: 'F',
    },
    {
      id: 6,
      name: 'Grace Lee',
      email: 'grace.lee@school.edu',
      grade: 7,
      courses: ['Python Programming', 'Digital Arts'],
      progress: 91,
      status: 'Active',
      avatar: 'G',
    },
    {
      id: 7,
      name: 'Henry Taylor',
      email: 'henry.taylor@school.edu',
      grade: 7,
      courses: ['Music Basics', 'Python Programming'],
      progress: 76,
      status: 'Active',
      avatar: 'H',
    },
    {
      id: 8,
      name: 'Isabella Garcia',
      email: 'isabella.garcia@school.edu',
      grade: 7,
      courses: ['Digital Arts', 'Music Basics'],
      progress: 84,
      status: 'Active',
      avatar: 'I',
    },

    // Grade 8 Students
    {
      id: 9,
      name: 'Bob Smith',
      email: 'bob.smith@school.edu',
      grade: 8,
      courses: ['Advanced Digital Design', 'Music Composition'],
      progress: 85,
      status: 'Active',
      avatar: 'B',
    },
    {
      id: 10,
      name: 'Jack Anderson',
      email: 'jack.anderson@school.edu',
      grade: 8,
      courses: ['Python Programming', 'Advanced Digital Design'],
      progress: 79,
      status: 'Active',
      avatar: 'J',
    },
    {
      id: 11,
      name: 'Karen White',
      email: 'karen.white@school.edu',
      grade: 8,
      courses: ['Music Composition', 'Python Programming'],
      progress: 87,
      status: 'Active',
      avatar: 'K',
    },
    {
      id: 12,
      name: 'Liam Martinez',
      email: 'liam.martinez@school.edu',
      grade: 8,
      courses: ['Advanced Digital Design', 'Music Composition'],
      progress: 82,
      status: 'Active',
      avatar: 'L',
    },
    {
      id: 13,
      name: 'Mia Thompson',
      email: 'mia.thompson@school.edu',
      grade: 8,
      courses: ['Python Programming', 'Advanced Digital Design'],
      progress: 90,
      status: 'Active',
      avatar: 'M',
    },
    {
      id: 14,
      name: 'Noah Rodriguez',
      email: 'noah.rodriguez@school.edu',
      grade: 8,
      courses: ['Music Composition', 'Python Programming'],
      progress: 75,
      status: 'Active',
      avatar: 'N',
    },
    {
      id: 15,
      name: 'Olivia Lopez',
      email: 'olivia.lopez@school.edu',
      grade: 8,
      courses: ['Advanced Digital Design', 'Music Composition'],
      progress: 88,
      status: 'Active',
      avatar: 'O',
    },
    {
      id: 16,
      name: 'Parker Gonzalez',
      email: 'parker.gonzalez@school.edu',
      grade: 8,
      courses: ['Python Programming', 'Advanced Digital Design'],
      progress: 81,
      status: 'Active',
      avatar: 'P',
    },

    // Grade 9 Students
    {
      id: 17,
      name: 'Diana Wilson',
      email: 'diana.wilson@school.edu',
      grade: 9,
      courses: ['Python Web Development', 'Advanced Music Theory'],
      progress: 67,
      status: 'Active',
      avatar: 'D',
    },
    {
      id: 18,
      name: 'Quinn Harris',
      email: 'quinn.harris@school.edu',
      grade: 9,
      courses: ['Python Game Development', 'Python Web Development'],
      progress: 72,
      status: 'Active',
      avatar: 'Q',
    },
    {
      id: 19,
      name: 'Riley Clark',
      email: 'riley.clark@school.edu',
      grade: 9,
      courses: ['Advanced Music Theory', 'Python Game Development'],
      progress: 85,
      status: 'Active',
      avatar: 'R',
    },
    {
      id: 20,
      name: 'Sophia Lewis',
      email: 'sophia.lewis@school.edu',
      grade: 9,
      courses: ['Python Web Development', 'Advanced Music Theory'],
      progress: 79,
      status: 'Active',
      avatar: 'S',
    },
    {
      id: 21,
      name: 'Tyler Young',
      email: 'tyler.young@school.edu',
      grade: 9,
      courses: ['Python Game Development', 'Python Web Development'],
      progress: 83,
      status: 'Active',
      avatar: 'T',
    },
    {
      id: 22,
      name: 'Victoria King',
      email: 'victoria.king@school.edu',
      grade: 9,
      courses: ['Advanced Music Theory', 'Python Game Development'],
      progress: 76,
      status: 'Active',
      avatar: 'V',
    },
    {
      id: 23,
      name: 'William Wright',
      email: 'william.wright@school.edu',
      grade: 9,
      courses: ['Python Web Development', 'Advanced Music Theory'],
      progress: 89,
      status: 'Active',
      avatar: 'W',
    },
    {
      id: 24,
      name: 'Xavier Hill',
      email: 'xavier.hill@school.edu',
      grade: 9,
      courses: ['Python Game Development', 'Python Web Development'],
      progress: 74,
      status: 'Active',
      avatar: 'X',
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedGrade, setSelectedGrade] = React.useState('All');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || student.grade === parseInt(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  const grades = ['All', ...new Set(students.map(student => student.grade.toString()))];

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'success';
    if (progress >= 70) return 'primary';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Students
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage student information, track progress, and monitor engagement
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <TextField
          select
          label="Grade"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          SelectProps={{
            native: true,
          }}
          sx={{ minWidth: 150 }}
        >
          {grades.map((grade) => (
            <option key={grade} value={grade}>
              {grade === 'All' ? 'All Grades' : `Grade ${grade}`}
            </option>
          ))}
        </TextField>

        <Button
          variant="contained"
          sx={{ ml: 'auto' }}
        >
          Add Student
        </Button>
      </Box>

      {/* Student Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h5">
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Students
              </Typography>
              <Typography variant="h5">
                {students.filter(student => student.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Progress
              </Typography>
              <Typography variant="h5">
                {Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Grades Covered
              </Typography>
              <Typography variant="h5">
                {new Set(students.map(student => student.grade)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Students Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Courses</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: '#1976d2' }}>
                      {student.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {student.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`Grade ${student.grade}`}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {student.courses.map((course, index) => (
                      <Chip
                        key={index}
                        label={course}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {student.progress}%
                    </Typography>
                    <Chip
                      label={student.progress >= 90 ? 'Excellent' :
                             student.progress >= 70 ? 'Good' :
                             student.progress >= 50 ? 'Average' : 'Needs Help'}
                      color={getProgressColor(student.progress)}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={student.status}
                    color={student.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    View Profile
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredStudents.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="textSecondary">
            No students found matching your search criteria
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Try adjusting your search terms or grade filter
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default StudentsPage;