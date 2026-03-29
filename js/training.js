let institutes = [];

async function loadInstitutes(){

const response = await fetch("data/institutes.json");

institutes = await response.json();

renderInstitutes(institutes);

}

document.addEventListener("DOMContentLoaded", loadInstitutes);
function renderInstitutes(data){

const container = document.getElementById("trainingContainer");

container.innerHTML = "";

data.forEach(inst => {

const card = `
<div class="col-md-4">

<div class="card h-100 shadow-sm">

<div class="card-body">

<h5 class="fw-bold">${inst.name}</h5>

<p class="text-muted small">
${inst.location} • ${inst.mode}
</p>

<div class="mb-3">
${inst.courses.slice(0,3).map(course =>
`<span class="badge text-bg-light me-1">${course}</span>`
).join("")}
</div>

<p class="small text-muted">
${inst.duration}
</p>

<a href="institute-details.html?id=${inst.id}" class="btn btn-sm btn-primary">
View Institute
</a>

</div>

</div>

</div>
`;

container.innerHTML += card;

});

}
function filterInstitutes(){

const location =
document.getElementById("locationFilter").value.toLowerCase();

const mode =
document.getElementById("modeFilter").value.toLowerCase();

const filtered = institutes.filter(inst => {

return (

(location === "" || inst.location.toLowerCase().includes(location)) &&

(mode === "" || inst.mode.toLowerCase() === mode)

);

});

renderInstitutes(filtered);

}