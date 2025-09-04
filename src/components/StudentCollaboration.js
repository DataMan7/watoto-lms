import React, { useState, useEffect, useRef } from 'react';
import ExcalidrawCanvas from './ExcalidrawCanvas';
import './StudentCollaboration.css';

const StudentCollaboration = ({
  sessionId,
  user,
  subject,
  onSaveWork,
  onSubmitAssignment
}) => {
  const [collaborators, setCollaborators] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTool, setCurrentTool] = useState('selection');
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(true);
  const [diagramData, setDiagramData] = useState(null);
  const [sessionInfo, setSessionInfo] = useState({
    title: 'Collaborative Session',
    description: 'Working together on diagrams',
    startTime: new Date(),
    participants: []
  });

  const wsRef = useRef(null);
  const chatInputRef = useRef(null);

  // WebSocket connection for real-time collaboration
  useEffect(() => {
    if (sessionId) {
      connectToSession();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId]);

  const connectToSession = () => {
    const wsUrl = `ws://localhost:8000/ws/session/${sessionId}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setIsConnected(true);
      // Send user info
      wsRef.current.send(JSON.stringify({
        type: 'join',
        user: user,
        timestamp: new Date().toISOString()
      }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      // Attempt to reconnect after 5 seconds
      setTimeout(connectToSession, 5000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'user_joined':
        setCollaborators(prev => [...prev, data.user]);
        addSystemMessage(`${data.user.name} joined the session`);
        break;

      case 'user_left':
        setCollaborators(prev => prev.filter(c => c.id !== data.userId));
        addSystemMessage(`${data.user.name} left the session`);
        break;

      case 'diagram_update':
        setDiagramData(data.diagramData);
        break;

      case 'chat_message':
        setMessages(prev => [...prev, {
          id: Date.now(),
          user: data.user,
          message: data.message,
          timestamp: new Date(data.timestamp),
          type: 'message'
        }]);
        break;

      case 'cursor_update':
        updateCollaboratorCursor(data.userId, data.cursor);
        break;

      default:
        break;
    }
  };

  const addSystemMessage = (message) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      message,
      timestamp: new Date(),
      type: 'system'
    }]);
  };

  const sendChatMessage = (message) => {
    if (!message.trim() || !wsRef.current) return;

    const chatData = {
      type: 'chat_message',
      user: user,
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    wsRef.current.send(JSON.stringify(chatData));

    // Add to local messages immediately for better UX
    setMessages(prev => [...prev, {
      id: Date.now(),
      user: user,
      message: message.trim(),
      timestamp: new Date(),
      type: 'message',
      isOwn: true
    }]);
  };

  const handleDiagramChange = (elements, appState) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const updateData = {
        type: 'diagram_update',
        user: user,
        diagramData: { elements, appState },
        timestamp: new Date().toISOString()
      };

      wsRef.current.send(JSON.stringify(updateData));
    }
  };

  const updateCollaboratorCursor = (userId, cursor) => {
    setCollaborators(prev => prev.map(collab =>
      collab.id === userId
        ? { ...collab, cursor, lastActive: new Date() }
        : collab
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = chatInputRef.current.value;
      if (message.trim()) {
        sendChatMessage(message);
        chatInputRef.current.value = '';
      }
    }
  };

  const saveWork = async () => {
    const workData = {
      sessionId,
      diagramData,
      collaborators: collaborators.map(c => c.id),
      messages: messages.filter(m => m.type === 'message'),
      savedAt: new Date().toISOString()
    };

    try {
      await onSaveWork(workData);
      addSystemMessage('Work saved successfully');
    } catch (error) {
      addSystemMessage('Error saving work: ' + error.message);
    }
  };

  const submitAssignment = async () => {
    const submissionData = {
      sessionId,
      diagramData,
      submittedAt: new Date().toISOString(),
      collaborators: collaborators.map(c => c.id)
    };

    try {
      await onSubmitAssignment(submissionData);
      addSystemMessage('Assignment submitted successfully');
    } catch (error) {
      addSystemMessage('Error submitting assignment: ' + error.message);
    }
  };

  const getConnectionStatus = () => {
    if (isConnected) {
      return { status: 'connected', color: '#4caf50', text: 'Connected' };
    } else {
      return { status: 'disconnected', color: '#f44336', text: 'Disconnected' };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="student-collaboration">
      {/* Header */}
      <div className="collaboration-header">
        <div className="session-info">
          <h2>{sessionInfo.title}</h2>
          <p>{sessionInfo.description}</p>
          <div className="session-meta">
            <span className="subject-badge">{subject}</span>
            <span className={`connection-status ${connectionStatus.status}`}>
              <div
                className="status-indicator"
                style={{ backgroundColor: connectionStatus.color }}
              ></div>
              {connectionStatus.text}
            </span>
          </div>
        </div>

        <div className="collaboration-actions">
          <button onClick={saveWork} className="save-btn">
            💾 Save Work
          </button>
          <button onClick={submitAssignment} className="submit-btn">
            📤 Submit Assignment
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`toggle-btn ${showChat ? 'active' : ''}`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`toggle-btn ${showParticipants ? 'active' : ''}`}
          >
            👥 Participants
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="collaboration-content">
        {/* Excalidraw Canvas */}
        <div className="canvas-container">
          <ExcalidrawCanvas
            initialData={diagramData}
            onChange={handleDiagramChange}
            subject={subject}
            theme="light"
            collaborationEnabled={true}
            onCollaborationUpdate={(payload) => {
              if (wsRef.current) {
                wsRef.current.send(JSON.stringify({
                  type: 'cursor_update',
                  user: user,
                  cursor: payload.pointer,
                  timestamp: new Date().toISOString()
                }));
              }
            }}
          />

          {/* Collaborator Cursors */}
          {collaborators.map(collab => (
            collab.cursor && (
              <div
                key={collab.id}
                className="collaborator-cursor"
                style={{
                  left: collab.cursor.x,
                  top: collab.cursor.y,
                  borderColor: collab.color || '#007bff'
                }}
              >
                <div
                  className="cursor-pointer"
                  style={{ backgroundColor: collab.color || '#007bff' }}
                ></div>
                <span className="cursor-name">{collab.name}</span>
              </div>
            )
          ))}
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {/* Chat Panel */}
          {showChat && (
            <div className="chat-panel">
              <div className="chat-header">
                <h3>Group Chat</h3>
                <span className="message-count">
                  {messages.filter(m => m.type === 'message').length} messages
                </span>
              </div>

              <div className="chat-messages">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.type} ${message.isOwn ? 'own' : ''}`}
                  >
                    {message.type === 'system' ? (
                      <div className="system-message">
                        <span>{message.message}</span>
                      </div>
                    ) : (
                      <>
                        <div className="message-header">
                          <span className="message-user">{message.user.name}</span>
                          <span className="message-time">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="message-content">{message.message}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="chat-input">
                <input
                  ref={chatInputRef}
                  type="text"
                  placeholder="Type a message..."
                  onKeyPress={handleKeyPress}
                  maxLength={500}
                />
                <button
                  onClick={() => {
                    const message = chatInputRef.current.value;
                    if (message.trim()) {
                      sendChatMessage(message);
                      chatInputRef.current.value = '';
                    }
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Participants Panel */}
          {showParticipants && (
            <div className="participants-panel">
              <div className="participants-header">
                <h3>Participants ({collaborators.length + 1})</h3>
              </div>

              <div className="participants-list">
                {/* Current user */}
                <div className="participant current-user">
                  <div className="participant-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="participant-info">
                    <span className="participant-name">{user.name} (You)</span>
                    <span className="participant-role">Student</span>
                  </div>
                  <div className="participant-status online"></div>
                </div>

                {/* Other participants */}
                {collaborators.map(collab => (
                  <div key={collab.id} className="participant">
                    <div className="participant-avatar">
                      {collab.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="participant-info">
                      <span className="participant-name">{collab.name}</span>
                      <span className="participant-role">Student</span>
                    </div>
                    <div className={`participant-status ${collab.isOnline ? 'online' : 'offline'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Timer */}
      <div className="session-timer">
        <span>Session Time: {Math.floor((new Date() - sessionInfo.startTime) / 1000 / 60)} minutes</span>
      </div>
    </div>
  );
};

export default StudentCollaboration;