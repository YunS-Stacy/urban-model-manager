export default function removeHash() {
  window.history.replaceState(
    '',
    document.title,
    window.location.pathname + window.location.search,
  );
}
