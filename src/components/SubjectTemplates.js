import React, { useState } from 'react';
import './SubjectTemplates.css';

const SubjectTemplates = ({ subject, onSelectTemplate, onCreateCustom }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = {
    math: {
      coordinate_plane: {
        name: 'Coordinate Plane',
        description: 'Interactive coordinate grid for plotting points and functions',
        category: 'geometry',
        difficulty: 'beginner',
        elements: [
          { type: 'line', x: 100, y: 200, width: 400, height: 0, strokeColor: '#666' },
          { type: 'line', x: 300, y: 0, width: 0, height: 400, strokeColor: '#666' },
          { type: 'text', x: 310, y: 190, text: 'x', fontSize: 16 },
          { type: 'text', x: 290, y: 10, text: 'y', fontSize: 16 }
        ]
      },
      geometry_shapes: {
        name: 'Geometry Shapes',
        description: 'Common geometric shapes for area and perimeter calculations',
        category: 'geometry',
        difficulty: 'beginner',
        elements: [
          { type: 'rectangle', x: 100, y: 100, width: 100, height: 80, strokeColor: '#2196f3' },
          { type: 'ellipse', x: 250, y: 100, width: 100, height: 80, strokeColor: '#4caf50' },
          { type: 'triangle', x: 400, y: 100, points: [[0,80],[50,0],[100,80]], strokeColor: '#ff9800' },
          { type: 'text', x: 120, y: 200, text: 'Rectangle: Area = l × w', fontSize: 12 },
          { type: 'text', x: 270, y: 200, text: 'Circle: Area = πr²', fontSize: 12 }
        ]
      },
      algebra_equations: {
        name: 'Algebra Equations',
        description: 'Visual representation of algebraic equations and inequalities',
        category: 'algebra',
        difficulty: 'intermediate',
        elements: [
          { type: 'text', x: 100, y: 100, text: '2x + 3 = 7', fontSize: 20 },
          { type: 'text', x: 100, y: 140, text: '2x = 4', fontSize: 18 },
          { type: 'text', x: 100, y: 170, text: 'x = 2', fontSize: 18 },
          { type: 'arrow', x: 200, y: 120, start: { id: 'eq1' }, end: { id: 'eq2' } }
        ]
      },
      statistics_charts: {
        name: 'Statistics Charts',
        description: 'Bar charts and graphs for data visualization',
        category: 'statistics',
        difficulty: 'intermediate',
        elements: [
          { type: 'rectangle', x: 100, y: 300, width: 40, height: 80, strokeColor: '#2196f3' },
          { type: 'rectangle', x: 160, y: 280, width: 40, height: 100, strokeColor: '#4caf50' },
          { type: 'rectangle', x: 220, y: 320, width: 40, height: 60, strokeColor: '#ff9800' },
          { type: 'text', x: 110, y: 400, text: 'A', fontSize: 14 },
          { type: 'text', x: 170, y: 400, text: 'B', fontSize: 14 },
          { type: 'text', x: 230, y: 400, text: 'C', fontSize: 14 }
        ]
      }
    },
    science: {
      lab_equipment: {
        name: 'Lab Equipment',
        description: 'Common laboratory equipment and their uses',
        category: 'biology',
        difficulty: 'beginner',
        elements: [
          { type: 'ellipse', x: 100, y: 100, width: 60, height: 40, strokeColor: '#2196f3' },
          { type: 'text', x: 100, y: 160, text: 'Beaker', fontSize: 12 },
          { type: 'rectangle', x: 200, y: 120, width: 80, height: 20, strokeColor: '#4caf50' },
          { type: 'text', x: 200, y: 160, text: 'Test Tube', fontSize: 12 },
          { type: 'line', x: 320, y: 100, width: 0, height: 60, strokeColor: '#ff9800' },
          { type: 'text', x: 300, y: 180, text: 'Thermometer', fontSize: 12 }
        ]
      },
      cell_structure: {
        name: 'Cell Structure',
        description: 'Plant and animal cell components',
        category: 'biology',
        difficulty: 'intermediate',
        elements: [
          { type: 'ellipse', x: 200, y: 150, width: 120, height: 100, strokeColor: '#4caf50' },
          { type: 'text', x: 220, y: 200, text: 'Cell Membrane', fontSize: 12 },
          { type: 'ellipse', x: 220, y: 170, width: 80, height: 60, strokeColor: '#2196f3' },
          { type: 'text', x: 240, y: 200, text: 'Nucleus', fontSize: 12 },
          { type: 'ellipse', x: 240, y: 180, width: 20, height: 20, strokeColor: '#ff9800' },
          { type: 'text', x: 250, y: 210, text: 'DNA', fontSize: 10 }
        ]
      },
      periodic_table: {
        name: 'Periodic Table Section',
        description: 'Elements and their properties',
        category: 'chemistry',
        difficulty: 'intermediate',
        elements: [
          { type: 'rectangle', x: 100, y: 100, width: 60, height: 60, strokeColor: '#2196f3' },
          { type: 'text', x: 115, y: 120, text: 'H', fontSize: 16, fontWeight: 'bold' },
          { type: 'text', x: 115, y: 135, text: '1', fontSize: 12 },
          { type: 'rectangle', x: 170, y: 100, width: 60, height: 60, strokeColor: '#4caf50' },
          { type: 'text', x: 185, y: 120, text: 'He', fontSize: 16, fontWeight: 'bold' },
          { type: 'text', x: 190, y: 135, text: '2', fontSize: 12 }
        ]
      },
      ecosystem_diagram: {
        name: 'Ecosystem Diagram',
        description: 'Food chains and energy flow',
        category: 'biology',
        difficulty: 'advanced',
        elements: [
          { type: 'ellipse', x: 100, y: 150, width: 80, height: 40, strokeColor: '#4caf50' },
          { type: 'text', x: 110, y: 170, text: 'Producer', fontSize: 12 },
          { type: 'ellipse', x: 220, y: 150, width: 80, height: 40, strokeColor: '#ff9800' },
          { type: 'text', x: 235, y: 170, text: 'Consumer', fontSize: 12 },
          { type: 'arrow', x: 180, y: 170, start: { id: 'producer' }, end: { id: 'consumer' } },
          { type: 'text', x: 190, y: 140, text: 'Energy Flow', fontSize: 10 }
        ]
      }
    },
    english: {
      story_map: {
        name: 'Story Map',
        description: 'Visual story structure and plot development',
        category: 'literature',
        difficulty: 'beginner',
        elements: [
          { type: 'rectangle', x: 100, y: 100, width: 150, height: 80, strokeColor: '#2196f3' },
          { type: 'text', x: 130, y: 130, text: 'Beginning', fontSize: 14 },
          { type: 'text', x: 120, y: 150, text: 'Setting & Characters', fontSize: 12 },
          { type: 'rectangle', x: 300, y: 100, width: 150, height: 80, strokeColor: '#4caf50' },
          { type: 'text', x: 340, y: 130, text: 'Middle', fontSize: 14 },
          { type: 'text', x: 330, y: 150, text: 'Conflict & Events', fontSize: 12 },
          { type: 'rectangle', x: 500, y: 100, width: 150, height: 80, strokeColor: '#ff9800' },
          { type: 'text', x: 545, y: 130, text: 'End', fontSize: 14 },
          { type: 'text', x: 535, y: 150, text: 'Resolution', fontSize: 12 }
        ]
      },
      character_web: {
        name: 'Character Web',
        description: 'Character relationships and traits',
        category: 'literature',
        difficulty: 'intermediate',
        elements: [
          { type: 'ellipse', x: 250, y: 150, width: 100, height: 60, strokeColor: '#2196f3' },
          { type: 'text', x: 270, y: 170, text: 'Main Character', fontSize: 12 },
          { type: 'ellipse', x: 150, y: 100, width: 80, height: 50, strokeColor: '#4caf50' },
          { type: 'text', x: 165, y: 120, text: 'Friend', fontSize: 12 },
          { type: 'ellipse', x: 350, y: 100, width: 80, height: 50, strokeColor: '#ff9800' },
          { type: 'text', x: 370, y: 120, text: 'Antagonist', fontSize: 12 },
          { type: 'line', x: 200, y: 130, width: 100, height: 40, strokeColor: '#666' },
          { type: 'line', x: 300, y: 130, width: 100, height: 40, strokeColor: '#666' }
        ]
      },
      grammar_diagram: {
        name: 'Sentence Diagram',
        description: 'Visual sentence structure analysis',
        category: 'grammar',
        difficulty: 'intermediate',
        elements: [
          { type: 'line', x: 100, y: 200, width: 400, height: 0, strokeColor: '#666' },
          { type: 'text', x: 150, y: 180, text: 'Subject', fontSize: 14 },
          { type: 'text', x: 350, y: 180, text: 'Predicate', fontSize: 14 },
          { type: 'line', x: 200, y: 200, width: 0, height: 60, strokeColor: '#666' },
          { type: 'text', x: 180, y: 230, text: 'Noun', fontSize: 12 },
          { type: 'text', x: 320, y: 230, text: 'Verb', fontSize: 12 }
        ]
      }
    },
    geography: {
      world_map: {
        name: 'World Map Outline',
        description: 'Continents and major geographical features',
        category: 'physical',
        difficulty: 'beginner',
        elements: [
          { type: 'ellipse', x: 200, y: 150, width: 300, height: 200, strokeColor: '#2196f3' },
          { type: 'text', x: 300, y: 200, text: 'Africa', fontSize: 16 },
          { type: 'ellipse', x: 100, y: 100, width: 150, height: 100, strokeColor: '#4caf50' },
          { type: 'text', x: 150, y: 140, text: 'Europe', fontSize: 14 },
          { type: 'ellipse', x: 400, y: 100, width: 180, height: 120, strokeColor: '#ff9800' },
          { type: 'text', x: 450, y: 140, text: 'Asia', fontSize: 14 }
        ]
      },
      climate_zones: {
        name: 'Climate Zones',
        description: 'Global climate patterns and zones',
        category: 'physical',
        difficulty: 'intermediate',
        elements: [
          { type: 'rectangle', x: 100, y: 100, width: 400, height: 50, fillColor: '#fff3cd', strokeColor: '#ffc107' },
          { type: 'text', x: 250, y: 125, text: 'Tropical Zone', fontSize: 14 },
          { type: 'rectangle', x: 100, y: 170, width: 400, height: 50, fillColor: '#d1ecf1', strokeColor: '#17a2b8' },
          { type: 'text', x: 250, y: 195, text: 'Temperate Zone', fontSize: 14 },
          { type: 'rectangle', x: 100, y: 240, width: 400, height: 50, fillColor: '#f8f9fa', strokeColor: '#6c757d' },
          { type: 'text', x: 250, y: 265, text: 'Polar Zone', fontSize: 14 }
        ]
      }
    },
    history: {
      timeline: {
        name: 'Historical Timeline',
        description: 'Chronological events and periods',
        category: 'chronology',
        difficulty: 'beginner',
        elements: [
          { type: 'line', x: 100, y: 200, width: 400, height: 0, strokeColor: '#666' },
          { type: 'ellipse', x: 150, y: 190, width: 20, height: 20, strokeColor: '#2196f3' },
          { type: 'text', x: 180, y: 185, text: 'Event 1', fontSize: 12 },
          { type: 'ellipse', x: 250, y: 190, width: 20, height: 20, strokeColor: '#4caf50' },
          { type: 'text', x: 280, y: 185, text: 'Event 2', fontSize: 12 },
          { type: 'ellipse', x: 350, y: 190, width: 20, height: 20, strokeColor: '#ff9800' },
          { type: 'text', x: 380, y: 185, text: 'Event 3', fontSize: 12 }
        ]
      },
      cause_effect: {
        name: 'Cause and Effect',
        description: 'Historical cause and effect relationships',
        category: 'analysis',
        difficulty: 'intermediate',
        elements: [
          { type: 'rectangle', x: 100, y: 150, width: 120, height: 60, strokeColor: '#2196f3' },
          { type: 'text', x: 120, y: 170, text: 'Cause', fontSize: 14 },
          { type: 'arrow', x: 220, y: 180, start: { id: 'cause' }, end: { id: 'effect' } },
          { type: 'rectangle', x: 280, y: 150, width: 120, height: 60, strokeColor: '#4caf50' },
          { type: 'text', x: 300, y: 170, text: 'Effect', fontSize: 14 }
        ]
      }
    },
    art: {
      color_wheel: {
        name: 'Color Wheel',
        description: 'Color theory and relationships',
        category: 'theory',
        difficulty: 'beginner',
        elements: [
          { type: 'ellipse', x: 200, y: 150, width: 150, height: 150, strokeColor: '#666' },
          { type: 'text', x: 250, y: 140, text: 'Primary', fontSize: 12 },
          { type: 'text', x: 250, y: 155, text: 'Colors', fontSize: 12 },
          { type: 'text', x: 200, y: 200, text: 'Secondary', fontSize: 12 },
          { type: 'text', x: 190, y: 215, text: 'Colors', fontSize: 12 }
        ]
      },
      composition_grid: {
        name: 'Composition Grid',
        description: 'Rule of thirds and composition guides',
        category: 'technique',
        difficulty: 'intermediate',
        elements: [
          { type: 'line', x: 200, y: 100, width: 0, height: 200, strokeColor: '#666', strokeStyle: 'dashed' },
          { type: 'line', x: 300, y: 100, width: 0, height: 200, strokeColor: '#666', strokeStyle: 'dashed' },
          { type: 'line', x: 100, y: 150, width: 300, height: 0, strokeColor: '#666', strokeStyle: 'dashed' },
          { type: 'line', x: 100, y: 200, width: 300, height: 0, strokeColor: '#666', strokeStyle: 'dashed' },
          { type: 'text', x: 180, y: 130, text: 'Rule of Thirds', fontSize: 14 }
        ]
      }
    },
    music: {
      staff_notation: {
        name: 'Music Staff',
        description: 'Musical notation and staff lines',
        category: 'theory',
        difficulty: 'beginner',
        elements: [
          { type: 'line', x: 100, y: 120, width: 300, height: 0, strokeColor: '#000' },
          { type: 'line', x: 100, y: 140, width: 300, height: 0, strokeColor: '#000' },
          { type: 'line', x: 100, y: 160, width: 300, height: 0, strokeColor: '#000' },
          { type: 'line', x: 100, y: 180, width: 300, height: 0, strokeColor: '#000' },
          { type: 'line', x: 100, y: 200, width: 300, height: 0, strokeColor: '#000' },
          { type: 'text', x: 120, y: 110, text: '♪', fontSize: 20 },
          { type: 'text', x: 160, y: 110, text: '♪', fontSize: 20 }
        ]
      },
      chord_progression: {
        name: 'Chord Progression',
        description: 'Visual representation of musical chords',
        category: 'harmony',
        difficulty: 'intermediate',
        elements: [
          { type: 'rectangle', x: 100, y: 150, width: 80, height: 60, strokeColor: '#2196f3' },
          { type: 'text', x: 120, y: 170, text: 'I', fontSize: 16 },
          { type: 'rectangle', x: 200, y: 150, width: 80, height: 60, strokeColor: '#4caf50' },
          { type: 'text', x: 225, y: 170, text: 'IV', fontSize: 16 },
          { type: 'rectangle', x: 300, y: 150, width: 80, height: 60, strokeColor: '#ff9800' },
          { type: 'text', x: 325, y: 170, text: 'V', fontSize: 16 },
          { type: 'text', x: 200, y: 230, text: 'Chord Progression', fontSize: 14 }
        ]
      }
    }
  };

  const categories = {
    all: 'All Templates',
    geometry: 'Geometry',
    algebra: 'Algebra',
    statistics: 'Statistics',
    biology: 'Biology',
    chemistry: 'Chemistry',
    literature: 'Literature',
    grammar: 'Grammar',
    physical: 'Physical Geography',
    chronology: 'Chronology',
    analysis: 'Analysis',
    theory: 'Theory',
    technique: 'Technique',
    harmony: 'Harmony'
  };

  const difficulties = {
    beginner: { label: 'Beginner', color: '#4caf50' },
    intermediate: { label: 'Intermediate', color: '#ff9800' },
    advanced: { label: 'Advanced', color: '#f44336' }
  };

  const subjectTemplates = templates[subject] || {};
  const filteredTemplates = selectedCategory === 'all'
    ? Object.values(subjectTemplates)
    : Object.values(subjectTemplates).filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
  };

  return (
    <div className="subject-templates">
      <div className="templates-header">
        <h3>Subject Templates</h3>
        <p>Choose from pre-built templates to get started quickly</p>
      </div>

      <div className="templates-filters">
        <div className="category-filter">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {Object.entries(categories).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="templates-grid">
        {filteredTemplates.map((template, index) => (
          <div
            key={index}
            className="template-card"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="template-header">
              <h4>{template.name}</h4>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: difficulties[template.difficulty].color }}
              >
                {difficulties[template.difficulty].label}
              </span>
            </div>
            <p className="template-description">{template.description}</p>
            <div className="template-meta">
              <span className="category">{categories[template.category]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="templates-actions">
        <button
          className="create-custom-btn"
          onClick={onCreateCustom}
        >
          + Create Custom Template
        </button>
      </div>
    </div>
  );
};

export default SubjectTemplates;