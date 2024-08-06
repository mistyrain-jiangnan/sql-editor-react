// Toolbar.tsx
import { FullscreenOutlined,FullscreenExitOutlined } from '@ant-design/icons'
import React from 'react'
import './Toolbar.css';

interface ToolbarProps {
  isFullScreen: boolean
  toggleFullScreen: () => void
  quitFullScreen: () => void
  children?: React.ReactNode
}
export const Toolbar: React.FC<ToolbarProps> = ({ isFullScreen, toggleFullScreen, quitFullScreen, children }) => {

  const className = `toolbar ${isFullScreen ? 'fullscreen' : ''}`;
  return (
    <div
      className={className}
      style={{ width: isFullScreen ? '100vw' : 'auto', height: isFullScreen ? 0 : 30 }}
    >
      {isFullScreen ? (
        <FullscreenOutlined 
          onClick={quitFullScreen}
          style={{
            color: '#000',
            cursor: 'pointer',
            padding: '5px',
            position: 'fixed',
            right: '25px',
            top: '20px',
            fontSize:20,
            zIndex: 100001,
          }}
        />
      ) : (
        <FullscreenExitOutlined 
          onClick={toggleFullScreen}
          style={{
            height: '20px',
            width: '20px',
          }}
        />
      )}
      {children}
    </div>
  )
}
