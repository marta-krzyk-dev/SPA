//#region Imports
//var fs =import('fs');
//var CryptoJS = import("crypto-js");
//#endregion

//#region Global variables
var taskList;
var current_user_data = null;
var sign_form, log_in_form, error_message, signed_up_message, dashboard, account_settings, no_lists_message;
//#endregion

//#region Site loaded
window.addEventListener('DOMContentLoaded', () => {

	//SET GLOBAL VARIABLES
	taskList = document.getElementById('tasks');
	let log_panel = document.getElementById('logging');
	sign_form = log_panel.querySelector('#sign_up_form');
	log_in_form = log_panel.querySelector('#log_in_form');
	error_message = log_panel.querySelector('#error_message');
	signed_up_message = log_panel.querySelector('#signed_up_message');
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
	
	var hashed_password = CryptoJS.SHA256("abc").toString();
	localStorage.setItem("admin@gmail.com", JSON.stringify({"email": "admin@gmail.com", "password":hashed_password, "name": "John", "surname":"Cat", "lists": null}));
});
//#endregion

//#region Form-related methods
function ShowLoggingError(message) {
	
	ShowElement(error_message);
	error_message.innerText = message;
}

function ShowSignUpMessage(message) {

	ShowElement(signed_up_message);
	signed_up_message.innerText = message;
}

function CheckIfStringsNotEmpty(names, ...elems) {

	for(i=0; i < names.length; ++i) {
		if (!elems[i]) {
			ShowLoggingError(names[i] + ' is empty.');
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
	CollapseElements(error_message, signed_up_message);

	const agreed_to_terms = sign_form[4].checked;
	console.log("Agreed to terms: "  + agreed_to_terms)

	if (!agreed_to_terms) {
		ShowLoggingError('You have to agree with Terms of Use.');
		return;
	}

	const email = sign_form[2].value;
	if (!email) {
		ShowLoggingError('Email is empty.');
		return;
	}
	const user = JSON.parse(localStorage.getItem(email));
	console.log("user read : " + user)

	if(user) {
		ShowLoggingError('The user with this email already exists');
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
			'password' : CryptoJS.SHA256(password).toString(),
			'lists' : null
		};

		console.log('Hashed password to ' + CryptoJS.SHA256(password));

		try {
			localStorage.setItem(email, JSON.stringify(user_data));
			ShowSignUpMessage('Your account was created, please log in!');
			console.log("Registered: " + email);
			current_user_data = user;
			DisplayDashboard();
		} catch (error) {
			ShowLoggingError('Error while signing up.');
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

	let hash = CryptoJS.SHA256(password);
	console.log('CryptoJS.SHA256(password):\n' + hash);
	console.log( user.password.toString() + "   type of hash:" + hash.toString());


	if (user) {
		if (user.password == hash.toString()) {
			console.log('Logged in.');
			setClassVisible('loggedIn', true);
			setClassVisible('loggedOut', false);
			current_user_data = user;

			DisplayDashboard(user.lists);
		} else {
			ShowLoggingError('Incorrect password!');
		}
	}
	else {
		ShowLoggingError('User does not exist.');
	}
}

function LogOut() {
	current_user_data = null;
	setClassVisible('loggedIn', false);
	setClassVisible('loggedOut', true);
}
//#endregion

//#region Dashboard
function DisplayDashboard(data = null) {
	CollapseAllForms();
	ShowElement(dashboard);
	//Load data from user
	//create div for lists

	if (!data || data.length === 0) {
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

	//get data from form/event
	//validate name, surname
	//if new_password is not null
	const new_name = form['name'];
	const new_surname = form['surname'];
	const new_email = form['email'];

	if (IsEmptyString(new_name)) {
		ShowLoggingError('First name cannot be empty.');
		return;
	} else if (IsNotEmptyString(surname)) {
		ShowLoggingError('Surname cannot be empty.');
		return;
	} else if (IsNotEmptyString(email)) {
		ShowLoggingError('Email cannot be empty.');
		return;
	}

	SavePassword(form['password'], form['new_password']);
	

	localStorage.setItem(current_user_data['email'], current_user_data);
	//hhow to handle email change?
}

function SavePassword(current_password_hash, new_password) {

	if (IsNotEmptyString(new_password)) {
		const password = current_password_hash;
		if (IsNotEmptyString(password)) {

			let new_hashed_password = CryptoJS.SHA256(password);
			if (new_hashed_password !== current_user_data['password']) {
				ShowLoggingError('Current password is incorrect.');
			} else {
				current_user_data['password'] = CryptoJS.SHA256(new_password);
			}
		} else {
			ShowLoggingError('Enter the current password to change it.');
		}
	}
}
//#endregion

//#region Helper methods
function CollapseAllForms() {
	const forms = document.querySelectorAll('FORM');
	for (let form of forms) {
		form.style.display = 'none';
	}

	document.getElementById('logging').style.display = 'block';
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

function IsNotEmptyString(str) {
	return str && str.trim().length > 0;
}

function IsEmptyString(str) {
	return !str || str.trim().length === 0;
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