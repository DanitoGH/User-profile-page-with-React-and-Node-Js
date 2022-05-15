const { gql } = require('apollo-server-express')

const users = gql`

   type User {
        id:    ID!
        name:  String
        bio:   String
        email: String!
        phone: String
        photo: String
        password: String
        accessToken: String
        lastLogin: String
    }
    
   input UpdateInput {
      name:  String!
      bio:   String!
      email: String!
      password: String
      phone: String
      photo: String
   }

   input AuthInput {
      email: String!
      password: String!
   }

   type Query {
      getUser(id: ID!): User!
      refreshToken: User!
   }

   type Mutation {
       userLogin(input: AuthInput): User!
       registerUser(input: AuthInput): User!
       updateUser(id:ID, input: UpdateInput): User!
       userLogout: String
   }
`;

module.exports = users