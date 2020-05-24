//#region Global variables
var taskList;
var current_user_data = null;
var sign_form, log_in_form, error_message, signed_up_message, dashboard, no_lists_message;
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

	//Add listeners
	sign_form.addEventListener("submit", Register);
	log_in_form.addEventListener("submit", LogIn);
	const new_task_form = document.getElementById("new_task_form");
	new_task_form.addEventListener("submit", addToList);

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
	localStorage.setItem("admin@gmail.com", JSON.stringify({"password":"abc"}));
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
			'name' : name,
			'surname' : surname,
			'password' : password, //HASH!
			'lists' : null
		};

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

	if (user) {
		if (user.password === password) {
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
};
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

function IsNotEmptyString(str)
{}

function setClassVisible(className, visible) {
    const targets = document.querySelectorAll("."+className);
    for (target of targets) {
		if (visible) {
			target.style.visibility = 'visible';
			target.style.display = 'inline-block';
		} else {
			console.log("Making " + target + " invisible")
			target.style.visibility = 'collapse';
			target.style.display = 'none';
		}
    }
};
//#endregion