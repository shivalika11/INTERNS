// ================= LOAD DATA =================

let internships = [];

async function loadInternships(){

const response = await fetch("data/internships.json");
internships = await response.json();

console.log("Loaded:", internships);

renderInternships();

}

// ================= RENDER ALL =================

function renderInternships() {
  renderFilteredInternships(internships, "featuredContainer");
}

// ================= RENDER FILTERED =================

function renderFilteredInternships(data, containerId) {

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
if(data.length === 0){
container.innerHTML = "<p>No internships found.</p>";
return;
}
  data.forEach(job => {

const card = `
<div class="col-md-6 col-lg-4">

<div class="card internship-list-card p-3 mb-4">

<h6 class="fw-bold">${job.title}</h6>

<p class="text-muted mb-2">
${job.company} • ${job.location}
</p>

<div class="tags mb-3">
${job.skills.map(skill =>
`<span class="badge bg-light text-dark">${skill}</span>`
).join("")}
</div>

<div class="d-flex justify-content-between align-items-center">

<small class="text-muted">
${job.duration}
</small>

<a href="pages/internship.html?id=${job.id}" 
class="btn btn-primary btn-sm">
View
</a>

</div>

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

  const filtered = internships.filter(job => {

return (

job.title.toLowerCase().includes(keyword) ||
job.company.toLowerCase().includes(keyword) ||
job.skills.join(" ").toLowerCase().includes(keyword)

);

  });

  renderFilteredInternships(filtered, "searchResults");
  document.getElementById("searchResultsSection").style.display = "block";
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

  renderFilteredInternships(filtered, "featuredContainer");
}

// ================= DETAILS PAGE =================

async function loadInternshipDetails() {

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (!jobId) return;

const response = await fetch("data/internships.json");
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
`<span class="badge text-bg-light">${skill}</span>`
).join("");

}

// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

  loadInternships();
  loadInternshipDetails();

  // Add search event listener
  document.getElementById("searchBtn").addEventListener("click", handleSearch);

  // Optional: search on enter key
  document.getElementById("searchInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

});

