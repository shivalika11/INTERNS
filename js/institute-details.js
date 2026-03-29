async function loadInstituteDetails(){

const params = new URLSearchParams(window.location.search);

const instId = params.get("id");

if(!instId) return;

const response = await fetch("data/institutes.json");

const institutes = await response.json();

const inst = institutes.find(i => i.id === instId);

if(!inst) return;

document.getElementById("instName").innerText = inst.name;

document.getElementById("instLocation").innerText =
inst.location + " • " + inst.mode;

document.getElementById("instDuration").innerText =
"Program Duration: " + inst.duration;

document.getElementById("instCourses").innerHTML =
inst.courses.map(course =>
`<span class="badge text-bg-light me-1 mb-1">${course}</span>`
).join("");

document.getElementById("instDescription").innerText =
inst.description;

if(inst.website){
document.getElementById("instWebsite").href = inst.website;
}else{
document.getElementById("instWebsite").style.display = "none";
}

}

document.addEventListener("DOMContentLoaded", loadInstituteDetails);