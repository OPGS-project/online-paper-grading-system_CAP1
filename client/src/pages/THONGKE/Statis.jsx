import { useState } from 'react';
import BarChart from './BarChar';
import '~~/pages/Statis.scss';
import { UserData } from './Data';
import { MediumScore } from './Data';
import DoughnutChart from './DoughnutChart';

function Statis() {
    const [userData, setUserData] = useState({
        labels: UserData.map((data) => data.score),
        datasets: [
            {
                label: 'Lớp A',
                data: UserData.map((data) => data.quantity),
                backgroundColor: ['#FF8080', '#FFCF96', '#F6FDC3', '#96C291'],
                borderColor: 'transparent',
                borderWidth: 1,
            },
        ],
    });

    const [mediumScore, SetMediumScore] = useState({
        datasets: [
            {
                label: 'Số lượng',
                data: MediumScore.map((data) => data.quantity),
                hoverOffset: 2,
            },
        ],
    });

    return (
        <div className="container">
            <h1 className="m-3 font-weight-bold text-primary ">Thống kê</h1>
            <div className="row justify-content-between ">
                <div className="col-md-8 ml-5">
                    <BarChart chartData={userData} />
                </div>
                <div className="col-md-3 d-flex flex-column text-center">
                    <div style={{ width: 200 }} className="ml-5">
                        <DoughnutChart chartData={mediumScore} />
                    </div>
                    <div className="note">
                        <p className="headingNote mt-3 text-center">Chú giải</p>
                        <div className="noteItem">
                            <div className="noteColorAbove"></div>
                            <p>Số lượng học sinh trên điểm trung bình</p>
                        </div>
                        <div className="noteItem">
                            <div className="noteColorBellow"></div>
                            <p>Số lượng học sinh dưới điểm trung bình</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statis;
