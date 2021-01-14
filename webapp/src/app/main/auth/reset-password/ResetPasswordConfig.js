import { authRoles } from 'app/auth';
import ResetPassword from './ResetPassword';

const LoginConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: '/auth/reset-password',
			component: ResetPassword
		}
	]
};

export default LoginConfig;
