class UnderageValidate {
    #fields = [];
    #invalidFields = new Set();
    #validFields = new Set();

    #matches = new Set();

    #rules = {};

    #defaultRules = {
        noErrorMessages: false,
        errorMessageClass: "error-message",
        errorMessageContainerClass: "error-message-container",
        staticErrorMessages: false,
        staticContainerId: "error-message-static-container",
        noErrorFields: false,
        errorFieldClass: "error-field"
    };

    #regex = {
        email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        password: /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/, // 8, a, num
        strongPassword: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, // 8, a, A, num
        securePassword: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()\-[{}:;'`,?/\\*~$^+=<>\]]).{10,}$/ // 8, a, A, num, symbol
    };

    constructor(rules) {
        this.#rules = {
            ...this.#defaultRules
        };

        if (rules) {
            this.#setRules(rules);
        }

        return this;
    }

    #setRules(rules) {
        if (typeof rules !== "object" || Array.isArray(rules) || rules == null)
            throw new TypeError("Invalid rules object!");
        this.#rules = {
            ...this.#rules,
            ...rules
        };

        return this;
    }

    addField(id, rules) {
        if (typeof id !== "string" || id === "") throw new TypeError("Invalid field ID!");
        if (typeof rules !== "object" || Array.isArray(rules) || rules == null)
            throw new TypeError("Invalid rules object!");

        const newField = {
            id,
            rules
        };

        this.#fields.push(newField);
        if(rules.matching) this.#matches.add({ primary: document.getElementById(rules.matching), secondary: document.getElementById(id) });
        return this;
    }

    removeField(id) {
        if (typeof id !== "string" || id === "") throw new TypeError("Invalid field ID!");

        const found = this.#fields.find((field) => field.id === id);
        if (!found || found == null) throw new ReferenceError("Field was not found!");

        this.#fields.splice(this.#fields.indexOf(found), 1);
        return this;
    }

    modifyField(id, rules) {
        if (typeof id !== "string" || id === "") throw new TypeError("Invalid field ID!");
        if (typeof rules !== "object" || Array.isArray(rules) || rules == null)
            throw new TypeError("Invalid rules object!");

        const found = this.#fields.find((field) => field.id === id);
        if (!found || found == null) throw new ReferenceError("Field was not found!");

        const newField = {
            id,
            rules: {
                ...this.#fields[this.#fields.indexOf(found)].rules,
                ...rules
            }
        };

        this.#fields[this.#fields.indexOf(found)] = newField;
        return this;
    }

    replaceField(id, rules) {
        if (typeof id !== "string" || id === "") throw new TypeError("Invalid field ID!");
        if (typeof rules !== "object" || Array.isArray(rules) || rules == null)
            throw new TypeError("Invalid rules object!");

        const found = this.#fields.find((field) => field.id === id);
        if (!found || found == null) throw new ReferenceError("Field was not found!");

        const newField = {
            id,
            rules: {
                ...this.#defaultRules,
                ...rules
            }
        };

        this.#fields[this.#fields.indexOf(found)] = newField;
        return this;
    }

    validate() {
        let valid = true;

        this.#clearMessages();
        this.#fields.forEach((field) => {
            if (!this.#validateField(field.id)) {
                document.getElementById(field.id).focus();
                valid = false;
                return;
            }
        });

        return valid;
    }

    validateField(id) {
        this.#clearMessage(id);
        this.#validateMatches(id);
        return this.#validateField(id);
    }

    invalidateField(id, message) {
        const field = document.getElementById(id);
        if (!field) throw new ReferenceError(`Could not find ID of "${id}" in document!`);

        const fieldObj = this.#fields.find((item) => item.id === id);
        if (!fieldObj) throw new ReferenceError("Field was not added to validator!");

        this.#validFields.delete(field);
        this.#invalidFields.add(field);
        this.#sendErrorMessage(false, field, message);
        
        return this;
    }

    #validateField(id) {
        const field = document.getElementById(id);
        if (!field) throw new ReferenceError(`Could not find ID of "${id}" in document!`);

        const fieldObj = this.#fields.find((item) => item.id === id);
        if (!fieldObj) throw new ReferenceError("Field was not added to validator!");

        const rules = fieldObj.rules;
        if (!rules || rules == null) throw new ReferenceError("No rules added to field!");

        const value = field.value;

        if (!rules.message || rules.message == null || rules.message === "" || typeof rules.message !== "string")
            throw new TypeError("Invalid message!", rules.message);
        const message = rules.message;

        if (rules.required) {
            if (!value || value == null || value === "") {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.min) {
            if (typeof rules.min !== "number" && !Number(rules.min)) throw new TypeError("Invalid 'min' number!");
            if (value.length < +rules.min) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.max) {
            if (typeof rules.max !== "number" && !Number(rules.max)) throw new TypeError("Invalid 'max' number!");
            if (value.length > +rules.max) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.minValue) {
            if (typeof rules.minValue !== "number" && !Number(rules.minValue))
                throw new TypeError("Invalid 'minValue' number!");
            if (!Number(value) || +value < +rules.minValue) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.maxValue) {
            if (typeof rules.maxValue !== "number" && !Number(rules.maxValue))
                throw new TypeError("Invalid 'maxValue' number!");
            if (!Number(value) || +value > +rules.maxValue) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.email) {
            if (!this.#regex.email.test(value)) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.password) {
            if (!this.#regex.password.test(value)) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.strongPassword) {
            if (!this.#regex.strongPassword.test(value)) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.securePassword) {
            if (!this.#regex.securePassword.test(value)) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.regex) {
            if (rules.regex.constructor.name !== "RegExp") throw new TypeError("Invalid regular expression!");
            if (!rules.regex.test(value)) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }
        if (rules.matching) {
            if (!rules.matching || rules.matching == null || rules.matching === "")
                throw new TypeError("Invalid matching ID!");

            const matching = document.getElementById(rules.matching);
            if (!matching || matching == null)
                throw new ReferenceError(`Could not find ID of "${rules.matching}" in document!`);

            if (matching.value !== value) {
                this.#sendErrorMessage(false, field, message);
                this.#validFields.delete(field);
                this.#invalidFields.add(field);
                return false;
            }
            this.#invalidFields.delete(field);
            this.#validFields.add(field);
        }

        return true;
    }

    #validateMatches(id) {
        const found = [...this.#matches].find(element => element.primary.id === id);
        if(!found) return;
        
        this.#clearMessage(id);
        this.#clearMessage(found.secondary.id);
        this.#validateField(found.secondary.id);
    }

    getInvalidFields() {
        return Array.from(this.#invalidFields);
    }

    getValidFields() {
        return Array.from(this.#validFields);
    }

    #sendErrorMessage(valid, field, message) {
        const {
            noErrorMessages,
            errorMessageClass,
            errorMessageContainerClass,
            staticErrorMessages,
            staticContainerId,
            noErrorFields,
            errorFieldClass
        } = this.#rules;

        if (!valid) {
            if (noErrorMessages === false || noErrorMessages == null) {
                const newMessage = document.createElement("p");
                newMessage.className = errorMessageClass;
                newMessage.dataset.field = field.id;
                newMessage.textContent = message;

                if (staticErrorMessages === true) {
                    const container = document.getElementById(staticContainerId);
                    if (!container || container == null)
                        throw new ReferenceError(`Could not find ID of "${staticContainerId}" in document!`);

                    container.appendChild(newMessage);
                } else {
                    const containers = document.querySelectorAll(`.${errorMessageContainerClass}`);
                    if (!containers || containers == null || containers.length === 0)
                        throw new ReferenceError(
                            `Could not find class of "${errorMessageContainerClass}" in document!`
                        );

                    for (let i = 0; i < containers.length; i++) {
                        if (this.#containsField(containers[i], field)) {
                            containers[i].insertBefore(newMessage, field.nextSibling);
                            break;
                        }
                    }
                }
            }

            if (noErrorFields === false || noErrorFields == null) {
                field.classList.add(errorFieldClass);
            }
        }
    }

    #clearMessage(id) {
        const field = document.getElementById(id);
        const parent = field.parentNode;

        if (field.classList.contains(this.#rules.errorFieldClass)) {
            field.classList.remove(this.#rules.errorFieldClass);
        }

        if (this.#rules.staticErrorMessages === false) {
            if (parent.hasChildNodes()) {
                for (let i = 0; i < parent.children.length; i++) {
                    if (
                        parent.children[i].classList.contains(this.#rules.errorMessageClass) &&
                        parent.children[i].tagName.toLowerCase() === "p"
                    ) {
                        parent.removeChild(parent.children[i]);
                    }
                }
            }
        } else {
            const container = document.getElementById(this.#rules.staticContainerId);
            if (container && container != null) {
                for (let i = 0; i < container.children.length; i++) {
                    if (
                        container.children[i].classList.contains(this.#rules.errorMessageClass) &&
                        container.children[i].tagName.toLowerCase() === "p" &&
                        container.children[i].dataset.field === field.id
                    ) {
                        container.removeChild(container.children[i]);
                    }
                }
            }
        }
    }

    #clearMessages() {
        for (let i = 0; i < this.#fields.length; i++) {
            const field = document.getElementById(this.#fields[i].id);
            const parent = field.parentNode;

            if (field.classList.contains(this.#rules.errorFieldClass)) {
                field.classList.remove(this.#rules.errorFieldClass);
            }

            if (this.#rules.staticErrorMessages === false) {
                if (parent.hasChildNodes()) {
                    for (let i = 0; i < parent.children.length; i++) {
                        if (
                            parent.children[i].classList.contains(this.#rules.errorMessageClass) &&
                            parent.children[i].tagName.toLowerCase() === "p"
                        ) {
                            parent.removeChild(parent.children[i]);
                        }
                    }
                }
            } else {
                const container = document.getElementById(this.#rules.staticContainerId);
                if (container && container != null) {
                    for (let i = 0; i < container.children.length; i++) {
                        if (
                            container.children[i].classList.contains(this.#rules.errorMessageClass) &&
                            container.children[i].tagName.toLowerCase() === "p" &&
                            container.children[i].dataset.field === field.id
                        ) {
                            container.removeChild(container.children[i]);
                        }
                    }
                }
            }
        }
    }

    #containsField(container, field) {
        for (let i = 0; i < container.children.length; i++) {
            if (container.children[i].id === field.id) return true;
        }

        return false;
    }
}