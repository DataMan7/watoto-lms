import React, { useState, useRef } from 'react';
import ExcalidrawCanvas from './ExcalidrawCanvas';
import './TeacherCourseCreator.css';

const TeacherCourseCreator = ({ onSaveCourse, onPublishCourse }) => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    subject: 'math',
    grade: 7,
    duration: '',
    objectives: [''],
    materials: [''],
    curriculum: {
      methodology: '',
      weeklyModules: [{ title: '', description: '', duration: '' }],
      finalProject: '',
      skills: ['']
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [diagrams, setDiagrams] = useState([]);
  const [activeDiagram, setActiveDiagram] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const subjects = [
    { value: 'math', label: 'Mathematics', icon: '📐' },
    { value: 'english', label: 'English', icon: '📚' },
    { value: 'kishwahili', label: 'Kishwahili', icon: '🗣️' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'biology', label: 'Biology', icon: '🧬' },
    { value: 'chemistry', label: 'Chemistry', icon: '⚗️' },
    { value: 'physics', label: 'Physics', icon: '⚛️' },
    { value: 'history', label: 'History', icon: '📜' },
    { value: 'geography', label: 'Geography', icon: '🌍' },
    { value: 'art', label: 'Art', icon: '🎨' },
    { value: 'music', label: 'Music', icon: '🎵' }
  ];

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCurriculumChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        [field]: value
      }
    }));
  };

  const addObjective = () => {
    setCourseData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const updateObjective = (index, value) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeObjective = (index) => {
    setCourseData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const addModule = () => {
    setCourseData(prev => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        weeklyModules: [
          ...prev.curriculum.weeklyModules,
          { title: '', description: '', duration: '' }
        ]
      }
    }));
  };

  const updateModule = (index, field, value) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        weeklyModules: prev.curriculum.weeklyModules.map((module, i) =>
          i === index ? { ...module, [field]: value } : module
        )
      }
    }));
  };

  const removeModule = (index) => {
    setCourseData(prev => ({
      ...prev,
      curriculum: {
        ...prev.curriculum,
        weeklyModules: prev.curriculum.weeklyModules.filter((_, i) => i !== index)
      }
    }));
  };

  const createNewDiagram = () => {
    const newDiagram = {
      id: Date.now().toString(),
      title: `Diagram ${diagrams.length + 1}`,
      subject: courseData.subject,
      elements: [],
      createdAt: new Date().toISOString()
    };
    setDiagrams(prev => [...prev, newDiagram]);
    setActiveDiagram(newDiagram.id);
  };

  const handleDiagramSave = (diagramId, diagramData) => {
    setDiagrams(prev => prev.map(diagram =>
      diagram.id === diagramId
        ? { ...diagram, ...diagramData, updatedAt: new Date().toISOString() }
        : diagram
    ));
  };

  const handleSaveCourse = async () => {
    const completeCourseData = {
      ...courseData,
      diagrams,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    try {
      await onSaveCourse(completeCourseData);
      alert('Course saved successfully!');
    } catch (error) {
      alert('Error saving course: ' + error.message);
    }
  };

  const handlePublishCourse = async () => {
    const completeCourseData = {
      ...courseData,
      diagrams,
      publishedAt: new Date().toISOString(),
      status: 'published'
    };

    try {
      await onPublishCourse(completeCourseData);
      alert('Course published successfully!');
    } catch (error) {
      alert('Error publishing course: ' + error.message);
    }
  };

  const renderStep1 = () => (
    <div className="course-creator-step">
      <h3>Course Basic Information</h3>

      <div className="form-group">
        <label>Course Title</label>
        <input
          type="text"
          value={courseData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter course title"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={courseData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe what students will learn"
          rows={4}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Subject</label>
          <select
            value={courseData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
          >
            {subjects.map(subject => (
              <option key={subject.value} value={subject.value}>
                {subject.icon} {subject.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Grade Level</label>
          <select
            value={courseData.grade}
            onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
          >
            {[7, 8, 9].map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Duration</label>
          <input
            type="text"
            value={courseData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="e.g., 3 months"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="course-creator-step">
      <h3>Learning Objectives</h3>

      {courseData.objectives.map((objective, index) => (
        <div key={index} className="objective-item">
          <input
            type="text"
            value={objective}
            onChange={(e) => updateObjective(index, e.target.value)}
            placeholder={`Learning objective ${index + 1}`}
          />
          {courseData.objectives.length > 1 && (
            <button
              type="button"
              onClick={() => removeObjective(index)}
              className="remove-btn"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addObjective} className="add-btn">
        + Add Learning Objective
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="course-creator-step">
      <h3>Curriculum Structure</h3>

      <div className="form-group">
        <label>Teaching Methodology</label>
        <select
          value={courseData.curriculum.methodology}
          onChange={(e) => handleCurriculumChange('methodology', e.target.value)}
        >
          <option value="">Select methodology</option>
          <option value="project-based">Project-Based Learning</option>
          <option value="problem-based">Problem-Based Learning</option>
          <option value="experiential">Experiential Learning</option>
          <option value="collaborative">Collaborative Learning</option>
          <option value="direct-instruction">Direct Instruction</option>
        </select>
      </div>

      <h4>Weekly Modules</h4>
      {courseData.curriculum.weeklyModules.map((module, index) => (
        <div key={index} className="module-item">
          <div className="module-header">
            <h5>Week {index + 1}</h5>
            {courseData.curriculum.weeklyModules.length > 1 && (
              <button
                type="button"
                onClick={() => removeModule(index)}
                className="remove-btn"
              >
                ✕
              </button>
            )}
          </div>

          <div className="form-row">
            <input
              type="text"
              value={module.title}
              onChange={(e) => updateModule(index, 'title', e.target.value)}
              placeholder="Module title"
            />
            <input
              type="text"
              value={module.duration}
              onChange={(e) => updateModule(index, 'duration', e.target.value)}
              placeholder="Duration (e.g., 2 hours)"
            />
          </div>

          <textarea
            value={module.description}
            onChange={(e) => updateModule(index, 'description', e.target.value)}
            placeholder="Module description and learning activities"
            rows={3}
          />
        </div>
      ))}

      <button type="button" onClick={addModule} className="add-btn">
        + Add Module
      </button>

      <div className="form-group">
        <label>Final Project</label>
        <textarea
          value={courseData.curriculum.finalProject}
          onChange={(e) => handleCurriculumChange('finalProject', e.target.value)}
          placeholder="Describe the final project or assessment"
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="course-creator-step">
      <h3>Visual Content Creation</h3>

      <div className="diagram-controls">
        <button onClick={createNewDiagram} className="create-diagram-btn">
          + Create New Diagram
        </button>

        <div className="diagram-list">
          {diagrams.map(diagram => (
            <div
              key={diagram.id}
              className={`diagram-item ${activeDiagram === diagram.id ? 'active' : ''}`}
              onClick={() => setActiveDiagram(diagram.id)}
            >
              <span className="diagram-title">{diagram.title}</span>
              <span className="diagram-subject">{diagram.subject}</span>
            </div>
          ))}
        </div>
      </div>

      {activeDiagram && (
        <div className="diagram-editor">
          <ExcalidrawCanvas
            subject={courseData.subject}
            onSave={(data) => handleDiagramSave(activeDiagram, data)}
            theme="light"
            showTemplates={true}
          />
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="course-preview">
      <h2>{courseData.title}</h2>
      <p className="course-description">{courseData.description}</p>

      <div className="course-meta">
        <span className="subject">{courseData.subject}</span>
        <span className="grade">Grade {courseData.grade}</span>
        <span className="duration">{courseData.duration}</span>
      </div>

      <div className="course-content">
        <h3>Learning Objectives</h3>
        <ul>
          {courseData.objectives.filter(obj => obj.trim()).map((obj, index) => (
            <li key={index}>{obj}</li>
          ))}
        </ul>

        <h3>Curriculum</h3>
        <p><strong>Methodology:</strong> {courseData.curriculum.methodology}</p>

        <h4>Weekly Modules</h4>
        {courseData.curriculum.weeklyModules.map((module, index) => (
          <div key={index} className="module-preview">
            <h5>Week {index + 1}: {module.title}</h5>
            <p>{module.description}</p>
            <p><em>Duration: {module.duration}</em></p>
          </div>
        ))}

        <h4>Final Project</h4>
        <p>{courseData.curriculum.finalProject}</p>

        <h3>Visual Content</h3>
        <p>{diagrams.length} diagram{diagrams.length !== 1 ? 's' : ''} created</p>
      </div>
    </div>
  );

  const steps = [
    { id: 1, title: 'Basic Info', component: renderStep1 },
    { id: 2, title: 'Objectives', component: renderStep2 },
    { id: 3, title: 'Curriculum', component: renderStep3 },
    { id: 4, title: 'Visual Content', component: renderStep4 }
  ];

  return (
    <div className="teacher-course-creator">
      <div className="creator-header">
        <h1>Create New Course</h1>
        <div className="header-actions">
          <button onClick={() => setShowPreview(!showPreview)} className="preview-btn">
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button onClick={handleSaveCourse} className="save-btn">
            Save Draft
          </button>
          <button onClick={handlePublishCourse} className="publish-btn">
            Publish Course
          </button>
        </div>
      </div>

      <div className="creator-content">
        <div className="step-navigation">
          {steps.map(step => (
            <button
              key={step.id}
              className={`step-btn ${currentStep === step.id ? 'active' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              {step.title}
            </button>
          ))}
        </div>

        <div className="step-content">
          {showPreview ? renderPreview() : steps[currentStep - 1].component()}
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseCreator;