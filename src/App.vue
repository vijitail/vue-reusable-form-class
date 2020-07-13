<template>
  <div id="app">
    <form class="login-form" @submit.prevent="loginUser" @keydown="form.setStatus('error', '')">
      <h2>Login</h2>
      <toast :type="toast.type" :isVisible="!!toast.message">{{toast.message}}</toast>

      <form-input
        label="Email"
        v-model="form.values.email"
        type="email"
        @validate="form.validateField('email')"
        name="email"
        :error="form.errors.email"
      ></form-input>
      <form-input
        label="Password"
        v-model="form.values.password"
        type="password"
        @validate="form.validateField('password')"
        name="password"
        :error="form.errors.password"
      ></form-input>
      <button class="btn btn-primary btn-block" :disabled="form.isSubmitting">
        <template v-if="!form.isSubmitting">Login</template>
        <template v-else>Logging In...</template>
      </button>
    </form>
  </div>
</template>

<script>
import { object, string } from "yup";

import FormInput from "./components/FormInput";
import Toast from "./components/Toast";

import { Form } from "./utils";

const loginFormSchema = object().shape({
  email: string()
    .email()
    .required(),
  password: string().required()
});

export default {
  name: "app",
  components: {
    "form-input": FormInput,
    toast: Toast
  },
  data() {
    return {
      form: new Form(
        {
          email: "",
          password: ""
        },
        loginFormSchema
      )
    };
  },
  computed: {
    toast() {
      return {
        type:
          (this.form.status.success && "success") ||
          (this.form.status.error && "error"),
        message: this.form.status.success || this.form.status.error
      };
    }
  },
  methods: {
    loginUser() {
      const URL = "https://61m46.sse.codesandbox.io/login";

      this.form
        .submit("post", URL)
        .then(data => {
          console.log(data.user.token); // store the login token

          this.form.setStatus("success", "User logged in successfully!");

          // redirect the user
        })
        .catch(err => {
          if (err.response)
            this.form.setStatus("error", err.response.data.error);
        });
    }
  }
};
</script>

<style lang="scss">
#app {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 16px;

  .login-form {
    max-width: 400px;
    width: 100%;
  }
}
</style>
