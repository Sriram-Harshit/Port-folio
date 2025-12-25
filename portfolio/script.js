import { projects, certificates, skills } from "./data.js";

// --------------------
// 1️⃣ Reusable Scroll Function
// --------------------
function setupHorizontalScroll(
  wrapperSelector,
  scrollContainerSelector,
  leftBtnSelector,
  rightBtnSelector,
  scrollStep = 350
) {
  const wrapper = document.querySelector(wrapperSelector);
  if (!wrapper) return;

  const scrollContainer = wrapper.querySelector(scrollContainerSelector);
  const leftBtn = wrapper.querySelector(leftBtnSelector);
  const rightBtn = wrapper.querySelector(rightBtnSelector);

  if (!scrollContainer || !leftBtn || !rightBtn) return;

  leftBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    scrollContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
  });
}

// --------------------
// 2️⃣ Projects Section
// --------------------
const projectsContainer = document.querySelector(".projects-scroll");
projectsContainer.innerHTML = projects
  .map(
    (project) => `
    <div class="project-card">
      <div class="project-preview">
        <iframe src="${project.preview}" frameborder="0" allowfullscreen></iframe>
      </div>
      <div class="project-content">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
        <div class="project-buttons">
          <a href="${project.codeLink}" class="btn primary" target="_blank">View Code</a>
          <a href="${project.demoLink}" class="btn secondary" target="_blank">View Website</a>
        </div>
      </div>
    </div>`
  )
  .join("");

setupHorizontalScroll(
  ".projects-wrapper",
  ".projects-scroll",
  ".left-btn",
  ".right-btn"
);

// --------------------
// 3️⃣ Certificates Section (NO AUTO SCROLL)
// --------------------
const container = document.getElementById("certificates-container");

certificates.forEach((cert) => {
  const card = document.createElement("div");
  card.classList.add("certificate-card");
  card.innerHTML = `
    <img src="${cert.img}" alt="${cert.title}" />
    <a href="${cert.img}" target="_blank" class="arrow-link" title="View Certificate">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="arrow-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 19L19 5M9 5h10v10" />
      </svg>
    </a>`;
  container.appendChild(card);
});

// Manual scrolling only
setupHorizontalScroll(
  ".certificates-wrapper",
  "#certificates-container",
  ".left-btn",
  ".right-btn",
  340
);

// --------------------
// 4️⃣ Skills Section
// --------------------
const skillsContainer = document.querySelector(".skills-main-container");
skillsContainer.innerHTML = Object.entries(skills)
  .map(
    ([category, list]) => `
    <div class="skills-category-container">
      <h3>${category}</h3>
      <div class="skills-grid">
        ${list
          .map(
            (skill) =>
              `<div class="skill-card">${skill.icon} ${skill.name}</div>`
          )
          .join("")}
      </div>
    </div>`
  )
  .join("");

// --------------------
// 5️⃣ Contact Form
// --------------------
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("✅ Message sent successfully!");
  e.target.reset();
});

// --------------------
// 6️⃣ Glowing Backgrounds (UNCHANGED)
// --------------------
const sections = document.querySelectorAll("section");
const glowClasses = ["glow1", "glow2", "glow3", "glow4", "glow5"];

function addGlowsToSection(section) {
  const glowCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < glowCount; i++) {
    const glow = document.createElement("div");
    glow.classList.add(
      "glow",
      glowClasses[Math.floor(Math.random() * glowClasses.length)]
    );
    glow.style.top = `${Math.random() * 80 + 10}%`;
    glow.style.left = `${Math.random() * 80 + 10}%`;
    section.appendChild(glow);
  }
}

addGlowsToSection(document.querySelector(".hero"));
