import React, { useEffect, useState } from 'react';
import registrationService from '../../services/registrationService';
import { Box, Card, CardContent, Typography } from '@mui/material';

const ViewResults: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
        const studentId = localStorage.getItem('userId') || '';
        
        registrationService.getDetailedRegistrationsByStudent(studentId)
            .then(response => {
                const allResults = response.registrations;           
                setResults(allResults);

                const passedCount = allResults.filter((registration: any) => registration.validation_status === 1).length;
                setResultMessage(passedCount > 0 
                    ? 'You have passed some exams/assignments!' 
                    : 'Waiting for results or validation.'
                );
            })
            .catch(error => console.error('Error fetching results:', error));
    }, []);

    const groupedResults = results.reduce((acc: any, result) => {
        const courseId = result.course_id; 
        if (!acc[courseId]) {
            acc[courseId] = { title: result.title, submissions: [] };
        }
        acc[courseId].submissions.push(result); 
        return acc;
    }, {});

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4">Assignment Results</Typography>
            <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>{resultMessage}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.keys(groupedResults).map(courseId => (
                    <Card key={courseId} sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h6">Course: {groupedResults[courseId].title}</Typography>
                            {groupedResults[courseId].submissions.map((submission: any) => (
                                <Box key={submission.registration_id} sx={{ marginTop: 1 }}>
                                    <Typography variant="body2">
                                        <strong>Question:</strong> {submission.question_text}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Validation Status:</strong> {submission.validation_status === 1 ? 'Passed' : 'Pending'}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Answer:</strong> {submission.answer_text}
                                    </Typography>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default ViewResults;
