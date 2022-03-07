import React, { FC, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import Button from 'react-bootstrap/Button';
import { ReportData, ReviewData } from "src/types/types";
import SubReport from './SubReport';
import './ReportGroup.scss';

interface ReportGroupProps {
    reviewID: string;
    reports: ReportData[],
    onAccept: () => void,
    onDeny: () => void,
}

const ReportGroup: FC<ReportGroupProps> = (props) => {
    const [review, setReview] = useState<ReviewData>(null!);

    const getReviewData = async (reviewID: string) => {
        const res: AxiosResponse<ReviewData[]> = await axios.get(`/reviews?reviewID=${reviewID}`);
        const review: ReviewData = res.data[0];
        console.log(review);
        setReview(review);
    }

    useEffect(() => {
        getReviewData(props.reviewID!);
    }, []);

    if (!review) {
        return <></>
    } else {
        return (
            <div className="report-group">
                <div className="report-group-identifier">
                    <div className="subreport-professor-name">
                        {review.professorID}
                    </div>
                    <div className='subreport-user-display'>
                        Posted by {review.userDisplay} on {new Date(review.timestamp).toLocaleString('default', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div className='report-group-content'>
                    <label>
                        Review Content:
                    </label>
                    <p>{review.reviewContent}</p>
                </div>
                {props.reports.map(report => {
                    return <SubReport key={report._id} reportID={report._id!} reviewID={report.reviewID} reason={report.reason}/>
                })}
                <div className='report-group-footer'>
                    <Button variant='danger' className='mr-3' onClick={props.onDeny}>Deny</Button>
                    <Button variant='success' onClick={props.onAccept}>Accept</Button>
                </div>
            </div>
        )
    }
}

export default ReportGroup;