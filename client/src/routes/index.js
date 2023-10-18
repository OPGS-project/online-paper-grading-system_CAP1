import Introduction from '~/pages/Introduction';
import Home from '../pages/Home';
import Login from '../layout/Login';
import LoginSuccess from '../layout/LoginSuccess';
import Register from '../layout/Register';
import ForgotPassword from '~/layout/ForgotPassword';
import AddAssignment from '~/pages/QLBTAP/AddAssignment';
import Assignment from '~/pages/QLBTAP/Assignment';
import EditAssignment from '~/pages/QLBTAP/EditAssignment';
import Profile from '~/pages/USER/Profile';
import UpdatePass from '~/pages/USER/UpdatePass';
import Marking from '~/pages/Marking';
import Student from '~/pages/QLHOCSINH/Student';
import CreateStudent from '~/pages/QLHOCSINH/CreateStudent';
import UpdateStudent from '~/pages/QLHOCSINH/UpdateStudent';
import Class from '~/pages/QLLOPHOC/Class';
import CreateClass from '~/pages/QLLOPHOC/CreateClass';
import UpdateClass from '~/pages/QLLOPHOC/UpdateClass';

//Public routes
const publicRoutes = [
    { path: '/', component: Introduction, layout: null },
    //
    { path: '/login', component: Login, layout: null },
    { path: '/login-success/:userId/:refresh_token', component: LoginSuccess, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
    { path: '/home', component: Home },
    // QLBAITAP
    { path: '/add-assignment', component: AddAssignment },
    { path: '/edit-assignment', component: EditAssignment },
    { path: '/assignment', component: Assignment },
    //QLHSINH
    { path: '/student', component: Student },
    { path: '/createStudent', component: CreateStudent },
    { path: '/student/updateStudent', component: UpdateStudent },
    // { path: '/student/updateStudent/:id', component: UpdateStudent },
    //QLLOPHOC
    { path: '/class', component: Class },
    { path: '/createClass', component: CreateClass },
    { path: '/class/updateClass', component: UpdateClass },

    //USER
    { path: '/user-profile', component: Profile },
    { path: '/update-password', component: UpdatePass },
    //Chấm bài
    { path: '/marking', component: Marking },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
