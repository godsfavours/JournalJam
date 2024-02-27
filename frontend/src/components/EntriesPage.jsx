// resizable panels: https://react-resizable-panels.vercel.app/

import React, { useEffect, useState, useRef, useReducer } from "react";
import axios from 'axios';
import NavBar from "./NavBar";
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  // IconButton,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import useWindowDimensions from "../hooks/useWindowDimensions";
// import { getEntries } from "../fake-db";
import { useSearchParams } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import useForceUpdate from "use-force-update";
import { preventDialogOnCtrlS } from "../utils";
import Cookies from 'js-cookie';

const MAX_TITLE_LEN = 100;
const SELECTED_INDEX_KEY = "si";

const EntriesPage = ({ user, theme, toggleTheme }) => {
  const [lastSaved, setLastSaved] = useState(undefined);
  const [textAreaRows, setTextAreaRows] = useState(undefined);
  const [panelHeight, setPanelHeight] = useState(undefined);
  const [entries, setEntries] = useState([]);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [entryListMaxTitleLen, setEntryListMaxTitleLen] = useState(10);
  const [journalEntriesCollapsed, setJournalEntriesCollapsed] = useState(false);
  const [promptTopCollapsed, setPromptTopCollapsed] = useState(false);
  const [promptsCollapsed, setPromptsCollapsed] = useState(false);

  const journalEntriesPanelRef = useRef();
  const promptPanelRef = useRef();

  const forceUpdate = useForceUpdate();

  const { height, width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();

  const getEntries = async () => {
    /* Get user entries */
    let res = await axios.get(`/entries/${user.id}/`);
    setEntries(res.data);
  }
  useEffect(() => {
    getEntries();
    // let e = getEntries();

    
    // setEntries(e);

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
    if (!entries[selectedIndex]) return;
    setEntryContent(entries[selectedIndex].content);
    setEntryTitle(entries[selectedIndex].title);
    // setLastSaved(entries[selectedIndex].createdAt.toLocaleString());
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
  };

  const handleEntryUpdate = async (e, member, save = false) => {
    e.preventDefault();

    const val = e.target.value;
    let entries_clone = [...entries];
    let entry = { ...entries[selectedIndex], [member]: val };
    entries_clone[selectedIndex] = entry;
    setEntries(entries_clone);

    
    // /* Update views */
    if (member === "title") {
      setEntryTitle(val);
    } else if (member === "content") {
      setEntryContent(val);
    } else if (member === "createdAt") {
      setLastSaved(val);
    }
  };

  const handleEntryUpdateTitle = (e) => {
    e.preventDefault();
    if (e.target.value.length > MAX_TITLE_LEN) return;
    handleEntryUpdate(e, "title");
  };

  const handleEntryUpdateContent = (e) => {
    e.preventDefault();

    handleEntryUpdate(e, "content");
  };

  const handleCollapseJournalEntries = () => {
    setJournalEntriesCollapsed(true);
    journalEntriesPanelRef.current.collapse();
  };

  const handleExpandJournalEntries = () => {
    setJournalEntriesCollapsed(false);
    journalEntriesPanelRef.current.expand();
  };
  const handleCollapsePrompt = () => {
    setPromptTopCollapsed(true);
    // journalEntriesPanelRef.current.collapse();
  };
  const handleExpandPrompt = () => {
    setPromptTopCollapsed(false);
    // journalEntriesPanelRef.current.expand();
  };
  const handleResizeJournalEntries = () => {
    const size = journalEntriesPanelRef.current.getSize();
    const journalEntriesPanelWidthPx = width * (size / 100) - 60;
    const len = journalEntriesPanelWidthPx * 0.12 - 0.9;
    setEntryListMaxTitleLen(Math.max(len, 10));
  };

  const handleCollapsePrompts = () => {
    setPromptsCollapsed(true);
    promptPanelRef.current.collapse();
  };

  const handleExpandPrompts = () => {
    setPromptsCollapsed(false);
    promptPanelRef.current.expand();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (e.ctrlKey && e.key == "s") {
      // const date = new Date(Date.now()).toLocaleString();
      // e.target.value = date;
      // handleEntryUpdate(e, "lastUpdated");

      try {
        console.log(entries[selectedIndex]);
        if (!entries[selectedIndex].lastUpdated) { /* Create the entry */
          let res = await axios.post(`/entries/`, {
            user: user.id,
            title: entryTitle,
            content: entryContent
          },{headers: {
            'X-CSRFTOKEN': Cookies.get('csrftoken'),
          }});
          // console.log(res);
          const date = new Date(res.data.entry_data.last_updated);
          console.log(date);
          e.target.value = date;
          handleEntryUpdate(e, "lastUpdated");
          // setEntries(res.data);
        } 

      } catch {
  
      } finally {
  
      }
    }
  };

  const handleNewEntry = (e) => {
    e?.preventDefault();
    const newEntry = { title: "Untitled", content: "", lastUpdated: undefined };
    setEntryTitle(newEntry.title);
    setEntryContent(newEntry.content);
    setLastSaved(undefined);
    let newEntries = [newEntry].concat(entries);
    setEntries(newEntries);
    setSearchParams({ ...searchParams, [SELECTED_INDEX_KEY]: 0 });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <NavBar
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        onNewEntry={handleNewEntry}
      />
      <div
        style={{
          marginLeft: "30px",
          marginRight: "30px",
          marginBottom: "10px",
          flexGrow: 1,
        }}
      >
        <PanelGroup
          autoSaveId="persistence"
          direction="horizontal"
          style={{ height: "100%" }}
        >
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
            style={{ height: "100%" }}
          >
            <Paper
              variant="outlined"
              style={{
                minHeight: `${panelHeight}px`,
                maxHeight: `${panelHeight}px`,
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", m: 1 }}>
                {!journalEntriesCollapsed && (
                  <Typography sx={{ flexGrow: 1 }} variant="h6">
                    Journal Entries
                  </Typography>
                )}
                <Box>
                  {!journalEntriesCollapsed ? (
                    <IconButton
                      aria-label="Minimize"
                      onClick={handleCollapseJournalEntries}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="Expand"
                      onClick={handleExpandJournalEntries}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
              {!journalEntriesCollapsed && (
                <List
                  style={{
                    height: "100%",
                    maxHeight: `${panelHeight}px`,
                    overflow: "auto",
                  }}
                >
                  {entries &&
                    entries.length > 0 ? 
                    (
                    entries.map((entry, i) => (
                      <ListItemButton
                        sx={{ width: "100%" }}
                        key={i}
                        selected={selectedIndex === i.toString()}
                        onClick={(e) => handleJournalEntrySelected(e, i)}
                      >
                        <ListItemText
                          primary={
                            entry?.title.length > entryListMaxTitleLen
                              ? `${entry.title.substring(
                                  0,
                                  entryListMaxTitleLen
                                )}...`
                              : entry?.title
                          }
                        />
                      </ListItemButton>
                    )
                    )) : 
                    (<>No Entries</>)
                    
                  }
                </List>
              )}
            </Paper>
          </Panel>
          <PanelResizeHandle
            style={{
              width: "7px",
            }}
          />
          {/* START */}
          {/* <Panel minSize={20} defaultSize={70}>
            <Paper
              variant="outlined"
              style={{
                height: "100%",
                maxHeight: `${panelHeight}px`,
                padding: "10px",
              }}
            >
              {selectedIndex === undefined ? (
                <>
                  <Button variant="outlined" onClick={handleNewEntry}>
                    New entry
                  </Button>
                </>
              ) : (
                <>
                   //Prompt Mid-Panel 
                  <Panel
                    minSize={15}
                    defaultSize={10}
                    collapsible={true}
                    collapsedSize={5}
                    // ref={promptPanelRef}
                    // onCollapse={handleCollapsePrompts}
                    // onExpand={handleExpandPrompts}
                    style={{
                      height: "flexDirection",
                      color: "white",
                    }}
                  >
                    <Paper
                      variant="outlined"
                      elevation="3"
                      style={{
                        // minHeight: "100%",
                        // maxHeight: "100%",
                        color: "#084298",
                        backgroundColor: "#cfe2ff",
                        borderColor: "#b6d4fe",
                        padding: 10,
                        height: "100%",

                        display: "flex",
                        flexDirection: "column",
                        // justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {!promptTopCollapsed ? (
                        <Typography variant="subtitle2">
                          <b>Your Daily Prompt:</b>
                        </Typography>
                      ) : null}
                      <Typography variant="body2">
                        <i>
                          You mentioned that you've been feeling lonely. How has
                          that feeling manifested in your actions today?
                        </i>
                      </Typography>
                      {!promptTopCollapsed ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            // justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton
                            aria-label="Minimize"
                            color="#084298"
                            onClick={handleCollapsePrompt}
                          >
                            <ExpandLessIcon />
                          </IconButton>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              // justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <IconButton>
                              <RefreshIcon />
                            </IconButton>

                            <IconButton>
                              <CloseIcon />
                            </IconButton>
                          </div>
                        </div>
                      ) : (
                        <IconButton
                          aria-label="Expand"
                          onClick={handleExpandPrompt}
                          color="#084298"
                          size="small"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      )}
                    </Paper>
                  </Panel>
                  {entryTitle !== undefined && (
                    <TextField
                      variant="standard"
                      fullWidth
                      name="title"
                      value={entryTitle}
                      style={{ fontSize: "50px" }}
                      placeholder="Untitled"
                      size="large"
                      InputProps={{
                        disableUnderline: true,
                        style: { fontSize: 20 },
                      }}
                      onChange={handleEntryUpdateTitle}
                      onKeyUp={handleSave}
                    />
                  )}
                  <Box component="form" sx={{ mt: 1 }}>
                    {entryContent !== undefined && (
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
                    )}
                  </Box>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    sx={{ mt: 1 }}
                  >
                    <Button variant="outlined">Get AI Prompt</Button>
                    <Typography variant="body2">
                      {lastSaved ? `Last saved ${lastSaved}` : "Unsaved"}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Panel> */}

          <Panel minSize={20} defaultSize={70}>
            {selectedIndex === undefined ? (
              <>
                <Button variant="outlined" onClick={handleNewEntry}>
                  New entry
                </Button>
              </>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper //prompt
                    variant="outlined"
                    elevation="3"
                    style={{
                      color: "#084298",
                      backgroundColor: "#cfe2ff",
                      borderColor: "#b6d4fe",
                      padding: 10,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {!promptTopCollapsed && (
                      <Typography variant="subtitle2">
                        <b>Your Daily Reflection Prompt:</b>
                      </Typography>
                    )}
                    <Typography variant="body2">
                      <i>
                        You mentioned that you've been feeling lonely. How has
                        that feeling manifested in your actions today?
                      </i>
                    </Typography>
                    {!promptTopCollapsed ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderWidth: "1",
                          borderColor: "black",
                        }}
                      >
                        <IconButton
                          aria-label="Minimize"
                          color="#084298"
                          onClick={handleCollapsePrompt}
                        >
                          <ExpandLessIcon />
                        </IconButton>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <IconButton>
                            <RefreshIcon />
                          </IconButton>
                          <IconButton>
                            <CloseIcon />
                          </IconButton>
                        </div>
                      </div>
                    ) : (
                      <IconButton
                        aria-label="Maximize"
                        color="#084298"
                        onClick={handleExpandPrompt}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    style={{
                      // display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // height: "100%",
                    }}
                  >
                    {entryTitle === undefined ? (
                      <Button variant="outlined" onClick={handleNewEntry}>
                        New Entry
                      </Button>
                    ) : (
                      <TextField //TITLE
                        variant="standard"
                        fullWidth
                        name="title"
                        value={entryTitle}
                        style={{ fontSize: "50px" }}
                        placeholder="Untitled"
                        size="medium"
                        InputProps={{
                          disableUnderline: true,
                          style: { fontSize: 20 },
                        }}
                        onChange={handleEntryUpdateTitle}
                        onKeyUp={handleSave}
                      />
                    )}
                    <Box component="form" sx={{ mt: 1 }}>
                      {entryContent !== undefined && (
                        <TextField //BODY
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
                          display="flex"
                        />
                      )}
                    </Box>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      sx={{ mt: 1 }}
                    >
                      {/* <Button variant="outlined">Get AI Prompt</Button> */}
                      <Typography variant="body2">
                        {lastSaved ? `Last saved ${lastSaved}` : "Unsaved"}
                      </Typography>
                    </Box>
                    {/* <TextField
                    variant="standard"
                    fullWidth
                    name="content"
                    multiline
                    rows={10}
                    placeholder="What's on your mind?"
                    autoFocus
                  />
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Button variant="outlined">Get AI Prompt</Button>
                    <Typography variant="body2">
                      Last saved 2 hours ago
                    </Typography>
                  </Box> */}
                  </Box>
                </Grid>
              </Grid>
            )}
          </Panel>
          {/* Side Prompt Panel */}
          {/* <PanelResizeHandle
            style={{
              width: "7px",
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
            style={{ height: "100%" }}
          >
            <Paper
              variant="outlined"
              style={{
                minHeight: `${panelHeight}px`,
                maxHeight: `${panelHeight}px`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", m: 1 }}>
                <Box>
                  {promptsCollapsed ? (
                    <IconButton
                      aria-label="Minimize"
                      onClick={handleExpandPrompts}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="Expand"
                      onClick={handleCollapsePrompts}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  )}
                </Box>
                {!promptsCollapsed && (
                  <Typography sx={{ flexGrow: 1 }} variant="h6">
                    Prompts
                  </Typography>
                )}
              </Box>
            </Paper>
          </Panel> */}
        </PanelGroup>
      </div>
    </div>
  );
};

export default EntriesPage;
