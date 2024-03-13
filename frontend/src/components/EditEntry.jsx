import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import Prompt from "../utils/Prompt";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

const MAX_TITLE_LEN = 100;
const UNSAVED_MSG =
  "You have some unsaved changed. Are you sure that you want to leave the page?";
const TEXT_FIELD_ROW_HEIGHT = 23; /* The height (pixels) of one text area row. */

const EditEntry = forwardRef(
  ({ entries, updateEntries, selectedIndex }, ref) => {
    const [entryContent, setEntryContent] = useState("");
    const [initialContent, setInitialContent] = useState(undefined);
    const [lastSaved, setLastSaved] = useState(undefined);
    const [textAreaRows, setTextAreaRows] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [dirty, setDirty] =
      useState(false); /* if changes were made that have not been saved. */
    const [entryTitle, setEntryTitle] = useState("");
    const [prompt, setPrompt] = useState("");
    const [initialTitle, setInitialTitle] = useState(undefined);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [saving, setSaving] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogDescription, setDialogDescription] = useState("");

    const mainBarAndPromptRef = useRef();
    const { height } = useWindowDimensions();
    const [searchParams, setSearchParams] = useSearchParams();

    /* Fetch the entry on load. */
    useEffect(() => {
      const getEntry = async () => {
        /* TODO: edit this to shortened prompt title */
        /* grab prompt from user */
        /* TODO: add POST for prompt as well*/
        try {
          setLoading(true);
          const res = await axios.get(
            `/api/entries/${entries[selectedIndex].id}/content/`
          );
          const promptRes = await axios.get(
            `/api/entries/${entries[selectedIndex].id}/prompt/`
          );
          setPrompt(promptRes.data.prompt);
          /* Update state. */
          setEntryContent(res.data.content);
          setInitialContent(res.data.content);
          setEntryTitle(entries[selectedIndex].title);
          setInitialTitle(entries[selectedIndex].title);

          let updated =
            entries[selectedIndex].last_updated < res.data.last_updated
              ? res.data.last_updated
              : entries[selectedIndex].last_updated;
          let date = new Date(updated);
          // `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          setLastSaved(
            `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
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

        let date = new Date(entry.last_updated);
        setLastSaved(
          `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
        );
        setDirty(false);
      },
    }));

    /* Dynamically set the number of rows of the entry content text field so 
    that the entire right panel fits in one view height. */
    const updateTextAreaRows = () => {
      if (!document.getElementById("mainBarAndPrompt")?.clientHeight) return;

      /* TODO: handle updating this based on whether or not the prompt panel is open */
      let availableHeight =
        height - document.getElementById("mainBarAndPrompt")?.clientHeight;
      let rows = availableHeight / TEXT_FIELD_ROW_HEIGHT - 5;
      setTextAreaRows(rows);
    };

    /* Set the number of rows of the text field based on the window height */
    useEffect(() => {
      updateTextAreaRows();
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

        setInitialTitle(entryTitle);

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

        setInitialContent(entryContent);

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

          if (!titleLastUpdated && !contentLastUpdated) return;

          let updated;
          if (titleLastUpdated && contentLastUpdated) {
            updated =
              titleLastUpdated < contentLastUpdated
                ? contentLastUpdated
                : titleLastUpdated;
          } else if (titleLastUpdated) {
            updated = titleLastUpdated;
          } else {
            updated = contentLastUpdated;
          }

          let date = new Date(updated);
          setLastSaved(
            `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
          );

          setDirty(false);

          /* Update the entry title in side bar */
          let entries_clone = [...entries];
          let entry = { ...entries[selectedIndex], title: entryTitle };
          entries_clone.splice(selectedIndex, 1);
          entries_clone.unshift(entry);
          updateEntries(entries_clone);

          setSearchParams({ ...searchParams, si: 0 });
        } catch (e) {
          /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
        } finally {
          setSaving(false);
        }
      };

      save();
    };

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

    const handleDelete = (e) => {
      e.preventDefault();
      handleCloseMenu(e);

      setDialogMessage("Are you sure you want to delete this journal entry?");
      setDialogDescription(
        `The journal entry "${initialTitle}" will be deleted. Please confirm this. `
      );
      setDialogOpen(true);
    };

    const handleCloseEntry = (e) => {
      e?.preventDefault();

      // expandJournalEntries();
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

    const handleDialogClose = (e) => {
      e.preventDefault();

      setDialogOpen(false);
    };

    const savePrompt = async () => {
      try {
        let res = await axios.put(
          `/api/entries/${entries[selectedIndex].id}/prompt/`,
          {
            prompt: prompt,
          },
          {
            headers: {
              "X-CSRFTOKEN": Cookies.get("csrftoken"),
            },
          }
        );
      } catch (e) {
        /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
        throw e;
      }
    };

    const handleGetAIPrompt = async () => {
      setLoading(true);
      try {
        setPrompt("This is a new prompt!");
        await savePrompt(); //put request for prompt
      } catch (e) {
        /* TODO: handle errors. Use https://mui.com/material-ui/react-alert/ */
      }
      // setDialogMessage("Test Dialog");
      // setDialogDescription(`Click Cancel `);
      // setDialogOpen(true);
      setLoading(false);
    };

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
      <React.Fragment>
        {/* For preventing navigating away with unsaved changes */}
        <Prompt
          when={!saving && dirty}
          message={UNSAVED_MSG}
          beforeUnload={true}
        />

        <Box id="mainBarAndPrompt" ref={mainBarAndPromptRef}>
          <Box sx={{ p: 1, display: "flex", alignItems: "center" }}>
            {/* Entry Title */}
            <TextField
              variant="standard"
              fullWidth
              name="title"
              sx={{ ml: 1 }}
              value={entryTitle}
              style={{ fontSize: "50px" }}
              placeholder="Name your journal entry"
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
            {/* AI Prompt Box */}
            {prompt !== "" ? (
              <Accordion
                // variant="outlined"
                defaultExpanded
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  {prompt}
                </AccordionSummary>
                {/* <AccordionDetails>
                <b>Your Daily Inspiration Prompt</b>
              </AccordionDetails> */}
                <AccordionActions>
                  <Tooltip title={"Give me another prompt"}>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        handleGetAIPrompt(e);
                      }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Don't prompt me about this topic again"}>
                    <IconButton
                      color="primary"
                      onClick={(e) => {
                        // e.preventDefault();
                        handleGetAIPrompt(e);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </AccordionActions>
              </Accordion>
            ) : (
              <></>
            )}
          </Box>
        </Box>

        {/* Entry content editing box */}
        <Box sx={{ m: 2 }}>
          <Box component="form" sx={{ mb: 2 }}>
            <TextField
              variant="standard"
              name="content"
              fullWidth
              multiline
              // minRows={10}
              rows={textAreaRows}
              // maxRows={textAreaRows}
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
            <Button
              onClick={(e) => {
                handleGetAIPrompt();
              }}
            >
              Get AI Prompt
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography sx={{ mr: 2 }} variant="body2">
                {lastSaved ? `Last saved ${lastSaved}` : "Unsaved"}
              </Typography>
              <LoadingButton loading={saving} onClick={handleSave}>
                Save
              </LoadingButton>
            </Box>
          </Box>
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle id="alert-dialog-title">{dialogMessage}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {dialogDescription}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={deleteEntry} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </React.Fragment>
    );
  }
);

export default EditEntry;
