function createCodeEnum(prefix) {
  return {
    account: {
      exist: prefix + 'account.exist',
      notExist: prefix + 'account.not_exist',
      activated: prefix + 'account.activated',
      blocked: prefix + 'account.blocked',
      notActivated: prefix + 'account.not_activated',
    },
    invalidLogin: prefix + 'invalid_login',
    registerSuccess: prefix + 'register_success',
    codeNotMatch: prefix + 'code_not_match',
    oldPassNotMatch: prefix + 'old_pass_not_match',
    unauthorization: prefix + 'unauthorization',
    tokenExpired: prefix + 'token_expired',
    accessDenined: prefix + 'access_denined',
    checkEmailGetCode: prefix + 'check_email_get_code',
  }
}

const AuthCodeEnum = createCodeEnum('auth.')

export default AuthCodeEnum
