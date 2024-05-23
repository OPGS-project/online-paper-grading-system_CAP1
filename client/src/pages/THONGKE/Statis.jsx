import { useEffect, useRef, useState } from 'react';
import BarChart from './BarChar';
import '~~/pages/Statis.scss';
import { useParams } from 'react-router-dom';
import DoughnutChart from './DoughnutChart';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

function Statis() {
    const params = useParams();
    const printRef = useRef();

    const [userData, setUserData] = useState({
        labels: ['1-4 điểm', '5-7 điểm', '8-10 điểm'],
        datasets: [
            {
                label: params.class_name,
                data: [0, 0, 0], // Khởi tạo 
                backgroundColor: ['#5FBF5D', '#FFCF96', '#F6FDC3'],
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

    const categorizeScores = (data) => {
        const scoreCounts = [0, 0, 0];

        data.forEach((item) => {
            const score = item.score_value;
            if (score >= 1 && score <= 4) scoreCounts[0]++;
            else if (score > 4 && score <= 7) scoreCounts[1]++;
            else if (score > 7 && score <= 10) scoreCounts[2]++;
        });

        return scoreCounts;
    };

    const categorizeMediumScores = (data) => {
        let aboveAverage = 0;
        let belowAverage = 0;
        const averageScore = 5; // Điểm trung bình phải >= 5

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
                    const allGrades = [...grade, ...gradeShort]; // Gộp 2 bảng grade && grade short

                    const categorizedData = categorizeScores(allGrades);
                    const categorizedMediumData = categorizeMediumScores(allGrades);

                    setUserData((prevData) => ({
                        ...prevData,
                        datasets: [{
                            ...prevData.datasets[0],
                            data: categorizedData,
                        }],
                    }));

                    setMediumScore((prevData) => ({
                        ...prevData,
                        datasets: [{
                            ...prevData.datasets[0],
                            data: categorizedMediumData,
                        }],
                    }));
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataStatis();
    }, [params.classId]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    return (
        <div className="container">
            <div className="" ref={printRef}>
                <h1 className="m-3 font-weight-bold text-primary ">Thống kê</h1>
                <div className="row justify-content-between ">
                    <div className="col-md-8 ml-5">
                        <BarChart chartData={userData} />
                        <br />
                        <span style={{ marginLeft: 180 }}><i>* Lưu ý: biểu đồ trên thống kê bài tập của {params.class_name}</i></span>
                    </div>
                    <div className="col-md-3 d-flex flex-column text-center">
                        <div style={{ width: 200 }} className="ml-5">
                            <DoughnutChart chartData={mediumScore} />
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
            </div>
            <button onClick={handlePrint} className="btn btn-primary mt-3 ml-3">Export to PDF</button>
        </div>
    );
}

export default Statis;