//#region Global variables
var taskList;
var current_user_data = null;
var sign_form, log_in_form, error_message, dashboard, account_settings_form, error_message_settings, no_lists_message, log_panel,
show_lists_button, list_editor, main_list_dashboard, listUL, taskList;
//#endregion

//#region Site loaded
window.addEventListener('DOMContentLoaded', () => {

	//SET GLOBAL VARIABLES
	//taskList = document.getElementById('tasks');
	log_panel = document.getElementById('logging');
	sign_form = log_panel.querySelector('#sign_up_form');
	log_in_form = log_panel.querySelector('#log_in_form');
	error_message = document.querySelector('#error_message');
	error_message_settings = document.querySelector('#error_message_settings');
	account_settings_form = document.getElementById('account_settings_form');

	//Dashboard elements
	dashboard = document.getElementById('dashboard');
	no_lists_message = dashboard.querySelector('#no_lists_message');
	main_list_dashboard = dashboard.querySelector('#main_list_dashboard');
	listUL = dashboard.querySelector('#listUL');
	show_lists_button = dashboard.querySelector('#show_lists_button');
	list_editor = dashboard.querySelector('#list_editor');	
	taskList = dashboard.querySelector('#taskList');

	//Add listeners
	sign_form.addEventListener("submit", Register);
	log_in_form.addEventListener("submit", LogIn);
	//const new_task_form = document.getElementById("new_task_form");
	//new_task_form.addEventListener("submit", addToList);
	account_settings_form.addEventListener("submit", ChangeAccountSettings);

	//show header
	document.body.querySelector('HEADER').style.display = 'block';
	//hide dashboard elements
	dashboard.style.display = 'none';
	log_panel.style.display = 'none';

	//Set Visibility
	setClassVisible('loggedIn', false);
	setClassVisible('loggedOut', true);
	CollapseAllForms();

	CreateExampleUser();
});

function CreateExampleUser() {
	let hashed_password = CryptoJS.SHA256("abc").toString();
	let lists = [ 
		{
			"created" : Date.now(),
			"name" : "things to do",
			"items" : [ 
				{ "text" : "Fry eggs", "checked" : false },
				{ "text" : "Cook potatoes", "checked" : false },
				{ "text" : "Play with cat", "checked" : true }
			]
		},
		{
			"created" : Date.now(),
			"name" : "css",
			"items" : [ 
				{ "text" : "Css study", "checked" : true },
				{ "text" : "Understand pseudo classes", "checked" : false },
				{ "text" : "Child combinator selector", "checked" : true }
			]
		}
	];
	localStorage.setItem("admin@gmail.com", JSON.stringify({"email": "admin@gmail.com", "password":hashed_password, "name": "John", "surname":"Cat", "lists": lists}));

}
//#endregion

//#region Form-related methods
function ShowFormError(message) {
	
	console.log("error message is " + JSON.stringify(error_message));
	error_message.innerText = message;
	ShowElements(error_message);
}
//TODO remove this func
function CheckIfStringsNotEmpty(names, ...elems) {

	for(i=0; i < names.length; ++i) {
		if (!elems[i]) {
			ShowFormError(names[i] + ' is empty.');
			return false;
		}
	}

	return true;
}

//#region Show hide methods
function ShowSignUpForm() {
	
	CollapseAllForms();
	document.getElementById('logging').style.display = 'block';
	sign_form.style.display = 'block';
}

function ShowLogInForm() {
	
	CollapseAllForms();
	//log_in_form.style.display = 'block';
	ShowElements(log_in_form);
	//ShowById('log_in_form');
}
//#endregion

//#region Methods for listeners
function Register(event){
	event.preventDefault();
	CollapseElements(error_message);

	const agreed_to_terms = sign_form[4].checked;
	console.log("Agreed to terms: "  + agreed_to_terms)

	if (!agreed_to_terms) {
		ShowFormError('You have to agree with Terms of Use.');
		return;
	}

	const email = sign_form[2].value;
	if (!email) {
		ShowFormError('Email is empty.');
		return;
	}
	const user = JSON.parse(localStorage.getItem(email));
	console.log("user read : " + user)

	if(user) {
		ShowFormError('The user with this email already exists');
	}
	else {
		const name = sign_form[0].value;
		const surname = sign_form[1].value;
		const password = sign_form[3].value;

		if (!CheckIfStringsNotEmpty(['Name','Surname','Password'], name, surname, password))
			return;

		user_data = {
			'email' : email,
			'name' : name,
			'surname' : surname,
			'password' : HashText(password),
			'lists' : []
		};

		console.log('Hashed password to ' + HashText(password));

		try {
			localStorage.setItem(email, JSON.stringify(user_data));
			console.log("Registered: " + email);
			current_user_data = user_data;
			setClassVisible('loggedIn', true);
			setClassVisible('loggedOut', false);
			ShowDashboard(current_user_data.lists);
		} catch (error) {
			ShowFormError('Error while signing up.');
			console.log("Error while signing up: " + error);
		}
	}
}

function LogIn(event){
	console.log("Log in ()...")
	event.preventDefault();
	CollapseElements(error_message);

	email = log_in_form[0].value;
	password = log_in_form[1].value;
	console.log("I read props: " + email + " " + password)

	const user = JSON.parse(localStorage.getItem(email));
	console.log("User:" + user);
	console.log('User read in log in  : ' + user);

	let hash = HashText(password);
	console.log('LogIn hashed password attempted:\n' + hash);
	
	if (user) {
		if (user.password === hash) {
			console.log('Logged in.');
			setClassVisible('loggedIn', true);
			setClassVisible('loggedOut', false);
			current_user_data = user;

			console.log("Current user data: " + user.toString());

			ShowDashboard(user.lists);
		} else {
			ShowFormError('Incorrect password!');
		}
	}
	else {
		ShowFormError('User does not exist.');
	}
}

function LogOut() {
	current_user_data = null;
	setClassVisible('loggedIn', false);
	setClassVisible('loggedOut', true);
}
//#endregion

//#region Dashboard
//TODO should it get data? or get data from global variable?
function ShowDashboard(data) {
	console.log("Display dashboard");
	CollapseAllForms();
	CollapseElements(list_editor);
	console.log("ShowDashboard  list_editor: "+ JSON.stringify(list_editor));
	console.log("collapsed all forms dashboard");
	
	ShowElements(dashboard, main_list_dashboard);
	ShowElements(main_list_dashboard);
	console.log("main_list_dashboard + " + main_list_dashboard.toString());
	main_list_dashboard.style.visibility = "visible";
	main_list_dashboard.style.display = "block";
	console.log("collapsed list editor");
	
	data = !data ? current_user_data.lists : data;
	console.log("ShowDashboard received data: "+ JSON.stringify(data));

	if (!data || data.length === 0) {
		ShowElements(no_lists_message);
		CollapseElements(listUL);
		console.log("collapsed lists");
		return;
	} else {

		CollapseElements(no_lists_message);
		console.log("collapsed no_lists_message");

		PopulateListUL(data, listUL);
		ShowElements(listUL);
		CollapseElements(list_editor);
		//console.log("collapsed list editor");
	}

	/*
	const ul = document.querySelector('#taskList');
	for(list of data) {
		for(item of list.items) {
			ul.appendChild( CreateListTask(item) );
		}
	}


var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
  }
}
// Add a "checked" symbol when clicking on a list item
ul.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);*/
}

function SaveList() {
	//check is name is still unique

	const list_name = listName.value;
	const name_unique = current_user_data.lists.some(l => l.name === list_name);

	//if not show alert
	//check is not empty
	if (!name_unique) {
		alert("The list name already exists. Choose another name.");
		return;
	}

	//get tasks

	const tasks = ConvertToTaskList(taskList);
	//create object
	const list_old_name; //!!!!!!!!!!!!!
	const list_exists = current_user_data.lists.some(l => l.name === list_old_name);
	if (list_exists) {
		//Change the data is local storage
	}
	const new_list = { "created" : Date.now(), "name" : new_name, "items" : tasks };
}
function ConvertToTaskList(ul) {

	const array = [];
	for(const li of ul) {
		array.add({
			"text" : li.innerText,
			"checked" : li.classList.some(c => c === "checked")
		});
	}

	console.log("ConvertToTaskList");
	console.log(array);
	return array;
}

function PopulateListUL(listy, ul) {

	//Clear elements
	ul.innerHTML = "";

	console.log("Creating lists: " + JSON.stringify(listy));
	//sort by created
	for (let list of listy) {
		console.log("Creating li for list: " + JSON.stringify(list));
		let li = document.createElement("LI");
		li.innerText = li.id = list.name;
		let span = document.createElement("SPAN");
		let txt = document.createTextNode("\u00D7");
		span.className = "close";
		span.appendChild(txt);
		span.onclick = function() {};
		li.appendChild(span);

		span.onclick = (event) => {
			console.log(event);

			if (confirm(`Are you sure you want to delete list "${li.id}"?`)) {

				const new_data = current_user_data;
				if (!new_data) {
					alert("Error while deleting list. Try again later.");
					return;
				}

				new_data.lists = new_data.lists.filter(function(el) { return el.name != li.id; }); 
				localStorage.setItem(current_user_data.email, JSON.stringify(new_data));
				current_user_data = new_data;
				ShowDashboard();
			}
		}; 

		li.onclick = (event) => {
			let listName = event.srcElement.id;
			let list = current_user_data.lists.find(l => l.name === listName);
			ShowListEditor(list);
		};

		ul.appendChild(li);
	}

/*	var close = ul.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
	div.style.background_color = "red";
	if (confirm("Are you sure you want to delete the list? parent: " + JSON.stringify(close))) {
		console.log("Deleting list in local storage...");
		console.log("Reload dashboard...");
		ShowDashboard();
	}
	else
		console.log("Don't delete list..");
  }}*/

}
function DeleteTaskList(event) {
	event.preventDefault();
	console.log("Delete task list")

	ShowDashboard();
}
function CreateListTask(item) {

	let li = document.createElement("LI");
	li.innerText = item.text;

	let span = document.createElement("SPAN");
	let txt = document.createTextNode("\u00D7");
	span.className = "close";
	span.appendChild(txt);
	li.appendChild(span);
			//li.classList.add("dashboard");
	if (item.checked) {
		li.classList.add("checked");
	}

	return li;
}

function AddNewTask() {

}

function CreateList(list) {
	var myNodelist = document.getElementsByTagName("LI");


		var i;
		for (i = 0; i < myNodelist.length; i++) {
		var span = document.createElement("SPAN");
		var txt = document.createTextNode("\u00D7");
		span.className = "close";
		span.appendChild(txt);
		myNodelist[i].appendChild(span);
		}

		// Click on a close button to hide the current list item
		var close = document.getElementsByClassName("close");
		var i;
		for (i = 0; i < close.length; i++) {
		close[i].onclick = function() {
			var div = this.parentElement;
			div.style.display = "none";
		}
	}
}

function ShowElementsWithClass(class_name) {

	let allElements = document.body.querySelectorAll('*');
	for(let element of allElements) {
		element.style.display = element.classList.contains(class_name) ? 'block' : 'none';
	}
}

function AddListTask(){
	
	var text = newTaskInput.value;
	if (!text || text.length === 0) {
		alert("Fill in task before adding");
		return;
	}

	const task = { "text" : text, "checked" : false };
	taskList.appendChild(CreateListTask(task));
	newTaskInput.value = '';
}

function ShowListEditor(list) {
	console.log("ShowListEditor " + list);
	console.log(list);

	CollapseElements(taskList, main_list_dashboard, listUL);
	ShowElements(list_editor, taskList);

	//flush data in list editor
	const inputs = list_editor.querySelectorAll('input');
	for(const input of inputs) {
		input.innerText = '';
	}

	taskList.innerHTML = '';

	if (list) {
		//Populate
		console.log("Create to do list received data: " + JSON.stringify(list));
		console.log(list_editor.querySelector('#listName'));
		list_editor.querySelector('#listName').value = list.name;
		
		//add tasks
		//const ul = dashboard.querySelector('#taskList');
		ShowElements(taskList);
		const items = list.items;
		console.log(list.items);
		for(const task of items) {
			const newTask = CreateListTask(task);
			taskList.appendChild(newTask);
			console.log("Task read: " + task.text);
		}
	}
};

//#endregion

//#region Account settings
function ShowAccountSettings(){

	CollapseAllForms();
	CollapseElements(dashboard, error_message_settings, error_message);
	ShowElements(account_settings_form);
	
	if (current_user_data) {
		console.log('account_settings.elements ' + account_settings_form);
		console.log('current use data: ' + JSON.stringify(current_user_data))
		account_settings_form['name'].value = current_user_data['name'];
		account_settings_form['surname'].value = current_user_data['surname'];
		account_settings_form['email'].value = current_user_data['email'];
	} else {
		account_settings_form.querySelector('.formError').innerText = "Cannot load user's account settings. Try again later.";
	}
}

function ChangeAccountSettings(event){
	event.preventDefault();
	console.log("ChangeAccountSettings  " + JSON.stringify(event));
	console.log(event);
	form = event.srcElement;
	CollapseElements(error_message_settings);

	const new_name = form['name'].value;
	const new_surname = form['surname'].value;
	const new_user_data = current_user_data;
	const old_email = current_user_data.email;
	const new_email = form['email'].value;

	if (!CheckIfStringsNotEmpty(['Name','Surname','Password'], new_name, new_surname, new_email))
			return;

	new_user_data.name = new_name;
	new_user_data.surname = new_surname;

	const new_password = ChangePassword(form['password'].value, form['new_password'].value);
	if (new_password !== null){
		console.log("CHanging password to "+ new_password);
		new_user_data.password = HashText(new_password); 
	}
	
	console.log("email value: " + form['email'].value + " typ: " + typeof(form['email'].value));

	new_user_data.email = ChangeEmail(current_user_data.email, form['email'].value);
	localStorage.setItem(new_user_data.email, JSON.stringify(new_user_data));
	
	if (new_user_data.email !== old_email) {
		localStorage.removeItem(old_email);
	}

	console.log("\nnew user data: " + JSON.stringify(new_user_data) + "\n");

	current_user_data = new_user_data;
	ShowAccountSettings();
}

function ShowSettingsFormError(message) {
	
	error_message_settings.innerText = message;
	ShowElements(error_message_settings);
}

function ChangeEmail(old_email, new_email) {

	if (!new_email) {
		ShowFormError('Email cannot be empty.');
	} else if (new_email !== old_email) {
		if (localStorage.getItem(new_email) != null) {
			console.log('Email is already taken by another user.');
			ShowFormError('Email is already taken by another user.');
		} else {
			console.log("Trying to change user's email from " + old_email + " to " + new_email);
			//current_user_data.email = new_email;
			//localStorage.setItem(new_email, JSON.stringify(current_user_data));
			//localStorage.removeItem(old_email);
			console.log("Removed old user in localStorage: " + localStorage.getItem(old_email));
			console.log("Changed user's email from " + old_email + " to " + new_email);
			return new_email;
		}
	} else {
		console.log("No change in user's email. " + old_email + " === " + new_email);
	}

	return old_email;
}

function ChangePassword(old_password, new_password) {

	if (IsNotEmptyString(new_password)) {
		if (IsNotEmptyString(old_password)) {
			let old_hashed_password = HashText(old_password);
			if (old_hashed_password !== current_user_data.password) {
				ShowFormError('Password is incorrect.');
			} else {
				return new_password;
			}
		} else {
			ShowFormError('Enter the current password to change it.');
		}
	}

	return null;
}
//#endregion

//#region Helper functions
function HashText(text) {
	return CryptoJS.SHA256(text).toString();
}
//#endregion

//#region UI Helper methods
function CollapseAllForms() {
	const forms = document.querySelectorAll('FORM');
	//CollapseElements(forms);
	for (let form of forms) {
		form.style.display = 'none';
		console.log("Collapsing form " + form.id);
	}

	document.getElementById('logging').style.display = 'block';

	//CollapseElement(error_message);
}

function ShowById(id) {
	document.getElementById(id).style.display = 'block';
}

function ShowElements(...elements) {
	for(element of elements) {
		try {
			console.log("Shwoing " + JSON.stringify(element));
			element.style.display = 'block';
		} catch (error) {
			console.log("Eror " + error);
		}
	}
}

function CollapseElements(...elements) {
	for(element of elements) {
		try {
			console.log("Collapsing " + JSON.stringify(element));
			element.style.display = 'none';
		} catch (error) {
			console.log("Eror " + error);
		}
	}
}

function IsNotEmptyString(str) {
	return str && str.length > 0;
}

function setClassVisible(className, visible) {
    const targets = document.querySelectorAll("."+className);
    for (target of targets) {
		if (visible) {
			target.style.visibility = 'visible';
			target.style.display = 'inline';
		} else {
			console.log("Making " + target + " invisible")
			target.style.visibility = 'collapse';
			target.style.display = 'none';
		}
    }
};
//#endregion