import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import Prompt from "../utils/Prompt";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Box, Typography, Button, TextField, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CircularProgress from "@mui/material/CircularProgress";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const MAX_TITLE_LEN = 100;
const UNSAVED_MSG =
  "You have some unsaved changed. Are you sure that you want to leave the page?";

const EditEntry = forwardRef(
  (
    {
      entries,
      updateEntries,
      selectedIndex,
      journalEntriesCollapsed,
      collapseJournalEntries,
      expandJournalEntries,
    },
    ref
  ) => {
    const [entryContent, setEntryContent] = useState("");
    const [initialContent, setInitialContent] = useState(undefined);
    const [lastSaved, setLastSaved] = useState(undefined);
    const [textAreaRows, setTextAreaRows] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [dirty, setDirty] =
      useState(false); /* if changes were made that have not been saved. */
    const [entryTitle, setEntryTitle] = useState("");
    const [initialTitle, setInitialTitle] = useState(undefined);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [saving, setSaving] = useState(false);

    const { height } = useWindowDimensions();
    const [searchParams, setSearchParams] = useSearchParams();

    /* Fetch the entry on load. */
    useEffect(() => {
      const getEntry = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `/api/entries/${entries[selectedIndex].id}/content/`
          );

          /* Update state. */
          setEntryContent(res.data.content);
          setInitialContent(res.data.content);
          setEntryTitle(entries[selectedIndex].title);
          setInitialTitle(entries[selectedIndex].title);
          setLastSaved(
            entries[selectedIndex].last_updated < res.data.last_updated
              ? res.data.last_updated
              : entries[selectedIndex].last_updated
          );

          /* Used to prevent the user from leaving the page with unsaved changes. */
          setDirty(false);
        } catch (e) {
          /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
        } finally {
          setLoading(false);
        }
      };

      getEntry();
    }, [entries, selectedIndex]);

    /* This allows the parent EntriesPage component to directly call the setEntry function. */
    useImperativeHandle(ref, () => ({
      setEntry(entry) {
        /* Called when a new entry is created. */
        setEntryContent(entry.content);
        setInitialContent(entry.content);

        setEntryTitle(entry.title);
        setInitialTitle(entry.title);

        setLastSaved(entry.last_updated);
        setDirty(false);
      },
    }));

    /* Set the number of rows of the text field based on the window height */
    useEffect(() => {
      setTextAreaRows(0.04 * height - 8);
    }, [height]);

    const handleEntryUpdateTitle = (e) => {
      e.preventDefault();
      if (e.target.value.length > MAX_TITLE_LEN) return;

      setEntryTitle(e.target.value);

      /* Indicate that there are changes to be saved. */
      setDirty(e.target.value !== initialTitle);
    };

    const handleEntryUpdateContent = (e) => {
      e.preventDefault();
      console.log(e.target.value);
      setEntryContent(e.target.value);

      /* Indicate that there are changes to be saved. */
      setDirty(e.target.value !== initialContent);
    };

    const saveTitle = async () => {
      if (initialTitle === entryTitle) return;

      try {
        let res = await axios.patch(
          `/api/entries/${entries[selectedIndex].id}/`,
          {
            title: entryTitle,
          },
          {
            headers: {
              "X-CSRFTOKEN": Cookies.get("csrftoken"),
            },
          }
        );

        console.log(res);

        /* Update the entry title in side bar */
        let entries_clone = [...entries];
        let entry = { ...entries[selectedIndex], title: res.data.title };
        entries_clone[selectedIndex] = entry;
        updateEntries(entries_clone);

        return res.data.last_updated;
      } catch (e) {
        /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
        throw e;
      }
    };

    const saveContent = async () => {
      if (initialContent === entryContent) return undefined;

      try {
        let res = await axios.patch(
          `/api/entries/${entries[selectedIndex].id}/content/`,
          {
            content: entryContent,
          },
          {
            headers: {
              "X-CSRFTOKEN": Cookies.get("csrftoken"),
            },
          }
        );

        console.log(res);
        return res.data.last_updated;
      } catch (e) {
        /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
        throw e;
      }
    };

    const handleSave = (e) => {
      e.preventDefault();

      const save = async () => {
        setSaving(true);
        try {
          const titleLastUpdated = await saveTitle();
          const contentLastUpdated = await saveContent();

          console.log(titleLastUpdated, contentLastUpdated);

          setLastSaved(
            titleLastUpdated && contentLastUpdated
              ? titleLastUpdated < contentLastUpdated
                ? contentLastUpdated
                : titleLastUpdated
              : titleLastUpdated
              ? titleLastUpdated
              : contentLastUpdated
              ? contentLastUpdated
              : lastSaved
          );

          setDirty(false);
          setInitialTitle(entryTitle);
          setInitialContent(entryContent);
        } catch (e) {
          /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
        } finally {
          setSaving(false);
        }
      };

      save();
    };

    const handleDelete = (e) => {
      e.preventDefault();
      handleCloseMenu(e);

      const deleteEntry = async () => {
        try {
          setLoading(true);

          const res = await axios.delete(
            `/api/entries/${entries[selectedIndex].id}/`,
            {
              headers: {
                "X-CSRFTOKEN": Cookies.get("csrftoken"),
              },
            }
          );

          /* Remove entry from list */
          let entries_clone = [...entries];
          entries_clone.splice(selectedIndex, 1);
          updateEntries(entries_clone);

          handleCloseEntry();
        } catch (e) {
          /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
        } finally {
          setLoading(false);
        }
      };

      deleteEntry();
    };

    const handleCloseEntry = (e) => {
      e?.preventDefault();

      const newSearchParams = searchParams;
      searchParams.delete("si");
      setSearchParams(newSearchParams);
    };

    const handleOpenMenu = (e) => {
      setMenuAnchorEl(e.currentTarget);
    };

    const handleCloseMenu = () => {
      setMenuAnchorEl(null);
    };

    const handleGetAIPrompt = () => {};

    if (loading)
      return (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );

    return (
      <>
        {/* For preventing navigating away with unsaved changes */}
        <Prompt when={dirty} message={UNSAVED_MSG} beforeUnload={true} />

        <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
          {/* Entry Title */}
          <TextField
            variant="standard"
            fullWidth
            name="title"
            sx={{ ml: 1 }}
            value={entryTitle}
            style={{ fontSize: "50px" }}
            placeholder="Untitled"
            size="large"
            InputProps={{
              disableUnderline: true,
              style: { fontSize: 20 },
            }}
            onChange={handleEntryUpdateTitle}
          />
          {/* Entry Menu */}
          <Box>
            <IconButton
              size="large"
              aria-label="More Entry Options"
              aria-controls="menu-journal-entry"
              aria-haspopup="true"
              onClick={handleOpenMenu}
              color="inherit"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="menu-journal-entry"
              anchorEl={menuAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(menuAnchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  handleGetAIPrompt();
                  handleCloseMenu();
                }}
              >
                Get AI Prompt
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  !journalEntriesCollapsed
                    ? collapseJournalEntries(e)
                    : expandJournalEntries(e);
                  handleCloseMenu();
                }}
              >
                {!journalEntriesCollapsed ? "Hide Entries" : "Show Entries"}
              </MenuItem>
              <MenuItem onClick={handleCloseEntry}>Close Entry</MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  handleSave(e);
                  handleCloseMenu(e);
                }}
              >
                Save
              </MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ m: 2 }}>
          {/* Consider using an accordion, or implement the prompt panel again */}
          <Accordion variant="outlined" defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              Accordion Actions
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
            <AccordionActions>
              <Button>Cancel</Button>
              <Button>Agree</Button>
            </AccordionActions>
          </Accordion>
        </Box>

        {/* Entry content editing box */}
        <Box sx={{ m: 2 }}>
          <Box component="form" sx={{ mb: 2 }}>
            <TextField
              variant="standard"
              name="content"
              fullWidth
              multiline
              minRows={5}
              // rows={textAreaRows}
              value={entryContent}
              onChange={handleEntryUpdateContent}
              placeholder="What's on your mind?"
              autoFocus
            />
          </Box>

          {/* Bottom panel */}
          <Box
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            sx={{ mt: 1 }}
          >
            <Button variant="outlined">Get AI Prompt</Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mr: 2 }} variant="body2">
                {lastSaved ? `Last saved ${lastSaved}` : "Unsaved"}
              </Typography>
              <LoadingButton
                loading={saving}
                variant="outlined"
                onClick={handleSave}
              >
                Save
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
);

export default EditEntry;
