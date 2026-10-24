// The navigation remains usable without JavaScript through native details/summary.
const menu = document.querySelector(".mobile-menu");
if (menu) {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
}

// Preserve campaign context on product handoffs without adding tracking storage.
const campaign = new URLSearchParams(window.location.search);
const accepted = [...campaign].filter(([key]) =>
  /^utm_(source|medium|campaign|term|content)$/.test(key),
);
if (accepted.length) {
  document.querySelectorAll('a[href^="https://trackdub.com/"]').forEach((link) => {
    const destination = new URL(link.href);
    for (const [key, value] of accepted) destination.searchParams.set(key, value);
    link.href = destination.href;
  });
}
