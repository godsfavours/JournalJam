// resizable panels: https://react-resizable-panels.vercel.app/

import React, { useEffect, useState, useRef, useReducer } from "react";
import axios from "axios";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Icon,
} from "@mui/material";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import EditEntry from "./EditEntry";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Tooltip from "@mui/material/Tooltip";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const SELECTED_INDEX_KEY = "si";

const EntriesPage = ({ user, theme, toggleTheme }) => {
  const [panelHeight, setPanelHeight] = useState(undefined);
  const [entries, setEntries] = useState([]);
  const [contents, setContents] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [journalEntriesPanelWidthPx, setJournalEntriesPanelWidthPx] =
    useState(10);
  const [leftPanelCollapsed, setleftPanelCollapsed] = useState(true);

  const journalEntriesPanelRef = useRef();
  const editEntryContentRef = useRef();

  const { height, width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();

  // Used for figuring out how to cut off the journal entry titles in the left panel.
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = "16px Arial";

  useEffect(() => {
    const getEntries = async () => {
      /* Get user entries */
      try {
        let res = await axios.get(`/entries/${user.id}`);

        /* Sort entries by last updated descending */
        const entries = res.data.sort((entryA, entryB) =>
          entryA.last_updated < entryB.last_updated ? 1 : -1
        );
        setEntries(entries);
        let new_contents = [];
        for (let i = 0; i < entries.length; i++) {
          let c_res = await axios.get(`api/entries/${entries[i].id}/content/`);
          new_contents.push(c_res.data.content);
        }
        setContents(new_contents);
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

  const handleExpandLeftPanel = () => {
    setleftPanelCollapsed(false);
    journalEntriesPanelRef.current.expand();
  };

  const handleCollapseLeftPanel = () => {
    setleftPanelCollapsed(true);
    journalEntriesPanelRef.current.collapse();
  };

  const toggleLeftPanelCollapsed = () => {
    const collapsed = !leftPanelCollapsed;
    setleftPanelCollapsed(collapsed);
    if (collapsed) journalEntriesPanelRef.current.collapse();
    else journalEntriesPanelRef.current.expand();
  };

  /* Updates the max length of the journal entry titles displayed 
  in the entries panel as the width of the panel changes. */
  const onLeftPanelResize = () => {
    const size = journalEntriesPanelRef.current.getSize();
    const w = width * (size / 100) - 60;
    setJournalEntriesPanelWidthPx(w);
  };

  /* Creates a new entry. */
  const handleNewEntry = (e) => {
    e?.preventDefault();

    const createEntry = async () => {
      // default title ex: Wed Mar 13th, 6 PM
      const date = new Date();
      const nthNumber = (number) => {
        return number > 0
          ? ["th", "st", "nd", "rd"][
              (number > 3 && number < 21) || number % 10 > 3 ? 0 : number % 10
            ]
          : "";
      };
      const days = ['Sun', 'Mon', 'Tue','Wed','Thu','Fri','Sat'];
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const time = date.toLocaleString('en-US', { hour: 'numeric', hour12: true });
      const title = `${days[date.getDay()]} ${month} ${day}${nthNumber(day)}, ${time}`;

      try {
        let res = await axios.post(
          `/entries/`,
          {
            user: user.id,
            title,
            content: "",
            prompt: "",
          },
          {
            headers: {
              "X-CSRFTOKEN": Cookies.get("csrftoken"),
            },
          }
        );

        let newEntries = [res.data.entry_data].concat(entries);
        setEntries(newEntries);
        let newContents = [res.data.content].concat(contents);
        setContents(newContents);
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

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/logout/", null, {
        headers: {
          "X-CSRFTOKEN": Cookies.get("csrftoken"),
        },
      });
      window.location.pathname = "/login";
    } catch (error) {}
  };

  const getDisplayedEntryTitle = (title) => {
    if (!title || leftPanelCollapsed) return undefined;

    const getCutoffString = (str) => {
      while (true) {
        if (
          ctx.measureText(str).width <=
          Math.max(journalEntriesPanelWidthPx - 15, 0)
        )
          return str;
        str = str.slice(0, -1);
      }
    };

    const cutOff = getCutoffString(title);
    return cutOff !== title ? `${cutOff}...` : title;
  };

  const onContext = (e) => {
    e.preventDefault();
    //want to add a context menu to delete
  };

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <PanelGroup
        autoSaveId="persistence"
        direction="horizontal"
        style={{ flexGrow: 1 }}
      >
        {/* Left Panel */}
        <Panel
          minSize={10}
          defaultSize={25}
          maxSize={40}
          collapsible={true}
          collapsedSize={5}
          onCollapse={handleCollapseLeftPanel}
          onExpand={handleExpandLeftPanel}
          onResize={onLeftPanelResize}
          ref={journalEntriesPanelRef}
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme === "dark" ? "#1a1a1a" : "#fafafa",
          }}
        >
          <Box
            sx={
              leftPanelCollapsed
                ? { display: "flex", justifyContent: "center", mt: 2 }
                : {
                    m: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }
            }
          >
            {!leftPanelCollapsed && (
              <Typography variant="h6">Journal Jam</Typography>
            )}
            <Tooltip
              title={leftPanelCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <IconButton
                size="large"
                onClick={toggleLeftPanelCollapsed}
                color="inherit"
              >
                {leftPanelCollapsed ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title="Create new journal entry">
            {!leftPanelCollapsed ? (
              <Button
                sx={{ p: 2 }}
                onClick={handleNewEntry}
                startIcon={<EditNoteIcon />}
              >
                New entry
              </Button>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <IconButton
                  onClick={handleNewEntry}
                  size="large"
                  color="primary"
                >
                  <EditNoteIcon />
                </IconButton>
              </Box>
            )}
          </Tooltip>

          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              marginBottom: "10px",
            }}
          >
            {!leftPanelCollapsed && (
              <Box>
                <Box sx={{ pl: 2, pr: 2, pt: 2 }}>
                  <Typography sx={{ flexGrow: 1 }} variant="body">
                    Entries
                  </Typography>
                </Box>
                <List
                  style={{
                    maxHeight: "400px",
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
                        onContextMenu={(e) => onContext(e)}
                      >
                        <ListItemText
                          primary={getDisplayedEntryTitle(entry?.title)}
                          secondary={getDisplayedEntryTitle(contents[i])}
                        />
                      </ListItemButton>
                    ))
                  ) : (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
                      <Typography variant="body">
                        No journal entries to display.
                      </Typography>
                    </Box>
                  )}
                </List>
              </Box>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <List>
                <ListItem key={"logout"} disablePadding>
                  <Tooltip
                    title={`Change to ${
                      theme === "dark" ? "light" : "dark"
                    } mode`}
                  >
                    {leftPanelCollapsed ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <IconButton size="large" onClick={toggleTheme}>
                          {theme === "dark" ? (
                            <LightModeIcon />
                          ) : (
                            <DarkModeIcon />
                          )}
                        </IconButton>
                      </Box>
                    ) : (
                      <ListItemButton onClick={toggleTheme}>
                        <ListItemIcon>
                          {theme === "dark" ? (
                            <LightModeIcon />
                          ) : (
                            <DarkModeIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            theme === "dark" ? "Light Mode" : "Dark Mode"
                          }
                        />
                      </ListItemButton>
                    )}
                  </Tooltip>
                </ListItem>
                <ListItem key={"sign-out"} disablePadding>
                  <Tooltip title={"Sign out"}>
                    {leftPanelCollapsed ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <IconButton size="large" onClick={handleSignOut}>
                          <LogoutIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <ListItemButton onClick={handleSignOut}>
                        <ListItemIcon>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Sign out"} />
                      </ListItemButton>
                    )}
                  </Tooltip>
                </ListItem>
              </List>
            </Box>
          </Box>
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={20} defaultSize={75}>
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
              <Button sx={{ mt: 2 }} onClick={handleNewEntry}>
                New entry
              </Button>
            </Box>
          ) : (
            <>
              <EditEntry
                entries={entries}
                contents={contents}
                updateEntries={setEntries}
                updateContents={setContents}
                selectedIndex={selectedIndex}
                ref={editEntryContentRef}
                user={user}
              />
            </>
          )}
        </Panel>
      </PanelGroup>
    </Box>
  );
};

export default EntriesPage;
