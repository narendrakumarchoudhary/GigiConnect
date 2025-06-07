// ------------------- Worker List -------------------
const workers = [
  { name: "Ravi Sharma", category: "electrician", rate: 200, location: "Jaipur", rating: 4.8 },
  { name: "Sita Verma", category: "plumber", rate: 180, location: "Ajmer", rating: 4.5 },
  { name: "Ajay Meena", category: "painter", rate: 150, location: "Udaipur", rating: 4.2 },
  { name: "Priya Yadav", category: "cleaner", rate: 100, location: "Jodhpur", rating: 4.6 },
  { name: "Vikas Rathore", category: "carpenter", rate: 220, location: "Jaipur", rating: 4.7 },
  { name: "Kiran Jangid", category: "gardener", rate: 130, location: "Ajmer", rating: 4.1 },
  { name: "Ramesh Patel", category: "electrician", rate: 250, location: "Kota", rating: 4.3 },
  { name: "Anita Sen", category: "cook", rate: 120, location: "Jodhpur", rating: 4.9 },
  { name: "Manoj Singh", category: "driver", rate: 300, location: "Bikaner", rating: 4.4 },
  { name: "Neha Kumari", category: "tutor", rate: 250, location: "Kota", rating: 4.7 },
  { name: "Suresh Bhandari", category: "welder", rate: 220, location: "Jodhpur", rating: 4.0 },
  { name: "Komal Jain", category: "beautician", rate: 300, location: "Udaipur", rating: 4.8 },
  { name: "Harish Lodha", category: "mechanic", rate: 210, location: "Ajmer", rating: 4.6 },
  { name: "Sunita Chaudhary", category: "babysitter", rate: 180, location: "Jaipur", rating: 4.5 },
  { name: "Vishal Goyal", category: "electrician", rate: 260, location: "Kota", rating: 4.2 },
  { name: "Radha Pareek", category: "cook", rate: 150, location: "Ajmer", rating: 4.6 },
  { name: "Rajeev Khandelwal", category: "housekeeper", rate: 140, location: "Bhilwara", rating: 4.3 },
  { name: "Aarti Rawal", category: "tailor", rate: 120, location: "Jodhpur", rating: 4.9 },
  { name: "Mukesh Soni", category: "goldsmith", rate: 500, location: "Udaipur", rating: 4.9 },
  { name: "Kavita Mehra", category: "painter", rate: 160, location: "Jaisalmer", rating: 4.1 },
  { name: "Rohit Kasliwal", category: "electrician", rate: 210, location: "Jaipur", rating: 4.4 },
  { name: "Jyoti Choudhary", category: "cleaner", rate: 110, location: "Ajmer", rating: 4.2 },
  { name: "Arvind Bishnoi", category: "driver", rate: 280, location: "Kota", rating: 4.7 },
  { name: "Sonal Sharma", category: "makeup", rate: 350, location: "Bikaner", rating: 4.8 },
  { name: "Mahesh Dhoot", category: "plumber", rate: 190, location: "Jaipur", rating: 4.6 },
  { name: "Poonam Rathore", category: "babysitter", rate: 170, location: "Ajmer", rating: 4.5 },
  { name: "Narendra Sen", category: "security", rate: 200, location: "Kota", rating: 4.3 },
  { name: "Rekha Solanki", category: "tailor", rate: 130, location: "Jodhpur", rating: 4.7 },
  { name: "Devendra Mali", category: "gardener", rate: 160, location: "Udaipur", rating: 4.4 },
  { name: "Preeti Gaur", category: "maid", rate: 100, location: "Bhilwara", rating: 4.1 }
];

// ------------------- Render Workers -------------------
function applyFilters() {
  const category = document.getElementById("category")?.value || "all";
  const location = document.getElementById("location")?.value || "all";
  const minRate = parseInt(document.getElementById("minRate")?.value) || 0;
  const maxRate = parseInt(document.getElementById("maxRate")?.value) || Infinity;

  const list = document.getElementById("workerList");
  if (!list) return;

  list.innerHTML = "";

  const filtered = workers.filter(w =>
    (category === "all" || w.category === category) &&
    (location === "all" || w.location === location) &&
    w.rate >= minRate &&
    w.rate <= maxRate
  );

  if (filtered.length === 0) {
    list.innerHTML = "<p>No workers match your filters.</p>";
    return;
  }

  filtered.forEach(worker => {
    const card = document.createElement("div");
    card.className = "worker-card";
    card.innerHTML = `
      <h3>${worker.name}</h3>
      <p><strong>Category:</strong> ${worker.category}</p>
      <p><strong>Rate:</strong> ₹${worker.rate}</p>
      <p><strong>Location:</strong> ${worker.location}</p>
      <p><strong>Rating:</strong> ${worker.rating} ⭐</p>
      <button>Contact</button>
    `;
    list.appendChild(card);
  });
}

// ------------------- Hamburger Menu -------------------
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}

// ------------------- Login/Logout Visibility -------------------
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if (loginBtn && logoutBtn) {
  loginBtn.style.display = isLoggedIn ? "none" : "inline-block";
  logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    alert("You have been logged out.");
    window.location.href = "index.html";
  });
}

// ------------------- On Load -------------------
window.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});
