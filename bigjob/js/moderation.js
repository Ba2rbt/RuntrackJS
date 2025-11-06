document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'connexion.html';
        return;
    }
    
    const user = JSON.parse(currentUser);
    
    if (user.role !== 'moderateur' && user.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    
    const welcomeElement = document.querySelector('h4.center-align');
    if (welcomeElement) {
        welcomeElement.textContent = `Bienvenue, ${user.prenom} ${user.nom}!`;
    }
    
    M.Tabs.init(document.querySelectorAll('.tabs'));
    
    const demandes = {
        'Jane Etudiant': {email: 'jane.doe@laplateforme.io', date: '15 Nov 2025', status: 'pending'},
        'John Etudiant': {email: 'john.smith@laplateforme.io', date: '18 Nov 2025', status: 'pending'},
        'Marie Etudiant': {email: 'marie.dupont@laplateforme.io', date: '20 Nov 2025', status: 'accepted'},
        'Pierre Etudiant': {email: 'pierre.martin@laplateforme.io', date: '22 Nov 2025', status: 'rejected'}
    };
    
    const demandesParDate = {};
    Object.entries(demandes).forEach(([student, data]) => {
        if (!demandesParDate[data.date]) {
            demandesParDate[data.date] = [];
        }
        demandesParDate[data.date].push({student, ...data});
    });
    
    const datepickerElems = document.querySelectorAll('#calendar-picker');
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
        onSelect: function(date) {
            const selectedDate = date.toLocaleDateString('fr-FR', {day: '2-digit', month: 'short', year: 'numeric'}).replace(/\./g, '');
            const capitalizedDate = selectedDate.charAt(0).toUpperCase() + selectedDate.slice(1);
            
            const requestsList = document.getElementById('calendar-requests-list');
            requestsList.innerHTML = '';
            
            let found = false;
            Object.entries(demandesParDate).forEach(([dateStr, demands]) => {
                if (dateStr.toLowerCase().includes(capitalizedDate.toLowerCase())) {
                    found = true;
                    demands.forEach(demand => {
                        const li = document.createElement('li');
                        li.className = 'collection-item';
                        
                        let statusColor = 'grey-text';
                        let statusLabel = 'En attente';
                        if (demand.status === 'accepted') {
                            statusColor = 'green-text';
                            statusLabel = 'Accepté';
                        } else if (demand.status === 'rejected') {
                            statusColor = 'red-text';
                            statusLabel = 'Refusé';
                        }
                        
                        li.innerHTML = `
                            <div>
                                <strong>${demand.student}</strong>
                                <p>${demand.email}</p>
                                <span class="${statusColor}">${statusLabel}</span>
                            </div>
                        `;
                        requestsList.appendChild(li);
                    });
                }
            });
            
            if (!found) {
                const li = document.createElement('li');
                li.className = 'collection-item';
                li.textContent = 'Aucune demande pour cette date';
                requestsList.appendChild(li);
            }
        }
    });
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'connexion.html';
        });
    }
    
    const acceptBtns = document.querySelectorAll('.accept-btn');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const student = row.cells[0].textContent;
            const date = row.cells[2].textContent;
            
            const acceptedTbody = document.getElementById('accepted-tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${student}</td>
                <td>${row.cells[1].textContent}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-small waves-effect waves-light orange undo-btn">Annuler</button>
                </td>
            `;
            
            acceptedTbody.appendChild(newRow);
            row.remove();
            
            M.toast({html: `Demande de ${student} acceptée pour le ${date}`});
            
            const undoBtns = document.querySelectorAll('.undo-btn');
            undoBtns.forEach(undoBtn => {
                if (!undoBtn.hasListener) {
                    undoBtn.addEventListener('click', handleUndo);
                    undoBtn.hasListener = true;
                }
            });
        });
    });
    
    const rejectBtns = document.querySelectorAll('.reject-btn');
    rejectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const student = row.cells[0].textContent;
            const date = row.cells[2].textContent;
            
            const rejectedTbody = document.getElementById('rejected-tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${student}</td>
                <td>${row.cells[1].textContent}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-small waves-effect waves-light orange undo-btn">Annuler</button>
                </td>
            `;
            
            rejectedTbody.appendChild(newRow);
            row.remove();
            
            M.toast({html: `Demande de ${student} refusée pour le ${date}`});
            
            const undoBtns = document.querySelectorAll('.undo-btn');
            undoBtns.forEach(undoBtn => {
                if (!undoBtn.hasListener) {
                    undoBtn.addEventListener('click', handleUndo);
                    undoBtn.hasListener = true;
                }
            });
        });
    });
    
    function handleUndo() {
        const row = this.closest('tr');
        const student = row.cells[0].textContent;
        const date = row.cells[2].textContent;
        
        const pendingTbody = document.getElementById('pending-tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${student}</td>
            <td>${row.cells[1].textContent}</td>
            <td>${date}</td>
            <td>
                <button class="btn-small waves-effect waves-light green accept-btn">Accepter</button>
                <button class="btn-small waves-effect waves-light red reject-btn">Refuser</button>
            </td>
        `;
        
        pendingTbody.appendChild(newRow);
        row.remove();
        
        M.toast({html: `Demande de ${student} remise en attente`});
        
        const newAcceptBtns = document.querySelectorAll('.accept-btn');
        newAcceptBtns.forEach(btn => {
            if (!btn.hasListener) {
                btn.addEventListener('click', handleAccept);
                btn.hasListener = true;
            }
        });
        
        const newRejectBtns = document.querySelectorAll('.reject-btn');
        newRejectBtns.forEach(btn => {
            if (!btn.hasListener) {
                btn.addEventListener('click', handleReject);
                btn.hasListener = true;
            }
        });
    }
    
    function handleAccept() {
        const row = this.closest('tr');
        const student = row.cells[0].textContent;
        const date = row.cells[2].textContent;
        
        const acceptedTbody = document.getElementById('accepted-tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${student}</td>
            <td>${row.cells[1].textContent}</td>
            <td>${date}</td>
            <td>
                <button class="btn-small waves-effect waves-light orange undo-btn">Annuler</button>
            </td>
        `;
        
        acceptedTbody.appendChild(newRow);
        row.remove();
        
        M.toast({html: `Demande de ${student} acceptée`});
    }
    
    function handleReject() {
        const row = this.closest('tr');
        const student = row.cells[0].textContent;
        const date = row.cells[2].textContent;
        
        const rejectedTbody = document.getElementById('rejected-tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${student}</td>
            <td>${row.cells[1].textContent}</td>
            <td>${date}</td>
            <td>
                <button class="btn-small waves-effect waves-light orange undo-btn">Annuler</button>
            </td>
        `;
        
        rejectedTbody.appendChild(newRow);
        row.remove();
        
        M.toast({html: `Demande de ${student} refusée`});
    }
});
