# BloomTask — Daily Task Manager

## Project Description

BloomTask is a daily task management web app that helps users organize tasks with categories, priorities, and due dates through a clean, pastel-themed interface. Users can add tasks, mark them as completed, delete them, search in real time, and filter by status or category — all updating dynamically without a page reload. A dashboard section shows live progress stats (total, pending, completed, and completion percentage), and tasks persist across page refreshes using `localStorage`.

## Live Demo
  Live URL: [add your GitHub Pages / Netlify link here]

## Technologies Used

- **HTML5** — semantic page structure
- **CSS3** — custom styling, responsive layout (external `style.css`)
- **JavaScript (ES6+)** — DOM manipulation, event delegation, localStorage (external `script.js`)
- **Font Awesome** — icons (via CDN)
- **Google Fonts** — Plus Jakarta Sans

No frameworks or build tools are used — the project runs entirely with static HTML, CSS, and JS in three separate files.

## Steps to Run the Project

: Open directly in a browser
1. Clone or download this repository.
2. Open the project folder.
3. Double-click `index.html` to open it in your browser.

## How It Works
1. **Load** — Reads saved tasks from localStorage, or seeds starter tasks if none exist.
2. **Add** — Form submission creates a new task object and adds it to the top of the list.
3. **Complete** — Checking a task's checkbox toggles its completed status.
4. **Delete** — Clicking the trash icon animates and removes the task from the list.
5. **Filter/Search** — Status tabs, category dropdown, and search box narrow down what's shown, without changing the actual data.
6. **Render** — Every change rebuilds the task list and dashboard stats from the current data, keeping the UI in sync.
7. **Save** — Every change is written to localStorage immediately, so tasks persist across refreshes.
8. **Sanitize** — Task text is HTML-escaped before display, preventing injected code from running.
