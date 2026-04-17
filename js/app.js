// ================= GLOBAL DATA =================

let internships = [];


// ================= LOAD INTERNSHIPS =================

async function loadInternships() {

  try {

    const response = await fetch("data/internships.json");
    internships = await response.json();

    renderInternships();

  } catch (error) {

    console.error("Error loading internships:", error);

  }

}


// ================= RENDER ALL =================

function getInternshipContainerId() {
  const container = document.getElementById("internshipContainer") || document.getElementById("jobList");
  return container ? container.id : "internshipContainer";
}

function renderInternships() {
  renderFilteredInternships(internships, getInternshipContainerId());
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

  updateResultCount(data.length);
}

function updateResultCount(count) {
  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    resultCount.innerText = count + " internships found";
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
    tags.push(`Salary: ${minLabel} - ${maxLabel}`);
  }

  renderTags(tags);

  const filtered = internships.filter(job => {
    const jobSalary = Number(job.salary) || 0;
    const matchesSearch = !keyword ||
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.location.toLowerCase().includes(keyword) ||
      job.category.toLowerCase().includes(keyword) ||
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

  renderFilteredInternships(filtered, getInternshipContainerId());
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

    renderInternships();
    return;

  }

  const filtered = internships.filter(job => {

    return (

      job.category === tag ||

      job.location.toLowerCase().includes(tag)

    );

  });

  renderFilteredInternships(filtered, getInternshipContainerId());

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

  loadInternships();

  loadInternshipDetails();

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

});

function renderTags(tags) {
  const tagContainer = document.getElementById('activeTags');
  if (!tagContainer) return;

  tagContainer.innerHTML = '';

  tags.forEach(tag => {
    tagContainer.innerHTML += `<div class="tag">${tag}</div>`;
  });
}
