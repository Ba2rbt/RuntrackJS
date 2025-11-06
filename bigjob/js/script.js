document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (!email.endsWith('@laplateforme.io')) {
                M.toast({html: 'Erreur : L\'adresse email doit se terminer par @laplateforme.io'});
                return;
            }
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            if (password !== confirmPassword) {
                M.toast({html: 'Erreur : Les mots de passe ne correspondent pas.'});
                return;
            }

            M.toast({html: 'Inscription réussie ! Vous allez être redirigé.'});
            setTimeout(() => {
                window.location.href = 'connexion.html';
            }, 2000);
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!email.endsWith('@laplateforme.io')) {
                M.toast({html: 'Erreur : L\'adresse email doit se terminer par @laplateforme.io'});
                return;
            }
            
            const usersData = [
                {email: 'admin@laplateforme.io', password: 'password123', nom: 'Admin', prenom: 'Super', role: 'admin'},
                {email: 'modo@laplateforme.io', password: 'password123', nom: 'Modo', prenom: 'Jean', role: 'moderateur'},
                {email: 'jane.doe@laplateforme.io', password: 'password123', nom: 'Etudiant', prenom: 'Jane', role: 'utilisateur'}
            ];
            
            const user = usersData.find(u => u.email === email && u.password === password);
            
            if (!user) {
                M.toast({html: 'Erreur : Email ou mot de passe incorrect'});
                return;
            }
            
            const userData = {
                email: user.email,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            M.toast({html: 'Connexion réussie !'});
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
});
