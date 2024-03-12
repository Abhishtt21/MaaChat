import React from 'react'
import { Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import "./Home.css";

function Home() {
  return (
    <Row>
        <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center home__content'>
        <div className="rounded-lg p-4   justify-content-center" style={{ backgroundColor: '#fff'}}> 
                    <h1>Welcome to the Mumma Care Community</h1>
                    <p>Connect, share experiences, and find support throughout your pregnancy journey.</p>

                <LinkContainer to='/chat'>
                    <Button  variant='success-outline' className='custom-button'>
                        Get Started
                        <i className='fas fa-comments home-message-icon' />
                    </Button>
                    
                </LinkContainer>
            </div>
        </Col>
        <Col md={6} className='home__bg'>
        </Col>
    </Row>
  )
}

export default Home