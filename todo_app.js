//#region Global variables
var taskList;
var current_user_data = null;
var sign_form, log_in_form, error_message, dashboard, account_settings, no_lists_message, log_panel;
//#endregion

//#region Site loaded
window.addEventListener('DOMContentLoaded', () => {

	//SET GLOBAL VARIABLES
	taskList = document.getElementById('tasks');
	log_panel = document.getElementById('logging');
	sign_form = log_panel.querySelector('#sign_up_form');
	log_in_form = log_panel.querySelector('#log_in_form');
	error_message = log_panel.querySelector('#error_message');//unused?
	dashboard = document.getElementById("dashboard");
	no_lists_message = document.getElementById("no_lists_message");
	account_settings = document.getElementById('account_settings_form');

	//Add listeners
	sign_form.addEventListener("submit", Register);
	log_in_form.addEventListener("submit", LogIn);
	const new_task_form = document.getElementById("new_task_form");
	new_task_form.addEventListener("submit", addToList);
	account_settings.addEventListener("submit", ChangeAccountSettings);

	//show header
	document.body.querySelector('HEADER').style.display = 'block';
	//hide dashboard elements
	document.getElementById('dashboard').style.display = 'none';
	log_panel.style.display = 'none';

	//Set Visibility
	setClassVisible('loggedIn', false);
	setClassVisible('loggedOut', true);
	CollapseAllForms();

	//Initialize global storage
	// window.localStorage - stores data with no expiration date
	
	var hashed_password = HashText("abc");
	localStorage.setItem("admin@gmail.com", JSON.stringify({"email": "admin@gmail.com", "password":hashed_password, "name": "John", "surname":"Cat", "lists": null}));
});
//#endregion

//#region Form-related methods
function ShowFormError(message) {
	
	error_message = log_panel.querySelector('.formError');
	error_message.innerText = message;
	ShowElement(error_message);
}

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
	ShowElement(log_in_form);
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
			DisplayDashboard(current_user_data.lists);
		} catch (error) {
			ShowFormError('Error while signing up.');
			console.log("Error while signing up: " + error);
		}
	}
}

function LogIn(event){
	console.log("Log in ()...")
	event.preventDefault();
	CollapseElement(error_message);

	email = log_in_form[0].value;
	password = log_in_form[1].value;
	console.log("I read props: " + email + " " + password)

	const user = JSON.parse(localStorage.getItem(email));
	console.log("User:" + user);
	console.log('User read in log in  : ' + user);

	let hash = HashText(password);
	console.log('CryptoJS.SHA256(password):\n' + hash);
	
	if (user) {
		if (user.password == hash.toString()) {
			console.log('Logged in.');
			setClassVisible('loggedIn', true);
			setClassVisible('loggedOut', false);
			current_user_data = user;

			console.log("Current user data: " + user.toString());

			DisplayDashboard(user.lists);
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
function DisplayDashboard(data) {
	console.log("Display dashboard");
	CollapseAllForms();
	ShowElement(dashboard);
	//Load data from user
	//create div for lists

	if (!data || data.length === 0) {
		console.log("no_lists_message : " + no_lists_message.toString())
		ShowElement(no_lists_message);
		return;
	} else {
		CollapseElement(no_lists_message);
	}

	for(list of data) {
		let listDiv = document.createElement('UL');
		listDiv.classList.add('TODOlist');

		innerHTML = "";
		for(item of list) {
			innerHTML += `<li>${item.text}</li>`;
		}
		let checkBox = document.createElement('CHECKBOX');
		let textBox = document.createElement('RICHTEXTBOX');

		listDiv.innerHTML = "<input class=\"list_title\" text=\"title\">LIST TITLE</input><li><input type=\"checkbox\"\/><input type=\"text\"></input></li>";
		dashboard.appendChild(listDiv);
	}
}

function ShowElementsWithClass(class_name) {

	let allElements = document.body.querySelectorAll('*');
	for(let element of allElements) {
		element.style.display = element.classList.contains(class_name) ? 'block' : 'none';
	}
}

function addToList(event){
	event.preventDefault();
	console.log(event);
	var input = document.getElementById("input_new_task");
	console.log(input.value);
	const newTask = document.createElement('LI');
	newTask.innerText = input.value;
	taskList.appendChild(newTask);
};

function CreateToDoList() {
	console.log("CreateToDoList");
	//Create list title input
	//create 1 checkbox + text input
	
	addToList();
};
//#endregion

//#region Account settings
function ShowAccountSettings(){

	CollapseAllForms();
	CollapseElement(dashboard);
	ShowElement(account_settings);
	
	if (current_user_data) {
		console.log('account_settings.elements ' + account_settings);
		console.log('current use data: ' + JSON.stringify(current_user_data))
		account_settings['name'].value = current_user_data['name'];
		account_settings['surname'].value = current_user_data['surname'];
		account_settings['email'].value = current_user_data['email'];
	} else {
		account_settings.querySelector('.formError').innerText = "Cannot load user's account settings. Try again later.";
	}
}

function ChangeAccountSettings(event){
	event.preventDefault();
	console.log("ChangeAccountSettings  " + JSON.stringify(event));
	console.log(event);
	form = event.srcElement;

	const new_name = form['name'].value;
	const new_surname = form['surname'].value;
	const new_user_data = current_user_data;
	const old_email = current_user_data.email;

	if (!new_name) {
		ShowFormError('First name cannot be empty.');
		return;
	} else {
		new_user_data.name = new_name;
	}
	
	if (!new_surname) {
		ShowFormError('Surname cannot be empty.');
		return;
	} else {
		new_user_data.surname = new_surname;
	}

	const new_password = ChangePassword(form['password'].value, form['new_password'].value);
	if (!new_password){
		new_user_data.password = HashText(new_password); 
	}
	
	console.log("email value: " + form['email'].value + " typ: " + typeof(form['email'].value));

	new_user_data.email = ChangeEmail(current_user_data.email, form['email'].value);
	localStorage.setItem(new_user_data.email, JSON.stringify(new_user_data));
	//localStorage[new_user_data.email].name = "CATTTTTTTTTTTTTTTTTTT";// JSON.stringify(new_user_data));
	if (new_user_data.email !== old_email) {
		localStorage.removeItem(old_email);
	}

	console.log("\nnew user data: " + JSON.stringify(new_user_data) + "\n");

	current_user_data = new_user_data;
	ShowAccountSettings();
}

function ChangeEmail(old_email, new_email) {

	if (!new_email) {
		ShowFormError('Email cannot be empty.');
	} else if (new_email !== old_email) {
		if (localStorage.getItem(new_email) != null) {
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

	return old_password;
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
	for (let form of forms) {
		form.style.display = 'none';
	}

	document.getElementById('logging').style.display = 'block';

	CollapseElement(error_message);
}

function ShowById(id) {
	document.getElementById(id).style.display = 'block';
}

function ShowElement(element) {
	element.style.display = 'block';
}

function CollapseById(id) {

}

function CollapseElement(element) {
	element.style.display = 'none';
}

function CollapseElements(...elements) {
	for(element of elements) {
		element.style.display = 'none';
	}
}

function noneById(id) {
	document.getElementById(id).style.display = 'none';
}

function Trim(x) {
	return x.replace(/^\s+|\s+$/gm,'');
}

function IsNotEmptyString(str) {
	return str && str.length > 0;
}

function IsEmptyString(str) {
	return !str || Trim(str).length === 0;
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