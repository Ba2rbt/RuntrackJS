const connexionForm = document.getElementById("connexionForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageConnexion = document.getElementById("messageConnexion");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function validerEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function afficherErreur(element, message) {
    element.textContent = message;
}

function effacerErreurs() {
    emailError.textContent = "";
    passwordError.textContent = "";
    messageConnexion.textContent = "";
    messageConnexion.className = "message-connexion";
}

connexionForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    effacerErreurs();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    let valide = true;
    
    if (!email) {
        afficherErreur(emailError, "L'email est obligatoire");
        valide = false;
    } else if (!validerEmail(email)) {
        afficherErreur(emailError, "L'email n'est pas valide");
        valide = false;
    }
    
    if (!password) {
        afficherErreur(passwordError, "Le mot de passe est obligatoire");
        valide = false;
    } else if (password.length < 6) {
        afficherErreur(passwordError, "Le mot de passe doit contenir au moins 6 caractères");
        valide = false;
    }
    
    if (valide) {
        messageConnexion.textContent = "Connexion en cours...";
        messageConnexion.className = "message-connexion success";
        
        console.log("Email :", email);
        console.log("Mot de passe :", password);
    }
});

emailInput.addEventListener("blur", function() {
    if (this.value && !validerEmail(this.value)) {
        afficherErreur(emailError, "Format d'email invalide");
    }
});

passwordInput.addEventListener("blur", function() {
    if (this.value && this.value.length < 6) {
        afficherErreur(passwordError, "Minimum 6 caractères requis");
    }
});