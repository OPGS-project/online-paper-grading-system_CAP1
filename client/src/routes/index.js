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
import Grading from '~/pages/Grading';
import Student from '~/pages/QLHOCSINH/Student';
import CreateStudent from '~/pages/QLHOCSINH/CreateStudent';
import UpdateStudent from '~/pages/QLHOCSINH/UpdateStudent';
import Class from '~/pages/QLLOPHOC/Class';
import CreateClass from '~/pages/QLLOPHOC/CreateClass';
import UpdateClass from '~/pages/QLLOPHOC/UpdateClass';
import ChooseRole from '~/pages/ChooseRole';
import Statis from '~/pages/THONGKE/Statis';
import Submitted from '~/pages/QLBTAP/Submitted';
import Criteria from '~/pages/QLBTAP/Criteria';

//Public routes
const publicRoutes = [
    { path: '/', component: Introduction, layout: null },
    { path: '/choose-role', component: ChooseRole, layout: null },

    //
    { path: '/login', component: Login, layout: null },
    { path: '/login-success/:userId/:refresh_token', component: LoginSuccess, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
    { path: '/home', component: Home },
    { path: '/statis', component: Statis },
    // QLBAITAP
    { path: '/assignment', component: Assignment },
    { path: '/criteria', component: Criteria },
    { path: '/submitted', component: Submitted },
    { path: '/assignment/add-assignment', component: AddAssignment },
    { path: '/assignment/edit-assignment/:assignmentId', component: EditAssignment },
    //QLHSINH
    { path: '/class/:classID', component: Student },
    { path: '/student/createStudent', component: CreateStudent },
    { path: '/student/updateStudent/:studentId', component: UpdateStudent },
    // { path: '/student/updateStudent/:id', component: UpdateStudent },
    //QLLOPHOC
    { path: '/class', component: Class },

    { path: '/class/createClass', component: CreateClass },
    { path: '/class/update-class/:classID', component: UpdateClass },

    //USER
    { path: '/user-profile', component: Profile },
    { path: '/update-password', component: UpdatePass },
    //Chấm bài
    { path: '/grading', component: Grading },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
