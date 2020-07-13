import axios from "axios";

export class Form {
  constructor(initialValues, validationSchema) {
    this.values = initialValues;
    this.validationSchema = validationSchema;
    this.errors = {};
    this.isSubmitting = false;
    this.status = {};
  }

  validateField(field) {
    this.validationSchema
      .validateAt(field, this.values)
      .then(() => (this.errors[field] = ""))
      .catch((err) => {
        this.errors = { ...this.errors, [err.path]: err.message };
      });
  }

  validate() {
    this.validationSchema
      .validate(this.values, { abortEarly: false })
      .catch((err) => {
        err.inner.forEach((error) => {
          this.errors = { ...this.errors, [error.path]: error.message };
        });
      });
    const isValid = Object.keys(this.errors).length > 0;
    return isValid;
  }

  setStatus(statusField, status) {
    this.status = { ...this.status, [statusField]: status };
  }

  setError(errorField, error) {
    this.errors = { ...this.errors, [errorField]: error };
  }

  reset() {
    this.values = {};
    this.errors = {};
  }

  submit(method, url) {
    return new Promise((resolve, reject) => {
      this.isSubmitting = true;
      const isValid = this.validate(); // do client side validation
      if (!isValid) {
        this.isSubmitting = false;
        reject({
          response: {
            data: {
              error: "All fields are required",
            },
          },
        });
      } else
        axios({ url, method, data: this.values })
          .then(({ data }) => {
            this.isSubmitting = false;
            resolve(data);
          })
          .catch((err) => {
            this.isSubmitting = false;
            this.reset();
            reject(err);
          });
    });
  }
}
