document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'connexion.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    
    if (user.role === 'moderateur' || user.role === 'admin') {
        window.location.href = 'moderation.html';
        return;
    }
    
    const welcomeElement = document.querySelector('h4.center-align');
    if (welcomeElement) {
        welcomeElement.textContent = `Bienvenue, ${user.prenom} ${user.nom}!`;
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'connexion.html';
        });
    }
    
    const datepickerElems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(datepickerElems, {
        format: 'dd mmm yyyy',
        i18n: {
            months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
            weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            cancel: 'Annuler',
            clear: 'Effacer',
            done: 'Ok'
        },
        minDate: new Date(),
        onSelect: function(date) {
            console.log('Date sélectionnée:', date);
            M.toast({html: `Demande pour le ${date.toLocaleDateString()} enregistrée !`});
        }
    });
});
