
const REFRESH_AUTH_TOKEN_QUERY = `
query refreshToken {
  refreshToken{
    id
    accessToken
    lastLogin
  }
}  
`;

const GET_USER = `
query getUser($id: ID!){
  getUser(id: $id) {
      id
      name
      bio
      email
      phone
      photo
      lastLogin
  }
}  
`;

export {
    REFRESH_AUTH_TOKEN_QUERY,
    GET_USER,
  }

