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