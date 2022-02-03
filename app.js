const addContactBtn = document.getElementById("add-contact-btn");

const contactModal = document.getElementById("add-modal");

const backdrop = document.getElementById("backdrop");

const newContactList = document.getElementById("contact-list");

const cancelBtn = contactModal.querySelector(".btn--passive");

const addBtn = cancelBtn.nextElementSibling;

const userInputs = contactModal.querySelectorAll("input");
console.log(userInputs);

const enteryText = document.getElementById("entry-text");

const deleteModal = document.getElementById("delete-modal");

const dangerBtn = document.getElementById("btn-danger");

const editModal = document.getElementById("edit-modal");

const editModalCancelBtn = document.getElementById("cancel-btn-edit");

const editModalUpdateBtn = document.getElementById("update-btn-edit");

const editModalInputs = editModal.querySelectorAll("input");

const addValidAlert = document.querySelectorAll("small");
console.log(addValidAlert);

const editValidAlert = document.querySelectorAll("span");
console.log(editValidAlert);

let successBtn = document.getElementById("btn-success");

let contacts = [];

if (localStorage.getItem("contactsData")) {
  contacts = JSON.parse(localStorage.getItem("contactsData"));
}

console.log(contacts);

let selectedContactForEdit = {};

const resetUi = () => {
  const toBeDeletedElements = document.querySelectorAll("li");

  toBeDeletedElements.forEach((contact) => newContactList.removeChild(contact));
};

const toggleBackdrop = () => {
  backdrop.classList.toggle("visible");
};

const openEditModal = () => {
  editModal.classList.add("visible");
};

const editModalOperations = (id) => {
  const obj = contacts.find((contact) => (newObject = contact.id === id));
  console.log(obj);
  console.log(editModalInputs);
  editModalInputs[0].value = obj.firstName;
  editModalInputs[1].value = obj.lastName;
  editModalInputs[2].value = obj.image;
  editModalInputs[3].value = obj.email;
  editModalInputs[4].value = obj.phone;
  if (obj.status === "Active") {
    editModalInputs[5].checked = true;
  } else editModalInputs[6].checked = true;
};

const editContactHandler = (selectedContact) => {
  toggleBackdrop();
  openEditModal();
  editModalOperations(selectedContact.id);
  selectedContactForEdit = selectedContact;
};

const removeBackdrop = () => {
  clearUsrInputs();
  closeContactModal();
  cancelContactDeletion();
  closeEditModal();
};

const clearUsrInputs = () => {
  userInputs.forEach((userinput) =>
    userinput.type === "radio"
      ? (userinput.checked = false)
      : (userinput.value = "")
  );

  addValidAlert.forEach((valiAl, idx) => {
    if (valiAl.className.includes("visible-alert")) {
      addValidAlert[idx].classList.remove("visible-alert");
    }
  });
};

const cancelAddContact = () => {
  toggleBackdrop();
  closeContactModal();
  clearUsrInputs();
};

const updateUi = () => {
  if (contacts.length == "") {
    enteryText.style.display = "block";
  } else {
    enteryText.style.display = "none";
  }
};

const cancelContactDeletion = () => {
  toggleBackdrop();
  deleteModal.classList.remove("visible");
};

const deleteContactElement = (contactId) => {
  deleteModal.classList.add("visible");
  toggleBackdrop();
  successBtn.replaceWith(successBtn.cloneNode(true));
  successBtn = document.getElementById("btn-success");
  dangerBtn.addEventListener("click", cancelDeletionModal);
  successBtn.addEventListener(
    "click",
    deleteContactConfirmation.bind(null, contactId)
  );
};

const deleteContactConfirmation = (contactId) => {
  let contactIndex = 0;

  contacts.find(
    (contact, idx) =>
      (contactIndex = contact.id === contactId ? idx : contactIndex)
  );

  contacts.splice(contactIndex, 1);
  console.log(contacts);
  const newContactList = document.getElementById("contact-list");
  newContactList.children[contactIndex].remove();
  cancelContactDeletion();
  localStorage.setItem("contactsData", JSON.stringify(contacts));
  swal({
    title: "Yay!",
    text: "Your contact is deleted!",
    icon: "success",
  });
  updateUi();
};

const randomNumberGenerator = () => {
  return Math.floor(Math.random() * 100000 + 1);
};

const randomAvatarUrlGenerator = () => {
  return `https://avatars.dicebear.com/api/big-ears-neutral/${randomNumberGenerator()}.svg`;
};

const renderContactElement = () => {
  resetUi();

  contacts.map((contact) => {
    let editId = `edit${Math.random()}`;
    let deleteId = `delete${Math.random()}`;

    const newContactElement = document.createElement("li");
    newContactElement.className = "contact-element";
    newContactElement.innerHTML = `
     <div class="contact-element__image">
     <img src="${contact.image}" alt="${contact.firstName}"> 
     </div>
     <div class="contact-element__info">
     <h2>${contact.firstName} ${contact.lastName}</h2>
     <div class="iconbox">
     <img src="assets/email.png">
     <p> ${contact.email}</p> 
     </div>
     <div class="iconbox">
     <img src="assets/phone.png">
     <p>${contact.phone}</p>
     </div>
     <div class="iconbox">
     <img src="assets/status.png">
      <p><bold style="color : ${
        contact.status === "Active" ? "green" : "red"
      }">${contact.status}</bold></p>
     </div>
     <div class="edit-box">
     <div id=${editId} class="btn--edit"><img src="assets/editing.png"></div>
     <div id=${deleteId} class="btn--delete"><img src="assets/dustbin.png"></div>
     </div>
     </div>
    `;

    newContactList.append(newContactElement);
    const deleteBtn = document.getElementById(deleteId);
    deleteBtn.addEventListener("click", () => deleteContactElement(contact.id));
    const editBtn = document.getElementById(editId);
    editBtn.addEventListener("click", () => editContactHandler({ ...contact }));
  });
};

console.log(contacts.length);

if (contacts.length) {
  renderContactElement();
  updateUi();
}

const closeContactModal = () => {
  contactModal.classList.remove("visible");
};

const addContactModal = () => {
  contactModal.classList.add("visible");
  toggleBackdrop();
};

const closeEditModal = () => {
  editModal.classList.remove("visible");
};

const formValidation = (
  isUpdateModalInputVisible = false,
  alertMode = false
) => {
  const inputs = isUpdateModalInputVisible ? editModalInputs : userInputs;

  const alert = alertMode ? editValidAlert : addValidAlert;

  for (let i = 0; i < inputs.length; i++) {
    if (i === 2) {
      continue;
    } else if (!inputs[i].value) {
      alert[i].classList.add("visible-alert");
    } else if (i === 5 || i === 6) {
      if (i === 5) {
        if (!inputs[i].checked) {
          alert[5].classList.add("visible-alert");
        } else {
          alert[5].classList.remove("visible-alert");
        }
      } else {
        if (!inputs[i].checked && !inputs[5].checked) {
          alert[5].classList.add("visible-alert");
        } else {
          alert[5].classList.remove("visible-alert");
        }
      }
    } else {
      alert[i].classList.remove("visible-alert");
    }
  }
};

const addContactHandler = () => {
  const firstNameValue = userInputs[0].value;
  console.log(firstNameValue);
  const lastNameValue = userInputs[1].value;
  const imageValue = userInputs[2].value
    ? userInputs[2].value
    : randomAvatarUrlGenerator();
  const emailValue = userInputs[3].value;
  const phonevalue = userInputs[4].value;
  const userStatus = userInputs[5].checked
    ? userInputs[5].value
    : userInputs[6].value;
  console.log(userStatus);
  console.log(userInputs.length);

  formValidation();

  for (const validAl of addValidAlert) {
    if (validAl.className.includes("visible-alert")) {
      swal({
        title: "Ooops!",
        text: "Please fill all mandatory fields *",
        icon: "warning",
      });
      return;
    }
  }

  swal({
    title: "Yay!",
    text: "Your contact is added to Database",
    icon: "success",
  });

  const newContact = {
    id: Math.random(),
    firstName: firstNameValue,
    lastName: lastNameValue,
    image: imageValue,
    email: emailValue,
    phone: phonevalue,
    status: userStatus,
  };
  contacts.push(newContact);
  const contactsArray = [...contacts];
  localStorage.setItem("contactsData", JSON.stringify(contactsArray));
  console.log(contacts);

  closeContactModal();
  toggleBackdrop();
  renderContactElement();
  clearUsrInputs();
  updateUi();
};

const cancelDeletionModal = () => {
  deleteModal.classList.remove("visible");
  toggleBackdrop();
};

const editModalCancelBtnHandler = () => {
  closeEditModal();
  removeBackdrop();
};

const editModalUpdateBtnHandler = () => {
  console.log(contacts);
  const editedContact = { ...selectedContactForEdit };

  console.log(editedContact);
  console.log(contacts);

  editedContact.firstName = editModalInputs[0].value;
  editedContact.lastName = editModalInputs[1].value;
  editedContact.image = editModalInputs[2].value;
  editedContact.email = editModalInputs[3].value;
  editedContact.phone = editModalInputs[4].value;
  editedContact.status =
    editModalInputs[5].checked === true
      ? editModalInputs[5].value
      : editModalInputs[6].value;

  formValidation(true, true);

  for (const validAl of editValidAlert) {
    if (validAl.className.includes("visible-alert")) {
      swal({
        title: "Ooops!",
        text: "Please fill all mandetory fields *",
        icon: "warning",
      });
      return;
    }
  }

  swal({
    title: "Yay!",
    text: "Your contact data has been updated",
    icon: "info",
  });

  contacts.splice(
    contacts.findIndex((contact) => contact.id === editedContact.id),
    1,
    editedContact
  );

  closeEditModal();
  removeBackdrop();
  console.log(editedContact);
  localStorage.setItem("contactsData", JSON.stringify(contacts));

  renderContactElement();
};

addContactBtn.addEventListener("click", addContactModal);

backdrop.addEventListener("click", removeBackdrop);

cancelBtn.addEventListener("click", cancelAddContact);

addBtn.addEventListener("click", addContactHandler);

editModalCancelBtn.addEventListener("click", editModalCancelBtnHandler);

editModalUpdateBtn.addEventListener("click", editModalUpdateBtnHandler);


