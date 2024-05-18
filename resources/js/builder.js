document.addEventListener("DOMContentLoaded", function() {
    const editorCanvas = document.getElementById("editor-canvas");

    new Sortable(editorCanvas, {
        animation: 150,
        ghostClass: 'sortable-ghost'
    });

    window.selectLayout = function(layout) {
        fetch(`/plugins/NewsletterPlugin/resources/views/layouts/${layout}.html`)
            .then(response => response.text())
            .then(data => {
                editorCanvas.innerHTML = data;
                initializeEditors();
            })
            .catch(error => console.error('Fehler beim Laden des Layouts:', error));
    };

    window.insertProductData = function(productId) {
        fetch(`/rest/products/${productId}`)
            .then(response => response.json())
            .then(data => {
                const productHtml = `<div class="product">
                    <h2>${data.name}</h2>
                    <p>${data.description}</p>
                    <img src="${data.imageUrl}" alt="${data.name}">
                </div>`;
                editorCanvas.innerHTML += productHtml;
                initializeEditors();
            })
            .catch(error => console.error('Fehler beim Laden der Produktdaten:', error));
    };

    window.saveEmail = function() {
        const emailContent = editorCanvas.innerHTML;
        const emailTitle = prompt("Bitte geben Sie einen Titel für die E-Mail ein:");

        if (!emailTitle || !emailContent) {
            alert("Titel und Inhalt sind erforderlich.");
            return;
        }

        fetch('/newsletter/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: emailTitle, content: emailContent })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("E-Mail erfolgreich gespeichert mit ID: " + data.id);
                loadEmailList();
            } else {
                alert("Fehler beim Speichern der E-Mail: " + data.message);
            }
        })
        .catch(error => console.error('Fehler beim Speichern der E-Mail:', error));
    };

    window.saveDraft = function() {
        const emailContent = editorCanvas.innerHTML;
        const emailTitle = prompt("Bitte geben Sie einen Titel für den Entwurf ein:");

        if (!emailTitle || !emailContent) {
            alert("Titel und Inhalt sind erforderlich.");
            return;
        }

        fetch('/newsletter/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: emailTitle, content: emailContent, draft: true })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Entwurf erfolgreich gespeichert mit ID: " + data.id);
                loadEmailList();
            } else {
                alert("Fehler beim Speichern des Entwurfs: " + data.message);
            }
        })
        .catch(error => console.error('Fehler beim Speichern des Entwurfs:', error));
    };

    window.loadEmail = function(emailId) {
        fetch(`/newsletter/load/${emailId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    editorCanvas.innerHTML = data.content;
                    initializeEditors();
                } else {
                    alert("Fehler beim Laden der E-Mail: " + data.message);
                }
            })
            .catch(error => console.error('Fehler beim Laden der E-Mail:', error));
    };

    window.previewEmail = function() {
        const emailContent = editorCanvas.innerHTML;
        const previewWindow = window.open('', 'E-Mail Vorschau', 'width=800,height=600');
        previewWindow.document.write(emailContent);
    };

    function loadEmailList() {
        fetch('/newsletter/list')
            .then(response => response.json())
            .then(data => {
                const emailList = document.getElementById('email-list');
                emailList.innerHTML = '';
                data.forEach(email => {
                    const emailItem = document.createElement('div');
                    emailItem.classList.add('email-item');
                    emailItem.innerHTML = `
                        <span>${email.title}</span>
                        <button onclick="loadEmail(${email.id})">Bearbeiten</button>
                        <button onclick="deleteEmail(${email.id})">Löschen</button>
                    `;
                    emailList.appendChild(emailItem);
                });
            })
            .catch(error => console.error('Fehler beim Laden der E-Mail-Liste:', error));
    }

    window.deleteEmail = function(emailId) {
        if (confirm("Sind Sie sicher, dass Sie diese E-Mail löschen möchten?")) {
            fetch(`/newsletter/delete/${emailId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("E-Mail erfolgreich gelöscht.");
                    loadEmailList();
                } else {
                    alert("Fehler beim Löschen der E-Mail: " + data.message);
                }
            })
            .catch(error => console.error('Fehler beim Löschen der E-Mail:', error));
        }
    };

    function drag(event, type) {
        event.dataTransfer.setData("elementType", type);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const elementType = event.dataTransfer.getData("elementType");
        let elementHtml = '';

        if (elementType === 'text') {
            elementHtml = '<textarea name="editor">Text hier eingeben</textarea>';
        } else if (elementType === 'image') {
            elementHtml = '<div><input type="file" onchange="uploadImage(event)"></div>';
        }

        const newElement = document.createElement('div');
        newElement.innerHTML = elementHtml;
        editorCanvas.appendChild(newElement);
        initializeEditors();
    }

    window.uploadImage = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Hochgeladenes Bild';
            event.target.parentNode.appendChild(img);
        };

        reader.readAsDataURL(file);
    };

    function initializeEditors() {
        const textareas = editorCanvas.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            CKEDITOR.replace(textarea);
        });
    }

    loadEmailList();
});
