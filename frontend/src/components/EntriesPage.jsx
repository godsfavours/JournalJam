// resizable panels: https://react-resizable-panels.vercel.app/

import React, { useEffect, useState, useRef, useReducer } from 'react'
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
import ListItemText from '@mui/material/ListItemText';
import { useSearchParams } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import useForceUpdate from 'use-force-update';
import { preventDialogOnCtrlS } from '../utils';

const MAX_TITLE_LEN = 100;
const SELECTED_INDEX_KEY = 'si';

const EntriesPage = ({ user, theme, toggleTheme }) => {
  const [lastSaved, setLastSaved] = useState(undefined);
  const [textAreaRows, setTextAreaRows] = useState(undefined);
  const [panelHeight, setPanelHeight] = useState(undefined);
  const [entries, setEntries] = useState([]);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [entryListMaxTitleLen, setEntryListMaxTitleLen] = useState(10);
  const [journalEntriesCollapsed, setJournalEntriesCollapsed] = useState(false);
  const [promptsCollapsed, setPromptsCollapsed] = useState(false);

  const journalEntriesPanelRef = useRef();
  const promptPanelRef = useRef();

  const forceUpdate = useForceUpdate();

  const { height, width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    let e = getEntries();

    /* Get user entries */
    setEntries(e);

    /* Prevent dialog opening when Ctrl + S is pressed */
    preventDialogOnCtrlS();
  }, []);

  useEffect(() => {
    /* Set the number of rows of the text field based on the window height */
    setTextAreaRows(0.04 * height - 8);
    setPanelHeight(height - 80);
  }, [height]);

  useEffect(() => {
    /* Updates editing panel based on the selected entry. */
    if (!entries[selectedIndex])
      return;
    setEntryContent(entries[selectedIndex].content);
    setEntryTitle(entries[selectedIndex].title);
    setLastSaved(entries[selectedIndex].createdAt.toLocaleString());
  }, [selectedIndex]);

  useEffect(() => {
    /* Get selected index from query string */
    let i = searchParams.get(SELECTED_INDEX_KEY);
    if (entries && i && i > entries.length - 1) {
      i = undefined;
    }
    setSelectedIndex(i ? i : undefined);
  }, [entries, searchParams]);

  const handleJournalEntrySelected = (e, index) => {
    e.preventDefault();
    setSearchParams({ ...searchParams, [SELECTED_INDEX_KEY]: index });
  }

  const handleEntryUpdate = (e, member) => {
    e.preventDefault();

    const val = e.target.value;
    let entries_clone = [...entries];
    let entry = { ...entries[selectedIndex], [member]: val };
    entries_clone[selectedIndex] = entry;
    setEntries(entries_clone);

    // /* Update views */
    if (member === 'title') {
      setEntryTitle(val);
    } else if (member === 'content') {
      setEntryContent(val);
    } else if (member === 'createdAt') {
      setLastSaved(val);
    }
  }

  const handleEntryUpdateTitle = (e) => {
    e.preventDefault();
    if (e.target.value.length > MAX_TITLE_LEN)
      return;
    handleEntryUpdate(e, 'title');
  }

  const handleEntryUpdateContent = (e) => {
    e.preventDefault();

    handleEntryUpdate(e, 'content');
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

  const handleSave = (e) => {
    e.preventDefault();
    if (e.ctrlKey && e.key == 's') {
      const date = new Date(Date.now()).toLocaleString();
      e.target.value = date;
      handleEntryUpdate(e, 'createdAt')
    }
  }

  const handleNewEntry = (e) => {
    e?.preventDefault();
    const newEntry = { title: 'Untitled', content: '', createdAt: new Date() };
    setEntryTitle(newEntry.title);
    setEntryContent(newEntry.content);
    setLastSaved(newEntry.createdAt.toLocaleString());
    let newEntries = [newEntry].concat(entries);
    setEntries(newEntries);
    setSearchParams({ ...searchParams, [SELECTED_INDEX_KEY]: 0 });
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', }}>
      <NavBar user={user} theme={theme} toggleTheme={toggleTheme} onNewEntry={handleNewEntry} />
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
                        <ArrowBackIosNewIcon />
                      </IconButton> :
                      <IconButton aria-label="Expand" onClick={handleExpandJournalEntries}>
                        <ArrowForwardIosIcon />
                      </IconButton>
                  }
                </Box>
              </Box>
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
                      selected={selectedIndex === i.toString()}
                      onClick={(e) => handleJournalEntrySelected(e, i)}
                    >
                      <ListItemText primary={
                        entry?.title.length > entryListMaxTitleLen ?
                          `${entry.title.substring(0, entryListMaxTitleLen)}...` :
                          entry?.title
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
                selectedIndex === undefined ?
                  <><Button variant="outlined" onClick={handleNewEntry}>New entry</Button></> :
                  <>
                    {
                      entryTitle !== undefined &&
                      <TextField
                        variant="standard"
                        fullWidth
                        name="title"
                        value={entryTitle}
                        style={{ fontSize: '50px' }}
                        placeholder="Untitled"
                        size="large"
                        InputProps={{
                          disableUnderline: true,
                          style: { fontSize: 20 }
                        }}
                        onChange={handleEntryUpdateTitle}
                        onKeyUp={handleSave}
                      />
                    }
                    <Box component="form" sx={{ mt: 1 }}>
                      {
                        entryContent !== undefined &&
                        <TextField
                          variant="standard"
                          name="content"
                          fullWidth
                          multiline
                          rows={textAreaRows}
                          value={entryContent}
                          onChange={handleEntryUpdateContent}
                          placeholder="What's on your mind?"
                          autoFocus
                          onKeyUp={handleSave}
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
                  </>
              }
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
                        <ArrowBackIosNewIcon />
                      </IconButton> :
                      <IconButton aria-label="Expand" onClick={handleCollapsePrompts}>
                        <ArrowForwardIosIcon />
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
            </Paper>
          </Panel>
        </PanelGroup >
      </div>
    </div >
  )
}

export default EntriesPage