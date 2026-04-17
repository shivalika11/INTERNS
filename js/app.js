// ================= GLOBAL DATA =================

let internships = [];
let trainings = [];
let currentData = internships;
let currentContainerId = "internshipContainer";


// ================= DETECT PAGE =================

function detectPage() {
  const path = window.location.pathname;
  if (path.includes('explore-training.html')) {
    currentData = trainings;
    currentContainerId = "trainingList";
    return 'training';
  } else if (path.includes('explore-internships.html')) {
    currentData = internships;
    currentContainerId = "internshipContainer";
    return 'internship';
  } else if (path.includes('index.html') || path === '/' || path.endsWith('/') || path === '') {
    return 'index';
  } else {
    return 'other';
  }
}


// ================= LOAD INTERNSHIPS =================

async function loadInternships() {
  try {
    const response = await fetch("data/internships.json");
    internships = await response.json();
    if (detectPage() === 'internship') {
      renderInternships();
    }
  } catch (error) {
    console.error("Error loading internships:", error);
  }
}


// ================= LOAD TRAININGS =================

async function loadTrainings() {
  try {
    const response = await fetch("data/trainings.json");
    trainings = await response.json();
    if (detectPage() === 'training') {
      renderTrainings();
    }
  } catch (error) {
    console.error("Error loading trainings:", error);
  }
}


// ================= RENDER ALL =================

function getInternshipContainerId() {
  const container = document.getElementById("internshipContainer") || document.getElementById("jobList") || document.getElementById("featuredContainer");
  return container ? container.id : "internshipContainer";
}

function getTrainingContainerId() {
  const container = document.getElementById("trainingList") || document.getElementById("jobList");
  return container ? container.id : "trainingList";
}

function renderInternships() {
  renderFilteredInternships(internships, getInternshipContainerId());
}

function renderTrainings() {
  renderFilteredTrainings(trainings, getTrainingContainerId());
}


// ================= RENDER FILTERED =================

function renderFilteredInternships(data, containerId) {

  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "";

  if (data.length === 0) {

    container.innerHTML = "<p>No internships found.</p>";
    return;

  }

  const page = detectPage();

  if (page === 'index') {
    // Render as Bootstrap cards for index
    data.slice(0, 6).forEach(job => {  // Limit to 6 for featured
      const skills = job.skills ? job.skills.slice(0, 3).join(", ") : "";
      const logo = job.logo ? `<img src="${job.logo}" alt="${job.company} logo" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">` : (job.company ? job.company.charAt(0).toUpperCase() : "C");
      const card = `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div style="text-align:center;margin-bottom:15px;">
                ${logo}
              </div>
              <h5 class="card-title">${job.title}</h5>
              <p class="card-text text-muted">${job.company} • ${job.location}</p>
              <p class="card-text">${job.description.substring(0, 80)}...</p>
              <p class="card-text small text-primary">${skills}</p>
              <a href="internship.html?id=${job.id}" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  } else {
    // Render as job-card for explore pages
    data.forEach(job => {

      const skills = job.skills
        ? job.skills.map(skill => `<span class="tag">${skill}</span>`).join("")
        : "";

      const logo = job.logo ? `<img src="${job.logo}" alt="${job.company} logo">` : (job.company ? job.company.charAt(0).toUpperCase() : "C");
      const salaryLabel = job.salary ? formatSalary(job.salary) : "Salary undisclosed";
      const experienceLabel = job.experience ? `<span class="experience-chip">${job.experience}</span>` : "";

      const card = `
      
      <div class="job-card">

        <div class="job-left">

          <div class="company-logo">
            ${logo}
          </div>

          <div class="job-info">

            <h3>${job.title}</h3>

            <p class="company">${job.company}</p>

            <div class="meta">
              <span>${job.location}</span>
              <span>${job.duration}</span>
            </div>

            <div class="meta">
              <span class="salary-chip">${salaryLabel}</span>
              ${experienceLabel}
            </div>

            <div class="skills">
              ${skills}
            </div>

          </div>

        </div>

        <div class="job-right">

          <a href="internship.html?id=${job.id}" class="view-btn">
            View Details
          </a>

        </div>

      </div>
      
      `;

      container.innerHTML += card;

    });
  }

  if (page !== 'index') {
    updateResultCount(data.length);
  }
}

function renderFilteredTrainings(data, containerId) {

  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "";

  if (data.length === 0) {

    container.innerHTML = "<p>No trainings found.</p>";
    return;

  }

  data.forEach(training => {

    const skills = training.skills
      ? training.skills.map(skill => `<span class="tag">${skill}</span>`).join("")
      : "";

    const logo = training.logo ? `<img src="${training.logo}" alt="${training.company} logo">` : (training.company ? training.company.charAt(0).toUpperCase() : "C");
    const feeLabel = training.salary ? formatSalary(training.salary) : "Fee undisclosed";
    const levelLabel = training.experience ? `<span class="experience-chip">${training.experience}</span>` : "";

    const card = `
    
    <div class="job-card">

      <div class="job-left">

        <div class="company-logo">
          ${logo}
        </div>

        <div class="job-info">

          <h3>${training.title}</h3>

          <p class="company">${training.company}</p>

          <div class="meta">
            <span>${training.location}</span>
            <span>${training.duration}</span>
          </div>

          <div class="meta">
            <span class="salary-chip">${feeLabel}</span>
            ${levelLabel}
          </div>

          <div class="skills">
            ${skills}
          </div>

        </div>

      </div>

      <div class="job-right">

        <a href="training.html?id=${training.id}" class="view-btn">
          Enroll Now
        </a>

      </div>

    </div>
    
    `;

    container.innerHTML += card;

  });

  updateResultCount(data.length);
}

function updateResultCount(count) {
  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    const type = detectPage() === 'training' ? 'trainings' : 'internships';
    resultCount.innerText = count + ` ${type} found`;
  }
}


// ================= SEARCH =================

function handleSearch() {
  applyFilters();
}

function applyFilters() {
  const keyword = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
  const selectedTypes = Array.from(document.querySelectorAll('.filter-group.job-type input[type="checkbox"]:checked'))
    .map(cb => cb.value.toLowerCase());
  const experience = document.querySelector('input[name="experience"]:checked')?.value || "All";
  const minSalary = Number(document.getElementById("salaryMin")?.value) || 0;
  const maxSalary = document.getElementById("salaryMax")?.value
    ? Number(document.getElementById("salaryMax").value)
    : Infinity;

  const tags = [];
  if (selectedTypes.length > 0) {
    tags.push(...selectedTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)));
  }
  if (experience && experience !== "All") {
    tags.push(experience);
  }
  if (minSalary > 0 || isFinite(maxSalary)) {
    const minLabel = minSalary > 0 ? formatSalary(minSalary) : "Any";
    const maxLabel = isFinite(maxSalary) ? formatSalary(maxSalary) : "Any";
    tags.push(`Fee: ${minLabel} - ${maxLabel}`);
  }

  renderTags(tags);

  const filtered = currentData.filter(job => {
    const jobSalary = Number(job.salary) || 0;
    const matchesSearch = !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.location.toLowerCase().includes(keyword) ||
      job.category?.toLowerCase().includes(keyword) ||
      (job.skills && job.skills.join(" ").toLowerCase().includes(keyword));

    const matchesType = selectedTypes.length === 0 || selectedTypes.some(type => {
      return job.type?.toLowerCase() === type ||
        job.location?.toLowerCase().includes(type) ||
        job.category?.toLowerCase().includes(type);
    });

    const matchesExperience = experience === "All" ||
      job.experience?.toLowerCase() === experience.toLowerCase();

    const matchesSalary = jobSalary >= minSalary && jobSalary <= maxSalary;

    return matchesSearch && matchesType && matchesExperience && matchesSalary;
  });

  if (detectPage() === 'training') {
    renderFilteredTrainings(filtered, getTrainingContainerId());
  } else {
    renderFilteredInternships(filtered, getInternshipContainerId());
  }
}

function formatSalary(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}


// ================= TAG FILTER =================

function filterByTag(tag) {

  if (tag === "all") {

    if (detectPage() === 'training') {
      renderTrainings();
    } else {
      renderInternships();
    }
    return;

  }

  const filtered = currentData.filter(job => {

    return (

      job.category === tag ||

      job.location.toLowerCase().includes(tag)

    );

  });

  if (detectPage() === 'training') {
    renderFilteredTrainings(filtered, getTrainingContainerId());
  } else {
    renderFilteredInternships(filtered, getInternshipContainerId());
  }
}


// ================= DETAILS PAGE =================

async function loadInternshipDetails() {

  const params = new URLSearchParams(window.location.search);

  const jobId = params.get("id");

  if (!jobId) return;

  try {

    const response = await fetch("data/internships.json");

    const internships = await response.json();

    const job = internships.find(j => j.id == jobId);

    if (!job) return;

    document.getElementById("jobTitle").innerText = job.title;

    document.getElementById("jobCompany").innerText =
      job.company + " • " + job.location;

    document.getElementById("jobDuration").innerText =
      "Duration: " + job.duration;

    const location = document.getElementById("jobLocation");
    if (location) location.innerText = job.location;

    const type = document.getElementById("jobType");
    if (type) type.innerText = job.type || "Internship";

    const desc = document.getElementById("jobDescription");
    if (desc) desc.innerText = job.description || "";

    const skills = document.getElementById("jobSkills");

    if (skills) {

      skills.innerHTML = job.skills.map(skill =>
        `<span class="tag">${skill}</span>`
      ).join("");

    }

    const applyBtn = document.getElementById("applyBtn");

    if (applyBtn) {
      applyBtn.href = job.applyLink || "#";
    }

  } catch (error) {

    console.error("Error loading job details:", error);

  }

}


// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

  const page = detectPage();

  if (page === 'internship' || page === 'training') {
    loadInternships();
    loadTrainings();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
      searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          handleSearch();
        }
      });
    }

    const searchButton = document.getElementById("searchBtn");
    if (searchButton) {
      searchButton.addEventListener("click", applyFilters);
    }

    const filterButton = document.getElementById("filterBtn");
    if (filterButton) {
      filterButton.addEventListener("click", applyFilters);
    }
  } else if (page === 'index') {
    // Setup for index page
    loadInternships(); // Load data for featured internships and search
    renderInternships(); // Render featured internships

    const searchBtn = document.querySelector('.search-box button');
    if (searchBtn) {
      searchBtn.addEventListener('click', handleIndexSearch);
    }
  }

  loadInternshipDetails();

});

function renderTags(tags) {
  const tagContainer = document.getElementById('activeTags');
  if (!tagContainer) return;

  tagContainer.innerHTML = '';

  tags.forEach(tag => {
    tagContainer.innerHTML += `<div class="tag">${tag}</div>`;
  });
}

function handleIndexSearch() {
  const keyword = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
  const location = document.getElementById("locationInput")?.value.toLowerCase().trim() || "";

  const filtered = internships.filter(job => {
    const matchesKeyword = !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.category?.toLowerCase().includes(keyword) ||
      (job.skills && job.skills.join(" ").toLowerCase().includes(keyword));

    const matchesLocation = !location || job.location.toLowerCase().includes(location);

    return matchesKeyword && matchesLocation;
  });

  renderIndexSearchResults(filtered);
}

function renderIndexSearchResults(data) {
  const section = document.getElementById("searchResultsSection");
  const container = document.getElementById("searchResults");

  if (!section || !container) return;

  if (data.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
  } else {
    container.innerHTML = "";
    data.forEach(job => {
      const logo = job.logo ? `<img src="${job.logo}" alt="${job.company} logo" style="width:60px;height:60px;border-radius:50%;object-fit:cover;">` : (job.company ? job.company.charAt(0).toUpperCase() : "C");
      const card = `
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body">
              <div style="text-align:center;margin-bottom:15px;">
                ${logo}
              </div>
              <h5 class="card-title">${job.title}</h5>
              <p class="card-text">${job.company} • ${job.location}</p>
              <p class="card-text">${job.description.substring(0, 100)}...</p>
              <a href="internship.html?id=${job.id}" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  }

  section.style.display = "block";
}
