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
      name: 'Bob Smith',
      email: 'bob.smith@school.edu',
      grade: 8,
      courses: ['Advanced Digital Design', 'Music Composition'],
      progress: 85,
      status: 'Active',
      avatar: 'B',
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie.brown@school.edu',
      grade: 7,
      courses: ['Music Basics', 'Digital Arts'],
      progress: 92,
      status: 'Active',
      avatar: 'C',
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