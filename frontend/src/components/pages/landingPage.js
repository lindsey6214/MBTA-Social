import React from 'react';
import Card from 'react-bootstrap/Card';

const LandingPage = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-blue-500 text-white">
            <Card className="w-96 bg-white text-black shadow-lg rounded-lg p-5">
                <Card.Body>
                    <Card.Title className="text-xl font-bold">
                        MBTA Social App
                    </Card.Title>
                    <Card.Subtitle className="mb-3 text-gray-600">
                        Connect with commuters and stay updated.
                    </Card.Subtitle>
                    <Card.Text>
                        If you see this with a blue background and white text, Tailwind is working!
                    </Card.Text>
                    <div className="flex justify-between mt-4">
                        <Card.Link href="/signup" className="text-blue-500 hover:underline">
                            Sign Up
                        </Card.Link>
                        <Card.Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Card.Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LandingPage;