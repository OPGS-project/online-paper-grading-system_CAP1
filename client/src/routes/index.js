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
import GradedAssignment from '~/pages/GradedAssignment';
import EditGradedAssignment from '~/pages/EditGradedAssignment';
import Student from '~/pages/QLHOCSINH/Student';
import CreateStudent from '~/pages/QLHOCSINH/CreateStudent';
import UpdateStudent from '~/pages/QLHOCSINH/UpdateStudent';
import Class from '~/pages/QLLOPHOC/Class';
import CreateClass from '~/pages/QLLOPHOC/CreateClass';
import UpdateClass from '~/pages/QLLOPHOC/UpdateClass';
import ChooseRole from '~/pages/ChooseRole';
import Statis from '~/pages/THONGKE/Statis';
import Submitted from '~/pages/QLBTAP/Submitted';
import StudentScores from '~/pages/QLHOCSINH/StudentScores';

//học sinh page
import ChooseRoleLogin from '~/pagesStudent/ChooseRoleLogin';
import LoginStudent from '~/pagesStudent/LoginStudent';
import AssignmentStudent from '~/pagesStudent/AssignmentStudent';
import ReturnAssignment from '~/pagesStudent/ReturnAssignment';
import ProfileStudent from '~/pagesStudent/ProfileStudent';
import UpdatePassStudent from '~/pagesStudent/UpdatePassStudent';
import UploadAssignment from '~/pagesStudent/UploadAssignment';

//Public routes
const publicRoutes = [
    { path: '/', component: Introduction, layout: null },
    { path: '/choose-role-register', component: ChooseRole, layout: null },
    //
    { path: '/login-teacher', component: Login, layout: null },
    { path: '/login-success/:userId/:refresh_token', component: LoginSuccess, layout: null },
    { path: '/register-teacher', component: Register, layout: null },
    { path: '/forgot-password', component: ForgotPassword, layout: null },
    { path: '/home', component: Home },
    { path: '/home/statis', component: Statis },
    // QLBAITAP
    { path: '/home/assignment', component: Assignment },
    { path: '/home/assignment/submitted/:assignmentId', component: Submitted },
    { path: '/home/assignment/add-assignment', component: AddAssignment },
    { path: '/home/assignment/edit-assignment/:assignmentId', component: EditAssignment },

    //QLHSINH
    { path: '/home/class/get-student/:classID', component: Student },
    { path: '/home/student/createStudent/:classID', component: CreateStudent },
    { path: '/home/student/updateStudent/:classID/:studentID', component: UpdateStudent },
    { path: '/home/student/student-scores/:sid', component: StudentScores },

    //QLLOPHOC
    { path: '/home/class', component: Class },

    { path: '/home/class/createClass/', component: CreateClass },
    { path: '/home/class/update-class/:classID', component: UpdateClass },

    //USER
    { path: '/home/user-profile', component: Profile },
    { path: '/home/update-password', component: UpdatePass },
    //Chấm bài
    { path: '/home/grading/:assignment_id/:student_id', component: Grading },
    //Bài đã chấm
    { path: '/home/GradedAssignment/:id/:student_name', component: GradedAssignment },
    //Sửa bài đã chấm
    { path: '/home/EditGradedAssignment/:id/:student_name', component: EditGradedAssignment },

];

const privateRoutes = [
    //OF Student
    { path: '/choose-role-login', component: ChooseRoleLogin, layout: null },
    { path: '/login-student', component: LoginStudent, layout: null },
    { path: '/student/assignment-of-student', component: AssignmentStudent },
    { path: '/student/return-assignment', component: ReturnAssignment },

    { path: '/student/upload-assignment/:aid/:classId', component: UploadAssignment },
    { path: '/student/student-profile', component: ProfileStudent },
    { path: '/student/update-password', component: UpdatePassStudent },
];

export { publicRoutes, privateRoutes };
