// resizable panels: https://react-resizable-panels.vercel.app/

import React, { useEffect, useState } from 'react'
import NavBar from './NavBar';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useWindowDimensions from '../hooks/useWindowDimensions';

const EntriesPage = ({ user, theme, toggleTheme }) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [textAreaRows, setTextAreaRows] = useState(null);
  const { height } = useWindowDimensions();

  useEffect(() => {
    /* Set the number of rows of the text field based on the window height*/
    setTextAreaRows(0.04 * height - 8);
  }, [height]);

  useEffect(() => {
    /* Override dialog appearing when Ctrl + S is pressed, so that the user
      can type it in the text field */
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    }, false);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'auto' }}>
      <NavBar user={user} theme={theme} toggleTheme={toggleTheme} />
      <div style={{ marginLeft: '30px', marginRight: '30px', marginBottom: '30px', flexGrow: 1 }}>
        <PanelGroup direction="horizontal" style={{ height: '100%' }}>
          <Panel minSize={10} defaultSize={25} collapsible={true} collapsedSize={5}>
            <Paper
              variant="outlined"
              style={
                {
                  height: '100%',
                }}
            >
              Journal entries
            </Paper>
          </Panel>
          <PanelResizeHandle
            style={
              {
                width: '7px',
              }}
          />
          <Panel minSize={20} defaultSize={70}>
            <Paper
              variant="outlined"
              style={{
                height: '100%',
                maxHeight: '100%',
                padding: '10px',
              }}
            >
              <Typography variant="h5" >
                Untitled
              </Typography>
              <Typography variant="body1" >
                What's on your mind?
              </Typography>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  variant="standard"
                  fullWidth
                  multiline
                  rows={textAreaRows}
                  autoFocus
                  onKeyUp={(event) => {
                    event.preventDefault();
                    if (event.ctrlKey && event.key == 's') {
                      setLastSaved(new Date(Date.now()).toISOString());
                    }
                  }}

                />
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                sx={{ mt: 1 }}
              >
                <Button>Get AI Prompt</Button>
                <Typography variant="body2">{lastSaved ? `Last saved ${lastSaved}` : 'Unsaved'}</Typography>
              </Box>
            </Paper>
          </Panel>
          <PanelResizeHandle
            style={{
              width: '7px'
            }}
          />
          <Panel minSize={10} defaultSize={5} collapsible={true} collapsedSize={5}>
            <Paper
              variant="outlined"
              style={{
                height: '100%',
              }}
            >
              Prompts
            </Paper>
          </Panel>
        </PanelGroup >
      </div>
    </div >
  )
}

export default EntriesPage