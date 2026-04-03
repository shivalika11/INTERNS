
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

function renderInternships() {
  renderFilteredInternships(internships, "internshipContainer");
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

    const card = `
    <div class="col-md-6 col-lg-4">

      <div class="card internship-card shadow-sm p-3 h-100">

        <div class="d-flex justify-content-between align-items-start mb-2">

          <div>
            <h5 class="fw-bold mb-1">${job.title}</h5>
            <p class="text-muted small mb-0">${job.company}</p>
          </div>

          <span class="badge bg-light text-dark">${job.location}</span>

        </div>

        <div class="mb-3">
          ${job.skills.map(skill =>
            `<span class="badge bg-secondary me-1">${skill}</span>`
          ).join("")}
        </div>

        <div class="d-flex justify-content-between align-items-center mt-auto">

          <small class="text-muted">
            ${job.duration}
          </small>

          <a href="pages/internship.html?id=${job.id}" class="btn btn-primary btn-sm">
            View Details
          </a>

        </div>

      </div>

    </div>
    `;

    container.innerHTML += card;

  });

  const resultCount = document.getElementById("resultCount");
  if (resultCount) {
    resultCount.innerText = data.length + " internships found";
  }

}


// ================= SEARCH =================

function handleSearch() {

  const input = document.getElementById("searchInput");
  if (!input) return;

  const keyword = input.value.toLowerCase();

  const filtered = internships.filter(job => {

    return (
      job.title.toLowerCase().includes(keyword) ||
      job.company.toLowerCase().includes(keyword) ||
      job.skills.join(" ").toLowerCase().includes(keyword)
    );

  });

  renderFilteredInternships(filtered, "internshipContainer");

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

  renderFilteredInternships(filtered, "internshipContainer");

}


// ================= DETAILS PAGE =================

async function loadInternshipDetails() {

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (!jobId) return;

  try {

    const response = await fetch("../data/internships.json");
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
        `<span class="badge text-bg-light me-1">${skill}</span>`
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

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
  }

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }

});

