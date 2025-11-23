const monthlyCompletionData = [
  { label: "Nov", percent: 0.725, color: "#7C51F1" },
  { label: "Dec", percent: 0.525, color: "#3B82F6" },
  { label: "Jan", percent: 0.625, color: "#06B6D4" },
  { label: "Feb", percent: 0.475, color: "#A78BFA" },
  { label: "Mar", percent: 0.675, color: "#6366F1" },
];

document.addEventListener("DOMContentLoaded", async () => {
  const includeElements = document.querySelectorAll("[include-html]");

  for (const el of includeElements) {
    try {
      const file = el.getAttribute("include-html");
      const response = await fetch(file);
      if (response.ok) {
        const html = await response.text();
        // Extract body content if full HTML document
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Load CSS links from the component
        const links = doc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && !document.querySelector(`link[href="${href}"]`)) {
            const newLink = document.createElement("link");
            newLink.rel = "stylesheet";
            newLink.href = href;
            document.head.appendChild(newLink);
          }
        });

        // Get content without CSS links
        const bodyContent = doc.body ? doc.body.innerHTML : html;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = bodyContent;
        tempDiv
          .querySelectorAll('link[rel="stylesheet"]')
          .forEach((link) => link.remove());
        el.innerHTML = tempDiv.innerHTML;
      } else {
        console.error(`Failed to load ${file}: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error loading ${el.getAttribute("include-html")}:`, error);
    }
  }

  // Initialize charts after components are loaded
  setTimeout(() => {
    initDonutChart();
    initBarChart();
  }, 500);
});

function initDonutChart() {
  const segment1 = document.querySelector('.donut-segment-1');
  const segment2 = document.querySelector('.donut-segment-2');
  const segment3 = document.querySelector('.donut-segment-3');

  if (!segment1 || !segment2 || !segment3) {
    // Retry if elements not found yet (for dynamically loaded content)
    setTimeout(initDonutChart, 200);
    return;
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  // Equal segments: Each segment is 33.33% (1/3 of circle)
  const segmentPercent = 1 / 3;
  const segmentLength = circumference * segmentPercent;
  
  // Ensure segments are visible
  segment1.style.opacity = '1';
  segment1.style.visibility = 'visible';
  segment2.style.opacity = '1';
  segment2.style.visibility = 'visible';
  segment3.style.opacity = '1';
  segment3.style.visibility = 'visible';
  
  // Set first segment (starts at top, 0 offset)
  segment1.setAttribute('stroke-dasharray', `${segmentLength} ${circumference}`);
  segment1.setAttribute('stroke-dashoffset', 0);
  segment1.setAttribute('stroke', '#7C51F1');
  
  // Set second segment (starts after first segment ends)
  // Offset should be negative to move clockwise
  segment2.setAttribute('stroke-dasharray', `${segmentLength} ${circumference}`);
  segment2.setAttribute('stroke-dashoffset', -segmentLength);
  segment2.setAttribute('stroke', '#16A34A');
  
  // Set third segment (starts after first and second segments end)
  segment3.setAttribute('stroke-dasharray', `${segmentLength} ${circumference}`);
  segment3.setAttribute('stroke-dashoffset', -(segmentLength * 2));
  segment3.setAttribute('stroke', '#FBBF24');
}

function initBarChart() {
  const chartEl = document.querySelector('#monthly-completion-chart');

  if (!chartEl) {
    setTimeout(initBarChart, 200);
    return;
  }

  const existingWrappers = Array.from(chartEl.querySelectorAll('.bar-wrapper'));

  // Ensure the DOM reflects the data (fallback markup stays if JS fails)
  monthlyCompletionData.forEach((item, index) => {
    let wrapper = existingWrappers[index];

    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'bar-wrapper';
      chartEl.appendChild(wrapper);
    }

    let container = wrapper.querySelector('.bar-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'bar-container';
      wrapper.insertBefore(container, wrapper.firstChild);
    }

    let unfilled = container.querySelector('.bar-unfilled');
    if (!unfilled) {
      unfilled = document.createElement('div');
      unfilled.className = 'bar-unfilled';
      container.insertBefore(unfilled, container.firstChild);
    }

    let filled = container.querySelector('.bar-filled');
    if (!filled) {
      filled = document.createElement('div');
      filled.className = 'bar-filled';
      container.appendChild(filled);
    }

    filled.className = `bar-filled bar-${index + 1}`;
    const filledHeight = Math.max(0, Math.min(100, item.percent * 100));
    const unfilledHeight = Math.max(0, 100 - filledHeight);
    filled.style.height = `${filledHeight}%`;
    filled.style.background = item.color;
    unfilled.style.height = `${unfilledHeight}%`;

    let label = wrapper.querySelector('.bar-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'bar-label';
      wrapper.appendChild(label);
    }
    label.textContent = item.label;
  });

  // Remove any extra wrappers if present
  if (existingWrappers.length > monthlyCompletionData.length) {
    existingWrappers
      .slice(monthlyCompletionData.length)
      .forEach((wrapper) => wrapper.remove());
  }
}
