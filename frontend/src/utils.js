/* Override dialog appearing when Ctrl + S is pressed, so that the user
  can type it in the text field */
export const preventDialogOnCtrlS = () => {
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
    }
  }, false);
}