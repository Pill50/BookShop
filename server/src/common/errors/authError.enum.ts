export enum AuthError {
  USER_NOT_ACTIVATED = 'Your account is not active, please confirm your email',
  USER_INVALID_CREDENTIALS = 'Invalid credentials',
  USER_ALREADY_ACTIVATED = 'Email already confirmed',
  USER_EMAIL_NOT_FOUND = 'User with this email does not exist',
  USER_PASSWORDS_NOT_MATCH = 'Password do not match confirm password',
  USER_NOT_FOUND = 'User not found',
  USER_OAUTH_CHANGE_PASSWORD = 'You are using OAuth, please change password in your OAuth account',
  USER_OAUTH_LOGIN = 'You are using OAuth, please login with your OAuth account',
  USER_OLD_PASSWORD_INVALID = 'Old password is not valid',
  USER_BLOCKED = 'Your account is blocked, please reset your password or contact for support',
  USER_ALREADY_ACTIVATED_LOGIN = 'User with this email already exists, please login',
  USER_LOGIN_INACTIVE_ACCOUNT = 'Your account is not active, please confirm your email',
}
