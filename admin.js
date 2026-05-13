// ================= ADMIN PROTECTION =================

if (!localStorage.getItem("adminToken")) {
  window.location.href = "admin-login.html";
}

// ================= ADMIN PROTECTION =================

// Only protect admin page (not login page)
if (window.location.pathname.includes("admin.html")) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "admin-login.html";
  }
}

// ================= FETCH REQUESTS =================

function loadRequests() {
  fetch('https://ivanov-project.up.railway.app/requests', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  }
})
    .then(res => res.json())
    .then(data => {
  const tableBody = document.querySelector("#requestTable tbody");
  tableBody.innerHTML = "";

  if (!data.success || !data.data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">No requests yet</td>
      </tr>
    `;
    return;
  }

  data.data.forEach(req => {
    const row = `
      <tr>
        <td>${req.name}</td>
        <td>${req.email}</td>
        <td>${req.phone}</td>
        <td>${req.address}</td>
        <td>${req.budget}</td>
        <td>${req.service}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
})
    .catch(err => {
      console.error(err);
      alert("Failed to load requests. Check server.");
    });
}

// Load immediately when page opens
loadRequests();

// ================= LOGOUT =================

function adminLogout() {
  localStorage.removeItem("adminToken");
  window.location.href = "admin-login.html";
}