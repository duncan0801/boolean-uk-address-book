const viewSection = document.querySelector(".view-section");
const contactsSection = document.querySelector(".contacts-section");

const state = {
  contacts: [],
  selectedContact: null
};

function creatEl(tag) {
  return document.createElement(tag)
}

/* [START] NO NEED TO EDIT */

function getContacts() {
  fetch("http://localhost:3000/contacts")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      state.contacts = data;
      
      renderContactsList();
    });
}// Will fetch data from the server then render in the list section

function renderContactsList() {
  let oldListEl = document.querySelector("ul.contacts-list")
      if(oldListEl) oldListEl.remove()

  const listEl = document.createElement("ul");
  listEl.className = "contacts-list";

  

  for (let i = 0; i < state.contacts.length; i++) {
    const contact = state.contacts[i];
    const listItemEl = renderContactListItem(contact);

    listEl.append(listItemEl);
  }

  contactsSection.append(listEl);
}

function renderAddressSection(address) {
  const containerEl = document.createElement("section");

  const headingEl = document.createElement("h2");
  headingEl.innerText = "Address";

  containerEl.append(headingEl);

  const streetText = document.createElement("p");
  streetText.innerText = address.street;

  containerEl.append(streetText);

  const cityText = document.createElement("p");
  cityText.innerText = address.city;

  containerEl.append(cityText);

  const postCodeText = document.createElement("p");
  postCodeText.innerText = address.postCode;

  containerEl.append(postCodeText);

  return containerEl;
}

function renderContactView() {
  const contact = state.selectedContact;

  if (!contact) return;

  viewSection.innerHTML = "";

  const containerEl = document.createElement("article");
  containerEl.className = "center light-shadow address-card";

  const headingEl = document.createElement("h1");

  const fullName = `${contact.firstName} ${contact.lastName}`;
  headingEl.innerText = fullName;

  containerEl.append(headingEl);

  const addressSectionEl = renderAddressSection(contact.address);

  containerEl.append(addressSectionEl);

  viewSection.append(containerEl);
}
function addAddress(addressToAdd) {
  //Takes addressToAdd = {
  //   "street": formEl.street.value,
  //   "city": formEl.city.value,
  //   "postCode": formEl.postCode.value
  // }
  return fetch(`http://localhost:3000/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(addressToAdd)
  })
  .then(function(response) {
    return response.json()
  })
}
function addContact(contactToAdd) {
  // let contactToAdd = {
  //   "firstName": formEl.firstName.value,
  //   "lastName": formEl.lastName.value,
  //   "blockContact": formEl.blockCheckbox.checked,
  //   "addressId": null
  // }
  return fetch(`http://localhost:3000/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(contactToAdd)
  })
  .then(function(response) {
    return response.json()
  })
  
}
function addNewContactToServer(event) {
  //TODO change the update function so that you can update the state and fix the problem in the browser where the updated contact is not shown straight after being updated 
  event.preventDefault()
  let formEl = event.target
  let addressToAdd = {
    "street": formEl.street.value,
    "city": formEl.city.value,
    "postCode": formEl.postCode.value
  }
  let contactToAdd = {
    "firstName": formEl.firstName.value,
    "lastName": formEl.lastName.value,
    "blockContact": formEl.blockCheckbox.checked,
  }

  addAddress(addressToAdd)
  .then(function(address) {
    contactToAdd.addressId = address.id
    addContact(contactToAdd)
    .then(function(contact) {
      contact.address = address

      state.contacts.push(contact)
      state.selectedContact = contact
      
      renderContactsList()
    })
    // The contact data is not saving the value from the form elements
})
}

function contactUpdateToServer (event, contact) {
  //1. Store the values from the input in the update object
  event.preventDefault()
  let formEl = event.target
  
  let updateAddress = {
    "street": formEl.street.value,
    "city": formEl.city.value,
    "postCode": formEl.postCode.value
  }
  let updateContact = {
    "firstName": formEl.firstName.value,
    "lastName": formEl.lastName.value,
    "blockContact": formEl.blockCheckbox.checked,
    "addressId": formEl.addressId
  }

  fetch(`http://localhost:3000/contacts/${contact.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateContact)
  })
  .then(function(response) {
    fetch(`http://localhost:3000/addresses/${contact.addressId}`, {
      method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateAddress)
    })
    return response
  })
  .then(function(response) {
    if(response.ok) {
      alert(`Contact Updated!`)
      state.selectedContact = contact
    }
  })
  .then(function() {
    getContacts()
    renderContactsList()
    renderContactView()
  })
  
}

/* [END] NO NEED TO EDIT */

function renderContactListItem(contact) {
  const listItemEl = document.createElement("li");

  const headingEl = document.createElement("h3");

  const fullName = `${contact.firstName} ${contact.lastName}`;

  headingEl.innerText = fullName;

  listItemEl.append(headingEl);

  const viewBtn = document.createElement("button");
  viewBtn.className = "button grey";
  viewBtn.innerText = "View";

  viewBtn.addEventListener("click", function () {
    state.selectedContact = contact;

    renderContactView();
  });

  listItemEl.append(viewBtn);

  const editBtn = document.createElement("button");
  editBtn.className = "button blue";
  editBtn.innerText = "Edit";

  editBtn.addEventListener("click", function () {
    /*
    - the updated contact should be saved in the database
        PATCH request with http://localhost:3000/contacts/${contact.id}
    - the updated contact should be viewable in the UI
    - the selected contact can also be deleted from the edit contact form
    */
    renderEditForm(contact)
  });

  listItemEl.append(editBtn);

  return listItemEl;
}

function renderEditForm(contact) {
  let oldFormEl = document.querySelector("main")
  if (oldFormEl) oldFormEl.innerHTML = ""

  let formEl = creatEl("form")
  formEl.setAttribute("class", "form-stack light-shadow center contact-form")

  let titleEl = creatEl("h2")
  titleEl.innerText = "Edit Contact"

  let firstNameInputLabelEl = creatEl("label")
  firstNameInputLabelEl.setAttribute("for", "firstName")
  firstNameInputLabelEl.innerText= "First Name:"
  let firstNameInputEl = creatEl("input")
  firstNameInputEl.setAttribute("id", "firstName")
  firstNameInputEl.setAttribute("name", "firstName")
  firstNameInputEl.setAttribute("type", "text")
  firstNameInputEl.value = contact.firstName
  
  let lastNameInputLabelEl = creatEl("label")
  lastNameInputLabelEl.setAttribute("for", "last-name-input")
  lastNameInputLabelEl.innerText ="Last Name:"
  let lastNameInputEl = creatEl("input")
  lastNameInputEl.setAttribute("id", "lastName")
  lastNameInputEl.setAttribute("name", "lastName")
  lastNameInputEl.setAttribute("type", "text")
  lastNameInputEl.value = contact.lastName

  let cityInputLabelEl = creatEl("label")
  cityInputLabelEl.setAttribute("for", "city")
  cityInputLabelEl.innerText = "City:"
  let cityInputEl = creatEl("input")
  cityInputEl.setAttribute("id", "city")
  cityInputEl.setAttribute("name", "city")
  cityInputEl.setAttribute("type", "text")
  cityInputEl.value = contact.address.city

  let postCodeInputLabelEl = creatEl("label")
  postCodeInputLabelEl.setAttribute("for", "postCode-input")
  postCodeInputLabelEl.innerText = "Postcode:"
  let postCodeInputEl = creatEl("input")
  postCodeInputEl.setAttribute("id", "postCode")
  postCodeInputEl.setAttribute("name", "postCode")
  postCodeInputEl.setAttribute("type", "text")
  postCodeInputEl.value =  contact.address.postCode

  let streetInputLabelEl = creatEl("label")
  streetInputLabelEl.setAttribute("for", "street")
  streetInputLabelEl.innerText = "Street:"
  let streetInputEl = creatEl("input")
  streetInputEl.setAttribute("id", "street")
  streetInputEl.setAttribute("name", "street")
  streetInputEl.setAttribute("type", "text")
  streetInputEl.value = contact.address.street

  let checkboxSectionEl = creatEl("div")
  checkboxSectionEl.setAttribute("class", "checkboxSection")
  let checkboxSectionInputEl = creatEl("input")
  checkboxSectionInputEl.setAttribute("id", "blockCheckbox" )
  checkboxSectionInputEl.setAttribute("name", "blockCheckbox")
  checkboxSectionInputEl.setAttribute("type", "checkbox")
  let checkboxSectionInputLabelEl = creatEl("label")
  checkboxSectionInputLabelEl.setAttribute("for", "blockCheckbox")
  checkboxSectionInputLabelEl.innerText = "Block"
  if(contact.blockContact) {
    checkboxSectionInputEl.checked = true
  }

  let actionSectionEl = creatEl("div")
  actionSectionEl.setAttribute("class", "actionsSection")
  let actionSectionButtonEl = creatEl("button")
  actionSectionButtonEl.setAttribute("class", "button blue")
  actionSectionButtonEl.setAttribute("type", "submit")
  actionSectionButtonEl.innerText= "Save"

  checkboxSectionEl.append(
    checkboxSectionInputEl,
    checkboxSectionInputLabelEl
    )
  actionSectionEl.append(actionSectionButtonEl)
  formEl.append(
    titleEl,
    firstNameInputLabelEl,
    firstNameInputEl,
    lastNameInputLabelEl,
    lastNameInputEl,
    cityInputLabelEl,
    cityInputEl,
    postCodeInputLabelEl,
    postCodeInputEl,
    streetInputLabelEl,
    streetInputEl,
    checkboxSectionEl,
    actionSectionEl
    )
    let viewSectionEl = document.querySelector(".view-section")
    viewSectionEl.append(formEl)

    formEl.addEventListener("submit", function(event) {
      contactUpdateToServer(event, contact)
    
    })
    
    
}



function renderContactForm() {
  let oldFormEl = document.querySelector("main")
  if (oldFormEl) oldFormEl.innerHTML = ""

  let formEl = creatEl("form")
  formEl.setAttribute("class", "form-stack light-shadow center contact-form")

  let titleEl = creatEl("h2")
  titleEl.innerText = "Create Contact"

  let firstNameInputLabelEl = creatEl("label")
  firstNameInputLabelEl.setAttribute("for", "firstName")
  firstNameInputLabelEl.innerText= "First Name:"
  let firstNameInputEl = creatEl("input")
  firstNameInputEl.setAttribute("id", "firstName")
  firstNameInputEl.setAttribute("name", "firstName")
  firstNameInputEl.setAttribute("type", "text")
  
  let lastNameInputLabelEl = creatEl("label")
  lastNameInputLabelEl.setAttribute("for", "last-name-input")
  lastNameInputLabelEl.innerText ="Last Name:"
  let lastNameInputEl = creatEl("input")
  lastNameInputEl.setAttribute("id", "lastName")
  lastNameInputEl.setAttribute("name", "lastName")
  lastNameInputEl.setAttribute("type", "text")

  let cityInputLabelEl = creatEl("label")
  cityInputLabelEl.setAttribute("for", "city")
  cityInputLabelEl.innerText = "City:"
  let cityInputEl = creatEl("input")
  cityInputEl.setAttribute("id", "city")
  cityInputEl.setAttribute("name", "city")
  cityInputEl.setAttribute("type", "text")

  let postCodeInputLabelEl = creatEl("label")
  postCodeInputLabelEl.setAttribute("for", "postCode-input")
  postCodeInputLabelEl.innerText = "Postcode:"
  let postCodeInputEl = creatEl("input")
  postCodeInputEl.setAttribute("id", "postCode")
  postCodeInputEl.setAttribute("name", "postCode")
  postCodeInputEl.setAttribute("type", "text")

  let streetInputLabelEl = creatEl("label")
  streetInputLabelEl.setAttribute("for", "street")
  streetInputLabelEl.innerText = "Street:"
  let streetInputEl = creatEl("input")
  streetInputEl.setAttribute("id", "street")
  streetInputEl.setAttribute("name", "street")
  streetInputEl.setAttribute("type", "text")

  let checkboxSectionEl = creatEl("div")
  checkboxSectionEl.setAttribute("class", "checkboxSection")
  let checkboxSectionInputEl = creatEl("input")
  checkboxSectionInputEl.setAttribute("id", "blockCheckbox" )
  checkboxSectionInputEl.setAttribute("name", "blockCheckbox")
  checkboxSectionInputEl.setAttribute("type", "checkbox")
  let checkboxSectionInputLabelEl = creatEl("label")
  checkboxSectionInputLabelEl.setAttribute("for", "blockCheckbox")
  checkboxSectionInputLabelEl.innerText = "Block"

  let actionSectionEl = creatEl("div")
  actionSectionEl.setAttribute("class", "actionsSection")
  let actionSectionButtonEl = creatEl("button")
  actionSectionButtonEl.setAttribute("class", "button blue")
  actionSectionButtonEl.setAttribute("type", "submit")
  actionSectionButtonEl.innerText= "Create"

  checkboxSectionEl.append(
    checkboxSectionInputEl,
    checkboxSectionInputLabelEl
    )
  actionSectionEl.append(actionSectionButtonEl)
  formEl.append(
    titleEl,
    firstNameInputLabelEl,
    firstNameInputEl,
    lastNameInputLabelEl,
    lastNameInputEl,
    cityInputLabelEl,
    cityInputEl,
    postCodeInputLabelEl,
    postCodeInputEl,
    streetInputLabelEl,
    streetInputEl,
    checkboxSectionEl,
    actionSectionEl
    )
    let viewSectionEl = document.querySelector(".view-section")
    viewSectionEl.append(formEl)

    //Add an event listener for submit function on the form 

    formEl.addEventListener("submit", function(e) {
      addNewContactToServer(e)
      formEl.reset()
    })


}

function listenNewContactButton() {
  const btn = document.querySelector(".new-contact-btn");

  btn.addEventListener("click", function () {
    // [TODO] Write Code
    /**
     * - A user can create a contact via a form when the "New Contact" button is clicked
    - the created contact should have:
        - first name
        - last name
        - street
        - city
        - post code
        - an option to block the contact
    - the created contact should be saved in the database
    - the created contact should be added to the contacts list
    1. Get the user input via an interface
    2. Update the contacts list by using a POST request
    3. Run getContacts(),  renderContactsList()
     */
    renderContactForm()
  });
}

// [TODO] Write Code

function main() {
  listenNewContactButton();
  getContacts();
}

main()
