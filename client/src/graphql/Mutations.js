
const LOGIN_USER_MUTATION = `
    mutation userLogin($input: AuthInput!){
        userLogin(input: $input) {
            id
            accessToken
            lastLogin
        }
    }
`;

const REGISTER_USER_MUTATION = `
    mutation registerUser($input: AuthInput!){
        registerUser(input: $input) {
            id
            accessToken
            lastLogin
        }
    }
`;

const UPDATE_USER_MUTATION = `
    mutation updateUser($id: ID!, $input: UpdateInput!){
        updateUser(id: $id, input: $input) {
            name
            lastLogin
        }
    }
`;

const USER_LOGOUT_MUTATION = `
    mutation userLogout{
        userLogout
    }
`;

export {
    LOGIN_USER_MUTATION,
    UPDATE_USER_MUTATION,
    REGISTER_USER_MUTATION,
    USER_LOGOUT_MUTATION
  }