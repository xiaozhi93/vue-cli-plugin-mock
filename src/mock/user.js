module.exports = [
  {
    url: '/mock/fjnpac-mediate/login',
    type: 'post',
    response: config => {
      const { loginName } = config.body
      const token = tokens[loginName]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 200,
        data: token
      }
    }
  },
  {
    url: '/mock/fjnpac-mediate/getUserInfo\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 200,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/fjnpac-mediate/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]