import React, { useEffect, useRef, useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { exportToCanvas } from '@excalidraw/excalidraw';
import './ExcalidrawCanvas.css';

const ExcalidrawCanvas = ({
  initialData = null,
  onChange = () => {},
  onSave = () => {},
  readOnly = false,
  theme = 'light',
  subject = 'general',
  showTemplates = true,
  collaborationEnabled = false,
  onCollaborationUpdate = () => {}
}) => {
  const excalidrawRef = useRef(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Subject-specific templates
  const subjectTemplates = {
    math: [
      {
        name: 'Coordinate Plane',
        elements: [
          // Grid lines for coordinate plane
          { type: 'line', x: 100, y: 200, width: 400, height: 0, strokeColor: '#ccc' },
          { type: 'line', x: 300, y: 0, width: 0, height: 400, strokeColor: '#ccc' },
          // Labels
          { type: 'text', x: 310, y: 190, text: 'x', fontSize: 16 },
          { type: 'text', x: 290, y: 10, text: 'y', fontSize: 16 }
        ]
      },
      {
        name: 'Geometry Shapes',
        elements: [
          { type: 'rectangle', x: 100, y: 100, width: 100, height: 100, strokeColor: '#1976d2' },
          { type: 'ellipse', x: 250, y: 100, width: 100, height: 100, strokeColor: '#388e3c' },
          { type: 'triangle', x: 400, y: 100, points: [[0,100],[50,0],[100,100]], strokeColor: '#f57c00' }
        ]
      }
    ],
    science: [
      {
        name: 'Lab Equipment',
        elements: [
          { type: 'ellipse', x: 100, y: 100, width: 60, height: 40, strokeColor: '#2196f3' }, // Beaker
          { type: 'rectangle', x: 200, y: 120, width: 80, height: 20, strokeColor: '#4caf50' }, // Test tube
          { type: 'line', x: 300, y: 100, width: 0, height: 60, strokeColor: '#ff9800' } // Thermometer
        ]
      },
      {
        name: 'Cell Structure',
        elements: [
          { type: 'ellipse', x: 200, y: 150, width: 120, height: 120, strokeColor: '#4caf50' }, // Cell membrane
          { type: 'ellipse', x: 220, y: 170, width: 80, height: 80, strokeColor: '#2196f3' }, // Nucleus
          { type: 'text', x: 240, y: 200, text: 'Nucleus', fontSize: 12 }
        ]
      }
    ],
    english: [
      {
        name: 'Story Map',
        elements: [
          { type: 'rectangle', x: 100, y: 100, width: 150, height: 80, strokeColor: '#2196f3' },
          { type: 'text', x: 120, y: 130, text: 'Beginning', fontSize: 14 },
          { type: 'rectangle', x: 300, y: 100, width: 150, height: 80, strokeColor: '#4caf50' },
          { type: 'text', x: 330, y: 130, text: 'Middle', fontSize: 14 },
          { type: 'rectangle', x: 500, y: 100, width: 150, height: 80, strokeColor: '#ff9800' },
          { type: 'text', x: 540, y: 130, text: 'End', fontSize: 14 }
        ]
      }
    ]
  };

  useEffect(() => {
    if (excalidrawAPI && initialData) {
      excalidrawAPI.updateScene(initialData);
    }
  }, [excalidrawAPI, initialData]);

  const handleChange = (elements, appState) => {
    onChange(elements, appState);

    // Auto-save functionality
    if (elements.length > 0) {
      const saveData = {
        elements,
        appState,
        timestamp: new Date().toISOString()
      };
      onSave(saveData);
    }
  };

  const loadTemplate = (templateName) => {
    const templates = subjectTemplates[subject] || [];
    const template = templates.find(t => t.name === templateName);

    if (template && excalidrawAPI) {
      excalidrawAPI.updateScene({
        elements: template.elements,
        appState: { viewBackgroundColor: '#ffffff' }
      });
    }
  };

  const exportCanvas = async () => {
    if (!excalidrawAPI) return null;

    try {
      const canvas = await exportToCanvas({
        elements: excalidrawAPI.getSceneElements(),
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles()
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Export failed:', error);
      return null;
    }
  };

  const renderCustomUI = () => {
    if (!showTemplates) return null;

    const templates = subjectTemplates[subject] || [];

    return (
      <div className="excalidraw-templates">
        <h4>Subject Templates</h4>
        <div className="template-buttons">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => loadTemplate(template.name)}
              className="template-btn"
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCollaborationUI = () => {
    if (!collaborationEnabled) return null;

    return (
      <div className="collaboration-panel">
        <h4>Live Collaboration</h4>
        <div className="collaborators">
          {/* Collaborator avatars would go here */}
          <div className="collaborator-count">3 active collaborators</div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="excalidraw-loading">
        <div className="loading-spinner"></div>
        <p>Loading Excalidraw...</p>
      </div>
    );
  }

  return (
    <div className="excalidraw-container">
      <div className="excalidraw-sidebar">
        {renderCustomUI()}
        {renderCollaborationUI()}
      </div>

      <div className="excalidraw-canvas">
        <Excalidraw
          ref={excalidrawRef}
          initialData={initialData}
          onChange={handleChange}
          theme={theme}
          viewModeEnabled={readOnly}
          UIOptions={{
            canvasActions: {
              loadScene: false,
              saveScene: false,
              export: !readOnly
            }
          }}
          onPointerUpdate={(payload) => {
            if (collaborationEnabled) {
              onCollaborationUpdate(payload);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExcalidrawCanvas;