<div id="top"></div>
<br />
<div align="center">
<h2 align="center">UnderageValidate</h2>

  <p align="center">
    A simple, configurable input validator for the browser.
    <br />
    <br />
    <a href="https://github.com/andrewse02/underage-validate/issues">Report Bug</a>
    ·
    <a href="https://github.com/andrewse02/underage-validate/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
        <a href="#usage">Usage</a>
        <ul>
            <li><a href="#the-basics">The Basics</a></li>
            <li><a href="#adding-fields">Adding Fields</a></li>
            <li><a href="#field-types">Field Types</a></li>
            <li><a href="#full-example">Full Example</a></li>
            <li><a href="#all-instance-methods">All Instance Methods</a></li>
        </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<br />

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

Ways to install

-   npm
    ```sh
    npm install underage-validate
    ```
    ```html
    <script type="text/javascript" src="path/to/node_modules/underage-validate/underage-validate.min.js"></script>
    ```
    _**Note:** You cannot `require` UnderageValidate, it is meant for browsers which do not support that feature._
<br />

-   CDN from unpkg
    ```html
    <script type="text/javascript" src="unpkg.com/underage-validate"></script>
    ```

-   Download From <a href="https://github.com/andrewse02/underage-validate/releases">Releases</a>
    ```html
    <script type="text/javascript" src="path/to/underage-validate.js"></script>
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Now that you have UnderageValidate installed, here's how to use it in your code.

<p align="right">(<a href="#top">back to top</a>)</p>

### The Basics

-   
    ```javascript
    const validator = new UnderageValidate({
        errorMessageClass: "error",
        errorMessageContainerClass: "error-message-container",
        errorFieldClass: "error"
    });
    ```
    The constructor takes in an object of `rules`, full list of options below.
    <br>
    <br>
    `keyName` `(default)`: description
    <br>
    <br>
    `noErrorMessages` `(false)`: If true, will not show error messages
    <br>
    `errorMessageClass` `("error-message")`: CSS class that the error message will be given
    <br>
    `errorMessageContainerClass` `("error-message-container")`: The class of each container that will hold the error message
    <br>
    `staticErrorMessages` `(false)`: If true, error messages will all be placed in one static container
    <br>
    `staticContainerId` `("error-message-container")`: The ID of the static container
    <br>
    `noErrorFields` `(false)`: If true, will not apply a class to invalid inputs
    <br>
    `errorFieldClass` `("error-field")`: CSS class that the invalid input will be given

<p align="right">(<a href="#top">back to top</a>)</p>

### Adding Fields

Now that we have our rules set, let's put our validator to use
<br>
<br>
Assume we have the following page:

-   
    ```html
    <form>
        <div class="error-message-container">
            <input id="required" type="text" value="Required" autocomplete="off">
        </div>

        <button id="submit">Submit</button>
    </form>
    ```
    ```css
    form, .error-message-container, .error-message-static-container {
        display: flex;
        flex-direction: column;
    }

    .error-message {
        color: red;
    }

    .error-field {
        outline: 1px red solid;
    }
    ```
    Now, in our javascript file we can call `addField(id, rules)` to start validating fields in our form
    ```javascript
    const form = document.querySelector("form");

    const validator = new UnderageValidate() // No rules set, assuming the defaults
    .addField("required", { // You can chain wherever makes sense to
        required: true,
        message: "This field is required!"
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        validator.validate();
    });
    ```
    `validate()` returns a `Boolean`, so you may use that value in conjuction with the `noErrorMessages` and `noErrorFields` rules to create custom error messages. Or even perform actions if the form is valid.

<p align="right">(<a href="#top">back to top</a>)</p>

### Field Types

Let's take a look at all the field types in more detail
<br>

-   
    The `rules` object takes any number of keys needed for a field
    <br>
    Unlike the `rules` object for each UnderageValidate instance, you must explicitly specify a field type for it to take effect, so there are no defaults
    <br>
    <br>
    `keyName`: description
    <br>
    <br>
    `required`: Requires the field to not be left blank
    <br>
    `min`: Defines a minimum character count in the field
    <br>
    `max`: Defines a maximum character count in the field
    <br>
    `minValue`: Defines a minimum *number* value in the field
    <br>
    `maxValue`: Defines a maximum *number* value in the field
    <br>
    `email`: Validates a field's email using Regex
    <br>
    `password`: Validates a password containing 1 letter, 1 number, 8 characters
    <br>
    `strongPassword`: Validates a password containing 1 lowercase letter, 1 uppercase letter, 1 number, 8 characters
    <br>
    `securePassword`: Validates a password containing 1 lowercase letter, 1 uppercase letter, 1 number, 1 symbol, 10 characters
    <br>
    `regex`: Validates a field using the defined regular expression
    <br>
    `matching`: Given a field's id, checks if the values match
    <br>
    `message`: Sets the text to display for the error message
    <br>

<p align="right">(<a href="#top">back to top</a>)</p>

### Full Example

Now let's look at a full example to see every way you can configure your instance of UnderageValidate

-   
    ```html
    <div class="error-message-container">
        <input id="required" type="text" value="Required">
    </div>
    <div class="error-message-container">
        <input id="min" type="text" value="Min Chars">
    </div>
    <div class="error-message-container">
        <input id="max" type="text" value="Max Chars">
    </div>
    <div class="error-message-container">
        <input id="min-value" type="text" value="3">
    </div>
    <div class="error-message-container">
        <input id="max-value" type="text" value="10">
    </div>
    <div class="error-message-container">
        <input id="email" type="text" value="email@site.com">
    </div>
    <div class="error-message-container">
        <input id="password" type="password" value="password123">
    </div>
    <div class="error-message-container">
        <input id="strong-password" type="password" value="Password123">
    </div>
    <div class="error-message-container">
        <input id="secure-password" type="password" value="Password123!">
    </div>
    <div class="error-message-container">
        <input id="regex" type="text" value="Regex">
    </div>
    <div class="error-message-container">
        <input id="matching" type="text" value="Password123!">
    </div>

    <button id="submit">Submit</button>
    ```
    ```css
    form, .error-message-container, .error-message-static-container {
        display: flex;
        flex-direction: column;
    }

    .error-message {
        color: red;
    }

    .error-field {
        outline: 1px red solid;
    }
    ```
    ```javascript
    const form = document.querySelector("form");

    const validator = new UnderageValidate({
        noErrorMessages: false,
        errorMessageClass: "error-message",
        errorMessageContainerClass: "error-message-container",
        staticErrorMessages: false,
        staticContainerId: "error-message-static-container",
        noErrorFields: false,
        errorFieldClass: "error-field"
    })
    .addField("required", {
        required: true,
        message: "This field is required!"
    })
    .addField("min", {
        min: 5,
        required: true,
        message: "Minimum of 5 characters!"
    })
    .addField("max", {
        max: 20,
        required: true,
        message: "Maximum of 20 characters!"
    })
    .addField("min-value", {
        minValue: 3,
        required: true,
        message: "Minimum value of 3!"
    })
    .addField("max-value", {
        maxValue: 10,
        required: true,
        message: "Maximum value of 10!"
    })
    .addField("email", {
        email: true,
        required: true,
        message: "Invalid email!"
    })
    .addField("password", {
        password: true,
        required: true,
        message: "Invalid password!"
    })
    .addField("strong-password", {
        strongPassword: true,
        required: true,
        message: "Invalid password!"
    })
    .addField("secure-password", {
        securePassword: true,
        required: true,
        message: "Invalid password!"
    })
    .addField("regex", {
        regex: /[a-zA-Z]/g,
        required: true,
        message: "Must match Regular Expression!"
    })
    .addField("matching", {
        matching: "secure-password",
        required: true,
        message: "Passwords do not match!"
    });

    document.querySelectorAll("input").forEach((input) => {
        input.addEventListener("input", (event) => {
            validator.validateField(event.target.id);
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        validator.validate();
        if(document.getElementById("required").value === "Required") validator.invalidateField("required", "Example!");
    });
    ```

<p align="right">(<a href="#top">back to top</a>)</p>

### All instance methods

Let's look at a list of all methods tou can use on an instance of UnderageValidate

-   
    `method(params) -> Return Type`: Description
    <br>
    <br>
    `addField(id, rules) -> UnderageValidate`: Adds a field to be validated. **Note:** Since UnderageValidate is not form-specific, you can add fields from any input id on a single page
    <br>
    `removeField(id) -> UnderageValidate`: Removes a field from validation
    <br>
    `modifyField(id, rules) -> UnderageValidate`: Modifies the rules for a field, only replacing the rules passed into the object
    <br>
    `replaceField(id, rules) -> UnderageValidate`: Modifies the rules for a field, replacing the rules passed into the object, all others replaced with the defaults
    <br>
    `validate() -> Boolean`: Validates all fields added, adding error messages and field classes if applicable
    <br>
    `validateField(id) -> Boolean`: Validates the given field added, adding an error message and field class if applicable
    <br>
    `invalidateField(id, message) -> UnderageValidate`: Forces an error message onto the given field, useful for recieving errors from a server
    <br>
    `getInvalidFields() -> Array[{id, rules}]`: Returns an array of all invalid field objects after validation
    <br>
    `getValidFields() -> Array[{id, rules}]`: Returns an array of all valid field objects after validation
    <br>

<p align="right">(<a href="#top">back to top</a>)</p>


## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Andrew Elliott - Discord: [@andrewse\_#6874](https://discordapp.com/users/202943202251112448/) - andrewelliottdev@gmail.com

Project Link: [https://github.com/andrewse02/underage-validate](https://github.com/andrewse02/underage-validate)

<p align="right">(<a href="#top">back to top</a>)</p>
