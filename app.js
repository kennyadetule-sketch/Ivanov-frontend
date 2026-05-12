
// ================= SESSION CONTROL =================
window.addEventListener("load", () => {
  if (localStorage.getItem("bonusUsed") === "true") {
    const btn = document.getElementById("bonusBtn");
    if (btn) btn.disabled = true;
  }
});
// Auto redirect if already logged in
if (localStorage.getItem("token") && window.location.pathname.includes("login.html")) {
  window.location.href = "dashboard.html";
}

// Protect dashboard
if (window.location.pathname.includes("dashboard") && !localStorage.getItem("token")) {
  window.location.href = "login.html";
}

// ================= NAVIGATION =================

function go(page) {
  window.location.href = page;
}

function goSignup() {
  window.location.href = "signup.html";
}

function goLogin() {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}

// ================= AUTH =================

// SIGNUP
function signup() {
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const btn = document.querySelector(".btn");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !username || !password) {
    showError("All fields are required");
    return;
  }

  if (!emailPattern.test(email)) {
    showError("Please enter a valid email address");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters");
    return;
  }

  btn.textContent = "Creating Account...";
  btn.disabled = true;

  fetch('https://ivanov.onrender.com/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showSuccess(data.message || 'Account created successfully!');
        window.location.href = 'login.html';
      } else {
        showError(data.message || 'Signup failed');
      }
    })
    .catch(err => {
      console.error(err);
      showError('Server error. Please try again later.');
    })
    .finally(() => {
      btn.textContent = 'Create Account';
      btn.disabled = false;
    });
}

// LOGIN
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const btn = document.querySelector(".btn");

  if (!username || !password) {
    showError("Enter username and password");
    return;
  }

  btn.textContent = "Logging in...";
  btn.disabled = true;

  fetch('https://ivanov.onrender.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        showSuccess("Login successful!");
        window.location.href = "dashboard.html";
      } else {
        showError(data.message || "Invalid login");
      }
    })
    .catch(err => {
      console.error(err);
      showError("Server error. Please try again.");
    })
    .finally(() => {
      btn.textContent = "Login";
      btn.disabled = false;
    });
}


// ================= BONUS SYSTEM =================

function applyBonus() {

  let budget = document.getElementById("budget");

  // Prevent reuse
  if (localStorage.getItem("bonusUsed") === "true") {
    alert("Bonus already used!");
    return;
  }

  // Ensure budget exists
  if (!budget.value) {
    alert("Enter budget first");
    return;
  }

  // ===== ANDROID APP =====
  // Show rewarded AdMob ad
  if (window.Android) {
    Android.showRewardedAd();
    return;
  }

  // ===== WEBSITE FALLBACK =====
  // Apply directly if not inside app

  let value = parseFloat(
    budget.value.replace(/[^0-9.]/g, "")
  );

  if (isNaN(value)) {
    alert("Enter a valid number");
    return;
  }

  let discounted = value * 0.8;

  budget.value = discounted.toFixed(2);

  localStorage.setItem("bonusUsed", "true");

  document.getElementById("bonusBtn").disabled = true;

  alert("20% bonus applied successfully!");
}

// ================= SERVICE REQUEST =================

function submitRequest(service) {
  const btn = event.target;

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    address: document.getElementById("address").value.trim(),
    description: document.getElementById("description")?.value.trim() || "",
    budget: document.getElementById("budget").value.trim(),
    service: service
  };

  if (!data.name || !data.email || !data.phone || !data.address || !data.budget) {
    showError("Please fill in all required fields.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    showError("Please enter a valid email address.");
    return;
  }

  const cleanedBudget = data.budget.replace(/[^0-9.]/g, "");
  if (!cleanedBudget || isNaN(cleanedBudget)) {
    showError("Please enter a valid budget.");
    return;
  }

  data.budget = parseFloat(cleanedBudget);

  btn.textContent = "Submitting...";
  btn.disabled = true;

  fetch('https://ivanov.onrender.com/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(async res => {
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Request submission failed');
      return result;
    })
    .then(result => {
      showSuccess(result.message || 'Request submitted successfully! We will contact you within 4–8 hours.');
      document.querySelector('form')?.reset();
    })
    .catch(err => {
      console.error(err);
      showError(err.message || 'Error submitting request. Please try again.');
    })
    .finally(() => {
      btn.textContent = 'Submit';
      btn.disabled = false;
    });
}

function showSuccess(message) {
  alert('✅ ' + message);
}

function showError(message) {
  alert('❌ ' + message);
}

// ================= PASSWORD STRENGTH =================

function checkPasswordStrength(password) {
  const hint = document.getElementById("passwordHint");

  if (!hint) return;

  if (password.length < 6) {
    hint.textContent = "Weak password (use at least 6 characters)";
    hint.style.color = "red";
  } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    hint.textContent = "Medium strength (add uppercase & number)";
    hint.style.color = "orange";
  } else {
    hint.textContent = "Strong password";
    hint.style.color = "green";
  }
}

// ================= SLIDER =================
const slider = document.querySelector(".slider-track");

if (slider) {
  // Duplicate images for infinite loop
  slider.innerHTML += slider.innerHTML;

  let scrollAmount = 0;

  function autoScroll() {
    scrollAmount += 0.1;

    if (scrollAmount >= slider.scrollWidth / 2) {
      scrollAmount = 0;
    }

    slider.style.transform = `translateX(-${scrollAmount}px)`;
    requestAnimationFrame(autoScroll);
  }

  autoScroll();
}

