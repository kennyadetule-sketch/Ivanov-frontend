// ================= ADMIN AUTH =================

// ADMIN LOGIN
function adminLogin() {
  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  if (!username || !password) {
    alert("Enter admin username and password");
    return;
  }

  fetch('https://ivanov-project-production.up.railway.app/admin-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(async res => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  })
  .then(data => {
    if (data.success && data.token) {
      localStorage.setItem("adminToken", data.token);

      // 🔥 DEBUG (you can remove later)
      console.log("Admin token saved:", localStorage.getItem("adminToken"));

      window.location.href = "admin.html";
    } else {
      alert("Invalid admin login");
    }
  })
  .catch(err => {
    console.error(err);
    alert(err.message || "Server error");
  });
}