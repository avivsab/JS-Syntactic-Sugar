class Contact {
    constructor(name, address, phone) {
        this.name = name;
        this.address = address;
        this.phone = phone;
    }
}
const phonebook = data; // needed only for using the external data file
// UI Class: Handle UI Tasks
class UI {
    static displayContact() {
        const contacts = Store.getContacts();
        if(phonebook.length) {
            phonebook.forEach(number => {
                contacts.push(number)
            })
            contacts.sort(function(a, b) {
                let nameA = a.name.toUpperCase(); // ignore upper and lowercase
                let nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // names must be equal
                return 0;
            })

        // return contacts;
        }
        contacts.forEach((contact) => {
            UI.addContactToList(contact)
        });
    }

    static addContactToList(contact) {
        const list = document.querySelector('#contact-list');
        const row = document.createElement('tr');
        row.innerHTML = `
              <td>${contact.name}</td>
              <td>${contact.address}</td>
              <td>${contact.phone}</td>
              <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
              <td><a href="#" class="btn btn-info btn-sm update">update</a></td>
    `;
        list.appendChild(row);
    }

    static updateContact(el) {
        if(el.classList.contains('update')) {
            let updateLine = el.parentElement.parentElement;
            let lineValues = updateLine.innerText;
            const wordsArr = lineValues.split(/\s+/);
            const row = document.createElement('tr');
              updateLine.innerHTML = `
                 <tr>
                      <td><input type="text" value="${wordsArr[0]} ${wordsArr[1]}" id="newName"></td>
                      <td><input type="text" value="${wordsArr[2]}" id="newAddress"></td>
                      <td><input type="text" value="${wordsArr[3]}" id="newPhone"></td>
                      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
                      <td><a href="#" class="btn btn-info btn-sm updateFields">update</a></td>
                </tr>`;
            const updateValues = document.querySelector('.updateFields');
            updateValues.addEventListener('click', _=> UI.updateFiled(updateValues))
            
            }
        }

        static updateFiled (el) {
            let updateLine = el.parentElement.parentElement;
            const newName = document.querySelector('#newName');
            const newAddress = document.querySelector('#newAddress');
            const newPhone = document.querySelector('#newPhone');
            updateLine.innerHTML = `
             <td>${newName.value}</td>
             <td>${newAddress.value}</td>
             <td>${newPhone.value}</td>
             <td>
                <a href="#" class="btn btn-danger btn-sm delete">X</a>
             </td>
             <td>
                <a href="#" class="btn btn-info btn-sm update">update</a></td>`
        }

    static deleteContact(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.setAttribute('style', 'display:block; width:22%; margin: 10px; position: fixed')
        div.appendChild(document.createTextNode(message));
        const form = document.querySelector('form');
        form.append(div);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#address').value = '';
        document.querySelector('#phone').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    static getContacts() {
        let contacts;
        if(localStorage.getItem('contacts') === null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
            contacts.sort(function(a, b) {
                let nameA = a.name.toUpperCase(); // ignore upper and lowercase
                let nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                // names must be equal
                return 0;
            })
        }
        return contacts;
    }

    static addContact(contact) {
        const contacts = Store.getContacts();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(phone) {
        const contacts = Store.getContacts();
        contacts.forEach((contact, index) => {
            if(contact.phone === phone) {
                contacts.splice(index, 1);
            }
        });

        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

// Event: Display contacts
document.addEventListener('DOMContentLoaded', UI.displayContact);

// Event: Add a contact
document.querySelector('#contact-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const name = document.querySelector('#name').value;
    const address = document.querySelector('#address').value;
    const phone = document.querySelector('#phone').value;

    // Validate
    if(name === '' || phone === '') {
        UI.showAlert('Please fill in phone and name', 'danger');
    } else {
        // Instantiate book
        const contact = new Contact(name, address, phone);

        // Add contact to UI
        UI.addContactToList(contact);

        // Add contact to store
        Store.addContact(contact);

        // Show success message
        UI.showAlert('Contact Added', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event: Remove a Contact
document.querySelector('#contact-list').addEventListener('click', (e) => {
    // Remove Contact from UI
    UI.deleteContact(e.target);

    //Update Contact in UI

    UI.updateContact(e.target);

    // Remove Contact from store
    Store.removeContact(e.target);

});
