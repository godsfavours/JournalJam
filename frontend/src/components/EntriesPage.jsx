// resizable panels: https://react-resizable-panels.vercel.app/

import React, { useEffect, useState, useRef, useReducer } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Divider from "@mui/material/Divider";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import EditEntry from "./EditEntry";

const SELECTED_INDEX_KEY = "si";

const EntriesPage = ({ user, theme, toggleTheme }) => {
  const [panelHeight, setPanelHeight] = useState(undefined);
  const [entries, setEntries] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [entryListMaxTitleLen, setEntryListMaxTitleLen] = useState(10);
  const [journalEntriesCollapsed, setJournalEntriesCollapsed] = useState(false);

  const journalEntriesPanelRef = useRef();
  const editEntryContentRef = useRef();

  const { height, width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const getEntries = async () => {
      /* Get user entries */
      try {
        let res = await axios.get(`/entries/${user.id}/`);

        /* Sort entries by last updated descending */
        const entries = res.data.sort((entryA, entryB) =>
          entryA.last_updated < entryB.last_updated ? 1 : -1
        );
        setEntries(entries);
      } catch (e) {
        /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
      }
    };

    getEntries();
  }, []);

  /* Set the height of the panels based on the browser height. */
  useEffect(() => {
    setPanelHeight(height - 80);
  }, [height]);

  /* Updates made when the query string changes. */
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

  const handleCollapseJournalEntries = () => {
    setJournalEntriesCollapsed(true);
    journalEntriesPanelRef.current.collapse();
  };

  const handleExpandJournalEntries = () => {
    setJournalEntriesCollapsed(false);
    journalEntriesPanelRef.current.expand();
  };

  /* Updates the max length of the journal entry titles displayed 
  in the entries panel as the width of the panel changes. */
  const onResizeJournalEntries = () => {
    const size = journalEntriesPanelRef.current.getSize();
    const journalEntriesPanelWidthPx = width * (size / 100) - 60;
    const len = journalEntriesPanelWidthPx * 0.12 - 0.9;
    setEntryListMaxTitleLen(Math.max(len, 10));
  };

  /* Creates a new entry. */
  const handleNewEntry = (e) => {
    e?.preventDefault();

    const createEntry = async () => {
      const date = new Date();
      const title = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      try {
        let res = await axios.post(
          `/entries/`,
          {
            user: user.id,
            title,
            content: "What's on your mind?" /* TODO: make content optional */,
          },
          {
            headers: {
              "X-CSRFTOKEN": Cookies.get("csrftoken"),
            },
          }
        );

        let newEntries = [res.data.entry_data].concat(entries);
        setEntries(newEntries);
        setSearchParams({
          ...searchParams,
          [SELECTED_INDEX_KEY]: 0,
        });

        /* Tell the EditEntry component to update the displayed entry to this new entry. */
        editEntryContentRef.current.setEntry({
          ...res.data.entry_data,
          content: res.data.content_data.content,
        });
      } catch (e) {
        /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
      } finally {
      }
    };

    createEntry();
  };

  return (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      {/* Navigation Bar */}
      <NavBar
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        onNewEntry={handleNewEntry}
      />
      {/* Main Panels */}
      <Box
        sx={{
          ml: 3,
          mr: 3,
          mb: 1,
          flexGrow: 1,
        }}
      >
        <PanelGroup
          autoSaveId="persistence"
          direction="horizontal"
          style={{ height: "100%", minHeight: `${panelHeight}px` }}
        >
          {/* Journal Entries Panel */}
          <Panel
            minSize={15}
            defaultSize={25}
            maxSize={40}
            collapsible={selectedIndex && true}
            collapsedSize={0}
            onCollapse={handleCollapseJournalEntries}
            onExpand={handleExpandJournalEntries}
            onResize={onResizeJournalEntries}
            ref={journalEntriesPanelRef}
            sx={{ height: "100%" }}
          >
            <Paper
              variant="outlined"
              style={{
                minHeight: `${panelHeight}px`,
                // maxHeight: `${panelHeight}px`,
                // height: "100%",
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography sx={{ flexGrow: 1 }} variant="h6">
                  Entries
                </Typography>
              </Box>
              <Divider />
              <List
                style={{
                  height: "100%",
                  maxHeight: `${panelHeight}px`,
                  overflow: "auto",
                }}
              >
                {entries.length > 0 ? (
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
                  ))
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <Typography variant="body">
                      No journal entries to display.
                    </Typography>
                  </Box>
                )}
              </List>
            </Paper>
          </Panel>
          <PanelResizeHandle
            style={{
              width: "7px",
            }}
          />
          <Panel minSize={20} defaultSize={75}>
            <Paper
              variant="outlined"
              style={{
                height: "100%",
                minHeight: `${panelHeight}px`,
              }}
            >
              {selectedIndex === undefined ? (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h4">Journal Jam</Typography>
                  <Typography sx={{ mt: 1 }} variant="body">
                    Create a new journal entry.
                  </Typography>
                  <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    onClick={handleNewEntry}
                  >
                    New entry
                  </Button>
                </Box>
              ) : (
                <>
                  <EditEntry
                    entries={entries}
                    updateEntries={setEntries}
                    selectedIndex={selectedIndex}
                    // handleEntryUpdate={handleEntryUpdate}
                    ref={editEntryContentRef}
                    journalEntriesCollapsed={journalEntriesCollapsed}
                    collapseJournalEntries={handleCollapseJournalEntries}
                    expandJournalEntries={handleExpandJournalEntries}
                  />
                </>
              )}
            </Paper>
          </Panel>
        </PanelGroup>
      </Box>
    </Box>
  );
};

export default EntriesPage;
