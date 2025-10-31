const inscriptionForm = document.getElementById("inscriptionForm");
const nomInput = document.getElementById("nom");
const prenomInput = document.getElementById("prenom");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const adresseInput = document.getElementById("adresse");
const codePostalInput = document.getElementById("codePostal");
const messageInscription = document.getElementById("messageInscription");
const nomError = document.getElementById("nomError");
const prenomError = document.getElementById("prenomError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const adresseError = document.getElementById("adresseError");
const codePostalError = document.getElementById("codePostalError");

function validerEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validerCodePostal(codePostal) {
    const regex = /^[0-9]{5}$/;
    return regex.test(codePostal);
}

function afficherErreur(element, message) {
    element.textContent = message;
}

function effacerErreurs() {
    nomError.textContent = "";
    prenomError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    adresseError.textContent = "";
    codePostalError.textContent = "";
    messageInscription.textContent = "";
    messageInscription.className = "message-inscription";
}

inscriptionForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    effacerErreurs();
    
    const nom = nomInput.value.trim();
    const prenom = prenomInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const adresse = adresseInput.value.trim();
    const codePostal = codePostalInput.value.trim();
    
    let valide = true;
    
    if (!nom) {
        afficherErreur(nomError, "Le nom est obligatoire");
        valide = false;
    } else if (nom.length < 2) {
        afficherErreur(nomError, "Le nom doit contenir au moins 2 caractères");
        valide = false;
    }
    
    if (!prenom) {
        afficherErreur(prenomError, "Le prénom est obligatoire");
        valide = false;
    } else if (prenom.length < 2) {
        afficherErreur(prenomError, "Le prénom doit contenir au moins 2 caractères");
        valide = false;
    }
    
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
    
    if (!adresse) {
        afficherErreur(adresseError, "L'adresse est obligatoire");
        valide = false;
    } else if (adresse.length < 5) {
        afficherErreur(adresseError, "L'adresse doit contenir au moins 5 caractères");
        valide = false;
    }
    
    if (!codePostal) {
        afficherErreur(codePostalError, "Le code postal est obligatoire");
        valide = false;
    } else if (!validerCodePostal(codePostal)) {
        afficherErreur(codePostalError, "Le code postal doit contenir 5 chiffres");
        valide = false;
    }
    
    if (valide) {
        const data = {
            nom: nom,
            prenom: prenom,
            email: email,
            password: password,
            adresse: adresse,
            codePostal: codePostal
        };
        
        fetch('inscription.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                messageInscription.textContent = "Inscription réussie ! Redirection...";
                messageInscription.className = "message-inscription success";
                setTimeout(() => {
                    window.location.href = "connexion.html";
                }, 2000);
            } else {
                messageInscription.textContent = result.message;
                messageInscription.className = "message-inscription error";
            }
        })
        .catch(error => {
            console.error("Erreur :", error);
            messageInscription.textContent = "Erreur lors de l'inscription";
            messageInscription.className = "message-inscription error";
        });
    }
});

nomInput.addEventListener("blur", function() {
    if (!this.value || this.value.length < 2) {
        afficherErreur(nomError, "Minimum 2 caractères requis");
    } else {
        nomError.textContent = "";
    }
});

prenomInput.addEventListener("blur", function() {
    if (!this.value || this.value.length < 2) {
        afficherErreur(prenomError, "Minimum 2 caractères requis");
    } else {
        prenomError.textContent = "";
    }
});

emailInput.addEventListener("blur", function() {
    if (!this.value || !validerEmail(this.value)) {
        afficherErreur(emailError, "Format d'email invalide");
    } else {
        emailError.textContent = "";
    }
});

passwordInput.addEventListener("blur", function() {
    if (!this.value || this.value.length < 6) {
        afficherErreur(passwordError, "Minimum 6 caractères requis");
    } else {
        passwordError.textContent = "";
    }
});

adresseInput.addEventListener("blur", function() {
    if (!this.value || this.value.length < 5) {
        afficherErreur(adresseError, "Minimum 5 caractères requis");
    } else {
        adresseError.textContent = "";
    }
});

codePostalInput.addEventListener("blur", function() {
    if (!this.value || !validerCodePostal(this.value)) {
        afficherErreur(codePostalError, "Format invalide (5 chiffres)");
    } else {
        codePostalError.textContent = "";
    }
});