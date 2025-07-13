document.addEventListener("DOMContentLoaded", function () {
    // Sign-Up Process
    document.querySelector(".sign-up-container form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent actual form submission

        let username = document.querySelector(".sign-up-container input[name='username']").value;
        let email = document.querySelector(".sign-up-container input[name='email']").value;
        let password = document.querySelector(".sign-up-container input[name='password']").value;

        if (username && email && password) {
            // Store user data in localStorage
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPassword", password);

            alert("Sign-up successful! You can now log in.");
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Log-In Process
    document.querySelector(".sign-in-container form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent actual form submission

        let email = document.querySelector(".sign-in-container input[name='email']").value;
        let password = document.querySelector(".sign-in-container input[name='password']").value;

        let storedEmail = localStorage.getItem("userEmail");
        let storedPassword = localStorage.getItem("userPassword");

        if (email === storedEmail && password === storedPassword) {
            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to another page
        } else {
            alert("Invalid email or password. Try again.");
        }
    });
});
// Firebase Configuration (Replace with your own Firebase config)
// const firebaseConfig = {
//     apiKey: "AIzaSyD4tp0diYMyuFRFhuB1xI7izkShuNQejrQ",
//     authDomain: "devknights-5ff52.firebaseapp.com",
//     projectId: "devknights-5ff52",
//     storageBucket: "devknights-5ff52.firebasestorage.app",
//     messagingSenderId: "752875440538",
//     appId: "1:752875440538:web:f524275e7c635632d25223",
//     measurementId: "G-8HH3L6L8QF"
// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth(); // Removed duplicate declaration

document.addEventListener("DOMContentLoaded", function () {

    // Sign-Up Process
    document.querySelector(".sign-up-container form").addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.querySelector(".sign-up-container input[name='username']").value;
        let email = document.querySelector(".sign-up-container input[name='email']").value;
        let password = document.querySelector(".sign-up-container input[name='password']").value;

        if (username && email && password) {
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    alert("Sign-up successful! You can now log in.");
                })
                .catch((error) => {
                    alert(error.message);
                });
        } else {
            alert("Please fill in all fields.");
        }
    });

    // Log-In Process
    document.querySelector(".sign-in-container form").addEventListener("submit", function (event) {
        event.preventDefault();

        let email = document.querySelector(".sign-in-container input[name='email']").value;
        let password = document.querySelector(".sign-in-container input[name='password']").value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert("Login successful!");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            })
            .catch((error) => {
                alert("Invalid email or password. Try again.");
            });
    });
});

// const db = firebase.firestore(); // Removed duplicate declaration

function logVolunteerHours(userId, hours) {
    const userRef = db.collection("volunteers").doc(userId);

    userRef.get().then((doc) => {
        if (doc.exists) {
            let newTotal = (doc.data().total_hours || 0) + hours;
            userRef.update({ total_hours: newTotal });
        } else {
            userRef.set({ total_hours: hours });
        }
    });
}
function setupLiveDashboard() {
    db.collection("volunteers").onSnapshot((snapshot) => {
        let totalHours = 0;
        let volunteerList = "";

        snapshot.forEach((doc) => {
            let data = doc.data();
            totalHours += data.total_hours;
            volunteerList += `<li>${data.name}: ${data.total_hours} hours</li>`;
        });

        document.getElementById("dashboard-total-hours").innerText = totalHours;
        document.getElementById("volunteer-list").innerHTML = volunteerList;
    });
}

// Call this function when the dashboard loads
setupLiveDashboard();
const auth = firebase.auth();
const db = firebase.firestore();
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        setupLiveDashboard(); // Load data if logged in
    } else {
        alert("Please log in first.");
        window.location.href = "login.html"; // Redirect if not logged in
    }
});

