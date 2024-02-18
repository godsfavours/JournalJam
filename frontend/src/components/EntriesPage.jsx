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
import { getEntries } from '../fake-db';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useSearchParams } from "react-router-dom";

/* Override dialog appearing when Ctrl + S is pressed, so that the user
  can type it in the text field */
const preventDialogOnCtrlS = () => {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
    }
  }, false);
}

const EntriesPage = ({ user, theme, toggleTheme }) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [textAreaRows, setTextAreaRows] = useState(null);
  const [entries, setEntries] = useState(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

  const { height } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    /* Get user entries */
    const e = getEntries();
    setEntries(e);

    /* Get selected journal entry */
    let i = searchParams.get("s");
    if (i) {
      setSelectedIndex(Number(i));
    }

    preventDialogOnCtrlS();
  }, []);

  /* Set the number of rows of the text field based on the window height */
  useEffect(() => {
    setTextAreaRows(0.04 * height - 8);
  }, [height]);

  useEffect(() => {
    if (!entries || !entries[selectedIndex]) return;
    setEntryContent(entries[selectedIndex].content);
    setEntryTitle(entries[selectedIndex].title);
  }, [selectedIndex]);

  const onJournalEntrySelected = (e, index) => {
    e.preventDefault();
    setSearchParams({ ...searchParams, s: index });
    setSelectedIndex(index);
  }

  const updateEntry = (e, member) => {
    e.preventDefault();
    const val = e.target.value;
    let ent = [...entries];
    let entry = { ...entries[selectedIndex], [member]: val };
    ent[selectedIndex] = entry;
    setEntries(ent);
    if (member === 'title') {
      setEntryTitle(e.target.value);
    } else if (member === 'content') {
      setEntryContent(e.target.value);
    }
  }

  const updateEntryTitle = (e) => {
    updateEntry(e, 'title');
  }

  const updateEntryContent = (e) => {
    updateEntry(e, 'content');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '100vh', overflow: 'auto' }}>
      <NavBar user={user} theme={theme} toggleTheme={toggleTheme} />
      <div style={{ marginLeft: '30px', marginRight: '30px', marginBottom: '10px', flexGrow: 1 }}>
        <PanelGroup autoSaveId="persistence" direction="horizontal" style={{ height: '100%' }}>
          <Panel minSize={10} defaultSize={25} collapsible={true} collapsedSize={5}>
            <Paper
              variant="outlined"
              style={
                {
                  height: '100%',
                  maxHeight: '500px', /* TODO: programmatically set max height */
                  overflow: 'auto'
                }}
            >
              <List
              >
                {entries &&
                  entries.map((entry, i) => (
                    <ListItemButton
                      sx={{ width: '100%' }}
                      key={i}
                      selected={selectedIndex === i}
                      onClick={(e) => onJournalEntrySelected(e, i)}
                    >
                      <ListItemText primary={entry.title} />
                    </ListItemButton>
                  ))
                }
              </List>
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
              {entryTitle &&
                <TextField
                  variant="standard"
                  fullWidth
                  value={entryTitle}
                  style={{ fontSize: '50px' }}
                  size="large"
                  InputProps={{
                    disableUnderline: true,
                    style: { fontSize: 20 }
                  }}
                  onChange={updateEntryTitle}
                />
              }
              <Typography variant="body1" >
                What's on your mind?
              </Typography>
              <Box component="form" sx={{ mt: 1 }}>
                {entryContent &&
                <TextField
                  variant="standard"
                  fullWidth
                  multiline
                  rows={textAreaRows}
                  value={entryContent}
                  onChange={updateEntryContent}
                  autoFocus
                  onKeyUp={(event) => {
                    event.preventDefault();
                    if (event.ctrlKey && event.key == 's') {
                      setLastSaved(new Date(Date.now()).toISOString());
                    }
                  }}

                />
                }
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