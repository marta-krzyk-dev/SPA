//#region Global variables
var taskList;
var sign_form, log_in_form, error_message;
//#endregion

//#region Site loaded
window.addEventListener('DOMContentLoaded', () => {

	//SET GLOBAL VARIABLES
	taskList = document.getElementById('tasks');
	let log_panel = document.getElementById('logging');
	sign_form = log_panel.querySelector('#sign_up_form');
	log_in_form = log_panel.querySelector('#log_in_form');
	error_message = log_panel.querySelector('#error_message');

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

	CollapseAllForms();

	//Initialize global storage
	var dict = {'admin@gmail.com':{password:'abc'}};
	console.log(JSON.stringify(dict));
	//localStorage.setItem('users', dict);
	console.log(localStorage);
	console.log(JSON.stringify(localStorage));
	const users = localStorage.getItem('users');
	console.log(users);

	const parsed = JSON.parse(users);
	console.log(parsed);
});
//#endregion

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

//#region Form-related methods
function ShowLoggingError(message) {
	
	ShowElement(error_message);
	error_message.innerText = message;
}
//#endregion

//#region Methods for listeners
function Register(event){
	event.preventDefault();

	const agreed_to_terms = sign_form[4].value === "check";
	if (!agreed_to_terms) {
		ShowLoggingError('You have to agree with Terms of Use.');
		return;
	}

	const email = sign_form[2].value;
	const users = JSON.parse(localStorage.getItem('users'))
	const user = users[email];
	if(!user) {
		user = {
			'name' : sign_form[0].value,
			'surname' : sign_form[1].value,
			'password' : sign_form[3].value, //HASH!
		};
		localStorage.setItem(email, JSON.stringify(user));
		ShowSignUpMessage('Your account was created, please log in!');
	}
	else {
		ShowLoggingError('The user with this email already exists');
	}
}

function LogIn(event){
	
	event.preventDefault();
	CollapseElement(error_message);

	email = log_in_form[0].value;
	password = log_in_form[1].value;

	const users = localStorage.getItem('users');
	console.log(users);
	const user = users[email];

	console.log('User read in log in  : ' + user);
	if (user) {
		if (user.password === password) {
			console.log('logging in...');
		} else {
			ShowLoggingError('Incorrect password!');
		}
	}
	else {
		ShowLoggingError('User does not exist.');
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

function noneById(id) {
	document.getElementById(id).style.display = 'none';
}

function IsNotEmptyString(str)
{}
//#endregion