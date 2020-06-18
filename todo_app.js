//#region Global variables
var current_user_data = null;
var current_list_name = null;
//Handles to UI elements
var sign_form,
  log_in_form,
  error_message,
  dashboard,
  account_settings_form,
  no_lists_message,
  log_panel,
  show_lists_button,
  list_editor,
  main_list_dashboard,
  listUL,
  taskList;
 //Other
const nonEmptyStringPattern = ".*\\S.*";
//#endregion

//#region Site loaded
window.addEventListener("DOMContentLoaded", () => {

  GenerateBodyHtml();
  AddToHeadHtml();

  //SET GLOBAL VARIABLES
  log_panel = document.getElementById("logging");
  sign_form = log_panel.querySelector("#sign_up_form");
  log_in_form = log_panel.querySelector("#log_in_form");
  error_message = document.querySelector("#error_message");
  account_settings_form = document.getElementById("account_settings_form");

  //Dashboard elements
  dashboard = document.getElementById("dashboard");
  no_lists_message = dashboard.querySelector("#no_lists_message");
  main_list_dashboard = dashboard.querySelector("#main_list_dashboard");
  listUL = dashboard.querySelector("#listUL");
  show_lists_button = dashboard.querySelector("#show_lists_button");
  list_editor = dashboard.querySelector("#list_editor");
  taskList = dashboard.querySelector("#taskList");
  old_list_name = list_editor.querySelector("#old_list_name");

  //Add listeners
  sign_form.addEventListener("submit", Register);
  log_in_form.addEventListener("submit", LogIn);
  list_editor.addEventListener("submit", SaveList);
  account_settings_form.addEventListener("submit", ChangeAccountSettings);

  taskList.addEventListener(
    "click",
    function (ev) {
      if (ev.target.tagName === "LI") {
        ev.target.classList.toggle("checked");
      }
    },
    false
  );

  //show header
  ShowElements(document.body.querySelector("HEADER"));

  //hide dashboard elements
  CollapseElements(dashboard, log_panel);

  //Set Visibility
  SetClassVisible("loggedIn", false);
  SetClassVisible("loggedOut", true);
  CollapseAllForms();

  CreateExampleUser();
});

function CreateExampleUser() {
  let hashed_password = CryptoJS.SHA256("abc").toString();
  let lists = [
    {
      created: Date.now(),
      name: "things to do",
      items: [
        { text: "Fry eggs", checked: false },
        { text: "Cook potatoes", checked: false },
        { text: "Play with cat", checked: true },
      ],
    },
    {
      created: Date.now(),
      name: "css",
      items: [
        { text: "Css study", checked: true },
        { text: "Understand pseudo classes", checked: false },
        { text: "Child combinator selector", checked: true },
      ],
    },
  ];
  localStorage.setItem(
    "admin@gmail.com",
    JSON.stringify({
      email: "admin@gmail.com",
      password: hashed_password,
      name: "John",
      surname: "Cat",
      lists: lists,
    })
  );
}
//#endregion

//#region HTML generators
function AddToHeadHtml() {
  var head = document.getElementsByTagName("HEAD")[0];
  const title = "Let's do it!";
  head.innerHTML += `<title>${title}</title>`;
}

function GenerateBodyHtml() {
  var body = document.getElementsByTagName("BODY")[0];

  html = [];
  html.push(GenerateMenuHtml());
  html.push(GenerateHeaderHtml());
  html.push(GenerateErrorMessage());
  html.push(GenerateElementHtml('div', 'logging', ['mainContainer', 'loggedOut'], `${GenerateSignInFormHtml()}\n\n${GenerateLogInFormHtml()}`));
  html.push(GenerateDashboardHtml());
  html.push(GenerateElementHtml('div', '', ['loggedIn'], `${GenerateAccountSettingsFormHtml()}`));

  body.innerHTML = html.join("");
}

function GenerateMenuHtml() {

  const ulClass = "menu";
  const classes = [["menuItem", "loggedOut"],["menuItem", "loggedIn"],["menuItem", "loggedIn"],["menuItem", "loggedIn"]];
  const functions = [ ShowLogInForm, LogOut, ShowAccountSettings, ShowDashboard];
  const names = ["Log In", "Log Out", "Account Settings", "Dashboard"];

  let ul = [`<ul class="${ulClass}">`];
  for(var i = 0; i < functions.length; ++i){
    ul.push(`<li class="${classes[i].join(' ')}"><a onclick="${functions[i].name}()">${names[i]}</a></li>`);
  }
  ul.push(`</ul>`);

  return ul.join("\n");
}

function GenerateHeaderHtml() {

  const title = "TODOs list manager";
  const descId = "description";
  const classes = ["loggedOut", "desc", "clearfix", "halfScreenButton"];
  const descText = `Immerse yourself into the world of effective task-smashing with this
  innovate task-tracking tool.<br />Start your journey into new life of concious planning now!`;
  const buttonIds = ["log_in", "sign_up"];
  const buttonFunctions = [ShowLogInForm, ShowSignUpForm];
  const buttonNames = ["Log in", "Sign up"];

  let html = [`<header class="${classes[0]}">`];
  html.push(`<h1>${title}</h1>`);
  html.push(`<span id="${descId}" class="${classes[1]}">${descText}</span>`);
  html.push(`<div class="${classes[2]}">`);
  for(var i = 0; i < buttonIds.length; ++i) {
    html.push(`<button id="${buttonIds[i]}" class="${classes[3]}" onclick="${buttonFunctions[i].name}()">${buttonNames[i]}</button>`);
  }
  html.push(`</div></header>`);

  return html.join("\n");
}

function GenerateErrorMessage() {
  const id = "error_message";
  const classes = ["message", "formError"];

  return GenerateElementHtml('div', id, classes, "");
}

function GenerateElementHtml(element, id, classArray, innerHtml) {
    return `<${element} id="${id}" class="${classArray.join(' ')}">
      ${innerHtml}
</${element}>`;
}

function GenerateSignInFormHtml() {

  const inputData = [
    {"label" : "First Name", "type":"text", "name":"firstname", "placeholder":"Your name", "isRequired" : true, "pattern":".*\S.*"},
    {"label" : "Last Name", "type":"text", "name":"lastname", "placeholder":"Last name", "isRequired" : true, "pattern":".*\S.*"},
    {"label" : "Email", "type":"email", "name":"email", "placeholder":"example@gmail.com", "isRequired" : true, "pattern": null},
    {"label" : "Password", "type":"password", "name":"password", "placeholder":"Make it a good one!", "isRequired" : true, "pattern":null},
    {"label" : "I agree to the Terms of Use", "type":"checkbox", "name":"tosAgreement", "placeholder":null, "isRequired" : true, "pattern":null}
  ];
  const formId="sign_up_form", formClass = "form", submitButtonText = "Get Started";

  return GenerateFormHtml(formId, formClass, inputData, submitButtonText);
}

function GenerateLogInFormHtml() {

  const inputData = [
    {"label" : "Email", "type":"email", "name":"email", "placeholder":null, "isRequired" : true, "pattern": null},
    {"label" : "Password", "type":"password", "name":"password", "placeholder":null, "isRequired" : true, "pattern":null}
  ];
  const formId = "log_in_form", formClass = "form", submitButtonText = "Log In";

  return GenerateFormHtml(formId, formClass, inputData, submitButtonText);
}

function GenerateAccountSettingsFormHtml() {
  const inputData = [
    {"label" : "First Name", "type":"text", "name":"name", "placeholder":"Your name", "isRequired" : true, "pattern":nonEmptyStringPattern},
    {"label" : "Last Name", "type":"text", "name":"surname", "placeholder":"Last name", "isRequired" : true, "pattern":nonEmptyStringPattern},
    {"label" : "Email", "type":"email", "name":"email", "placeholder":"example@gmail.com", "isRequired" : false, "pattern": null},
    {"label" : "Current Password", "type":"password", "name":"password", "placeholder":"Your current password", "isRequired" : false, "pattern":null},
    {"label" : "New Password", "type":"password", "name":"new_password", "placeholder":"Make it a good one!", "isRequired" : false, "pattern":null},
  ];
  const formId="account_settings_form", formClass = "form", submitButtonText = "Save Changes";

  return GenerateFormHtml(formId, formClass, inputData, submitButtonText);
}

function GenerateFormHtml(formId, formClass, inputs, submitButtonText) {

  const wrapperClass = "inputWrapper";
  const innerFormClass = "formContainer";
  const labelClass = "inputLabel";

  let html = [`<form id="${formId}" method="POST" class="${formClass}">
            <div class="${innerFormClass}">`];

  html.push(inputs.map(i => {
    
    const inputHtml = `<input type="${i.type}" name="${i.name}" ${(i.placeholder===null ? '' : `placeholder="${i.placeholder}"`)} ${i.isRequired ? 'required' : ''} ${i.pattern==null ? '' : `pattern="${i.pattern}"`}/>`;
    const innerHtml = i.type === "checkbox" ? `<div class="${labelClass}">${inputHtml}${i.label}</div>` :
     `<div class="${labelClass}">${i.label}</div> ${inputHtml}`;

    return `<div class="${wrapperClass}">
      ${innerHtml}
    </div>`
  }).join('\n'));

  html.push(`<div class="${wrapperClass} ctaWrapper">
    <button type="submit" class="green">${submitButtonText}</button>
  </div>`);

  html.push(`</div></form>`);

  return html.join('\n');
}
 
function GenerateDashboardHtml() {
  const id = 'dashboard';
  const classes = ["loggedIn", "container", "dashboard"];
  const ulId = "listUL";
  const ulClass = "taskList";

  const ulHtml = GenerateElementHtml('ul', ulId, [ulClass], '');
  const formHtml = GenerateListEditorHtml();
  const innerHtml = [GenerateMainListDashboardHtml(), ulHtml, formHtml];

  return GenerateElementHtml('div', id, classes, innerHtml.join('\n'));
}

function GenerateListEditorHtml() {

  const formId = "list_editor";
  const containerClass = "listHeader";
  const show_lists_button_id = "show_lists_button", showListButtonText = "BACK TO DASHBOARD", saveListButtonText = "SAVE LIST", addButtonText = "ADD";
  const styleLeft = "float: left;", styleRight = "float: right", styleNoMargin = "margin:0px";
  const spanClass = "newTaskSpan";
  const inputData = {"id" : "listName", "type":"text", "placeholder":"List name...", "pattern":nonEmptyStringPattern};
  const newTaskInputData = {"id" : "newTaskInput", "type":"text", "class":"fullWidth", "placeholder":"New task...", "pattern":nonEmptyStringPattern};
  const taskListId = "taskList"; const taskListClass = "taskList";

  const html = `<form id="${formId}" method="POST">
  <div class="${containerClass}">
    <button id="${show_lists_button_id}" onclick="${ShowDashboard.name}()" style="${styleLeft}">${showListButtonText}</button>
    <button type="submit" style="${styleRight}">${saveListButtonText}</button>

    <input id="${inputData.id}" type="${inputData.type}" placeholder="${inputData.placeholder}" required pattern="${inputData.pattern}"/>

    <div>
    <button onclick="${AddListTask.name}()" style="${styleRight}; ${styleNoMargin}">${addButtonText}</button>
    <span class="${spanClass}">
      <input id="${newTaskInputData.id}" class="${newTaskInputData.class}" type="${newTaskInputData.type}" placeholder="${newTaskInputData.placeholder}" pattern="${nonEmptyStringPattern}"/></span>
   </div>
  </div>

  <ul id="${taskListId}" class="${taskListClass}"></ul>
</form>`

  return html;
}

function GenerateMainListDashboardHtml() {

  const containerClass = "container";
  const spanId = "no_lists_message";
  const spanMessage = "You have no lists.";
  const buttonId = "new_list_button";
  const buttonStyle = "float: right";
  const buttonText = "NEW LIST";

  const innerHtml =
`<div class="${containerClass}">
  <span id="${spanId}">${spanMessage}</span>
  <button id="${buttonId}" onclick="${ShowListEditor.name}()" style="${buttonStyle}">${buttonText}</button>
</div>`;

  return GenerateElementHtml('div', 'main_list_dashboard', [], innerHtml);
}
//#endregion

//#region Form-related methods
function ShowFormError(message) {
  console.log("error message is " + JSON.stringify(error_message));
  error_message.innerText = message;
  ShowElements(error_message);
}

function CheckIfStringsNotEmpty(names, ...elems) {
  for (i = 0; i < names.length; ++i) {
    if (!elems[i]) {
      ShowFormError(names[i] + " is empty.");
      return false;
    }
  }

  return true;
}

//#region Show hide methods
function ShowSignUpForm() {
  CollapseAllForms();
  document.getElementById("logging").style.display = "block";
  sign_form.style.display = "block";
}

function ShowLogInForm() {
  CollapseAllForms();
  ShowElements(log_in_form);
}
//#endregion

//#region Methods for listeners
function Register(event) {
  event.preventDefault();
  CollapseElements(error_message);

  const agreed_to_terms = sign_form[4].checked;
  console.log("Agreed to terms: " + agreed_to_terms);

  if (!agreed_to_terms) {
    ShowFormError("You have to agree with Terms of Use.");
    return;
  }

  const email = sign_form[2].value;
  if (!email) {
    ShowFormError("Email is empty.");
    return;
  }
  const user = JSON.parse(localStorage.getItem(email));
  console.log("user read : " + user);

  if (user) {
    ShowFormError("The user with this email already exists");
  } else {
    const name = sign_form[0].value;
    const surname = sign_form[1].value;
    const password = sign_form[3].value;

    if (
      !CheckIfStringsNotEmpty(
        ["Name", "Surname", "Password"],
        name,
        surname,
        password
      )
    )
      return;

    user_data = {
      email: email,
      name: name,
      surname: surname,
      password: HashText(password),
      lists: [],
    };

    console.log("Hashed password to " + HashText(password));

    try {
      localStorage.setItem(email, JSON.stringify(user_data));
      console.log("Registered: " + email);
      current_user_data = user_data;
      console.log(JSON.stringify(current_user_data));
      SetClassVisible("loggedIn", true);
      SetClassVisible("loggedOut", false);
      ShowDashboard();
    } catch (error) {
      ShowFormError("Error while signing up.");
      console.log("Error while signing up: " + error);
    }
  }
}

function LogIn(event) {
  console.log("Logging in...");
  event.preventDefault();
  CollapseElements(error_message);

  email = log_in_form[0].value;
  password = log_in_form[1].value;

  const user = JSON.parse(localStorage.getItem(email));

  let hash = HashText(password);
  console.log("LogIn hashed password attempted:\n" + hash);

  if (user) {
    if (user.password === hash) {
      console.log("Logged in.");
      SetClassVisible("loggedIn", true);
      SetClassVisible("loggedOut", false);
      current_user_data = user;

      console.log("Current user data: " + user.toString());

      ShowDashboard();
    } else {
      ShowFormError("Incorrect password!");
    }
  } else {
    ShowFormError("User does not exist.");
  }
}

function LogOut() {
  current_user_data = null;
  SetClassVisible("loggedIn", false);
  SetClassVisible("loggedOut", true);
  CollapseElements(error_message);
}
//#endregion

//#region Dashboard
function ShowDashboard() {
  CollapseAllForms();
  CollapseElements(list_editor);
  ShowElements(dashboard, main_list_dashboard);

  data = current_user_data.lists;

  if (!data || data.length === 0) {
    ShowElements(no_lists_message);
    CollapseElements(listUL);
  } else {
    CollapseElements(no_lists_message);
    PopulateListUL(data, listUL);
    ShowElements(listUL);
  }
}

function SaveList(event) {
  event.preventDefault();

  //Check if name is unique
  const list_name = listName.value;
  const list_exists = current_list_name != null;
  const name_was_changed = list_exists && list_name !== current_list_name;

  if (current_user_data.lists === null) current_user_data.lists = [];
  const name_exists = current_user_data.lists.some((l) => l.name === list_name);
  name_not_unique = list_exists
    ? name_was_changed
      ? name_exists
      : false
    : name_exists;

  if (name_not_unique) {
    alert("The list name is not unique. Choose another name.");
    return;
  }

  const tasks = ConvertToTaskList(taskList);

  if (list_exists) {
    const lists = current_user_data.lists;
    for (var i = 0; i < lists.length; ++i)
      if (lists[i].name === current_list_name) {
        lists[i].name = list_name;
        lists[i].items = tasks;
        break;
      }

    //Override list data
    localStorage.setItem(
      current_user_data.email,
      JSON.stringify(current_user_data)
    );
  } else {
    //Add new list
    current_user_data.lists.push({
      created: Date.now(),
      name: list_name,
      items: tasks,
    });
    localStorage.setItem(
      current_user_data.email,
      JSON.stringify(current_user_data)
    );
  }

  current_list_name = list_name;
}

function ConvertToTaskList(ul) {
  const array = [];
  var items = ul.getElementsByTagName("li");

  for (const li of items) {
    console.log(li);
    array.push({
      text: li.querySelector("INPUT").value,
      checked: li.classList.contains("checked"),
    });
  }

  return array;
}

function PopulateListUL(lists, ul) {
  //Clear elements
  ul.innerHTML = "";

  for (let list of lists) {
    let li = document.createElement("LI");
    li.innerText = li.id = list.name;
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    span.onclick = (event) => {
      event.cancelBubble = true;

      if (confirm(`Are you sure you want to delete list "${li.id}"?`)) {
        const new_data = current_user_data;
        if (!new_data) {
          alert("Error while deleting list. Try again later.");
          return;
        }

        new_data.lists = new_data.lists.filter(function (el) {
          return el.name != li.id;
        });
        localStorage.setItem(current_user_data.email, JSON.stringify(new_data));
        current_user_data = new_data;
        ShowDashboard();
      }
    };

    li.onclick = (event) => {
      let listName = event.srcElement.id;
      let list = current_user_data.lists.find((l) => l.name === listName);
      if (list !== undefined) ShowListEditor(list);
      else alert("Trouble opening the list, please try later.");
    };

    ul.appendChild(li);
  }
}

function AddListTaskToUL(item, ul) {
  let li = document.createElement("LI");
  let input = document.createElement("INPUT");
  input.value = item.text;
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  span.onclick = (event) => {
    event.cancelBubble = true;
    ul.removeChild(li);
  };

  li.appendChild(input);
  li.appendChild(span);

  if (item.checked) {
    li.classList.add("checked");
  }

  ul.appendChild(li);
}

function AddListTask() {
  var text = newTaskInput.value;
  if (!text || text.length === 0) {
    //Check if not empty or whitespace
    alert("Fill in task before adding");
    return;
  }

  AddListTaskToUL({ text: text, checked: false }, taskList);
  newTaskInput.value = "";
}

function ShowListEditor(list) {
  CollapseElements(taskList, main_list_dashboard, listUL);
  ShowElements(list_editor, taskList);

  //flush data in list editor
  const inputs = list_editor.querySelectorAll("input");
  for (const input of inputs) {
    input.value = "";
  }

  taskList.innerHTML = "";

  if (list) {
    //Populate
    console.log("Create to do list received data: " + JSON.stringify(list));
    list_editor.querySelector("#listName").value = list.name;
    current_list_name = list.name;

    ShowElements(taskList);
    const items = list.items;

    for (const task of items) {
      AddListTaskToUL(task, taskList);
    }
  } else {
    current_list_name = null;
  }
}
//#endregion

//#region Account settings
function ShowAccountSettings() {
  CollapseAllForms();
  CollapseElements(dashboard, error_message);
  ShowElements(account_settings_form);

  LoadAccountSettings();
}

function ChangeAccountSettings(event) {
  event.preventDefault();
  form = event.srcElement;
  CollapseElements(error_message);

  const new_user_data = JSON.parse(JSON.stringify(current_user_data)); //Copy the current data to modify it
  let email_success,
    password_success,
    name_success = false; //Will change to true, if no data will fail validation

  name_success = CheckIfStringsNotEmpty(
    ["Name", "Surname"],
    form["name"].value,
    form["surname"].value
  );
 
  if (IsNotEmptyString(form["new_password"].value)) {
    [password_success, new_password] = ChangePassword(
      form["password"].value,
      form["new_password"].value
    );
    if (password_success) {
      new_user_data.password = HashText(new_password);
    }
  } else {
    password_success = true;
  }

  let email = current_user_data.email;
  [email_success, email] = ChangeEmail(
    current_user_data.email,
    form["email"].value
  );
  new_user_data.email = email;

  if (name_success && password_success && email_success) {
	//Override user's data or add new item in the storage
	new_user_data.name = form["name"].value;
	new_user_data.surname = form["surname"].value;

	
    localStorage.setItem(new_user_data.email, JSON.stringify(new_user_data));
	const old_email = current_user_data.email;
	console.log("geting ready to remove user " + old_email + " from local storage ");
    if (new_user_data.email !== old_email) {
      localStorage.removeItem(old_email);
	}
	
    current_user_data = new_user_data;
    console.log(
      "\nChanged account settings: " + JSON.stringify(new_user_data) + "\n"
    );

    LoadAccountSettings();
  }

  form["new_password"].value = "";
  form["password"].value = "";
}

function LoadAccountSettings() {
  if (current_user_data) {
    account_settings_form["name"].value = current_user_data["name"];
    account_settings_form["surname"].value = current_user_data["surname"];
    account_settings_form["email"].value = current_user_data["email"];
  } else {
    ShowFormError("Cannot load user's account settings. Try again later.");
  }
}

//Returns [no_errors: Boolean, email : string]
function ChangeEmail(old_email, new_email) {
  if (!new_email || new_email.length === 0) {
    ShowFormError("Email cannot be empty.");
    return [false, old_email];
  } else if (new_email !== old_email) {
    if (localStorage.getItem(new_email) != null) {
      ShowFormError("Email is already taken by another user.");
      return [false, old_email];
    } else {
      return [true, new_email];
    }
  } else {
    console.log(
      "No change in user's email. " + old_email + " === " + new_email
    );
    return [true, old_email];
  }
}

function ChangePassword(current_password, new_password) {
  if (IsNotEmptyString(current_password)) {
    let old_hashed_password = HashText(current_password);
    if (old_hashed_password !== current_user_data.password) {
      ShowFormError("Password is incorrect.");
      return [false, current_password];
    } else {
      return [true, new_password];
    }
  } else {
    ShowFormError("Enter the current password to change it.");
    return [false, current_password];
  }
}
//#endregion

//#region Helper functions
function HashText(text) {
  return CryptoJS.SHA256(text).toString();
}
//#endregion

//#region UI Helper methods
function CollapseAllForms() {
  const forms = document.querySelectorAll("FORM");

  for (let form of forms) {
    form.style.display = "none";
  }

  document.getElementById("logging").style.display = "block";

  CollapseElements(error_message);
}

function ShowElements(...elements) {
  for (element of elements) {
    try {
      element.style.display = "block";
    } catch {}
  }
}

function CollapseElements(...elements) {
  for (element of elements) {
    try {
      element.style.display = "none";
    } catch (error) {}
  }
}

function IsNotEmptyString(str) {
  return str && str.length > 0;
}

function SetClassVisible(className, visible) {
  const targets = document.querySelectorAll("." + className);
  for (target of targets) {
    if (visible) {
      target.style.visibility = "visible";
      target.style.display = "inline";
    } else {
      target.style.visibility = "collapse";
      target.style.display = "none";
    }
  }
}
//#endregion
