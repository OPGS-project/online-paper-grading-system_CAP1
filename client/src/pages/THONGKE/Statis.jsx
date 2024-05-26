import { useEffect, useRef, useState } from 'react';
import BarChart from './BarChar';
import '~~/pages/Statis.scss';
import { Link, useParams } from 'react-router-dom';
import DoughnutChart from './DoughnutChart';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment/moment';

function Statis() {
    const params = useParams();
    const printRef = useRef();

    const [className, setClassName] = useState('');
    const [noData, setNoData] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [userData, setUserData] = useState({
        labels: ['0-4 điểm', '5-7 điểm', '8-10 điểm'],
        datasets: [
            {
                label: '',
                data: [0, 0, 0],
                backgroundColor: ['#f82732', '#fa8d33', '#31e44f'],
                borderColor: 'transparent',
                borderWidth: 1,
            },
        ],
    });

    const [mediumScore, setMediumScore] = useState({
        datasets: [
            {
                label: 'Số lượng',
                data: [0, 0],
                hoverOffset: 2,
                backgroundColor: ['#049bfc', '#ff4069'],
            },
        ],
    });

    const [detailedData, setDetailedData] = useState([]);

    const categorizeScores = (data) => {
        const scoreCounts = [0, 0, 0];

        data.forEach((item) => {
            const score = item.score_value;
            if (score >= 0 && score <= 4) scoreCounts[0]++;
            else if (score > 4 && score <= 7) scoreCounts[1]++;
            else if (score > 7 && score <= 10) scoreCounts[2]++;
        });

        return scoreCounts;
    };

    const categorizeMediumScores = (data) => {
        let aboveAverage = 0;
        let belowAverage = 0;
        const averageScore = 5;

        data.forEach((item) => {
            const score = item.score_value;
            if (score >= averageScore) aboveAverage++;
            else belowAverage++;
        });

        return [aboveAverage, belowAverage];
    };

    useEffect(() => {
        const fetchDataStatis = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/statis/${params.classId}`);
                console.log(response);
                if (response.data.err === 0) {
                    const { grade, gradeShort } = response.data.response;

                    if (grade.length === 0 && gradeShort.length === 0) {
                        setNoData(true);
                        return;
                    }

                    const allGrades = [...grade, ...gradeShort];

                    const categorizedData = categorizeScores(allGrades);
                    const categorizedMediumData = categorizeMediumScores(allGrades);

                    const className = allGrades.map(item => item.submissionData.assignmentData.classData.class_name);

                    setUserData((prevData) => ({
                        ...prevData,
                        datasets: [{
                            ...prevData.datasets[0],
                            data: categorizedData,
                            label: className[0],
                        }],
                    }));

                    setMediumScore((prevData) => ({
                        ...prevData,
                        datasets: [{
                            ...prevData.datasets[0],
                            data: categorizedMediumData,
                        }],
                    }));

                    setDetailedData(allGrades);
                    setClassName(className[0]);
                    setNoData(false);
                } else {
                    console.error(response.data.message);
                    setNoData(true);
                }
            } catch (error) {
                console.error(error);
                setNoData(true);
            }
        };

        fetchDataStatis();
    }, [params.classId]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const handleBarClick = (index) => {
        const barLabel = userData.labels[index];
        const details = detailedData.filter(item => {
            const score = item.score_value;
            if (barLabel === '0-4 điểm') return score >= 0 && score <= 4;
            if (barLabel === '5-7 điểm') return score > 4 && score <= 7;
            if (barLabel === '8-10 điểm') return score > 7 && score <= 10;
            return false;
        });

        setSelectedDetail(details);
    };

    const handleDoughnutClick = (index) => {
        const details = detailedData.filter(item => {
            const score = item.score_value;
            if (index === 0) return score >= 5; // Above average
            if (index === 1) return score < 5;  // Below average
            return false;
        });

        setSelectedDetail(details);
    };

    const closeDialog = () => {
        setSelectedDetail(null);
    };

    return (
        <div className="container">
            <div className="" ref={printRef}>
                <h1 className="m-3 font-weight-bold text-primary">Thống kê</h1>
                {noData ? (
                    <div className='d-flex align-items-center justify-content-center' style={{ height: '60vh' }}>
                        <h5 className='text-center' style={{ color: 'red' }}>Không có dữ liệu để thống kê.</h5>
                    </div>
                ) : (
                    <div className="row justify-content-between">
                        <div className="col-md-8 ml-5">
                            <BarChart chartData={userData} onBarClick={handleBarClick} />
                            <br />
                            <span style={{ marginLeft: 180 }}>
                                <i>* Lưu ý: biểu đồ trên thống kê bài tập của {className}</i>
                            </span>
                        </div>
                        <div className="col-md-3 d-flex flex-column text-center">
                            <div style={{ width: 200 }} className="ml-5">
                                <DoughnutChart chartData={mediumScore} onDoughnutClick={handleDoughnutClick} />
                            </div>
                            <div className="note">
                                <p className="headingNote mt-3 text-center">Chú giải</p>
                                <div className="noteItem">
                                    <div className="noteColorAbove"></div>
                                    <p>Số lượng bài tập trên điểm trung bình</p>
                                </div>
                                <div className="noteItem">
                                    <div className="noteColorBellow"></div>
                                    <p>Số lượng bài tập dưới điểm trung bình</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {noData ? ("") : (<button onClick={handlePrint} className="btn btn-primary mt-3 ml-3">Export to PDF</button>)}
            {selectedDetail && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thông tin chi tiết</h5>
                                <button type="button" className="close" onClick={closeDialog}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body modal-scrollable">
                                {selectedDetail.map((detail, index) => (
                                    <div key={index}>
                                        <p>
                                            <span>Bài tập: </span>
                                            <Link
                                                onClick={(e) => e.stopPropagation()}
                                                to={'/home/assignment'}
                                            >
                                                {detail.submissionData.assignmentData.assignment_name}
                                            </Link>
                                        </p>
                                        <p>
                                            <span>Loại bài tập: </span>
                                            {detail.submissionData.assignmentData.type_assignment === '0' ? (
                                                <span style={{ fontWeight: 400 }}>Tự luận</span>
                                            ) : (
                                                <span style={{ fontWeight: 400 }}>Câu trả lời ngắn</span>
                                            )}
                                        </p>
                                        <p>
                                            <span>Điểm số: </span>
                                            <span style={{ color: '#ff4069' }}>{detail.score_value}</span>
                                        </p>
                                        <p>
                                            <span>Thời gian chấm: </span>
                                            <span style={{ fontWeight: 400 }}>{moment(detail.createdAt).format('DD-MM-YYYY HH:mm')}</span>
                                        </p>
                                        <p><span>Học sinh làm bài: </span> {detail.studentData.student_name}</p>
                                        <div className="line-info"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Statis;