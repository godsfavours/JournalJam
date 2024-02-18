// resizable panels: https://react-resizable-panels.vercel.app/

import React, { useEffect, useState, useRef } from 'react'
import NavBar from './NavBar';
import { PanelGroup, Panel, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
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
import IconButton from '@mui/material/IconButton';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const MAX_TITLE_LEN = 100;

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
  const [panelHeight, setPanelHeight] = useState(null);
  const [entries, setEntries] = useState(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [entryListMaxTitleLen, setEntryListMaxTitleLen] = useState(10);
  const [journalEntriesCollapsed, setJournalEntriesCollapsed] = useState(false);
  const [promptsCollapsed, setPromptsCollapsed] = useState(false);

  const journalEntriesPanelRef = useRef();
  const promptPanelRef = useRef();

  const { height, width } = useWindowDimensions();
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

  useEffect(() => {
    /* Set the number of rows of the text field based on the window height */
    setTextAreaRows(0.04 * height - 8);
    setPanelHeight(height - 80);
  }, [height]);

  useEffect(() => {
    if (!entries || !entries[selectedIndex])
      return;
    setEntryContent(entries[selectedIndex].content);
    setEntryTitle(entries[selectedIndex].title);
  }, [selectedIndex]);

  const handleJournalEntrySelected = (e, index) => {
    e.preventDefault();
    setSearchParams({ ...searchParams, s: index });
    setSelectedIndex(index);
  }

  const handleUpdate = (e, member) => {
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

  const handleUpdateTitle = (e) => {
    e.preventDefault();
    if (e.target.value.length > MAX_TITLE_LEN)
      return;
    handleUpdate(e, 'title');
  }

  const handleUpdateContent = (e) => {
    e.preventDefault();
    handleUpdate(e, 'content');
  }

  const handleCollapseJournalEntries = () => {
    setJournalEntriesCollapsed(true);
    journalEntriesPanelRef.current.collapse();
  }

  const handleExpandJournalEntries = () => {
    setJournalEntriesCollapsed(false);
    journalEntriesPanelRef.current.expand();
  }

  const handleResizeJournalEntries = () => {
    const size = journalEntriesPanelRef.current.getSize();
    const journalEntriesPanelWidthPx = (width * (size / 100)) - 60;
    const len = journalEntriesPanelWidthPx * 0.12 - 0.9;
    setEntryListMaxTitleLen(Math.max(len, 10));
  }

  const handleCollapsePrompts = () => {
    setPromptsCollapsed(true);
    promptPanelRef.current.collapse();
  }

  const handleExpandPrompts = () => {
    setPromptsCollapsed(false);
    promptPanelRef.current.expand();
  }



  return (
    <div style={{ display: 'flex', flexDirection: 'column', }}>
      <NavBar user={user} theme={theme} toggleTheme={toggleTheme} />
      <div
        style={{
          marginLeft: '30px',
          marginRight: '30px',
          marginBottom: '10px',
          flexGrow: 1,
        }}>
        <PanelGroup
          autoSaveId="persistence"
          direction="horizontal"
          style={{ height: '100%' }}>
          <Panel
            minSize={15}
            defaultSize={25}
            maxSize={25}
            collapsible={true}
            collapsedSize={5}
            ref={journalEntriesPanelRef}
            onCollapse={handleCollapseJournalEntries}
            onExpand={handleExpandJournalEntries}
            onResize={handleResizeJournalEntries}
            style={{ height: '100%' }}
          >
            <Paper
              variant="outlined"
              style={{
                minHeight: `${panelHeight}px`,
                maxHeight: `${panelHeight}px`, height: '100%',
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', m: 1, }}>
                {
                  !journalEntriesCollapsed &&
                  <Typography sx={{ flexGrow: 1 }} variant="h6" >
                    Journal entries
                  </Typography>
                }
                <Box>
                  {
                    !journalEntriesCollapsed ?
                      <IconButton aria-label="Minimize" onClick={handleCollapseJournalEntries}>
                        <KeyboardDoubleArrowLeftIcon />
                      </IconButton> :
                      <IconButton aria-label="Expand" onClick={handleExpandJournalEntries}>
                        <KeyboardDoubleArrowRightIcon />
                      </IconButton>
                  }
                </Box>
              </Box>
              <Divider />
              {
                !journalEntriesCollapsed &&
                <List
                  style={{
                      height: '100%',
                      maxHeight: `${panelHeight}px`,
                      overflow: 'auto'
                    }}>
                {entries &&
                  entries.map((entry, i) => (
                    <ListItemButton
                      sx={{ width: '100%' }}
                      key={i}
                      selected={selectedIndex === i}
                      onClick={(e) => handleJournalEntrySelected(e, i)}
                    >
                      <ListItemText primary={
                        entry.title.length > entryListMaxTitleLen ?
                          `${entry.title.substring(0, entryListMaxTitleLen)}...` :
                          entry.title
                      } />
                    </ListItemButton>
                  ))
                }
              </List>
              }

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
                maxHeight: `${panelHeight}px`,
                padding: '10px',
              }}
            >
              {
                entryTitle !== null &&
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
                  onChange={handleUpdateTitle}
                />
              }
              <Typography variant="body1" >
                What's on your mind?
              </Typography>
              <Box component="form" sx={{ mt: 1 }}>
                {entryContent !== null &&
                <TextField
                  variant="standard"
                  fullWidth
                  multiline
                  rows={textAreaRows}
                  value={entryContent}
                  onChange={handleUpdateContent}
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
                <Button variant="outlined">Get AI Prompt</Button>
                <Typography variant="body2">{lastSaved ? `Last saved ${lastSaved}` : 'Unsaved'}</Typography>
              </Box>
            </Paper>
          </Panel>
          <PanelResizeHandle
            style={{
              width: '7px'
            }}
          />
          <Panel
            minSize={15}
            defaultSize={25}
            maxSize={50}
            collapsible={true}
            collapsedSize={5}
            ref={promptPanelRef}
            onCollapse={handleCollapsePrompts}
            onExpand={handleExpandPrompts}
            style={{ height: '100%' }}>
            <Paper
              variant="outlined"
              style={{
                minHeight: `${panelHeight}px`,
                maxHeight: `${panelHeight}px`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', m: 1, }}>
                <Box>
                  {
                    promptsCollapsed ?
                      <IconButton aria-label="Minimize" onClick={handleExpandPrompts}>
                        <KeyboardDoubleArrowLeftIcon />
                      </IconButton> :
                      <IconButton aria-label="Expand" onClick={handleCollapsePrompts}>
                        <KeyboardDoubleArrowRightIcon />
                      </IconButton>
                  }
                </Box>
                {
                  !promptsCollapsed &&
                  <Typography sx={{ flexGrow: 1 }} variant="h6" >
                      Prompts
                  </Typography>
                }
              </Box>
              <Divider />
            </Paper>
          </Panel>
        </PanelGroup >
      </div>
    </div >
  )
}

export default EntriesPage