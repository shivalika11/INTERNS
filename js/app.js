javascript
// ================= LOAD DATA =================

let internships = [];

async function loadInternships(){

const response = await fetch("data/internships.json");
internships = await response.json();

renderInternships();

}

// ================= RENDER ALL =================

function renderInternships() {
  renderFilteredInternships(internships);
}

// ================= RENDER FILTERED =================

function renderFilteredInternships(data) {

  const container = document.getElementById("internshipContainer");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(job => {

const card = `
<div class="card internship-list-card mb-3 p-3">

      <div class="d-flex justify-content-between align-items-center">

        <div>
          <h6 class="fw-bold mb-1">${job.title}</h6>

          <p class="text-muted mb-2">
            ${job.company} • ${job.location}
          </p>

<div class="tags">
${job.skills.map(skill =>
`<span class="badge bg-light text-dark me-1">${skill}</span>`
).join("")}
</div>

</div>

<div>

<a href="pages/internship.html?id=${job.id}" 
class="btn btn-primary btn-sm">
View Details
</a>

      </div>

</div>
`;

    container.innerHTML += card;

  });

}

// ================= SEARCH =================

function handleSearch(){

const keyword =
document.getElementById("searchInput").value.toLowerCase();

const location =
document.getElementById("locationInput").value.toLowerCase();

  const filtered = internships.filter(job => {

return (

(
job.title.toLowerCase().includes(keyword) ||
job.company.toLowerCase().includes(keyword) ||
job.skills.join(" ").toLowerCase().includes(keyword)
)

&&

(
location === "" ||
job.location.toLowerCase().includes(location)
)

);

  });

  renderFilteredInternships(filtered);
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

  renderFilteredInternships(filtered);
}

// ================= DETAILS PAGE =================

async function loadInternshipDetails() {

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (!jobId) return;

const response = await fetch("../data/internships.json");
const internships = await response.json();

const job = internships.find(j => j.id == jobId);

if(!job) return;

document.getElementById("jobTitle").innerText = job.title;

document.getElementById("jobCompany").innerText =
job.company + " • " + job.location;

document.getElementById("jobDuration").innerText =
"Duration: " + job.duration;

document.getElementById("jobSkills").innerHTML =
job.skills.map(skill =>
<span class="badge text-bg-light">${skill}</span>
).join("");

}

// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

  loadInternships();
  loadInternshipDetails();

});

