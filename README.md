# TODO list Single Page Application
Goal: Create a Single Page Application for managing TODO list and user accounts with the ugliest UI imaginable

A simple "to-do list" application, using client-side **HTML, CSS, Javascript**. 

## Features:
- [x] Storing user's data in localStorage
- [x] Password hashing using Crypto-JS minified library
- [x] Page never actually refreshes or reloads, the contents of the page should disappear/appear as needed

## User-stories:
- [x] Create user account
- [x] Log in
- [x] Log out
- [x] Change user's data (name, surname, password, email)

- [x] Create a new TODO list with custom name
- [x] Rename a TODO list
- [x] Delete a TODO list
- [x] Add element to a TODO list
- [x] Remove an element in a TODO list
- [x] Modify an element in a TODO list

![log_in](https://github.com/marta-krzyk-dev/SPA/blob/master/Printscreens/log_in_form.png?raw=true)
![register](https://github.com/marta-krzyk-dev/SPA/blob/master/Printscreens/register_form.png?raw=true)

### Index
- [x] Upon a fresh load (or refresh) of the application, the user should see the title of the application, a description, and two buttons: "Sign Up" and "Log In".
- [x] "Sign Up" form: first name, last name, email, and password, check-box "I agree to the Terms of Use"
- [x] When they submit the form, if there are any errors on the form, they should see a red error message somewhere on the screen. 
- [x] If the form submission is successful, they should be taken to their dashboard.
- [x] User data is stored in localStorage
- [x] "Log In" form: email address and password. 
- [x] Red error message in case of errors
- [x] If the inputs are fine, take user to their dashboard.

![lists](https://github.com/marta-krzyk-dev/SPA/blob/master/Printscreens/lists.png?raw=true)

### Dashboard:
- [x]  The dashboard should list (in chronological order), all of the "To-Do Lists" created by the user thus far. If none have been created, none should be displayed. In either case, there should be a "Create New to-do List button" somewhere on the screen.
- [x] If one of the existing todo-lists is clicked on, the user should be taken to that list.
- [x] If a user clicks to create a new todo list, they should be taken to a blank list.

![list_editor](https://github.com/marta-krzyk-dev/SPA/blob/master/Printscreens/list_editor.png?raw=true)
![editing list](https://github.com/marta-krzyk-dev/SPA/blob/master/Printscreens/editing_list.png?raw=true)

### Lists:
When a user is viewing a (new or existing) list, they should be able to :
- [x] Name or rename the list to anything they want, as long as it doesn't conflict with the name of any other list created by that particular user.
- [x] Add as many items to the list as they wish
- [x] Check off an item as "done", and uncheck it as well
- [x] Save the list

![account_settings](https://github.com/marta-krzyk-dev/SPA/blob/master/Printscreens/account_settings.png?raw=true)

### Users 
- [x] Support as many unique users as possible.
- [x] If the user is logged in, then at the top of the screen, on every page of the site, there should be a "log out" button. Clicking that should log the user out.
- [x] If the user is logged in, then at the top of the screen, on every page of the site, there should be a button that says "account settings". Clicking that link should take the user to a page where they can edit any/all of the information they entered on the signup form.
- [x] User can change their password
- [x] User can change their email (unless it collides with other existing user)
- [x] The actions that one user takes within the application should have virtually no effect on what other users are doing.
